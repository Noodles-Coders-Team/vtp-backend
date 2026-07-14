import { GameCsv } from "../lib/class";
import { Router } from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

import p from "../lib/prisma";
const prisma = p.prisma;
const router = Router();


const upload = multer({ dest: "uploads/" })

router.post('/game',
    upload.single("file"),
    (request, response) => {
        if (!request.file)
            return response.status(400).json({ error: "No File uploaded" })
        const results: GameCsv[] = [];
        fs.createReadStream(request.file.path)
            .pipe(csv())
            .on("data", (data: GameCsv) => results.push(data))
            .on("end", () => {
                fs.unlinkSync(request.file!.path);
                response.json({
                    rows: results.length,
                    data: results
                });
            });
    });

export default router;