import { Router } from "express";
import { createGame, deleteGame, getAllGames, getAllGamesWithInfo, getGameById, updateGame } from "../services/gameService";
import { updateGameInfo } from "../services/gameInfoService";

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
 *       `game_score` (the sum of its tag and genre scores, adjusted by the latest rank).
 *       Results are sorted by `game_score` descending. Omit a filter field to leave that
 *       filter off. Uses POST only to carry the filter body.
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
    const { can_record, discussed } = request.body;
    const allGamesWithInfo = await getAllGamesWithInfo(can_record, discussed);
    response.json(allGamesWithInfo);
});


/**
 * @swagger
 * /games/{id}:
 *   get:
 *     tags: [Games]
 *     summary: Get game by ID
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
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
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/create', async (request, response) => {
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
 *       The row to update is identified by the `id` in the body.
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
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/info', async (request, response) => {
    const updatedGameInfo = await updateGameInfo(request.body);
    response.status(200).json(updatedGameInfo);
});


/**
 * @swagger
 * /games/{id}:
 *   put:
 *     tags: [Games]
 *     summary: Update a game by ID
 *     description: The full game object is expected in the body, including its `id`.
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
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', async (request, response) => {
    const updatedGame = await updateGame(request.params.id, request.body);
    response.status(200).json(updatedGame);
});


/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     tags: [Games]
 *     summary: Delete a game by ID
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', async (request, response) => {
    const deletedGame = await deleteGame(request.params.id);
    response.status(200).json(deletedGame);
});

export default router;
