import { Router } from "express";
import { getAllChannelData } from "../services/chanelDataService";

const router = Router();

router.get('/', async (request, response) => {
    const allData = await getAllChannelData();
    response.json(allData);
});

export default router;