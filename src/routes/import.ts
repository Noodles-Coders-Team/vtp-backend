import { ChannelDataCsv, GameCsv, TableDataCsv } from "../lib/class";
import { Router } from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

import { importChannelDataCsv, importGameCsv, importTableDataCsv } from "../services/importService";


/**
 * @swagger
 * tags:
 *   name: Import
 *   description: CSV import endpoints
 */
const router = Router();


const upload = multer({ dest: "uploads/" })


/**
 * @swagger
 * /import/games:
 *   post:
 *     tags: [Import]
 *     summary: Import games from CSV file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       GameName:
 *                         type: string
 *                       Id:
 *                         type: number
 *                       UpdateDate:
 *                         type: string
 *                         format: date
 *                       NumberOfEpisodes:
 *                         type: number
 *                       Views:
 *                         type: number
 *                       VideoTitle:
 *                         type: string
 *                       Queue:
 *                         type: number
 *                       Ads:
 *                         type: boolean
 *                       CanRecord:
 *                         type: boolean
 *                       Discussed:
 *                         type: boolean
 *                       Genre:
 *                         type: string
 *                       Tags:
 *                         type: string
 *                       Notes:
 *                         type: string
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Internal server error
 */
router.post('/games',
    upload.single("file"),
    async (request, response) => {
        await importCsv<GameCsv>(request.file, response, importGameCsv);
    });


/**
 * @swagger
 * /import/channel-data:
 *   post:
 *     tags: [Import]
 *     summary: Import channel data from CSV file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Date:
 *                         type: string
 *                       Views:
 *                         type: number
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Internal server error
 */
router.post('/channel-data',
    upload.single("file"),
    async (request, response) => {
        await importCsv<ChannelDataCsv>(request.file, response, importChannelDataCsv);
    });


/**
 * @swagger
 * /import/table-data:
 *   post:
 *     tags: [Import]
 *     summary: Import table data from CSV file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *     400:
 *       description: No file uploaded
 *     500:
 *       description: Internal server error
 */
router.post('/table-data',
    upload.single("file"),
    async (request, response) => {
        await importCsv<TableDataCsv>(request.file, response, importTableDataCsv);
    });


async function importCsv<T>(file: Express.Multer.File | undefined, response: any, callBack: (obj: T[]) => void) {
    try {
        if (!file)
            return response.status(400).json({ error: "No File uploaded" });

        let results: T[] = [];
        await new Promise<void>((resolve, reject) => {
            if (!file) {
                return;
            }

            fs.createReadStream(file.path)
                .pipe(csv())
                .on("data", (data: T) => results.push(data))
                .on("end", resolve)
                .on("error", reject)
        });

        fs.unlinkSync(file!.path);
        console.log(`Import file read, length: ${results.length}, with first entry: ${results[0]}`)

        await callBack(results);
        response.status(200).json({
            rows: results.length,
            data: results
        });
    } catch (e) {
        console.log(`Import error: ${e}`);
        response.status(500).json({ message: 'Import failed!' });
    }
}


export default router;