import {ChannelDataDto, ChannelDataSchema, ValidateSchema} from "@nct/vtp-common";
import p from '../lib/prisma';

const prisma = p.prisma;


export async function createChannelData(body: any) {
    const channelData = ValidateSchema<ChannelDataDto>(body, ChannelDataSchema);
    const data = await prisma.channelData.upsert(
        {
            where: {id: channelData.id},
            create: channelData as any,
            update: channelData as any,
        });
    return ValidateSchema<ChannelDataDto>(data, ChannelDataSchema);
}


export async function getAllChannelData() {
    return await prisma.channelData.findMany({orderBy: {id: "asc"}});
}