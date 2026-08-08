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
 *     summary: Get games filtered by info fields
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               can_record:
 *                 type: boolean
 *               discussed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: OK
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
 *     responses:
 *       200:
 *         description: OK
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               release_date:
 *                 type: string
 *                 format: date-time
 *               link:
 *                 type: string
 *               recorded:
 *                 type: boolean
 *             required: [name, recorded]
 *     responses:
 *       201:
 *         description: Created
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
 *     summary: Update game info
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               game_id:
 *                 type: string
 *                 format: uuid
 *               discussed:
 *                 type: boolean
 *               can_record:
 *                 type: boolean
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               notes:
 *                 type: string
 *             required: [id, game_id]
 *     responses:
 *       200:
 *         description: OK
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               release_date:
 *                 type: string
 *                 format: date-time
 *               link:
 *                 type: string
 *               recorded:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: OK
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
 *     responses:
 *       200:
 *         description: OK
 */
router.delete('/:id', async (request, response) => {
    const deletedGame = await deleteGame(request.params.id);
    response.status(200).json(deletedGame);
});

export default router;
