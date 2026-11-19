import p from "../lib/prisma";
import {SteamAppDto, type UserSteamAppRefDataConfigDto} from "@nct/vtp-common";
import {SteamRequestLimitExceeded} from "../classes/Errors";
import schedule from 'node-schedule';
import {SteamAppWebDetails} from "../lib/Interfaces";
import SteamWrapper from "../classes/SteamWrapper";
import {isJobRunning, toggleJobRunner} from "./jobsService";
import {SteamAppReferenceDataType} from "../generated/prisma/enums";
import {getScoreConfig} from "./userGameScoreService";
import {SystemSettingName} from "../enums/SystemSettingName";

const prisma = p.prisma;

// getFilteredApps returns the steam_app row plus the computed tag score
export type FilteredSteamAppDto = SteamAppDto & { rating: number };

const steam = new SteamWrapper();
const LIMIT_APPS_PER_BATCH = 100;

// https://github.com/node-schedule/node-schedule
// https://stackoverflow.com/questions/48432356/node-js-express-how-to-schedule-task


//TODO: add checks if there is none left - stop the job
export async function triggerAllSteamAppsScheduler() {
    const rule = new schedule.RecurrenceRule();
    rule.hour = new schedule.Range(0, 24, 1);
    toggleJobRunner(rule, SystemSettingName.SteamAppsImport, getSteamAppsAndSaveThem);
}


export async function triggerAllSteamAppsDataScheduler() {
    const rule = new schedule.RecurrenceRule();
    //rule.second = new schedule.Range(0, 59, 15);
    rule.minute = new schedule.Range(0, 59, 2);
    toggleJobRunner(rule, SystemSettingName.SteamAppsDataImport, getSteamAppsDataAndSaveThem);
}


export function getAllSteamAppsSchedulerStatus() {
    return isJobRunning(SystemSettingName.SteamAppsImport);
}


export function getAllSteamAppsDataScheduler() {
    return isJobRunning(SystemSettingName.SteamAppsDataImport);
}


export async function getSteamAppsAndSaveThem() {
    try {
        const appItems = await steam.getSteamGames(50000, await getTheLargestSteamAppId());
        if (appItems === undefined)
            return;

        await createSteamApps(appItems.map(app => {
            return {
                id: app.appid,
                is_data_imported: false,
                name: app.name,
            } as SteamAppDto;
        }));
        console.log(`Got new ${appItems.length} apps`)
    } catch (error) {
        if (error instanceof SteamRequestLimitExceeded) {
            console.warn('Steam API limit exceeded');
        } else
            console.error(`Error getSteamAppsAndSaveThem: ${error}`);
    }
}


async function getSteamAppsDataAndSaveThem(): Promise<void> {
    const appIds = await getPendingImportSteamAppIds(LIMIT_APPS_PER_BATCH);
    if (!appIds)
        return;

    let numberUpdated = 0;
    try {
        for (const appId of appIds) {
            await getSteamAppDataAndSaveIt(appId);
            numberUpdated++;
            await new Promise(f => setTimeout(f, 500));
        }
    } catch (error) {
        if (error instanceof SteamRequestLimitExceeded) {
            console.warn('Steam API limit exceeded');
        } else
            console.error(`Error getSteamAppDataAndSaveIt: ${error}`);
    } finally {
        console.log(`Updated ${numberUpdated} apps`);
    }
}


async function getSteamAppDataAndSaveIt(appId: string): Promise<void> {
    const appData = await steam.getAppInformation(appId);
    const webData: SteamAppWebDetails | null = await steam.getAppWebInformation(appId);

    if (appData !== undefined) {
        const steamApp: SteamAppDto = {
            id: Number(appId),
            categories: appData.categories,
            genres: appData.genres,
            tags: webData?.tags ?? [],
            name: appData.name,
            release_date: appData.releaseDate,
            review_count: webData?.recommendations ?? appData.recommendations,
            review_positive_count: webData?.positive_recommendations,
            review_positive_percent: webData?.percent_positive_recommendations,
            last_info_updated: new Date()
        };
        await upsertSteamApp(steamApp);
    }
}


