import { ChannelDataCsv, GameCsv, TableDataCsv } from "../lib/class";
import { Router } from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

import { importChannelDataCsv, importGameCsv, importTableDataCsv } from "../services/importService";

const router = Router();


const upload = multer({ dest: "uploads/" })

router.post('/games',
    upload.single("file"),
    async (request, response) => {
        try {
            if (!request.file)
                return response.status(400).json({ error: "No File uploaded" });

            let results: GameCsv[] = [];
            await new Promise<void>((resolve, reject) => {
                if (!request.file) {
                    return;
                }

                fs.createReadStream(request.file.path)
                    .pipe(csv())
                    .on("data", (data: GameCsv) => results.push(data))
                    .on("end", resolve)
                    .on("error", reject)
            });

            fs.unlinkSync(request.file!.path);
            console.log(`Import file read, length: ${results.length}, with first entry: ${results[0]}`)

            await importGameCsv(results);
            response.status(200).json({
                rows: results.length,
                data: results
            });
        } catch (e) {
            response.status(500).json({ message: 'Internal Server Error!', error: e })
        }
    });


router.post('/channel-data',
    upload.single("file"),
    async (request, response) => {
        try {
            if (!request.file)
                return response.status(400).json({ error: "No File uploaded" });

            let results: ChannelDataCsv[] = [];
            await new Promise<void>((resolve, reject) => {
                if (!request.file) {
                    return;
                }

                fs.createReadStream(request.file.path)
                    .pipe(csv())
                    .on("data", (data: ChannelDataCsv) => results.push(data))
                    .on("end", resolve)
                    .on("error", reject)
            });

            fs.unlinkSync(request.file!.path);
            console.log(`Import file read, length: ${results.length}, with first entry: ${results[0]}`)

            await importChannelDataCsv(results);
            response.status(200).json({
                rows: results.length,
                data: results
            });
        } catch (e) {
            response.status(500).json({ message: 'Internal Server Error!', error: e })
        }
    });


router.post('/table-data',
    upload.single("file"),
    async (request, response) => {
        try {
            if (!request.file)
                return response.status(400).json({ error: "No File uploaded" });

            let results: TableDataCsv[] = [];
            await new Promise<void>((resolve, reject) => {
                if (!request.file) {
                    return;
                }

                fs.createReadStream(request.file.path)
                    .pipe(csv())
                    .on("data", (data: TableDataCsv) => results.push(data))
                    .on("end", resolve)
                    .on("error", reject)
            });

            fs.unlinkSync(request.file!.path);
            console.log(`Import file read, length: ${results.length}, with first entry: ${results[0]}`)

            await importTableDataCsv(results);
            response.status(200).json({
                rows: results.length,
                data: results
            });
        } catch (e) {
            response.status(500).json({ message: 'Internal Server Error!', error: e })
        }
    });

export default router;