import {CreateGameInfoDto, CreateGameInfoSchema, GameInfoDto, GameInfoSchema, ValidateSchema} from "@nct/vtp-common";
import p from "../lib/prisma";

const prisma = p.prisma;


export async function createGameInfo(body: any): Promise<GameInfoDto> {
    const gameInfo = ValidateSchema<CreateGameInfoDto>(body, CreateGameInfoSchema);

    const existingInfo = await prisma.gameInformation.upsert({
        where: {game_id: gameInfo.game_id},
        create: gameInfo as any,
        update: gameInfo as any,
    });
    return ValidateSchema<GameInfoDto>(existingInfo, GameInfoSchema);
}

export async function updateGameInfo(body: any): Promise<GameInfoDto> {
    const gameInfo = ValidateSchema(body, GameInfoSchema) as GameInfoDto;
    const updatedInfo = await prisma.gameInformation.update({where: {id: gameInfo.id}, data: gameInfo});
    return ValidateSchema<GameInfoDto>(updatedInfo, GameInfoSchema);
}