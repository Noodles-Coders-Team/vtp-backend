import p from "../lib/prisma";
import {SteamAppDto, type UserSteamAppRefDataConfigDto} from "@nct/vtp-common";
import {SteamRequestLimitExceeded} from "../classes/Errors";
import schedule from 'node-schedule';
import {SteamSpyResponse} from "../lib/Interfaces";
import SteamWrapper from "../classes/SteamWrapper";
import {isJobRunning, toggleJobRunner} from "./jobsService";
import {SteamAppReferenceDataType} from "../generated/prisma/enums";

const prisma = p.prisma;

// getFilteredApps returns the steam_app row plus the computed tag score
export type FilteredSteamAppDto = SteamAppDto & { rating: number };

const steam = new SteamWrapper();
const LIMIT_APPS_PER_BATCH = 50;

// https://github.com/node-schedule/node-schedule
// https://stackoverflow.com/questions/48432356/node-js-express-how-to-schedule-task


export async function triggerAllSteamAppsScheduler() {
    const rule = new schedule.RecurrenceRule();
    rule.second = new schedule.Range(0, 59, 30);
    toggleJobRunner(rule, 'AllSteamApps', getSteamAppsAndSaveThem);
}


export async function triggerAllSteamAppsDataScheduler() {
    const rule = new schedule.RecurrenceRule();
    //rule.second = new schedule.Range(0, 59, 15);
    rule.minute = new schedule.Range(0, 59, 15);
    toggleJobRunner(rule, 'AllSteamAppsData', getSteamAppsDataAndSaveThem);
}


export async function triggerAllSteamAppsTagsScheduler() {
    const rule = new schedule.RecurrenceRule();
    //rule.minute = new schedule.Range(0, 59, 2);
    rule.minute = new schedule.Range(0, 59, 45);
    toggleJobRunner(rule, 'AllSteamAppsTags', getSteamAppsTagsAndSaveThem);
}


export function getAllSteamAppsSchedulerStatus() {
    return isJobRunning('AllSteamApps');
}


export function getAllSteamAppsDataScheduler() {
    return isJobRunning('AllSteamAppsData');
}


