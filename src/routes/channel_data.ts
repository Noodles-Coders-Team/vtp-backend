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
 *     description: >
 *       Returns the per-date view counters used to draw the channel chart, ordered by `id`
 *       ascending. `id` is the date as it was spelled in the imported CSV, so the ordering
 *       is lexicographic on that string, not chronological: it only comes out in date order
 *       if the source file used a sortable format such as `YYYY-MM-DD`.
 *
 *
 *       This is the one read path that returns rows straight from Prisma without a DTO
 *       check, so it cannot fail validation.
 *
 *
 *       There is no endpoint to create, update or delete channel data by hand - rows only
 *       arrive through `POST /import/channel-data`.
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
