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
 *     description: The `id` is supplied by the caller, it is not generated server side.
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
 *       400:
 *         $ref: '#/components/responses/ValidationError'
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
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
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