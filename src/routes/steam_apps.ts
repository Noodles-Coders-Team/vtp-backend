import {Router} from "express";
import {
    getImportedApps, getAllSteamAppsDataScheduler, getAllSteamAppsSchedulerStatus, getAllSteamAppsTagsScheduler,
    triggerAllSteamAppsDataScheduler,
    triggerAllSteamAppsScheduler, triggerAllSteamAppsTagsScheduler
} from "../services/steamAppsService";


const router = Router();


router.get('/trigger-all-games-scheduler', async (request, response) => {
    triggerAllSteamAppsScheduler();
    response.status(202);
    response.send();
});


router.get('/all-games-scheduler-status', async (request, response) => {
    const status = getAllSteamAppsSchedulerStatus();
    response.status(200).json({isActive: status});
});


router.get('/trigger-all-data-scheduler', async (request, response) => {
    triggerAllSteamAppsDataScheduler();
    response.status(202);
    response.send();
});


router.get('/all-data-scheduler-status', async (request, response) => {
    const status = getAllSteamAppsDataScheduler();
    response.status(200).json({isActive: status});
});


router.get('/trigger-all-tags-scheduler', async (request, response) => {
    triggerAllSteamAppsTagsScheduler();
    response.status(202);
    response.send();
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