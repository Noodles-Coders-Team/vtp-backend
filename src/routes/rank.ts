import { Router } from "express";
import { createRank, deleteRank, getAllRanks, getAllRanksForGame } from "../services/rankService";


/**
 * @swagger
 * tags:
 *   name: Ranks
 *   description: Rank management endpoints
 */
const router = Router();


/**
 * @swagger
 * /rank:
 *   get:
 *     tags: [Ranks]
 *     summary: List all ranks
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rank'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (request, response) => {
    const allRanks = await getAllRanks();
    response.json(allRanks);
});


/**
 * @swagger
 * /rank/{gameId}:
 *   get:
 *     tags: [Ranks]
 *     summary: List the rank history of a single game
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         description: ID of the game whose ranks should be returned
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Every rank recorded for the game, empty array if there are none
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rank'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:gameId', async (request, response) => {
    const gameId = request.params.gameId;
    const gameRanks = await getAllRanksForGame(gameId);
    response.json(gameRanks);
});


/**
 * @swagger
 * /rank:
 *   post:
 *     tags: [Ranks]
 *     summary: Create a rank
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRank'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rank'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', async (request, response) => {
    const createdRank = await createRank(request.body);
    response.status(201).json(createdRank);
});


/**
 * @swagger
 * /rank/{id}:
 *   delete:
 *     tags: [Ranks]
 *     summary: Delete a rank by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: The deleted rank
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rank'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', async (request, response) => {
    const deletedRank = await deleteRank(request.params.id);
    response.status(200).json(deletedRank);
});


export default router;