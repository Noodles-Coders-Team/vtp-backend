import { Router } from "express";
import prisma from "../lib/prisma";


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
    const allRanks = await prisma.prisma.rank.findMany();
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
router.get('/:id', async (request, response) => {
    const rankId = request.params.id;
    const rank = await prisma.prisma.rank.findUnique({
        where: { id: rankId }
    });
    response.json(rank);
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
 *             description: Rank entity data (Prisma model: rank)
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', async (request, response) => {
    const rank = request.body;
    const createdRank = await prisma.prisma.rank.create({
        data: rank
    });
    response.status(201).json(createdRank);
});


/**
 * @swagger
 * /rank/{id}:
 *   put:
 *     tags: [Ranks]
 *     summary: Update a rank by ID
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
 *             description: Rank fields to update (Prisma model: rank)
 *     responses:
 *       200:
 *         description: OK
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
    const rankId = request.params.id;
    console.log("Deleting rank with ID: ", rankId);
    const deletedRank = await prisma.prisma.rank.delete({
        where: { id: rankId }
    });
    response.status(200).json(deletedRank);
});


export default router;