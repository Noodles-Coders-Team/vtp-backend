import { Router } from "express";
import prisma from "../lib/prisma";

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
    const allGames = await prisma.prisma.games.findMany();
    console.log("All games: ", JSON.stringify(allGames, null, 2));
    response.json(allGames);
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
    const gameId = request.params.id;
    const game = await prisma.prisma.games.findUnique({
        where: { id: gameId }
    });
    console.log("Game: ", JSON.stringify(game, null, 2));
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
    const game = request.body;
    console.log("Creating game: ", JSON.stringify(game, null, 2));
    const createdGame = await prisma.prisma.games.create({
        data: game
    });
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
    const gameId = request.params.id;
    const game = request.body;
    console.log("Updating game with ID: ", gameId, " with data: ", JSON.stringify(game, null, 2));
    const updatedGame = await prisma.prisma.games.update({
        where: { id: gameId },
        data: game
    });
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
    const gameId = request.params.id;
    console.log("Deleting game with ID: ", gameId);
    const deletedGame = await prisma.prisma.games.delete({
        where: { id: gameId }
    });
    response.status(200).json(deletedGame);
});

export default router;