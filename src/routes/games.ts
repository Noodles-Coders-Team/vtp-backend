import { Router } from "express";
import p from "../lib/prisma";
import { createGame, deleteGame, getAllGames, getAllGamesWithInfo, getGameById, updateGame } from "../services/gameService";
const prisma = p.prisma;
const router = Router();

/**
 * @openapi
 * /games:
 *   get:
 *     summary: List all games
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: A list of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   release_date:
 *                     type: string
 *                     format: date-time
 *                   link:
 *                     type: string
 *                   discussed:
 *                     type: boolean
 *                   can_record:
 *                     type: boolean
 *                   recorded:
 *                     type: boolean
 */
router.get('/', async (request, response) => {
    const allGames = await getAllGames();
    response.json(allGames);
});

router.post('/with-info', async (request, response) => {
    console.log(request.body);
    const { can_record, discussed } = request.body;
    const allGamesWithInfo = await getAllGamesWithInfo(can_record, discussed);
    response.json(allGamesWithInfo);
});

/**
 * @openapi
 * /games/{id}:
 *   get:
 *     summary: Get a game by ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A game object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 release_date:
 *                   type: string
 *                   format: date-time
 *                 link:
 *                   type: string
 *                 discussed:
 *                   type: boolean
 *                 can_record:
 *                   type: boolean
 *                 recorded:
 *                   type: boolean
 */
router.get('/:id', async (request, response) => {
    const game = await getGameById(request.params.id)
    response.json(game);
});

/**
 * @openapi
 * /games:
 *   post:
 *     summary: Create a new game
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               release_date:
 *                 type: string
 *                 format: date-time
 *               link:
 *                 type: string
 *               discussed:
 *                 type: boolean
 *               can_record:
 *                 type: boolean
 *               recorded:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Game created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 release_date:
 *                   type: string
 *                   format: date-time
 *                 link:
 *                   type: string
 *                 discussed:
 *                   type: boolean
 *                 can_record:
 *                   type: boolean
 *                 recorded:
 *                   type: boolean
 */
router.post('/', async (request, response) => {
    const createdGame = await createGame(request.body);
    response.status(201).json(createdGame);
});

/**
 * @openapi
 * /games/{id}:
 *   put:
 *     summary: Update a game by ID
 *     tags: [Games]
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
 *               name:
 *                 type: string
 *               release_date:
 *                 type: string
 *                 format: date-time
 *               link:
 *                 type: string
 *               discussed:
 *                 type: boolean
 *               can_record:
 *                 type: boolean
 *               recorded:
 *                   type: boolean
 *     responses:
 *       200:
 *         description: Game updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 release_date:
 *                   type: string
 *                   format: date-time
 *                 link:
 *                   type: string
 *                 discussed:
 *                   type: boolean
 *                 can_record:
 *                   type: boolean
 *                 recorded:
 *                   type: boolean
 */
router.put('/:id', async (request, response) => {
    const updatedGame = await updateGame(request.params.id, request.body);
    response.status(200).json(updatedGame);
});

/**
 * @openapi
 * /games/{id}:
 *   delete:
 *     summary: Delete a game by ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.delete('/:id', async (request, response) => {
    const deletedGame = await deleteGame(request.body.id);
    response.status(200).json(deletedGame);
});

export default router;