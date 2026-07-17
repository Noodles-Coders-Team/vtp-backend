import { Router } from "express";
import { CreateUserSchema } from "@nct/vtp-common";
import { validateRequest } from "../middleware/validate";
import prisma from "../lib/prisma";

const router = Router();


router.get('/', async (request, response) => {
    const allUsers = await prisma.prisma.users.findMany();
    response.json(allUsers);
});


router.get('/:id', async (request, response) => {
    const userId = request.params.id;
    const allUsers = await prisma.prisma.users.findFirst({where: {login: userId}});
    response.json(allUsers);
});


router.post('/create', validateRequest(CreateUserSchema), async (request, response) => {
    const user = request.body;
    console.log("Creating user: ", JSON.stringify(user, null, 2));
    const createdUser = await prisma.prisma.users.create({
        data: user
    });
    response.status(201).json(createdUser);
});


router.post('/delete/byId/:id', async (request, response) => {
    const userId = request.params.id;
    console.log("Deleting user with ID: ", userId);
    const deletedUser = await prisma.prisma.users.delete({
        where: { login: userId }
    });
    response.status(200).json(deletedUser);
});


router.post('/delete/byLogin/:login', async (request, response) => {
    const userLogin = request.params.login;
    console.log("Deleting user with login: ", userLogin);
    const deletedUser = await prisma.prisma.users.delete({
        where: { login: userLogin }
    });
    response.status(200).json(deletedUser);
});

export default router;