import { CreateGameInfoDto, CreateGameInfoSchema, GameInfoDto, GameInfoSchema } from "@nct/vtp-common";
import p from "../lib/prisma";
import { validateSchema } from "../middleware/validate";
const prisma = p.prisma;


export async function createGameInfo(body: any) {
    const gameInfo = validateSchema(body, CreateGameInfoSchema) as CreateGameInfoDto;

    const existingInfo = await prisma.gameInformation.findFirst({ where: { game_id: gameInfo.game_id } });
    if (existingInfo === null) {
        console.log(`Creating game info for game id: ${gameInfo.game_id}`);

        const createdInfo = await prisma.gameInformation.create({
            data: gameInfo
        });
        return createdInfo;
    }
    else {
        if (existingInfo.notes === null)
            existingInfo.notes = "";
        return updateGameInfo(existingInfo);
    }
}

export async function updateGameInfo(body: any) {
    const gameInfo = validateSchema(body, GameInfoSchema) as GameInfoDto;
    return await prisma.gameInformation.update({ where: { id: gameInfo.id }, data: gameInfo })
}