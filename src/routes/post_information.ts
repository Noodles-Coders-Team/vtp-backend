import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get('/', async (request, response) => {
    const allPostInformations = await prisma.prisma.postInformation.findMany();
    response.json(allPostInformations);
});


router.get('/:id', async (request, response) => {
    const postInformationId = request.params.id;
    const postInformation = await prisma.prisma.postInformation.findUnique({
        where: { id: postInformationId }
    });
    response.json(postInformation);
});


router.post('/', async (request, response) => {
    const postInformation = request.body;
    console.log("Creating post information: ", JSON.stringify(postInformation, null, 2));
    const createdPostInformation = await prisma.prisma.postInformation.create({
        data: postInformation
    });
    response.status(201).json(createdPostInformation);
});


router.put('/:id', async (request, response) => {
    const postInformationId = request.params.id;
    const postInformation = request.body;
    console.log("Updating post information with ID: ", postInformationId, " with data: ", JSON.stringify(postInformation, null, 2));
    const updatedPostInformation = await prisma.prisma.postInformation.update({
        where: { id: postInformationId },
        data: postInformation
    });
    response.status(200).json(updatedPostInformation);
});


router.delete('/:id', async (request, response) => {
    const postInformationId = request.params.id;
    console.log("Deleting post information with ID: ", postInformationId);
    const deletedPostInformation = await prisma.prisma.postInformation.delete({
        where: { id: postInformationId }
    });
    response.status(200).json(deletedPostInformation);
});

export default router;