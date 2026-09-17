import {SettingDto, SettingSchema, ValidateSchema} from "@nct/vtp-common";
import p from "../lib/prisma";

const prisma = p.prisma;


export async function getAllSettings(): Promise<SettingDto[]> {
    const rawSettings = await prisma.settings.findMany();
    return ValidateSchema<SettingDto>(rawSettings, SettingSchema, true);
}


export async function getSettingByKey(key: string): Promise<SettingDto> {
    const rawSettings = await prisma.settings.findFirst({where: {key: key}});
    return ValidateSchema<SettingDto>(rawSettings, SettingSchema);
}


export async function createSetting(body: any): Promise<SettingDto> {
    const setting = ValidateSchema<SettingDto>(body, SettingSchema);
    const created = await prisma.settings.create({data: setting});
    return ValidateSchema<SettingDto>(created, SettingSchema);
}


export async function updateSetting(body: any): Promise<SettingDto> {
    const setting = ValidateSchema<SettingDto>(body, SettingSchema);
    const updated = await prisma.settings.update({data: setting, where: {key: setting.key}});
    return ValidateSchema<SettingDto>(updated, SettingSchema);
}


export async function deleteSetting(key: string): Promise<SettingDto> {
    const deleted = await prisma.settings.delete({where: {key: key}});
    return ValidateSchema<SettingDto>(deleted, SettingSchema);
}