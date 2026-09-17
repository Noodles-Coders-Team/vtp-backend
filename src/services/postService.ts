import {
    CreatePostInformationDto,
    CreatePostInformationSchema,
    PostDto,
    PostInformationDto,
    PostInformationSchema,
    PostSchema,
    ValidateSchema
} from "@nct/vtp-common";
import p from "../lib/prisma";

const prisma = p.prisma;


export async function createPost(postDto: PostDto): Promise<PostDto> {
    const post = ValidateSchema<PostDto>(postDto, PostSchema);

    const createdPost = await prisma.post.upsert({
        where: {id: post.id},
        create: post as any,
        update: post as any,
    });
    return ValidateSchema<PostDto>(createdPost, PostSchema);
}


export async function createPostInformation(postDto: CreatePostInformationDto) {
    const post = ValidateSchema<CreatePostInformationDto>(postDto, CreatePostInformationSchema);

    const existingPost = await prisma.postInformation.findFirst({
        where: {post_id: post.post_id},
        orderBy: {version_id: "desc"}
    });
    if (existingPost !== null) {
        const oldPost = ValidateSchema<PostInformationDto>(existingPost, PostInformationSchema);
        post.version_id = oldPost.version_id + 1;
    }
    const newPost = await prisma.postInformation.create({data: post as any});
    return ValidateSchema<PostInformationDto>(newPost, PostInformationSchema);
}