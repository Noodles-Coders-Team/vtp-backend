import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

/**
 * @openapi
 * /post:
 *   get:
 *     summary: List all posts
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: A list of posts
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
 *                   publication_time:
 *                     type: string
 *                     format: date-time
 */
router.get('/', async (request, response) => {
    const allPosts = await prisma.prisma.post.findMany();
    console.log("All posts: ", JSON.stringify(allPosts, null, 2));
    response.json(allPosts);
});

/**
 * @openapi
 * /post/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A post object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 game_id:
 *                   type: string
 *                 publication_time:
 *                   type: string
 *                   format: date-time
 */
router.get('/:id', async (request, response) => {
    const postId = request.params.id;
    const post = await prisma.prisma.post.findUnique({
        where: { id: postId }
    });
    console.log("Post: ", JSON.stringify(post, null, 2));
    response.json(post);
});

/**
 * @openapi
 * /post:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, game_id, publication_time]
 *             properties:
 *               id:
 *                 type: string
 *               game_id:
 *                 type: string
 *               publication_time:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 game_id:
 *                   type: string
 *                 publication_time:
 *                   type: string
 *                   format: date-time
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
 * @openapi
 * /post/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Post]
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
 *               publication_time:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 game_id:
 *                   type: string
 *                 publication_time:
 *                   type: string
 *                   format: date-time
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
 * @openapi
 * /post/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
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