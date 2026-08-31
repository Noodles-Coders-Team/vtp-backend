import { Router } from "express";
import { createSetting, getAllSettings, getSettingByKey, updateSetting } from "../services/settingsService";


const router = Router();


router.get('/', async (request, response) => {
    const allSettings = await getAllSettings();
    response.json(allSettings);
});


router.get('/:key', async (request, response) => {
    const setting = await getSettingByKey(request.params.key);
    response.json(setting);
});


router.post('/', async (request, response) => {
    const setting = await createSetting(request.body);
    response.json(setting);
});


router.put('/', async (request, response) => {
    const setting = await updateSetting(request.body);
    response.json(setting);
});


export default router;