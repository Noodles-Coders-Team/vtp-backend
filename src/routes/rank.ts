import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

/**
 * @openapi
 * /rank:
 *   get:
 *     summary: List all ranks
 *     tags: [Rank]
 *     responses:
 *       200:
 *         description: A list of ranks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   game_id:
 *                     type: string
 *                   version_id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   rank:
 *                     type: number
 *                     format: float
 */
router.get('/', async (request, response) => {
    const allRanks = await prisma.prisma.rank.findMany();
    response.json(allRanks);
});

/**
 * @openapi
 * /rank/{id}:
 *   get:
 *     summary: Get a rank by ID
 *     tags: [Rank]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A rank object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 game_id:
 *                   type: string
 *                 version_id:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 rank:
 *                   type: number
 *                   format: float
 */
router.get('/:id', async (request, response) => {
    const rankId = request.params.id;
    const rank = await prisma.prisma.rank.findUnique({
        where: { id: rankId }
    });
    response.json(rank);
});

/**
 * @openapi
 * /rank:
 *   post:
 *     summary: Create a new rank
 *     tags: [Rank]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [game_id, version_id, date, rank]
 *             properties:
 *               game_id:
 *                 type: string
 *               version_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date-time
 *               rank:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Rank created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 game_id:
 *                   type: string
 *                 version_id:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 rank:
 *                   type: number
 *                   format: float
 */
router.post('/', async (request, response) => {
    const rank = request.body;
    const createdRank = await prisma.prisma.rank.create({
        data: rank
    });
    response.status(201).json(createdRank);
});

/**
 * @openapi
 * /rank/{id}:
 *   put:
 *     summary: Update a rank by ID
 *     tags: [Rank]
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
 *               game_id:
 *                 type: string
 *               version_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date-time
 *               rank:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Rank updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 game_id:
 *                   type: string
 *                 version_id:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 rank:
 *                   type: number
 *                   format: float
 */
router.put('/:id', async (request, response) => {
    const rankId = request.params.id;
    const rank = request.body;
    console.log("Updating rank with ID: ", rankId, " with data: ", JSON.stringify(rank, null, 2));
    const updatedRank = await prisma.prisma.rank.update({
        where: { id: rankId },
        data: rank
    });
    response.status(200).json(updatedRank);
});

/**
 * @openapi
 * /rank/{id}:
 *   delete:
 *     summary: Delete a rank by ID
 *     tags: [Rank]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rank deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.delete('/:id', async (request, response) => {
    const rankId = request.params.id;
    console.log("Deleting rank with ID: ", rankId);
    const deletedRank = await prisma.prisma.rank.delete({
        where: { id: rankId }
    });
    response.status(200).json(deletedRank);
});

export default router;