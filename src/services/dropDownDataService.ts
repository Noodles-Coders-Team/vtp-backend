import {type DropDownDto, DropDownSchema, ValidateSchema} from "@nct/vtp-common";
import p from "../lib/prisma";

const prisma = p.prisma;


export async function getTagsDropDown(): Promise<DropDownDto[]> {
    return await getDropDownData('tag');
}


export async function getGenreDropDown(): Promise<DropDownDto[]> {
    return await getDropDownData('genre');
}


async function getDropDownData(type: string): Promise<DropDownDto[]> {
    const data = await prisma.dropDownData.findMany({
        where: {
            type: type
        },
        orderBy: [
            {type: "asc"},
            {score: "desc"},
            {value: "asc"},
        ]
    });
    return ValidateSchema<DropDownDto>(data, DropDownSchema, true);
}


export async function getAllDropDownData(): Promise<DropDownDto[]> {
    return ValidateSchema<DropDownDto>(await prisma.dropDownData.findMany({
        orderBy: [
            {type: "asc"},
            {score: "desc"},
            {value: "asc"},
        ]
    }), DropDownSchema, true);
}


export async function createDropDownData(body: any): Promise<DropDownDto> {
    let data = ValidateSchema<DropDownDto>(body, DropDownSchema);
    if (data.value == "" || data.value == null)
        return data;
    data.key = data.type + '_' + data.value;
    const existingData = await prisma.dropDownData.findFirst({where: {key: data.key}});
    if (existingData === null) {
        const responseBody = await prisma.dropDownData.create({data: data as any});
        return ValidateSchema<DropDownDto>(responseBody, DropDownSchema);
    }
    return ValidateSchema<DropDownDto>(existingData, DropDownSchema);
}


export async function deleteDropDownData(key: string): Promise<DropDownDto> {
    console.log(`Trying to delete DropDownData: ${key}`);
    const rawData = await prisma.dropDownData.delete({where: {key: key}});
    return ValidateSchema<DropDownDto>(rawData, DropDownSchema);
}