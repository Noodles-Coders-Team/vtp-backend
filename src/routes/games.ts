import {Request, Router} from "express";
import {
    createGame,
    deleteGame,
    getAllGames,
    getAllGamesWithInfo,
    getGameById,
    updateGame
} from "../services/gameService";
import {updateGameInfo} from "../services/gameInfoService";
import {validateRequest} from "../middleware/validate";
import {CreateGameSchema, GameInfoSchema, GameSchema} from "@nct/vtp-common";

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Game management endpoints
 */
const router = Router();


/**
 * @swagger
 * /games:
 *   get:
 *     tags: [Games]
 *     summary: List all games
 *     description: Returns every game ordered by name ascending. Game info is not included.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (request, response) => {
    const allGames = await getAllGames();
    response.json(allGames);
});


/**
 * @swagger
 * /games/with-info:
 *   post:
 *     tags: [Games]
 *     summary: Get games joined with their info, filtered and scored
 *     description: >
 *       Returns each game flattened together with its game_info row and a computed
 *       `game_score`: the sum of the scores of its tags and genres, plus
 *       `(latest_rank - 50) / 10`, rounded to two significant digits. A game with no rank
 *       is treated as rank 50, so it contributes nothing. Results are sorted by
 *       `game_score` descending. Omit a filter field to leave that filter off. Uses POST
 *       only to carry the filter body.
 *
 *
 *       Games that have no game_info row are dropped, because the filter is expressed as a
 *       condition on the related row.
 *
 *
 *       **Known defect:** reading the latest rank of a game validates a Prisma row against
 *       `RankSchema`, which rejects the `Date` it carries. Once any rank row exists this
 *       endpoint therefore fails with a 500. See the `Rank` schema for detail.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               can_record:
 *                 type: boolean
 *                 description: Keep only games whose info has this can_record value
 *               discussed:
 *                 type: boolean
 *                 description: Keep only games whose info has this discussed value
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GameWithInfo'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/with-info', async (request, response) => {
    const {can_record, discussed} = request.body;
    const allGamesWithInfo = await getAllGamesWithInfo(can_record, discussed);
    response.json(allGamesWithInfo);
});


/**
 * @swagger
 * /games/{id}:
 *   get:
 *     tags: [Games]
 *     summary: Get game by ID
 *     description: >
 *       An unknown id does not produce a 404. The lookup returns `null`, which is then
 *       validated against `GameSchema`, fails, and surfaces as a 500.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', async (request, response) => {
    const game = await getGameById(request.params.id)
    response.json(game);
});


/**
 * @swagger
 * /games/create:
 *   post:
 *     tags: [Games]
 *     summary: Create a game
 *     description: >
 *       Creates the game together with an empty game_info row. If a game with the same
 *       name already exists it is returned untouched, so the call is safe to repeat.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGame'
 *     responses:
 *       201:
 *         description: The created game, or the existing game with the same name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/create', validateRequest(CreateGameSchema), async (request, response) => {
    const createdGame = await createGame(request.body);
    response.status(201).json(createdGame);
});


/**
 * @swagger
 * /games/info:
 *   put:
 *     tags: [Games]
 *     summary: Update the info attached to a game
 *     description: >
 *       Declared before `/games/{id}` so that the literal `info` segment is matched first.
 *       The row to update is identified by the `id` in the body, and the whole
 *       `GameInformation` object is expected - this is a replace, not a patch.
 *
 *
 *       A body that fails its DTO, or an `id` that matches no row, comes back as a 500.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInformation'
 *     responses:
 *       200:
 *         description: The updated game info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameInformation'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/info', validateRequest(GameInfoSchema), async (request, response) => {
    const updatedGameInfo = await updateGameInfo(request.body);
    response.status(200).json(updatedGameInfo);
});


/**
 * @swagger
 * /games/{id}:
 *   put:
 *     tags: [Games]
 *     summary: Update a game by ID
 *     description: >
 *       The full game object is expected in the body, including its `id`. The row that is
 *       written is the one named by the path parameter; the `id` in the body is validated
 *       but not used to locate it, and is written through, so sending a different value
 *       reassigns the primary key.
 *
 *
 *       An `id` that matches no row raises a Prisma `P2025` and comes back as a 500, as
 *       does a body that fails its DTO.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       200:
 *         description: The updated game
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', validateRequest(GameSchema), async (request: Request<{ id: string }>, response) => {
    const updatedGame = await updateGame(request.params.id, request.body);
    response.status(200).json(updatedGame);
});


/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     tags: [Games]
 *     summary: Delete a game by ID
 *     description: >
 *       Deletes only the `game` row. The related `game_info` and `rank` rows are not
 *       cascaded, so a game that has either still attached fails on its foreign key, and
 *       an id that matches nothing raises a Prisma `P2025`. Both surface as a 500.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: The deleted game
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', async (request, response) => {
    const deletedGame = await deleteGame(request.params.id);
    response.status(200).json(deletedGame);
});


export default router;
