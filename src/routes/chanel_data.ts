import { Router } from "express";
import { getAllChannelData } from "../services/chanelDataService";

/**
 * @swagger
 * tags:
 *   name: ChannelData
 *   description: Channel data endpoints
 */

const router = Router();


/**
 * @swagger
 * /channel-data:
 *   get:
 *     tags: [ChannelData]
 *     summary: List all channel data
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', async (request, response) => {
    const allData = await getAllChannelData();
    response.json(allData);
});

export default router;
