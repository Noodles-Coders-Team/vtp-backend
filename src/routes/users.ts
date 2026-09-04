import { Router } from "express";
import { CreateUserSchema } from "@nct/vtp-common";
import { validateRequest } from "../middleware/validate";
import prisma from "../lib/prisma";


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */
const router = Router();


/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List all users
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', async (request, response) => {
    const allUsers = await prisma.prisma.users.findMany();
    response.json(allUsers);
});


/**
 * @swagger
 * /users/{login}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by login
 *     parameters:
 *       - in: path
 *         name: login
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:login', async (request, response) => {
    const login = request.params.login;
    const allUsers = await prisma.prisma.users.findFirst({ where: { login: login } });
    response.json(allUsers);
});


/**
 * @swagger
 * /users/create:
 *   post:
 *     tags: [Users]
 *     summary: Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               user_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               permission_level:
 *                 type: string
 *                 maxLength: 100
 *             required: [login]
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/create', validateRequest(CreateUserSchema), async (request, response) => {
    const user = request.body;
    const createdUser = await prisma.prisma.users.create({
        data: user
    });
    response.status(201).json(createdUser);
});


/**
 * @swagger
 * /users/delete/byId/{id}:
 *   post:
 *     tags: [Users]
 *     summary: Delete user by ID
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
router.post('/delete/byId/:id', async (request, response) => {
    const userId = request.params.id;
    const deletedUser = await prisma.prisma.users.delete({
        where: { login: userId }
    });
    response.status(200).json(deletedUser);
});


/**
 * @swagger
 * /users/delete/byLogin/{login}:
 *   post:
 *     tags: [Users]
 *     summary: Delete user by login
 *     parameters:
 *       - in: path
 *         name: login
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/delete/byLogin/:login', async (request, response) => {
    const userLogin = request.params.login;
    const deletedUser = await prisma.prisma.users.delete({
        where: { login: userLogin }
    });
    response.status(200).json(deletedUser);
});


export default router;