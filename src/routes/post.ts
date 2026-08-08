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
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Post entity data
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', async (request, response) => {
    const post = request.body;
    console.log("Creating post: ", JSON.stringify(post, null, 2));
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
 *             type: object
 *             description: Post fields to update
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/:id', async (request, response) => {
    const postId = request.params.id;
    const post = request.body;
    console.log("Updating post with ID: ", postId, " with data: ", JSON.stringify(post, null, 2));
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
 *         description: OK
 */
router.delete('/:id', async (request, response) => {
    const postId = request.params.id;
    console.log("Deleting post with ID: ", postId);
    const deletedPost = await prisma.prisma.post.delete({
        where: { id: postId }
    });
    response.status(200).json(deletedPost);
});


export default router;