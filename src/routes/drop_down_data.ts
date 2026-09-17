import { Router } from "express";
import { createDropDownData, deleteDropDownData, getAllDropDownData, getGenreDropDown, getTagsDropDown } from "../services/dropDownDataService";

const router = Router();


router.get('/tag', async (request, response) => {
    const allTags = await getTagsDropDown();
    response.json(allTags);
});

router.get('/genre', async (request, response) => {
    const allGenres = await getGenreDropDown();
    response.json(allGenres);
});

router.delete('/:key', async (request, response) => {
    const deleted = await deleteDropDownData(request.params.key);
    response.json(deleted);
});

router.get('/', async (request, response) => {
    const allData = await getAllDropDownData();
    response.json(allData);
});

router.post('/', async (request, response) => {
    const created = await createDropDownData(request.body);
    response.json(created);
});

export default router;