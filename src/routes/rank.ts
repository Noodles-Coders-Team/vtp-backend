import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();


router.get('/', async (request, response) => {
    const allRanks = await prisma.prisma.rank.findMany();
    response.json(allRanks);
});


router.get('/:id', async (request, response) => {
    const rankId = request.params.id;
    const rank = await prisma.prisma.rank.findUnique({
        where: { id: rankId }
    });
    response.json(rank);
});


router.post('/', async (request, response) => {
    const rank = request.body;
    const createdRank = await prisma.prisma.rank.create({
        data: rank
    });
    response.status(201).json(createdRank);
});


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


router.delete('/:id', async (request, response) => {
    const rankId = request.params.id;
    console.log("Deleting rank with ID: ", rankId);
    const deletedRank = await prisma.prisma.rank.delete({
        where: { id: rankId }
    });
    response.status(200).json(deletedRank);
});

export default router;