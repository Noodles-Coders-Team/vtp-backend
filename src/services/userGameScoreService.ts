import p from "../lib/prisma";
import {
    UserGameScoreConfigDto,
    UserGameScoreConfigSchema,
    type UserSteamAppRefDataConfigDto,
    ValidateSchema
} from "@nct/vtp-common";
import {UserSteamAppRefDataConfigListSchema} from "@nct/vtp-common/dist/schemas/user_steam_app_ref_data_config_list";


const prisma = p.prisma;


export async function loadAllScoreConfigForUser(userId: string): Promise<UserGameScoreConfigDto[]> {
    const rows = await prisma.userGameScoreConfig.findMany({where: {user_id: userId}});
    return ValidateSchema<UserGameScoreConfigDto>(rows, UserGameScoreConfigSchema, true);
}


export async function createScoreConfig(userId: string, configName: string): Promise<UserGameScoreConfigDto> {
    const data: UserGameScoreConfigDto = {
        id: userId + configName,
        score_config: [],
        score_config_label: configName,
        user_id: userId
    };
    const config = await prisma.userGameScoreConfig.create({data: data});
    return ValidateSchema<UserGameScoreConfigDto>(config, UserGameScoreConfigSchema);
}


export async function saveScoreConfig(config: UserGameScoreConfigDto, userId: string): Promise<void> {
    const data = UserGameScoreConfigSchema.parse(config);
    data.user_id = userId;
    await prisma.userGameScoreConfig.create({data: data});
}


export async function saveScoreConfigRefDataById(config: UserSteamAppRefDataConfigDto[], configId: string, userId: string) {
    const scoreConfig = await getScoreConfig(userId, configId);
    scoreConfig.score_config = UserSteamAppRefDataConfigListSchema.parse(config);
    await prisma.userGameScoreConfig.update({
        where: {
            user_id: userId,
            id: configId
        },
        data: scoreConfig
    });
}


export async function getScoreConfig(userId: string, configId: string): Promise<UserGameScoreConfigDto> {
    const config = await prisma.userGameScoreConfig.findFirst({where: {user_id: userId, id: configId}});
    return ValidateSchema<UserGameScoreConfigDto>(config, UserGameScoreConfigSchema);
}