import {Router} from "express";
import {
    getAllImportedApps,
    triggerAllSteamAppsDataScheduler,
    triggerAllSteamAppsScheduler
} from "../services/steamAppsService";


const router = Router();


router.get('/trigger-all-games-scheduler', async (request, response) => {
    triggerAllSteamAppsScheduler();
    response.status(202);
    response.send();
});


router.get('/trigger-all-data-scheduler', async (request, response) => {
    triggerAllSteamAppsDataScheduler();
    response.status(202);
    response.send();
});


router.get('/imported-apps', async (request, response) => {
    let page = request.query.page;
    if (page === undefined || page === "")
        page = "1";

    const apps = await getAllImportedApps(Number(page));
    response.json(apps);
});


export default router;