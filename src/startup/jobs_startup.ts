import {SystemSettingName} from "../enums/SystemSettingName";
import {getSettingByKey} from "../services/settingsService";
import {triggerAllSteamAppsDataScheduler, triggerAllSteamAppsScheduler} from "../services/steamAppsService";


export async function jobsStartup(): Promise<void> {
    console.log("Jobs start up");

    await checkAndStartJob(SystemSettingName.SteamAppsDataImport, triggerAllSteamAppsDataScheduler);
    await checkAndStartJob(SystemSettingName.SteamAppsImport, triggerAllSteamAppsScheduler);

    console.log("Jobs ready");
}


async function checkAndStartJob(name: string, jobRunner: () => Promise<void>): Promise<void> {
    const setting = await getSettingByKey(name);
    if (setting && setting.value == 'true') {
        jobRunner();
    }
}