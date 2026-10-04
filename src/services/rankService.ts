import {RankDto} from "@nct/vtp-common";
import p from "../lib/prisma";

const prisma = p.prisma;


export async function getAllRanks(): Promise<RankDto[]> {
    return await prisma.rank.findMany();
}


export async function getAllRanksForGame(gameId: string): Promise<RankDto[]> {
    return await prisma.rank.findMany({
        where: {game_id: gameId},
        orderBy: {date: "desc"}
    });
}


export async function getLatestRankForGame(gameId: string): Promise<RankDto | null> {
    return await prisma.rank.findFirst({
        where: {game: {id: gameId}},
        orderBy: {date: "desc"}
    });
}


//TODO: Upgrade to upsert. Merge unique validation in DTO into one item (by date and game)
export async function createRank(rank: RankDto): Promise<RankDto> {
    const existingRank = await prisma.rank.findFirst({
        where: {
            date: rank.date,
            game: {id: rank.game_id}
        }
    });
    if (existingRank === null) {
        return await prisma.rank.create({
            data: rank as any
        });
    }
    return updateRank(existingRank.id, rank);
}


async function updateRank(id: string, rank: RankDto): Promise<RankDto> {
    return await prisma.rank.update({
        where: {id: id},
        data: rank
    });
}


export async function deleteRank(rankId: string): Promise<RankDto> {
    return await prisma.rank.delete({
        where: {id: rankId}
    });
}