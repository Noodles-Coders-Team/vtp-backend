import { Router } from "express";
import { createGame, deleteGame, getAllGames, getAllGamesWithInfo, getGameById, updateGame } from "../services/gameService";
import { updateGameInfo } from "../services/gameInfoService";
import { validateRequest } from "../middleware/validate";
const router = Router();


router.get('/', async (request, response) => {
    const allGames = await getAllGames();
    response.json(allGames);
});

router.post('/with-info', async (request, response) => {
    const { can_record, discussed } = request.body;
    const allGamesWithInfo = await getAllGamesWithInfo(can_record, discussed);
    response.json(allGamesWithInfo);
});


router.get('/:id', async (request, response) => {
    const game = await getGameById(request.params.id)
    response.json(game);
});


router.post('/create', async (request, response) => {
    const createdGame = await createGame(request.body);
    response.status(201).json(createdGame);
});


router.put('/info', async (request, response) => {
    const updatedGameInfo = await updateGameInfo(request.body);
    response.status(200).json(updatedGameInfo);
});


router.put('/:id', async (request, response) => {
    const updatedGame = await updateGame(request.params.id, request.body);
    response.status(200).json(updatedGame);
});


router.delete('/:id', async (request, response) => {
    const deletedGame = await deleteGame(request.body.id);
    response.status(200).json(deletedGame);
});

export default router;