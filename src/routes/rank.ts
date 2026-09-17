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
 */
router.get('/', async (request, response) => {
    const allRanks = await getAllRanks();
    response.json(allRanks);
});


/**
 * @swagger
 * /rank/{id}:
 *   get:
 *     tags: [Ranks]
 *     summary: Get rank by ID
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
 *             type: object
 *             description: Rank entity data
 *     responses:
 *       201:
 *         description: Created
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
 *     responses:
 *       200:
 *         description: OK
 */
router.delete('/:id', async (request, response) => {
    const deletedRank = await deleteRank(request.params.id);
    response.status(200).json(deletedRank);
});


export default router;