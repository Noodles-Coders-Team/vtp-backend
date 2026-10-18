import p from "../lib/prisma";
import {SteamAppDto} from "@nct/vtp-common";
import {SteamRequestLimitExceeded} from "../classes/Errors";
import schedule, {Job, RecurrenceRule} from 'node-schedule';
import {SteamSpyResponse} from "../lib/Interfaces";
import SteamWrapper from "../classes/SteamWrapper";

const prisma = p.prisma;

const steam = new SteamWrapper();
const LIMIT_APPS_PER_BATCH = 50;

const jobs: Record<string, Job | null> = {};

// https://github.com/node-schedule/node-schedule
// https://stackoverflow.com/questions/48432356/node-js-express-how-to-schedule-task


export async function triggerAllSteamAppsScheduler() {
    const rule = new schedule.RecurrenceRule();
    rule.second = 30;
    jobScheduler(rule, 'AllSteamApps', getSteamAppsAndSaveThem);
}


export async function triggerAllSteamAppsDataScheduler() {
    const rule = new schedule.RecurrenceRule();
    rule.second = 59;
    jobScheduler(rule, 'AllSteamAppsData', getSteamAppsDataAndSaveThem);
}


export async function triggerAllSteamAppsTagsScheduler() {
    const rule = new schedule.RecurrenceRule();
    rule.second = 10;
    jobScheduler(rule, 'AllSteamAppsTags', getSteamAppsTagsAndSaveThem);
}


export function getAllSteamAppsSchedulerStatus() {
    return !!jobs['AllSteamApps'];
}


export function getAllSteamAppsDataScheduler() {
    return !!jobs['AllSteamAppsData'];
}


export function getAllSteamAppsTagsScheduler() {
    return !!jobs['AllSteamAppsTags'];
}


async function jobScheduler(rule: RecurrenceRule, name: string, jobFunction: () => Promise<void>) {
    const job = jobs[name];
    if (!job) {
        console.log(`Scheduling ${name} job!`);
        let ruleRunCount = 0;
        jobs[name] = schedule.scheduleJob(rule, async function () {
            ruleRunCount++;
            console.log(`Starting job: ${name}. N: ${ruleRunCount}`);
            try {
                await jobFunction();
            } catch (e) {
                console.error(`Error while running ${jobFunction.name}!`);
                console.error((e as Error).message);
            } finally {
                console.log(`Job ${name} finished.`);
            }
        });
    } else {
        console.log(`Cancelling ${name} job!`);
        job.cancel(false);
        jobs[name] = null;
    }
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
    await prisma.steamApp.update({where: {id: Number(appId)}, data: {tags: tags}});
}


async function getSteamAppDataAndSaveIt(appId: string): Promise<void> {
    const steamAppDetail = await steam.getAppInformation(appId);
    let tags = await getSteamspyAppTags(appId);
    if (tags.length === 0) {
        tags = await steam.getAppTags(appId);
    }
    let steamApp: SteamAppDto;
    if (steamAppDetail === undefined) {
        steamApp = {
            id: Number(appId),
            is_data_imported: true,
            tags: tags,
        };
    } else {
        steamApp = {
            id: Number(appId),
            is_data_imported: true,
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
        },
        orderBy: {id: "desc"},
        take: limit,
    });
    return apps.map(app => app.id.toString());
}


export async function getImportedApps(page: number): Promise<SteamAppDto[]> {
    const pageLimit = 50;
    return await prisma.steamApp.findMany({
        where: {is_data_imported: true},
        orderBy: {id: "asc"},
        take: pageLimit,
        skip: pageLimit * (page - 1)
    });
}