export async function getTheLargestSteamAppId(): Promise<string | undefined> {
    const appData: SteamAppDto | null = await prisma.steamApp.findFirst({orderBy: {id: "desc"}});
    return appData?.id.toString();
}


export async function getPendingImportSteamAppIds(limit: number): Promise<string[] | undefined> {
    const appData: SteamAppDto[] | null = await prisma.steamApp.findMany({
        orderBy: [{last_info_updated: {sort: "asc", nulls: "first"}}, {id: "desc"}],
        take: limit
    });
    return appData?.map(data => data.id.toString());
}


export async function upsertSteamApp(body: SteamAppDto): Promise<SteamAppDto> {
    return await prisma.steamApp.upsert({
        where: {id: body.id},
        create: body,
        update: body
    });
}


export async function createSteamApps(apps: SteamAppDto[]) {
    await prisma.steamApp.createMany({
        data: apps,
        skipDuplicates: true, // ignore rows whose id already exists
    });
}


export async function getImportedApps(page: number): Promise<SteamAppDto[]> {
    const pageLimit = 50;
    return await prisma.steamApp.findMany({
        where: {last_info_updated: {not: null}},
        orderBy: {id: "desc"},
        take: pageLimit,
        skip: pageLimit * (page - 1)
    });
}


// TODO: add values for minimum review count and rate
// https://www.prisma.io/docs/orm/v7/prisma-client/using-raw-sql/raw-queries

export async function getFilteredAppsWithUserConfigById(userId: string, configId: string): Promise<FilteredSteamAppDto[]> {
    const config = await getScoreConfig(userId, configId);
    return await getFilteredAppsWithUserConfig(config.score_config);
}

export async function getFilteredAppsWithUserConfig(config: UserSteamAppRefDataConfigDto[]): Promise<FilteredSteamAppDto[]> {
    const tagsVal = config.filter(ref => ref.type == SteamAppReferenceDataType.TAG).map(ref => ref.value.toString());
    const tagsWeight = config.filter(ref => ref.type == SteamAppReferenceDataType.TAG).map(ref => ref.score);

    const categoryVal = config.filter(ref => ref.type == SteamAppReferenceDataType.CATEGORY).map(ref => ref.value.toString());
    const categoryWeight = config.filter(ref => ref.type == SteamAppReferenceDataType.CATEGORY).map(ref => ref.score);

    const genresVal = config.filter(ref => ref.type == SteamAppReferenceDataType.GENRE).map(ref => ref.value.toString());
    const genresWeight = config.filter(ref => ref.type == SteamAppReferenceDataType.GENRE).map(ref => ref.score);

    const limit = 25;

    return await prisma.$queryRaw<FilteredSteamAppDto[]>`
        select a.*,
               coalesce(r_categories.rating, 0)
                   + coalesce(r_genres.rating, 0)
                   + coalesce(r_tags.rating, 0) as rating
        from steam_app a
                 left join lateral (
            select sum(w.weight) ::int as rating
            from unnest(
                         ${tagsVal}::text[],
                         ${tagsWeight}::int[])
                     as w(tag, weight)
            where w.tag = any (a.tags)
                ) r_tags on true
                 left join lateral (
            select sum(w.weight) ::int AS rating
            from unnest(
                         ${categoryVal}::text[],
                         ${categoryWeight}::int[])
                     as w(category, weight)
            where w.category = any (a.categories)
                ) r_categories on true
                 left join lateral (
            select sum(w.weight) ::int as rating
            from unnest(
                         ${genresVal}::text[],
                         ${genresWeight}::int[])
                     as w(genre, weight)
            where w.genre = any (a.genres)
                ) r_genres on true
        where a.release_date is not null
          and a.release_date < NOW()
        order by rating desc
            limit ${limit};`;
}