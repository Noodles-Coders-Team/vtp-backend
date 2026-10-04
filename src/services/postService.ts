import {
    CreatePostInformationDto,
    CreatePostInformationSchema,
    PostDto,
    PostInformationDto,
    PostInformationSchema,
    ValidateSchema
} from "@nct/vtp-common";
import p from "../lib/prisma";

const prisma = p.prisma;


export async function createPost(post: PostDto): Promise<PostDto> {
    return await prisma.post.upsert({
        where: {id: post.id},
        create: post,
        update: post,
    });
}


export async function createPostInformation(postDto: CreatePostInformationDto) {
    const post = ValidateSchema<CreatePostInformationDto>(postDto, CreatePostInformationSchema);

    const existingPost = await prisma.postInformation.findFirst({
        where: {post_id: post.post_id},
        orderBy: {version_id: "desc"}
    });
    if (existingPost !== null) {
        const oldPost = ValidateSchema<PostInformationDto>(existingPost, PostInformationSchema);
        post.version_id = (oldPost.version_id ?? 0) + 1;
    }
    const newPost = await prisma.postInformation.create({data: post as any});
    return ValidateSchema<PostInformationDto>(newPost, PostInformationSchema);
}