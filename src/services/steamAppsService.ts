import p from "../lib/prisma";
import {SteamAppDto} from "@nct/vtp-common";
import {SteamRequestLimitExceeded} from "../classes/Errors";
import schedule, {Job} from 'node-schedule';
import {SteamSpyResponse} from "../lib/Interfaces";
import SteamWrapper from "../classes/SteamWrapper";

const prisma = p.prisma;

const steam = new SteamWrapper();
let allAppsJob: Job | null;
let allAppsDataJob: Job | null;


// https://github.com/node-schedule/node-schedule
// https://stackoverflow.com/questions/48432356/node-js-express-how-to-schedule-task

export async function triggerAllSteamAppsScheduler() {
    if (!allAppsJob) {
        console.log('Scheduling AllSteamApps job!');
        const rule = new schedule.RecurrenceRule();
        rule.second = 30;
        let ruleRunCount = 0;
        allAppsJob = schedule.scheduleJob(rule, async function () {
            ruleRunCount++;
            console.log(`Starting job: AllSteamApps. N: ${ruleRunCount}`);
            try {
                await getSteamAppsAndSaveThem();
            } catch (e) {
                console.error('Error while running getSteamAppsAndSaveThem!');
                console.error((e as Error).message);
            } finally {
                console.log('Job AllSteamApps finished.');
            }
        });
    } else {
        console.log('Cancelling AllSteamApps job!');
        allAppsJob.cancel(false);
        allAppsJob = null;
    }
}


export async function triggerAllSteamAppsDataScheduler() {
    if (!allAppsDataJob) {
        console.log('Scheduling AllSteamAppsData job!');
        const rule = new schedule.RecurrenceRule();
        rule.second = 59;
        let ruleRunCount = 0;
        allAppsDataJob = schedule.scheduleJob(rule, async function () {
            ruleRunCount++;
            console.log(`Starting job: AllSteamAppsData. N: ${ruleRunCount}`);
            try {
                await getSteamAppsDataAndSaveThem();
            } catch (e) {
                console.error('Error while running getSteamAppsDataAndSaveThem!');
                console.error((e as Error).message);
            } finally {
                console.log('Job AllSteamAppsData finished.');
            }
        });
    } else {
        console.log('Cancelling AllSteamAppsData job!');
        allAppsDataJob.cancel(false);
        allAppsDataJob = null;
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
            console.error(`Error getSteamAppDataAndSaveThem: ${error}`);
    }
}


export async function getSteamAppsDataAndSaveThem(): Promise<void> {
    const limit = 100;
    const appIds = await getPendingImportSteamAppIds(limit);
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
            console.error(`Error getSteamAppDataAndSaveThem: ${error}`);
    } finally {
        console.log(`Updated ${numberUpdated} apps`);
    }
}


async function getSteamAppDataAndSaveIt(appId: string): Promise<void> {
    const steamAppDetail = await steam.getAppInformation(appId);
    const tags = await getSteamspyAppTags(appId);
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


export async function getAllImportedApps(): Promise<SteamAppDto[]> {
    return await prisma.steamApp.findMany({
        where: {is_data_imported: true},
        orderBy: {id: "desc"},
        take: 50
    });
}