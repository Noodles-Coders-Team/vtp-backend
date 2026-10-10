import {Router} from "express";
import {triggerAllSteamAppsDataScheduler, triggerAllSteamAppsScheduler} from "../services/steamAppsService";


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


export default router;