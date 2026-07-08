import { Router } from "express";
import { CreateUserSchema } from "@nct/vtp-common";
import { validate } from "../middleware/validate";
import prisma from "../lib/prisma";

const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   login:
 *                     type: string
 *                   name:
 *                     type: string
 *                   city:
 *                     type: string
 *                     nullable: true
 */
router.get('/', async (request, response) => {
    const allUsers = await prisma.prisma.users.findMany();
    console.log("All users: ", JSON.stringify(allUsers, null, 2));
    response.json(allUsers);
});

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   login:
 *                     type: string
 *                   name:
 *                     type: string
 *                   city:
 *                     type: string
 *                     nullable: true
 */
router.get('/:id', async (request, response) => {
    const userId = request.params.id;
    const allUsers = await prisma.prisma.users.findFirst({where: {login: userId}});
    console.log("All users: ", JSON.stringify(allUsers, null, 2));
    response.json(allUsers);
});

/**
 * @openapi
 * /users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login, name]
 *             properties:
 *               login:
 *                 type: string
 *               name:
 *                 type: string
 *               city:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 login:
 *                   type: string
 *                 name:
 *                   type: string
 *                 city:
 *                   type: string
 *                   nullable: true
 */
router.post('/create', validate(CreateUserSchema), async (request, response) => {
    const user = request.body;
    console.log("Creating user: ", JSON.stringify(user, null, 2));
    const createdUser = await prisma.prisma.users.create({
        data: user
    });
    response.status(201).json(createdUser);
});

/**
 * @openapi
 * /users/delete/byId/{id}:
 *   post:
 *     summary: Delete a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post('/delete/byId/:id', async (request, response) => {
    const userId = request.params.id;
    console.log("Deleting user with ID: ", userId);
    const deletedUser = await prisma.prisma.users.delete({
        where: { login: userId }
    });
    response.status(200).json(deletedUser);
});

/**
 * @openapi
 * /users/delete/byLogin/{login}:
 *   post:
 *     summary: Delete a user by login
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: login
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post('/delete/byLogin/:login', async (request, response) => {
    const userLogin = request.params.login;
    console.log("Deleting user with login: ", userLogin);
    const deletedUser = await prisma.prisma.users.delete({
        where: { login: userLogin }
    });
    response.status(200).json(deletedUser);
});

export default router;