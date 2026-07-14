import { GameCsv } from "../lib/class";
import { Router } from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

import p from "../lib/prisma";
import { importGameCsv } from "../services/importService";
const prisma = p.prisma;
const router = Router();


const upload = multer({ dest: "uploads/" })

router.post('/game',
    upload.single("file"),
    async (request, response) => {
        if (!request.file)
            return response.status(400).json({ error: "No File uploaded" });

        let results: GameCsv[] = [];
        await new Promise<void>((resolve, reject) => {
            if (!request.file){
                return;
            }
            
            fs.createReadStream(request.file.path)
            .pipe(csv())
            .on("data", (data: GameCsv) => console.log(`Importing row ${results.push(data)}`))
            .on("end", resolve)
            .on("error", reject)
        });

        fs.unlinkSync(request.file!.path);
        console.log(`Import file read, length: ${results.length}, with first entry: ${results[0]}`)
        await importGameCsv(results);
        response.json({
            rows: results.length,
            data: results
        });
    });

export default router;