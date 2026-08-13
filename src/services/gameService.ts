import { CreateGameSchema, GameDto, GameInfoDto, GameInfoSchema, GameSchema, GameWithInfoDto, GameWithInfoSchema, ValidateSchema, ValidateSchemaArray } from "@nct/vtp-common";
import p from "../lib/prisma";
import { getGenreDropDown, getTagsDropDown } from "./dropDownDataService";
import { getLatestRankForGame } from "./rankService";
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
        },
        //take: 10
    });

    const allGamesFlattened = allGamesWithInfo.map((game) => {
        const { game_info, ...gameFields } = game;
        const flat = { ...game_info, ...gameFields };
        return flat;
    });

    let gamesWithInfoRaw = ValidateSchemaArray<GameWithInfoDto[]>(allGamesFlattened, GameWithInfoSchema);

    const allTags = await getTagsDropDown();
    const allGenres = await getGenreDropDown();

    for (const game in gamesWithInfoRaw) {

    }
    await Promise.all(gamesWithInfoRaw.map(async (game) => {
        let score = 0;
        game.tags?.forEach((tag) => {
            score += allTags.find((t) => t.value === tag)?.score ?? 0;
        });
        game?.genre?.forEach((genre) => {
            score += allGenres.find((g) => g.value === genre)?.score ?? 0;
        });

        const rankDto = await getLatestRankForGame(game.id);
        const rank = rankDto?.rank ?? 50;
        score += (rank - 50) / 10;
        game.game_score = Number(score.toPrecision(2));
        return game;
    }));

    const gamesWithInfo = ValidateSchemaArray<GameWithInfoDto[]>(gamesWithInfoRaw, GameWithInfoSchema);
    gamesWithInfo.sort((a, b) => (b.game_score ?? 0) - (a.game_score ?? 0));
    return gamesWithInfo;
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