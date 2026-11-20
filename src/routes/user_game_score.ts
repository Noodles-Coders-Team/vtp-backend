import {Router} from "express";
import {
    createScoreConfig,
    getScoreConfig,
    loadAllScoreConfigForUser,
    saveScoreConfig,
    saveScoreConfigRefDataById,
    saveScoreMinMaxConfigById
} from "../services/userGameScoreService";
import {validateRequestSchema} from "../middleware/validateRequestSchema";
import {UserGameScoreConfigSchema, UserSteamAppRefDataConfigSchema} from "@nct/vtp-common";


// Documented in src/docs/user_game_score.yaml
const router = Router();


router.get('/', async (request, response) => {
    const session = response.locals.session;
    const configs = await loadAllScoreConfigForUser(session.user.id);
    response.json(configs);
});


router.post('/create/:configId', async (request, response) => {
    const session = response.locals.session;
    const userId: string = session.user.id;
    const configId = request.params.configId;
    const config = await createScoreConfig(userId, configId);
    response.json({configId: config.id});
});


router.post('/', validateRequestSchema(UserGameScoreConfigSchema), async (request, response) => {
    const session = response.locals.session;
    await saveScoreConfig(request.body, session.user.id);
    response.statusCode = 200;
    response.send();
});


router.post('/:configId', validateRequestSchema(UserSteamAppRefDataConfigSchema, true), async (request, response) => {
    const session = response.locals.session;
    const configId = request.params.configId;
    await saveScoreConfigRefDataById(request.body, configId, session.user.id);
    response.statusCode = 200;
    response.send();
});


router.post('/min-max/:configId', async (request, response) => {
    const session = response.locals.session;
    const configId = request.params.configId;
    const {minReviews, minScore} = request.body as { minReviews: number | null, minScore: number | null };
    await saveScoreMinMaxConfigById(configId, session.user.id, minReviews, minScore);
    response.statusCode = 200;
    response.send();
});


router.get('/:configId', async (request, response) => {
    const session = response.locals.session;
    const userId: string = session.user.id;
    const configId = request.params.configId;
    const data = await getScoreConfig(userId, configId);
    response.json(data);
});


export default router;