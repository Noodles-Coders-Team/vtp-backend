import {SettingDto} from "@nct/vtp-common";
import p from "../lib/prisma";

const prisma = p.prisma;


export async function getAllSettings(): Promise<SettingDto[]> {
    return await prisma.settings.findMany();
}


export async function getSettingByKey(key: string): Promise<SettingDto | null> {
    return await prisma.settings.findFirst({where: {key: key}});
}


export async function createSetting(setting: SettingDto): Promise<SettingDto> {
    return await prisma.settings.create({data: setting});
}


export async function updateSetting(setting: SettingDto): Promise<SettingDto> {
    return await prisma.settings.update({data: setting, where: {key: setting.key}});
}


export async function createDefaultSetting(setting: SettingDto): Promise<void> {
    await prisma.settings.upsert({where: {key: setting.key}, create: setting, update: {}});
}


export async function deleteSetting(key: string): Promise<SettingDto> {
    return await prisma.settings.delete({where: {key: key}});
}