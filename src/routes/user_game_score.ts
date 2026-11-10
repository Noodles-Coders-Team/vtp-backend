import {Router} from "express";
import {loadAllScoreConfigForUser, saveScoreConfig} from "../services/userGameScoreService";
import {validateRequestSchema} from "../middleware/validateRequestSchema";
import {UserGameScoreConfigSchema} from "@nct/vtp-common";


const router = Router();


router.get('/', async (request, response) => {
    const configs = await loadAllScoreConfigForUser('hk');
    response.json(configs);
});


router.post('/', validateRequestSchema(UserGameScoreConfigSchema), async (request, response) => {
    await saveScoreConfig(request.body);
    response.statusCode = 200;
    response.send();
});


export default router;