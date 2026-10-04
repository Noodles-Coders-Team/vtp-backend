import {ChannelDataDto, ChannelDataSchema, ValidateSchema} from "@nct/vtp-common";
import p from '../lib/prisma';

const prisma = p.prisma;


export async function createChannelData(body: ChannelDataDto): Promise<ChannelDataDto> {
    const data = await prisma.channelData.upsert(
        {
            where: {id: body.id},
            create: body,
            update: body,
        });
    return ValidateSchema<ChannelDataDto>(data, ChannelDataSchema);
}


export async function getAllChannelData(): Promise<ChannelDataDto[]> {
    return await prisma.channelData.findMany({orderBy: {id: "asc"}});
}