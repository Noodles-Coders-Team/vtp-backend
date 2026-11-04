import p from "../lib/prisma";
import type {SteamAppRefDataDto} from "@nct/vtp-common";
import schedule from "node-schedule";
import {isJobRunning, toggleJobRunner} from "./jobsService";
import {SteamAppReferenceDataType} from "../generated/prisma/enums";

const prisma = p.prisma;


const UPDATE_REF_DATA_JOB = "UpdateSteamAppsReferenceData";


export default async function getAllReferenceData(): Promise<SteamAppRefDataDto[]> {
    return await prisma.steamAppReferenceData.findMany();
}


export async function triggerAllSteamAppsTagsScheduler() {
    const rule = new schedule.RecurrenceRule();
    //rule.minute = new schedule.Range(0, 59, 2);
    rule.minute = new schedule.Range(0, 59, 45);
    toggleJobRunner(rule, UPDATE_REF_DATA_JOB, updateAllSteamReferenceDataAndSaveIt);
}


export function getAllSteamAppsSchedulerStatus() {
    return isJobRunning(UPDATE_REF_DATA_JOB);
}


export async function updateAllSteamReferenceDataAndSaveIt(): Promise<void> {
    const categories = await prisma.$queryRaw<{ data: string }[]>`
        select distinct unnest(categories) as "data"
        from steam_app
        order by data`;
    const genres = await prisma.$queryRaw<{ data: string }[]>`
        select distinct unnest(genres) as "data"
        from steam_app
        order by data`;
    const tags = await prisma.$queryRaw<{ data: string }[]>`
        select distinct unnest(tags) as "data"
        from steam_app
        order by data`;

    categories.forEach((category) => {
        createRefData(category.data, SteamAppReferenceDataType.CATEGORY)
    });
    genres.forEach((genre) => {
        createRefData(genre.data, SteamAppReferenceDataType.GENRE)
    });
    tags.forEach((tag) => {
        createRefData(tag.data, SteamAppReferenceDataType.TAG)
    });
    console.log('Updated all Ref Data');
}


async function createRefData(value: string, type: SteamAppReferenceDataType): Promise<void> {
    const object: SteamAppRefDataDto = {
        id: value + '-' + type,
        value: value,
        type: type
    };
    await prisma.steamAppReferenceData.upsert({
        where: {id: object.id},
        create: object,
        update: {}
    });
}