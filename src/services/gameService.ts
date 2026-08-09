import { CreateGameSchema, GameDto, GameInfoDto, GameInfoSchema, GameSchema, GameWithInfoDto, ValidateSchema, ValidateSchemaArray } from "@nct/vtp-common";
import p from "../lib/prisma";
const prisma = p.prisma;


export async function getAllGames(): Promise<GameDto[]> {
    const allGames = await prisma.game.findMany({ orderBy: { name: "asc" } });
    return ValidateSchemaArray<GameDto[]>(allGames, GameSchema);
}


export async function getAllGamesWithInfo(can_record: boolean | null, discussed: boolean | null): Promise<GameWithInfoDto[]> {
    const allGamesWithInfo = await prisma.game.findMany({
        orderBy: { name: "asc" },
        include: {
            game_info: true
        },
        where: {
            game_info: {
                ...(can_record !== null && { can_record: can_record }),
                ...(discussed !== null && { discussed: discussed }),
            }
        }

    });
    return ValidateSchemaArray<GameWithInfoDto[]>(allGamesWithInfo, GameInfoSchema);
}


export async function getGameById(gameId: string): Promise<GameDto> {
    const game = await prisma.game.findUnique({
        where: { id: gameId }
    });
    return ValidateSchema<GameDto>(game, GameSchema);
}


export async function createGame(body: any): Promise<GameDto> {
    const game = ValidateSchema<GameDto>(body, CreateGameSchema);
    const existingGame = await prisma.game.findFirst({
        where: {
            name: game.name
        }
    });

    if (existingGame !== null) {
        return ValidateSchema<GameDto>(existingGame, GameSchema);
    }

    const createdGame = await prisma.game.create({
        data: body
    });

    return ValidateSchema<GameDto>(createdGame, GameSchema)
}


export async function updateGame(id: string, game_body: any): Promise<GameDto> {
    console.log("Updating game with ID: ", id, " with data: ", JSON.stringify(game_body, null, 2));
    const updatedGame = await prisma.game.update({
        where: { id: id },
        data: game_body
    });
    return ValidateSchema<GameDto>(updatedGame, GameSchema);
}


export async function deleteGame(id: string): Promise<GameDto> {
    console.log("Deleting game with ID: ", id);
    const deletedGame = await prisma.game.delete({
        where: { id: id }
    });
    return ValidateSchema<GameDto>(deletedGame, GameSchema);
}