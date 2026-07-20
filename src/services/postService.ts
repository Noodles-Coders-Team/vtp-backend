import { CreatePostInformationDto, CreatePostInformationSchema, GameInfoDto, GameInfoSchema, PostDto, PostInformationDto, PostInformationSchema, PostSchema } from "@nct/vtp-common";
import p from "../lib/prisma";
import { validateSchema } from "../middleware/validate";
const prisma = p.prisma;


export async function createPost(postDto: PostDto): Promise<PostDto> {
    const post = validateSchema<PostDto>(postDto, PostSchema);

    const existingPost = await prisma.post.findFirst({ where: { id: post.id } });
    if (existingPost === null) {
        const result = await prisma.post.create({ data: post as any });
        return result as PostDto;
    }
    return validateSchema<PostDto>(existingPost, PostSchema);
}


export async function createPostInformation(postDto: CreatePostInformationDto) {
    const post = validateSchema<CreatePostInformationDto>(postDto, CreatePostInformationSchema);

    const existingPost = await prisma.postInformation.findFirst({ where: { post_id: post.post_id }, orderBy: { version_id: "desc" } });
    if (existingPost !== null) {
        const oldPost = validateSchema<PostInformationDto>(existingPost, PostInformationSchema);
        post.version_id = oldPost.version_id + 1;
    }
    const newPost = await prisma.postInformation.create({ data: post as any });
    return validateSchema<PostInformationDto>(newPost, PostInformationSchema);
}