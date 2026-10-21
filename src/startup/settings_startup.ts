import {SettingDto} from "@nct/vtp-common";
import {createDefaultSetting} from "../services/settingsService";


export enum SystemSettingName {
    SteamAppTableImported = 'steam_app_table_imported',
    SteamAppsImported = 'steam_apps_imported',
    SteamAppDataImported = 'steam_app_data_imported',
    SteamAppTagsImported = 'steam_app_tags_imported',
}


const DEFAULT_SETTINGS: SettingDto[] = [
    {
        key: SystemSettingName.SteamAppTableImported,
        value: "false",
        display: SystemSettingName.SteamAppTableImported,
        is_system: true
    },
    {
        key: SystemSettingName.SteamAppsImported,
        value: "false",
        display: SystemSettingName.SteamAppsImported,
        is_system: true
    },
    {
        key: SystemSettingName.SteamAppDataImported,
        value: "false",
        display: SystemSettingName.SteamAppDataImported,
        is_system: true
    },
    {
        key: SystemSettingName.SteamAppTagsImported,
        value: "false",
        display: SystemSettingName.SteamAppTagsImported,
        is_system: false
    }
];


export async function settingsStartup(): Promise<void> {
    console.log("Settings start up");

    for (let setting of DEFAULT_SETTINGS) {
        await createDefaultSetting(setting);
    }

    console.log("Settings ready");
}