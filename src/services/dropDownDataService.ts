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
    return await prisma.dropDownData.findMany({
        where: {
            type: type
        },
        orderBy: [
            {type: "asc"},
            {score: "desc"},
            {value: "asc"},
        ]
    });
}


export async function getAllDropDownData(): Promise<DropDownDto[]> {
    return await prisma.dropDownData.findMany({
        orderBy: [
            {type: "asc"},
            {score: "desc"},
            {value: "asc"},
        ]
    });
}


export async function createDropDownData(body: DropDownDto): Promise<DropDownDto> {
    const dropDownData = await prisma.dropDownData.upsert(
        {
            where: {key: body.key},
            create: body,
            update: body,
        });
    return ValidateSchema<DropDownDto>(dropDownData, DropDownSchema);
}


export async function deleteDropDownData(key: string): Promise<DropDownDto> {
    return await prisma.dropDownData.delete({where: {key: key}});
}