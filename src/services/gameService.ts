import {CreateGameInfoDto, GameDto, GameWithInfoDto, GameWithInfoSchema, ValidateSchema} from "@nct/vtp-common";
import p from "../lib/prisma";
import {getGenreDropDown, getTagsDropDown} from "./dropDownDataService";
import {getLatestRankForGame} from "./rankService";
import {createGameInfo} from "./gameInfoService";

const prisma = p.prisma;


export async function getAllGames(): Promise<GameDto[]> {
    return await prisma.game.findMany({orderBy: {name: "asc"}});
}


export async function getAllGamesWithInfo(can_record: boolean | null, discussed: boolean | null): Promise<GameWithInfoDto[]> {
    const allGamesWithInfo = await prisma.game.findMany({
        orderBy: {name: "asc"},
        include: {
            game_info: true
        },
        where: {
            game_info: {
                ...(can_record !== null && {can_record: can_record}),
                ...(discussed !== null && {discussed: discussed}),
            }
        },
        //take: 10
    });

    const allGamesFlattened = allGamesWithInfo.map((game) => {
        const {game_info, ...gameFields} = game;
        return {...game_info, ...gameFields};
    });

    let gamesWithInfoRaw = ValidateSchema<GameWithInfoDto>(allGamesFlattened, GameWithInfoSchema, true);

    const allTags = await getTagsDropDown();
    const allGenres = await getGenreDropDown();

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

    const gamesWithInfo = ValidateSchema<GameWithInfoDto>(gamesWithInfoRaw, GameWithInfoSchema, true);
    gamesWithInfo.sort((a, b) => (b.game_score ?? 0) - (a.game_score ?? 0));
    return gamesWithInfo;
}


export async function getGameById(gameId: string): Promise<GameDto | null> {
    return await prisma.game.findUnique({
        where: {id: gameId}
    });
}

//TODO: rewrite to a proper one
export async function createGame(game: GameDto): Promise<GameDto> {
    const existingGame = await prisma.game.findFirst({
        where: {
            name: game.name
        }
    });

    if (existingGame !== null) {
        return existingGame;
    }

    const createdGame = await prisma.game.create({
        data: game
    });
    await createGameInfo({game_id: createdGame.id} as CreateGameInfoDto);

    return createdGame
}


export async function updateGame(id: string, game: GameDto): Promise<GameDto> {
    return await prisma.game.update({
        where: {id: id},
        data: game
    });
}


export async function deleteGame(id: string): Promise<GameDto> {
    return await prisma.game.delete({
        where: {id: id}
    });
}