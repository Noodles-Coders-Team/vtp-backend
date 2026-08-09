import { CreateGameInfoDto, CreateGameInfoSchema, GameInfoDto, GameInfoSchema, ValidateSchema } from "@nct/vtp-common";
import p from "../lib/prisma";
const prisma = p.prisma;


export async function createGameInfo(body: any): Promise<GameInfoDto> {
    const gameInfo = ValidateSchema<CreateGameInfoDto>(body, CreateGameInfoSchema);

    const existingInfo = await prisma.gameInformation.findFirst({ where: { game_id: gameInfo.game_id } });
    if (existingInfo === null) {
        console.log(`Creating game info for game id: ${gameInfo.game_id}`);

        const createdInfo = await prisma.gameInformation.create({
            data: gameInfo
        });
        return ValidateSchema<GameInfoDto>(createdInfo, GameInfoSchema);
    }
    else {
        existingInfo.can_record = gameInfo.can_record;
        existingInfo.discussed = gameInfo.discussed;
        existingInfo.genre = gameInfo.genre ?? [];
        existingInfo.tags = gameInfo.tags ?? [];
        existingInfo.notes = gameInfo.notes ?? "";
        return await updateGameInfo(existingInfo);
    }
}

export async function updateGameInfo(body: any): Promise<GameInfoDto> {
    const gameInfo = ValidateSchema(body, GameInfoSchema) as GameInfoDto;
    const updatedInfo = await prisma.gameInformation.update({ where: { id: gameInfo.id }, data: gameInfo });
    return ValidateSchema<GameInfoDto>(updatedInfo, GameInfoSchema);
}