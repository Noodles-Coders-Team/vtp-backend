import { Router } from "express";
import { createDropDownData, deleteDropDownData, getAllDropDownData, getGenreDropDown, getTagsDropDown } from "../services/dropDownDataService";

/**
 * @swagger
 * tags:
 *   name: DropDownData
 *   description: Drop down dictionary values (tags, genres, ...)
 */
const router = Router();


/**
 * @swagger
 * /drop-down-data/tag:
 *   get:
 *     tags: [DropDownData]
 *     summary: List tag values
 *     description: Returns every entry of type `tag`, ordered by score descending then value.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DropDownData'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/tag', async (request, response) => {
    const allTags = await getTagsDropDown();
    response.json(allTags);
});

/**
 * @swagger
 * /drop-down-data/genre:
 *   get:
 *     tags: [DropDownData]
 *     summary: List genre values
 *     description: Returns every entry of type `genre`, ordered by score descending then value.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DropDownData'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/genre', async (request, response) => {
    const allGenres = await getGenreDropDown();
    response.json(allGenres);
});

/**
 * @swagger
 * /drop-down-data/{key}:
 *   delete:
 *     tags: [DropDownData]
 *     summary: Delete a drop down value by key
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         description: Composite key in the form `<type>_<value>`, e.g. `tag_horror`
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DropDownData'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:key', async (request, response) => {
    const deleted = await deleteDropDownData(request.params.key);
    response.json(deleted);
});

/**
 * @swagger
 * /drop-down-data:
 *   get:
 *     tags: [DropDownData]
 *     summary: List every drop down value
 *     description: Returns all types at once, ordered by type, then score descending, then value.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DropDownData'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (request, response) => {
    const allData = await getAllDropDownData();
    response.json(allData);
});

/**
 * @swagger
 * /drop-down-data:
 *   post:
 *     tags: [DropDownData]
 *     summary: Create or update a drop down value
 *     description: >
 *       Upsert keyed on `<type>_<value>`, so posting an existing pair updates its score
 *       instead of failing. A blank `value` is a no-op and is echoed back unsaved.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DropDownData'
 *     responses:
 *       200:
 *         description: The created or updated entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DropDownData'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', async (request, response) => {
    const created = await createDropDownData(request.body);
    response.json(created);
});

export default router;
