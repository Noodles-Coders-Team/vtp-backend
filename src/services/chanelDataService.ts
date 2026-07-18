import { ChannelDataDto, ChannelDataSchema } from "@nct/vtp-common";
import p from '../lib/prisma';
import { validateSchema } from "../middleware/validate";
const prisma = p.prisma;


export async function createChannelData(data: ChannelDataDto) {
    const channelData = validateSchema<ChannelDataDto>(data, ChannelDataSchema);
    const existingData = prisma.channelData.findFirst({
        where: {
            id: channelData.id
        }
    });
    if (existingData === null) {
        const created = prisma.channelData.create({ data: channelData });
        return created;
    }
    else {
        const data = validateSchema<ChannelDataDto>(existingData, ChannelDataSchema);
        data.views = channelData.views;
        const updated = prisma.channelData.update({
            where: { id: data.id },
            data: data
        });
        return updated;
    }
}


export async function getAllChannelData() {
    const allChannellData = prisma.channelData.findMany({ orderBy: { id: "asc" } });
    return allChannellData;
}