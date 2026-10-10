import {CreateGameInfoDto, CreateGameInfoSchema, GameInfoDto, ValidateSchema} from "@nct/vtp-common";
import p from "../lib/prisma";

const prisma = p.prisma;


export async function createGameInfo(body: any): Promise<GameInfoDto> {
    const gameInfo = ValidateSchema<CreateGameInfoDto>(body, CreateGameInfoSchema);

    return await prisma.gameInformation.upsert({
        where: {game_id: gameInfo.game_id},
        create: gameInfo,
        update: gameInfo,
    });
}

export async function updateGameInfo(gameInfo: GameInfoDto): Promise<GameInfoDto> {
    return await prisma.gameInformation.update({where: {id: gameInfo.id}, data: gameInfo});
}