import { SettingDto, SettingSchema, ValidateSchema, ValidateSchemaArray } from "@nct/vtp-common";
import p from "../lib/prisma";
const prisma = p.prisma;


export async function getAllSettings(): Promise<SettingDto[]> {
    const rawSettings = prisma.settings.findMany();
    return await ValidateSchemaArray<SettingDto[]>(rawSettings, SettingSchema);
}


export async function getSettingByKey(key: string): Promise<SettingDto> {
    const rawSettings = prisma.settings.findFirst({ where: { key: key } });
    return await ValidateSchema<SettingDto>(rawSettings, SettingSchema);
}


export async function createSetting(setting: any): Promise<SettingDto> {
    ValidateSchema<SettingDto>(setting, SettingSchema)
    const created = await prisma.settings.create({ data: setting });
    return ValidateSchema<SettingDto>(created, SettingSchema);
}


export async function updateSetting(setting: any): Promise<SettingDto> {
    ValidateSchema<SettingDto>(setting, SettingSchema);
    const updated = await prisma.settings.update({ data: setting, where: { key: setting.key } });
    return ValidateSchema<SettingDto>(updated, SettingSchema);
}