import {Router} from "express";
import getAllReferenceData, {updateAllSteamReferenceDataAndSaveIt} from "../services/steamAppReferenceDataService";


// Documented in src/docs/steam_app_reference_data.yaml
const router = Router();


router.get('/', async (request, response) => {
    const allData = await getAllReferenceData();
    response.json(allData);
});


router.get('/update', async (request, response) => {
    await updateAllSteamReferenceDataAndSaveIt();
    response.status(200).send();
});

export default router;