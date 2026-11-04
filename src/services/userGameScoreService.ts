import p from "../lib/prisma";
import {UserGameScoreConfigDto, UserGameScoreConfigSchema, ValidateSchema} from "@nct/vtp-common";

const prisma = p.prisma;

export async function loadAllScoreConfigForUser(userId: string): Promise<UserGameScoreConfigDto[]> {
    const rows = await prisma.userGameScoreConfig.findMany({ where: { user_login: userId } });
    return ValidateSchema<UserGameScoreConfigDto>(rows, UserGameScoreConfigSchema, true);
}


export async function saveScoreConfig(config: UserGameScoreConfigDto): Promise<void> {
    const data = UserGameScoreConfigSchema.parse(config);
    await prisma.userGameScoreConfig.create({ data: data });
}