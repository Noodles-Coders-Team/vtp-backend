import { Router } from "express";
import { createSetting, deleteSetting, getAllSettings, getSettingByKey, updateSetting } from "../services/settingsService";


/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Key/value application settings
 */
const router = Router();


/**
 * @swagger
 * /settings:
 *   get:
 *     tags: [Settings]
 *     summary: List all settings
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Setting'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (request, response) => {
    const allSettings = await getAllSettings();
    response.json(allSettings);
});


/**
 * @swagger
 * /settings/{key}:
 *   get:
 *     tags: [Settings]
 *     summary: Get a setting by key
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Setting'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:key', async (request, response) => {
    const setting = await getSettingByKey(request.params.key);
    response.json(setting);
});


/**
 * @swagger
 * /settings:
 *   post:
 *     tags: [Settings]
 *     summary: Create a setting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Setting'
 *     responses:
 *       200:
 *         description: The created setting
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Setting'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', async (request, response) => {
    const setting = await createSetting(request.body);
    response.json(setting);
});


/**
 * @swagger
 * /settings:
 *   put:
 *     tags: [Settings]
 *     summary: Update a setting
 *     description: The setting to update is identified by the `key` in the body, not by a path parameter.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Setting'
 *     responses:
 *       200:
 *         description: The updated setting
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Setting'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/', async (request, response) => {
    const setting = await updateSetting(request.body);
    response.json(setting);
});


/**
 * @swagger
 * /settings/{key}:
 *   delete:
 *     tags: [Settings]
 *     summary: Delete a setting by key
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted setting
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Setting'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:key', async (request, response) => {
    const setting = await deleteSetting(request.params.key);
    response.json(setting);
})


export default router;
