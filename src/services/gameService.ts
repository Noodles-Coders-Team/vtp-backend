import { CreateGameSchema, GameDto, GameInfoDto } from "@nct/vtp-common";
import p from "../lib/prisma";
import { validateSchema } from "../middleware/validate";
const prisma = p.prisma;

export async function getAllGames() {
    const allGames = await prisma.game.findMany({ orderBy: { name: "asc" } });
    return allGames;
}

export async function getAllGamesWithInfo(can_record: boolean | null, discussed: boolean | null) {
    const allGamesWithInfo = await prisma.game.findMany({
        orderBy: { name: "asc" },
        include: {
            game_info: true
        },
        where: {
            game_info: {
                ...(can_record !== null && {can_record: can_record}),
                ...(discussed !== null && {discussed: discussed}),
            }
        }
        
    });
    return allGamesWithInfo;
}

export async function getGameById(gameId: string) {
    const game = await prisma.game.findUnique({
        where: { id: gameId }
    });
    return game;
}

export async function createGame(body: any) {
    const game = validateSchema<GameDto>(body, CreateGameSchema);
    const existingGame = await prisma.game.findFirst({
        where: {
            name: game.name
        }
    });
    let gameToReturn;
    if (existingGame === null) {
        const createdGame = await prisma.game.create({
            data: body
        });
        gameToReturn = createdGame;
    }
    else {
        gameToReturn = existingGame;
    }

    return gameToReturn;
}

export async function updateGame(id: string, game_body: any) {
    console.log("Updating game with ID: ", id, " with data: ", JSON.stringify(game_body, null, 2));
    const updatedGame = await prisma.game.update({
        where: { id: id },
        data: game_body
    });
    return updatedGame;
}

export async function deleteGame(id: string) {
    console.log("Deleting game with ID: ", id);
    const deletedGame = await prisma.game.delete({
        where: { id: id }
    });
    return deletedGame;
}