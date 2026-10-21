import {Router} from "express";
import {
    getImportedApps, getAllSteamAppsDataScheduler, getAllSteamAppsSchedulerStatus, getAllSteamAppsTagsScheduler,
    triggerAllSteamAppsDataScheduler,
    triggerAllSteamAppsScheduler, triggerAllSteamAppsTagsScheduler
} from "../services/steamAppsService";


const router = Router();


router.get('/trigger-all-games-scheduler', async (request, response) => {
    await triggerAllSteamAppsScheduler();
    const status = getAllSteamAppsSchedulerStatus();
    response.status(202);
    response.json({isActive: status})
});


router.get('/all-games-scheduler-status', async (request, response) => {
    const status = getAllSteamAppsSchedulerStatus();
    response.status(200).json({isActive: status});
});


router.get('/trigger-all-data-scheduler', async (request, response) => {
    await triggerAllSteamAppsDataScheduler();
    const status = getAllSteamAppsDataScheduler();
    response.status(202);
    response.json({isActive: status})
});


router.get('/all-data-scheduler-status', async (request, response) => {
    const status = getAllSteamAppsDataScheduler();
    response.status(200).json({isActive: status});
});


router.get('/trigger-all-tags-scheduler', async (request, response) => {
    await triggerAllSteamAppsTagsScheduler();
    const status = getAllSteamAppsTagsScheduler();
    response.status(202);
    response.json({isActive: status})
});


router.get('/all-tags-scheduler-status', async (request, response) => {
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


export default router;