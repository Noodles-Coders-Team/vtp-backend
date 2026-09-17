import { Router } from "express";
import { getAllChannelData } from "../services/channelDataService";

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
 *     description: Returns the per-date view counters used to draw the channel chart.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChannelData'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (request, response) => {
    const allData = await getAllChannelData();
    response.json(allData);
});

export default router;
