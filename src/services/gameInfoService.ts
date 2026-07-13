import { CreateGameInfoDto, CreateGameInfoSchema } from "@nct/vtp-common";
import p from "../lib/prisma";
import { validateSchema } from "../middleware/validate";
const prisma = p.prisma;

export async function createGameInfo(body: any) {
    const gameInfo = validateSchema(body, CreateGameInfoSchema) as CreateGameInfoDto;
    console.log("Creating game info: ", JSON.stringify(gameInfo, null, 2));

    const createdInfo = await prisma.gameInformation.create({
        data: body
    });
    return createdInfo;
}