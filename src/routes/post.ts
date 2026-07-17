/**
 * @file Post Routes
 * @description API routes for managing posts including CRUD operations
 * @author VTP Team
 * @version 1.0.0
 */

import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get('/', async (request, response) => {
    const allPosts = await prisma.prisma.post.findMany();
    response.json(allPosts);
});


router.get('/:id', async (request, response) => {
    const postId = request.params.id;
    const post = await prisma.prisma.post.findUnique({
        where: { id: postId }
    });
    response.json(post);
});


router.post('/', async (request, response) => {
    const post = request.body;
    console.log("Creating post: ", JSON.stringify(post, null, 2));
    const createdPost = await prisma.prisma.post.create({
        data: post
    });
    response.status(201).json(createdPost);
});


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


router.delete('/:id', async (request, response) => {
    const postId = request.params.id;
    console.log("Deleting post with ID: ", postId);
    const deletedPost = await prisma.prisma.post.delete({
        where: { id: postId }
    });
    response.status(200).json(deletedPost);
});

export default router;