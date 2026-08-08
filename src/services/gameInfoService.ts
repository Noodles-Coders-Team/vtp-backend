import { CreateGameInfoDto, CreateGameInfoSchema, GameInfoDto, GameInfoSchema, ValidateSchema } from "@nct/vtp-common";
import p from "../lib/prisma";
const prisma = p.prisma;


export async function createGameInfo(body: any) {
    const gameInfo = ValidateSchema<CreateGameInfoDto>(body, CreateGameInfoSchema);

    const existingInfo = await prisma.gameInformation.findFirst({ where: { game_id: gameInfo.game_id } });
    if (existingInfo === null) {
        console.log(`Creating game info for game id: ${gameInfo.game_id}`);

        const createdInfo = await prisma.gameInformation.create({
            data: gameInfo
        });
        return createdInfo;
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

export async function updateGameInfo(body: any) {
    const gameInfo = ValidateSchema(body, GameInfoSchema) as GameInfoDto;
    return await prisma.gameInformation.update({ where: { id: gameInfo.id }, data: gameInfo })
}