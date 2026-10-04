import { Router } from "express";
import prisma from "../lib/prisma";


/**
 * @swagger
 * tags:
 *   name: PostInformation
 *   description: Post information management endpoints
 */
const router = Router();

//TODO: Create service

/**
 * @swagger
 * /post/information:
 *   get:
 *     tags: [PostInformation]
 *     summary: List every post information snapshot
 *     description: >
 *       Returns all versions of all snapshots, newest versions are not filtered out.
 *
 *
 *       **Known defect: this operation is unreachable.** `app.ts` mounts the Post router on
 *       `/post` before this router on `/post/information`, and the Post router's
 *       `GET /:id` matches the single remaining segment `information` first. A
 *       `GET /post/information` is therefore answered by that handler with `200` and a
 *       `null` body - a lookup for a post whose id is the string `information`. The other
 *       operations in this file are reachable, because they either use a different method
 *       or carry an extra path segment.
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
 *     description: >
 *       The `id` is the snapshot's own id, not the id of the post it belongs to. There is
 *       no endpoint that lists the snapshots of one post; filter the full list instead.
 *
 *
 *       Queries Prisma directly without a DTO check, so an unknown id is answered with
 *       `200` and a literal `null` body rather than a 404.
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
 *       The referenced `post_id` must already exist; the foreign key is enforced, so a
 *       dangling reference comes back as a 500. Most callers reach this through
 *       `POST /import/table-data` instead of posting snapshots one at a time.
 *
 *
 *       The body is handed to Prisma unvalidated. `version_id` is not incremented here -
 *       it defaults to 1 unless the caller sets it, so posting two snapshots for the same
 *       post without setting it leaves both at version 1. Only the import endpoint keeps
 *       the versions in step.
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
 *     description: >
 *       Updates one snapshot in place; it does not create a new version. The body is passed
 *       to Prisma unvalidated as the update payload, so only the fields present are written.
 *       An id that matches no row raises a Prisma `P2025` and comes back as a 500.
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
 *     description: >
 *       Deletes a single version. Nothing renumbers the remaining snapshots, so deleting a
 *       middle version leaves a gap in `version_id`, and deleting the highest one means the
 *       next import reuses that number. An id that matches no row raises a Prisma `P2025`
 *       and comes back as a 500.
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