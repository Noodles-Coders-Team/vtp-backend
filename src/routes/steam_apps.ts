import {Router} from "express";
import {
    getAllSteamAppsDataScheduler,
    getAllSteamAppsSchedulerStatus,
    getAllSteamAppsTagsScheduler,
    getFilteredAppsWithUserConfig,
    getImportedApps,
    triggerAllSteamAppsDataScheduler,
    triggerAllSteamAppsScheduler,
    triggerAllSteamAppsTagsScheduler
} from "../services/steamAppsService";
import {
    UserRoles,
    UserSteamAppRefDataConfigDto,
    UserSteamAppRefDataConfigSchema,
    ValidateSchema
} from "@nct/vtp-common";
import {requireRole} from "../middleware/requireRole";


// Documented in src/docs/steam_apps.yaml
const router = Router();


router.get('/trigger-all-games-scheduler', requireRole([UserRoles.Admin]), async (request, response) => {
    await triggerAllSteamAppsScheduler();
    const status = getAllSteamAppsSchedulerStatus();
    response.status(202);
    response.json({isActive: status})
});


router.get('/all-games-scheduler-status', requireRole([UserRoles.Admin]), async (request, response) => {
    const status = getAllSteamAppsSchedulerStatus();
    response.status(200).json({isActive: status});
});


router.get('/trigger-all-data-scheduler', requireRole([UserRoles.Admin]), async (request, response) => {
    await triggerAllSteamAppsDataScheduler();
    const status = getAllSteamAppsDataScheduler();
    response.status(202);
    response.json({isActive: status})
});


router.get('/all-data-scheduler-status', requireRole([UserRoles.Admin]), async (request, response) => {
    const status = getAllSteamAppsDataScheduler();
    response.status(200).json({isActive: status});
});


router.get('/trigger-all-tags-scheduler', requireRole([UserRoles.Admin]), async (request, response) => {
    await triggerAllSteamAppsTagsScheduler();
    const status = getAllSteamAppsTagsScheduler();
    response.status(202);
    response.json({isActive: status})
});


router.get('/all-tags-scheduler-status', requireRole([UserRoles.Admin]), async (request, response) => {
    const status = getAllSteamAppsTagsScheduler();
    response.status(200).json({isActive: status});
});


router.get('/imported-apps', async (request, response) => {
    let page = request.query.page;
    if (page === undefined || page === "")
        page = "1";

    const apps = await getImportedApps(Number(page));
    response.json(apps);
});


router.post('/apps-filtered-with-user-config', async (request, response) => {
    const refData: UserSteamAppRefDataConfigDto[] = request.body;
    console.log(refData);
    const refDataDto = ValidateSchema<UserSteamAppRefDataConfigDto>(refData, UserSteamAppRefDataConfigSchema, true)
    const apps = await getFilteredAppsWithUserConfig(refDataDto);
    response.json(apps);
});


export default router;