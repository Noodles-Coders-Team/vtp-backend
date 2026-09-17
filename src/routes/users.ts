import {Router} from "express";
import {CreateUserSchema} from "@nct/vtp-common";
import {validateRequest} from "../middleware/validate";
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
 *         description: The user, or `null` when no user has that login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:login', async (request, response) => {
    const login = request.params.login;
    const allUsers = await prisma.prisma.users.findFirst({where: {login: login}});
    response.json(allUsers);
});


/**
 * @swagger
 * /users/create:
 *   post:
 *     tags: [Users]
 *     summary: Create a user
 *     description: The body is validated against `CreateUserSchema` from `@nct/vtp-common`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
 * /users/delete/byLogin/{login}:
 *   delete:
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
 *         description: The deleted user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/delete/byLogin/:login', async (request, response) => {
    const userLogin = request.params.login;
    const deletedUser = await prisma.prisma.users.delete({
        where: {login: userLogin}
    });
    response.status(200).json(deletedUser);
});


export default router;