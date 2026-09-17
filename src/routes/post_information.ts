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
 *     summary: List every post information snapshot
 *     description: Returns all versions of all snapshots, newest versions are not filtered out.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostInformation'
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
 *     description: The `id` is the snapshot's own id, not the id of the post it belongs to.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: The snapshot, or `null` when nothing has that id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostInformation'
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
 *     summary: Create a post information snapshot
 *     description: >
 *       The referenced `post_id` must already exist. Most callers reach this through
 *       `POST /import/table-data` instead of posting snapshots one at a time.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInformation'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostInformation'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInformation'
 *     responses:
 *       200:
 *         description: The updated snapshot
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostInformation'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
 *           format: uuid
 *     responses:
 *       200:
 *         description: The deleted snapshot
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostInformation'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', async (request, response) => {
    const postInformationId = request.params.id;
    const deletedPostInformation = await prisma.prisma.postInformation.delete({
        where: { id: postInformationId }
    });
    response.status(200).json(deletedPostInformation);
});

export default router;