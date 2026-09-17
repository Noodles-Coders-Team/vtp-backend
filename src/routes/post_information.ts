import { Router } from "express";
import prisma from "../lib/prisma";


/**
 * @swagger
 * tags:
 *   name: PostInformation
 *   description: Post information management endpoints
 */
const router = Router();


/**
 * @swagger
 * /post/information:
 *   get:
 *     tags: [PostInformation]
 *     summary: List all post informations
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', async (request, response) => {
    const allPostInformation = await prisma.prisma.postInformation.findMany();
    response.json(allPostInformation);
});


/**
 * @swagger
 * /post/information/{id}:
 *   get:
 *     tags: [PostInformation]
 *     summary: Get post information by ID
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
    const postInformationId = request.params.id;
    const postInformation = await prisma.prisma.postInformation.findUnique({
        where: { id: postInformationId }
    });
    response.json(postInformation);
});


/**
 * @swagger
 * /post/information:
 *   post:
 *     tags: [PostInformation]
 *     summary: Create post information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: PostInformation entity data
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', async (request, response) => {
    const postInformation = request.body;
    const createdPostInformation = await prisma.prisma.postInformation.create({
        data: postInformation
    });
    response.status(201).json(createdPostInformation);
});


/**
 * @swagger
 * /post/information/{id}:
 *   put:
 *     tags: [PostInformation]
 *     summary: Update post information by ID
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
 *             description: PostInformation fields to update
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/:id', async (request, response) => {
    const postInformationId = request.params.id;
    const postInformation = request.body;
    const updatedPostInformation = await prisma.prisma.postInformation.update({
        where: { id: postInformationId },
        data: postInformation
    });
    response.status(200).json(updatedPostInformation);
});


/**
 * @swagger
 * /post/information/{id}:
 *   delete:
 *     tags: [PostInformation]
 *     summary: Delete post information by ID
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
    const postInformationId = request.params.id;
    const deletedPostInformation = await prisma.prisma.postInformation.delete({
        where: { id: postInformationId }
    });
    response.status(200).json(deletedPostInformation);
});

export default router;