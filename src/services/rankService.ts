import {CreateRankDto, CreateRankSchema, RankDto, RankSchema, ValidateSchema} from "@nct/vtp-common";
import p from "../lib/prisma";

const prisma = p.prisma;


export async function getAllRanks(): Promise<RankDto[]> {
    const data = await prisma.rank.findMany();
    return ValidateSchema<RankDto>(data, RankSchema, true);
}


export async function getAllRanksForGame(gameId: string): Promise<RankDto[]> {
    const data = await prisma.rank.findMany({
        where: {game_id: gameId},
        orderBy: {date: "desc"}
    });
    if (data === null)
        return [];
    return ValidateSchema<RankDto>(data, RankSchema, true);
}


export async function getLatestRankForGame(gameId: string): Promise<RankDto | null> {
    const data = await prisma.rank.findFirst({
        where: {game: {id: gameId}},
        orderBy: {date: "desc"}
    });
    if (data === null)
        return null;
    return ValidateSchema<RankDto>(data, RankSchema);
}


export async function createRank(body: any): Promise<RankDto> {
    const rank = ValidateSchema<CreateRankDto>(body, CreateRankSchema);
    const existingRank = await prisma.rank.findFirst({
        where: {
            date: rank.date,
            game: {id: rank.game_id}
        }
    });
    if (existingRank === null) {
        const createdRank = await prisma.rank.create({
            data: rank as any
        });
        return ValidateSchema<RankDto>(createdRank, RankSchema);
    }
    return updateRank(existingRank.id, rank);
}


async function updateRank(id: string, body: any): Promise<RankDto> {
    const rank = ValidateSchema<CreateRankDto>(body, CreateRankSchema);
    const updated = await prisma.rank.update({
        where: {id: id},
        data: rank as any
    });
    return ValidateSchema<RankDto>(updated, RankSchema);
}


export async function deleteRank(rankId: string): Promise<RankDto> {
    console.log("Deleting rank with ID: ", rankId);
    const deletedRank = await prisma.rank.delete({
        where: {id: rankId}
    });
    return ValidateSchema<RankDto>(deletedRank, RankSchema);
}