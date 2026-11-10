import {Router} from "express";
import {
    createSetting,
    deleteSetting,
    getAllSettings,
    getSettingByKey,
    updateSetting
} from "../services/settingsService";
import {validateRequestSchema} from "../middleware/validateRequestSchema";
import {SettingSchema} from "@nct/vtp-common";


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
 *     description: Returns every setting in no particular order.
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
 *     description: >
 *       An unknown key does not produce a 404. The lookup returns `null`, which is then
 *       validated against `SettingSchema`, fails, and surfaces as a 500.
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
 *     description: >
 *       A plain insert, not an upsert. `key` is the primary key and is supplied by the
 *       caller, so re-posting an existing key raises a unique constraint violation and
 *       comes back as a 500, as does a body that fails `SettingSchema`. Note the 200:
 *       this endpoint does not answer 201.
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
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', validateRequestSchema(SettingSchema), async (request, response) => {
    const setting = await createSetting(request.body);
    response.json(setting);
});


/**
 * @swagger
 * /settings:
 *   put:
 *     tags: [Settings]
 *     summary: Update a setting
 *     description: >
 *       The setting to update is identified by the `key` in the body, not by a path
 *       parameter. A key that matches no row raises a Prisma `P2025` and comes back as a
 *       500, as does a body that fails `SettingSchema`.
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
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/', validateRequestSchema(SettingSchema), async (request, response) => {
    const setting = await updateSetting(request.body);
    response.json(setting);
});


/**
 * @swagger
 * /settings/{key}:
 *   delete:
 *     tags: [Settings]
 *     summary: Delete a setting by key
 *     description: A key that matches no row raises a Prisma `P2025` and comes back as a 500.
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
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:key', async (request, response) => {
    const setting = await deleteSetting(request.params.key);
    response.json(setting);
})


export default router;
