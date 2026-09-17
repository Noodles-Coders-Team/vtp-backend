import {ChannelDataDto, ChannelDataSchema, ValidateSchema} from "@nct/vtp-common";
import p from '../lib/prisma';

const prisma = p.prisma;


//Creates new channel data if doesn't exist. If exists updates Views count
export async function createChannelData(data: ChannelDataDto) {
    const channelData = ValidateSchema<ChannelDataDto>(data, ChannelDataSchema);
    const existingData = await prisma.channelData.findFirst({
        where: {
            id: channelData.id
        }
    });
    if (existingData === null) {
        const created = await prisma.channelData.create({
            data: {
                id: channelData.id,
                views: channelData.views
            }
        });
        return created;
    } else {
        const data = ValidateSchema<ChannelDataDto>(existingData, ChannelDataSchema);
        data.views = channelData.views;
        const updated = await prisma.channelData.update({
            where: {id: data.id},
            data: data
        });
        return updated;
    }
}


export async function getAllChannelData() {
    return await prisma.channelData.findMany({orderBy: {id: "asc"}});
}