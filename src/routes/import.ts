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
 *     description: >
 *       Processes the rows one at a time, and for each row: looks up the game by `GameName`
 *       and creates it if it is missing, upserts its GameInformation, then records a Rank.
 *
 *
 *       Points worth knowing before relying on this endpoint:
 *
 *
 *       - Only `GameName` reaches the game row. `recorded` is hard coded to `false` and
 *         `release_date` and `link` are never set, even on a game this import creates.
 *
 *       - An existing game is matched by name and left untouched, so re-importing never
 *         corrects a game row, only its info and rank.
 *
 *       - The rank value is taken from the `Id` column, not from `Queue`; `Queue` is
 *         declared on the CSV type but unused. A rank is written for every row, not only
 *         for rows that carry a position.
 *
 *       - `Genre` and `Tags` are split on commas and stored as arrays on GameInformation.
 *         No `drop_down_data` rows are created, so a genre or tag that has no drop down
 *         entry scores zero in `POST /games/with-info` until one is added by hand.
 *
 *       - `UpdateDate` is parsed as `DD.MM.YYYY`. Anything else silently falls back to the
 *         current time.
 *
 *       - `Discussed` and `CanRecord` count as true only for the exact string `TRUE`.
 *
 *       - `NumberOfEpisodes`, `Views`, `VideoTitle` and `Ads` are parsed from the CSV and
 *         echoed back, but are not persisted anywhere.
 *
 *
 *       The import is not transactional: a row that throws aborts the run and leaves the
 *       rows before it committed.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file, sent as the `file` field
 *     responses:
 *       200:
 *         description: Import finished, the parsed rows are echoed back
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
 *         $ref: '#/components/responses/NoFileUploaded'
 *       500:
 *         $ref: '#/components/responses/ImportFailed'
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
 *     description: >
 *       Upserts one ChannelData row per row of the file. The `Date` cell is used verbatim
 *       as the primary key, with no parsing or normalising, so two exports that spell the
 *       same day differently create two rows. `Views` is coerced with `Number`; a cell that
 *       will not parse becomes `NaN`, fails the `z.int()` check on `ChannelDataSchema` and
 *       aborts the run with a 500, leaving the rows before it committed.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file, sent as the `file` field
 *     responses:
 *       200:
 *         description: Import finished, the parsed rows are echoed back
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
 *         $ref: '#/components/responses/NoFileUploaded'
 *       500:
 *         $ref: '#/components/responses/ImportFailed'
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
 *     summary: Import post table data from CSV file
 *     description: >
 *       Imports a YouTube Studio table export. Each row upserts the parent post, keyed on
 *       the `Content` column, then adds a PostInformation snapshot whose `version_id` is
 *       one past the highest version already stored for that post. Re-importing the same
 *       export therefore appends a new version rather than replacing the old one.
 *
 *
 *       Points worth knowing before relying on this endpoint:
 *
 *
 *       - `category` is written as `null`. Nothing classifies the row as Post, Shorts or
 *         Video, despite `duration` being present to do it with.
 *
 *       - Numeric cells go through `Number`; anything unparseable becomes `undefined` and
 *         is stored as `null` rather than failing the row. `Duration` is the exception -
 *         it is required, so an unparseable duration aborts the run.
 *
 *       - `Video publish time` is reformatted from `May 16, 2026` to `2026-05-16` and kept
 *         as a string. An empty cell becomes `undefined`; a month name that does not match
 *         the expected three letter form yields a malformed string rather than an error.
 *
 *       - `Average view duration` is kept verbatim as a `H:MM:SS` string.
 *
 *       - `Card teaser clicks` is declared on the CSV type but not persisted.
 *
 *       - The post is created with no `game_id`, so imported posts start unlinked from any
 *         game and have to be attached with `PUT /post/{id}`.
 *
 *
 *       The import is not transactional: a row that throws aborts the run and leaves the
 *       rows before it committed.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file, sent as the `file` field
 *     responses:
 *       200:
 *         description: Import finished
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImportResult'
 *       400:
 *         $ref: '#/components/responses/NoFileUploaded'
 *       500:
 *         $ref: '#/components/responses/ImportFailed'
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