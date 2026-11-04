import {Router} from "express";
import getAllReferenceData, {updateAllSteamReferenceDataAndSaveIt} from "../services/steamAppReferenceDataService";


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