import { Router } from "express";
import { validate } from "../middleware/validate";
import { CreateTemperatureSchema } from "@nct/weather-common";
import prisma from "../lib/prisma";

const router = Router();

/**
 * @openapi
 * /temperature:
 *   get:
 *     summary: List all temperatures
 *     tags: [Temperatures]
 *     responses:
 *       200:
 *         description: A list of temperature records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   user_id:
 *                     type: integer
 *                   inside:
 *                     type: number
 *                   outside:
 *                     type: number
 *                   time:
 *                     type: string
 *                     format: date-time
 */
router.get('/', async (request, response) => {
    const allTemperatures = (await prisma.prisma.temperature.findMany({orderBy: {time: "asc"}, take: 10}));
    console.log("All temperatures: ", JSON.stringify(allTemperatures, null, 2));
    response.json(allTemperatures);
});

/**
 * @openapi
 * /temperature/user/{id}:
 *   get:
 *     summary: Get temperatures for a specific user
 *     tags: [Temperatures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of temperature records for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/user/:id', async (request, response) => {
    const parsedId = parseInt(request.params.id, 10);
    const userTemperatures = await prisma.prisma.temperature.findMany({
        where: { user_id: parsedId },
        orderBy: {time: "asc"},
        take: 10
    });
    console.log(`Temperatures for user ${parsedId}: `, JSON.stringify(userTemperatures, null, 2));
    response.json(userTemperatures);
});

/**
 * @openapi
 * /temperature/create:
 *   post:
 *     summary: Create a new temperature record
 *     tags: [Temperatures]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, inside, outside]
 *             properties:
 *               user_id:
 *                 type: integer
 *               inside:
 *                 type: number
 *               outside:
 *                 type: number
 *     responses:
 *       201:
 *         description: Temperature record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post('/create', validate(CreateTemperatureSchema), async (request, response) => {
    const temperature = request.body;
    console.log("Creating temperature: ", JSON.stringify(temperature, null, 2));
    const createdTemperature = await prisma.prisma.temperature.create({
        data: temperature
    });
    response.status(201).json(createdTemperature);
});

/**
 * @openapi
 * /temperature/delete/{id}:
 *   post:
 *     summary: Delete a temperature record by id
 *     tags: [Temperatures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Temperature deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post('/delete/:id', async (request, response) => {
    console.log("Deleting temperature with ID: ", request.params.id);
    const deletedTemperature = await prisma.prisma.temperature.delete({
        where: { id: request.params.id }
    });
    response.status(200).json(deletedTemperature);
});

/**
 * @openapi
 * /temperature/delete/allFromUserId/{userId}:
 *   post:
 *     summary: Delete all temperature records for a user by user id
 *     tags: [Temperatures]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deletion result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: No temperatures were found for the given user id
 */
router.post('/delete/allFromUserId/:userId', async (request, response) => {
    const userId = parseInt(request.params.userId, 10);
    console.log("Deleting temperatures for user with ID: ", userId);
    const deletedTemperatures = await prisma.prisma.temperature.deleteMany({
        where: { user_id: userId }
    });
    if (deletedTemperatures.count === 0) {
        response.status(404).json({ error: "No temperatures found for the given user ID" });
        return;
    }
    response.status(200).json(deletedTemperatures);
});

/**
 * @openapi
 * /temperature/delete/allFromUserLogin/{userLogin}:
 *   post:
 *     summary: Delete all temperature records for a user by login
 *     tags: [Temperatures]
 *     parameters:
 *       - in: path
 *         name: userLogin
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deletion result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: User not found or no temperatures found for the user
 */
router.post('/delete/allFromUserLogin/:userLogin', async (request, response) => {
    const userLogin = request.params.userLogin;
    const user = await prisma.prisma.user.findUnique({ where: { login: userLogin } });
    if (!user) {
        response.status(404).json({ error: "User not found" });
        return;
    }
    console.log("Deleting temperatures for user with ID: ", user.id);
    const deletedTemperatures = await prisma.prisma.temperature.deleteMany({
        where: { user_id: user.id }
    });
    if (deletedTemperatures.count === 0) {
        response.status(404).json({ error: "No temperatures found for the given user ID" });
        return;
    }
    response.status(200).json(deletedTemperatures);
});

export default router;