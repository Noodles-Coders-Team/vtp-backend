import { Router } from "express";
import { createRank, deleteRank, getAllRanks, getAllRanksForGame } from "../services/rankService";
import {validateRequest} from "../middleware/validate";
import {CreateRankSchema} from "@nct/vtp-common";


/**
 * @swagger
 * tags:
 *   name: Ranks
 *   description: Rank management endpoints
 */
const router = Router();


/**
 * @swagger
 * /rank:
 *   get:
 *     tags: [Ranks]
 *     summary: List all ranks
 *     description: >
 *       Returns every rank row across all games, in no particular order.
 *
 *
 *       **Known defect:** each row is validated against `RankSchema`, which types `date` as
 *       a string while Prisma hydrates it into a `Date`. As soon as one rank row exists this
 *       call fails validation and comes back as a 500. See the `Rank` schema for detail.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rank'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (request, response) => {
    const allRanks = await getAllRanks();
    response.json(allRanks);
});


/**
 * @swagger
 * /rank/{gameId}:
 *   get:
 *     tags: [Ranks]
 *     summary: List the rank history of a single game
 *     description: >
 *       Ordered by date descending, so the current position is first. An unknown game id is
 *       not an error, it simply yields an empty array.
 *
 *
 *       **Known defect:** a game that does have ranks fails validation and comes back as a
 *       500, for the reason described on the `Rank` schema. Only the empty case succeeds.
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         description: ID of the game whose ranks should be returned
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Every rank recorded for the game, empty array if there are none
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rank'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:gameId', async (request, response) => {
    const gameId = request.params.gameId;
    const gameRanks = await getAllRanksForGame(gameId);
    response.json(gameRanks);
});


/**
 * @swagger
 * /rank:
 *   post:
 *     tags: [Ranks]
 *     summary: Create or replace the rank of a game on a date
 *     description: >
 *       Despite the name and the 201, this behaves as an upsert: it looks for a rank with
 *       the same `game_id` and `date` and updates it if one exists, otherwise it inserts a
 *       new row. The status is 201 either way. Any `id` in the body is ignored for matching.
 *
 *
 *       `game_id` must reference an existing game; the foreign key is enforced, so a
 *       dangling reference comes back as a 500.
 *
 *
 *       **Known defect:** the created or updated row is validated against `RankSchema` on
 *       the way out, which rejects the `Date` Prisma returns. The write is committed, but
 *       the response is a 500. See the `Rank` schema for detail.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRank'
 *     responses:
 *       201:
 *         description: The created or updated rank
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rank'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', validateRequest(CreateRankSchema), async (request, response) => {
    const createdRank = await createRank(request.body);
    response.status(201).json(createdRank);
});


/**
 * @swagger
 * /rank/{id}:
 *   delete:
 *     tags: [Ranks]
 *     summary: Delete a rank by ID
 *     description: >
 *       An id that matches no row raises a Prisma `P2025` and comes back as a 500.
 *
 *
 *       **Known defect:** the deleted row is validated against `RankSchema` on the way out,
 *       which rejects the `Date` Prisma returns, so the delete is committed but the
 *       response is a 500. See the `Rank` schema for detail.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: The deleted rank
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rank'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', async (request, response) => {
    const deletedRank = await deleteRank(request.params.id);
    response.status(200).json(deletedRank);
});


export default router;