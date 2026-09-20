import { Router } from "express";
import prisma from "../lib/prisma";


/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management endpoints
 */
const router = Router();


/**
 * @swagger
 * /post:
 *   get:
 *     tags: [Posts]
 *     summary: List all posts
 *     description: >
 *       Returns every post in no particular order, without its statistic snapshots. Queries
 *       Prisma directly without a DTO check.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (request, response) => {
    const allPosts = await prisma.prisma.post.findMany();
    response.json(allPosts);
});


/**
 * @swagger
 * /post/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Get post by ID
 *     description: >
 *       Queries Prisma directly without a DTO check, so an unknown id is answered with
 *       `200` and a literal `null` body rather than a 404.
 *
 *
 *       **Known defect:** this router is mounted on `/post` ahead of the PostInformation
 *       router on `/post/information`, and `/:id` matches a single segment, so a
 *       `GET /post/information` is served here with `id` set to the literal string
 *       `information` and answers `null`. `GET /post/information` can therefore never
 *       reach its own handler. The deeper `/post/information/{id}` paths are unaffected,
 *       as are the other methods.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: External post identifier, e.g. the YouTube video id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The post, or `null` when no post has that id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', async (request, response) => {
    const postId = request.params.id;
    const post = await prisma.prisma.post.findUnique({
        where: { id: postId }
    });
    response.json(post);
});


/**
 * @swagger
 * /post:
 *   post:
 *     tags: [Posts]
 *     summary: Create a post
 *     description: >
 *       The `id` is supplied by the caller, it is not generated server side. The body is
 *       handed to Prisma unvalidated, so an unknown field or a duplicate `id` fails inside
 *       Prisma and comes back as a 500. `game_id` is a loose reference: it is not declared
 *       as a relation and carries no foreign key, so any string is accepted.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', async (request, response) => {
    const post = request.body;
    const createdPost = await prisma.prisma.post.create({
        data: post
    });
    response.status(201).json(createdPost);
});


/**
 * @swagger
 * /post/{id}:
 *   put:
 *     tags: [Posts]
 *     summary: Update a post by ID
 *     description: >
 *       The body is passed to Prisma as the update payload, so only the fields present are
 *       written. An id that matches no row raises a Prisma `P2025` and comes back as a 500.
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
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', async (request, response) => {
    const postId = request.params.id;
    const post = request.body;
    const updatedPost = await prisma.prisma.post.update({
        where: { id: postId },
        data: post
    });
    response.status(200).json(updatedPost);
});


/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     tags: [Posts]
 *     summary: Delete a post by ID
 *     description: >
 *       Deletes only the `post` row. Its `post_info` snapshots are not cascaded - the
 *       foreign key is `ON DELETE RESTRICT` - so a post that has been imported cannot be
 *       deleted until its snapshots are removed first. That, and an id that matches no
 *       row, both come back as a 500.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', async (request, response) => {
    const postId = request.params.id;
    const deletedPost = await prisma.prisma.post.delete({
        where: { id: postId }
    });
    response.status(200).json(deletedPost);
});


export default router;