export function getAllSteamAppsTagsScheduler() {
    return isJobRunning('AllSteamAppsTags');
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


async function getSteamAppsTagsAndSaveThem() {
    const appIds = await getImportedAppsWithoutTags(LIMIT_APPS_PER_BATCH);
    if (!appIds)
        return;

    let numberUpdated = 0;
    try {
        for (const appId of appIds) {
            await getSteamAppsTagAndSaveIt(appId);
            numberUpdated++;
            await new Promise(f => setTimeout(f, 500));
        }
    } catch (error) {
        if (error instanceof SteamRequestLimitExceeded) {
            console.warn('Steam API limit exceeded');
        } else
            console.error(`Error getSteamAppsTagAndSaveIt: ${error}`);
    } finally {
        console.log(`Updated ${numberUpdated} apps`);
    }
}


async function getSteamAppsTagAndSaveIt(appId: string) {
    // SteamSpy first: it has no age gate, so it covers the adult-only titles the store scrape cannot reach
    let tags = await getSteamspyAppTags(appId);
    if (tags.length === 0) {
        tags = await steam.getAppTags(appId);
    }
    await prisma.steamApp.update({where: {id: Number(appId)}, data: {tags: tags, is_tags_imported: true}});
}


async function getSteamAppDataAndSaveIt(appId: string): Promise<void> {
    const steamAppDetail = await steam.getAppInformation(appId);
    let tags = await getSteamspyAppTags(appId);
    if (tags.length === 0) {
        tags = await steam.getAppTags(appId);
    }

    let isTags: boolean = true;
    if (tags.length === 0)
        isTags = false;

    let steamApp: SteamAppDto;
    if (steamAppDetail === undefined) {
        steamApp = {
            id: Number(appId),
            is_data_imported: true,
            is_tags_imported: isTags,
            tags: tags
        };
    } else {
        steamApp = {
            id: Number(appId),
            is_data_imported: true,
            is_tags_imported: isTags,
            categories: steamAppDetail.categories,
            genres: steamAppDetail.genres,
            tags: tags,
            metacritic_score: steamAppDetail.metacritic,
            name: steamAppDetail.name,
            release_date: steamAppDetail.releaseDate,
            review_count: steamAppDetail.recommendations
        };
    }
    await upsertSteamApp(steamApp);
}


export async function getTheLargestSteamAppId(): Promise<string | undefined> {
    const appData: SteamAppDto | null = await prisma.steamApp.findFirst({orderBy: {id: "desc"}});
    return appData?.id.toString();
}


export async function getPendingImportSteamAppIds(limit: number): Promise<string[] | undefined> {
    const appData: SteamAppDto[] | null = await prisma.steamApp.findMany({
        orderBy: {id: "desc"},
        where: {is_data_imported: false},
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


async function getSteamspyAppTags(appId: string): Promise<string[]> {
    const url = `https://steamspy.com/api.php?request=appdetails&appid=${appId}`;
    const spyResponse = await fetch(url);
    if (!spyResponse.ok) {
        console.log('SteamSpy responded NOT OK');
        return [];
    }
    const body: SteamSpyResponse = await spyResponse.json();
    return Object.keys(body.tags);
}


async function getImportedAppsWithoutTags(limit: number): Promise<string[]> {
    const apps = await prisma.steamApp.findMany({
        where: {
            is_data_imported: true,
            tags: {isEmpty: true},
            is_tags_imported: false
        },
        orderBy: {id: "desc"},
        take: limit,
    });
    return apps.map(app => app.id.toString());
}


export async function getImportedApps(page: number): Promise<SteamAppDto[]> {
    const pageLimit = 50;
    return await prisma.steamApp.findMany({
        where: {is_data_imported: true, tags: {isEmpty: false}},
        orderBy: {id: "asc"},
        take: pageLimit,
        skip: pageLimit * (page - 1)
    });
}


// https://www.prisma.io/docs/orm/v7/prisma-client/using-raw-sql/raw-queries
export async function getFilteredApps(tags: string, tag_weights: string): Promise<FilteredSteamAppDto[]> {
    const tagList = parseTags(tags);
    const weightList = parseTagWeights(tag_weights);
    if (tagList.length === 0 || tagList.length !== weightList.length)
        return [];

    const limit = 25;

    return await prisma.$queryRaw<FilteredSteamAppDto[]>`
        SELECT a.*, COALESCE(r.rating, 0) AS rating
        FROM steam_app a
                 LEFT JOIN LATERAL (
            SELECT SUM(w.weight)::int AS rating
            FROM unnest(${tagList}::text[], ${weightList}::int[]) AS w(tag, weight)
            WHERE w.tag = ANY (a.tags)
            ) r ON true
        WHERE a.release_date IS NOT NULL
        ORDER BY rating DESC
        LIMIT ${limit};`;
}


// Accepts both "Tennis, MOBA" and the quoted "'Tennis', 'MOBA'" form shown in the UI placeholder
function parseTags(tags: string | undefined): string[] {
    return (tags ?? '').split(',')
        .map(tag => tag.trim().replace(/^['"]|['"]$/g, '').trim())
        .filter(tag => tag.length > 0);
}


function parseTagWeights(tag_weights: string | undefined): number[] {
    return (tag_weights ?? '').split(',')
        .map(weight => weight.trim())
        .filter(weight => weight.length > 0)
        .map(weight => Number(weight))
        // a non-numeric weight drops out here, tripping the length check against the tags
        .filter(weight => Number.isFinite(weight));
}


export async function getFilteredAppsWithUserConfig(config: UserSteamAppRefDataConfigDto[]): Promise<FilteredSteamAppDto[]> {
    const tagsVal = config.filter(ref => ref.type = SteamAppReferenceDataType.TAG).map(ref => ref.value.toString());
    const tagsWeight = config.filter(ref => ref.type = SteamAppReferenceDataType.TAG).map(ref => ref.score);

    const categoryVal = config.filter(ref => ref.type = SteamAppReferenceDataType.CATEGORY).map(ref => ref.value.toString());
    const categoryWeight = config.filter(ref => ref.type = SteamAppReferenceDataType.CATEGORY).map(ref => ref.score);

    const genresVal = config.filter(ref => ref.type = SteamAppReferenceDataType.GENRE).map(ref => ref.value.toString());
    const genresWeight = config.filter(ref => ref.type = SteamAppReferenceDataType.GENRE).map(ref => ref.score);

    const limit = 25;

    return await prisma.$queryRaw<FilteredSteamAppDto[]>`
        select a.*,
               coalesce(r_categories.rating, 0)
                   + coalesce(r_genres.rating, 0)
                   + coalesce(r_tags.rating, 0) as rating
        from steam_app a
                 left join lateral (
            select sum(w.weight)::int as rating
            from unnest(
                         ${tagsVal}::text[],
                         ${tagsWeight}::int[])
                     as w(tag, weight)
            where w.tag = any (a.tags)
            ) r_tags on true
                 left join lateral (
            select sum(w.weight)::int AS rating
            from unnest(
                         ${categoryVal}::text[],
                         ${categoryWeight}::int[])
                     as w(category, weight)
            where w.category = any (a.categories)
            ) r_categories on true
                 left join lateral (
            select sum(w.weight)::int as rating
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