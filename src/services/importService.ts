import { GameDto, GameInfoDto, GameInfoSchema, GameSchema, type CreateGameDto, type CreateGameInfoDto } from "@nct/vtp-common";
import { GameCsv } from "../lib/class";
import { createGame } from "./gameService";
import { createGameInfo } from "./gameInfoService";
import { _isoDateTime } from "zod/v4/core";


export async function importGameCsv(gameCsv: GameCsv[]) {
    gameCsv.forEach(async (game: GameCsv) => {
        console.log(`Importing game row: ${game.GameName}`);
        const createGameSchema: CreateGameDto = {
            name: game.GameName,
            recorded: false,
        };
        const createdGame: GameDto = GameSchema.parse(await createGame(createGameSchema));

        const createGameInfoSchema: CreateGameInfoDto = {
            game_id: createdGame.id,
            discussed: stringToBool(game.Discussed),
            can_record: stringToBool(game.CanRecord),
            notes: game.Notes
        }

        const createdInfo: GameInfoDto = GameInfoSchema.parse(await createGameInfo(createGameInfoSchema));
        console.log(`Game info created for the game ${createGame.name} with id ${createdInfo.id}`);
    });
}

function stringToBool(val: any): boolean{
    if(val === "TRUE")
        return true;
    return false;
}