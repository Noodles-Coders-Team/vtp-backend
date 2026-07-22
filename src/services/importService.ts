import { ChannelDataDto, CreatePostInformationDto, GameDto, GameInfoDto, GameInfoSchema, GameSchema, PostDto, type CreateGameDto, type CreateGameInfoDto } from "@nct/vtp-common";
import { ChannelDataCsv, GameCsv, TableDataCsv } from "../lib/class";
import { createGame } from "./gameService";
import { createGameInfo } from "./gameInfoService";
import { _isoDateTime } from "zod/v4/core";
import { createChannelData } from "./chanelDataService";
import { createPost, createPostInformation } from "./postService";


export async function importGameCsv(gameCsv: GameCsv[]) {
    gameCsv.forEach(async (game: GameCsv) => {
        console.log(`Importing game row: ${game.GameName}`);
        const createGameSchema: CreateGameDto = {
            name: game.GameName,
            recorded: false,
        };
        const createdGame: GameDto = GameSchema.parse(await createGame(createGameSchema));

        const createGameInfoSchema: CreateGameInfoDto = {
            game_id: createdGame.id,
            discussed: stringToBool(game.Discussed),
            can_record: stringToBool(game.CanRecord),
            notes: game.Notes
        }

        const createdInfo: GameInfoDto = GameInfoSchema.parse(await createGameInfo(createGameInfoSchema));
        console.log(`Game info created for the game ${createGame.name} with id ${createdInfo.id}`);
    });
}


function stringToBool(val: any): boolean {
    if (val === "TRUE")
        return true;
    return false;
}


export async function importChannelDataCsv(channel_data: ChannelDataCsv[]) {
    channel_data.forEach(async (data: ChannelDataCsv) => {
        const channelDataDto: ChannelDataDto = {
            id: data.Date,
            views: Number(data.Views) as number
        };

        await createChannelData(channelDataDto);
    });
}


export async function importTableDataCsv(table_data: TableDataCsv[]) {
    table_data.forEach(async (data: TableDataCsv) => {
        const post: PostDto = {
            id: data['Content'],
        };
        await createPost(post);
        
        const tableData: CreatePostInformationDto = {
            post_id: data['Content'],
            post_title: data['Video title'],
            publish_time: data['Video publish time'],

            duration: data.Duration,
            engaged_views: data['Engaged views'],

            average_view_duration: data['Average view duration'], // Keep as '0:12:34' string

            average_percentage_viewed_percent: data['Average percentage viewed (%)'],
            stayed_to_watch_percent: data['Stayed to watch (%)'],

            unique_viewers: data['Unique viewers'],
            unique_reach: data['Unique reach'],
            average_views_per_viewer: data['Average views per viewer'],
            new_viewers: data['New viewers'],
            returning_viewers: data['Returning viewers'],
            casual_viewers: data['Casual viewers'],
            regular_viewers: data['Regular viewers'],

            hypes: data.Hypes,
            hype_points: data['Hype points'],
            subscribers_gained: data['Subscribers gained'],
            subscribers_lost: data['Subscribers lost'],

            likes: data.Likes,
            dislikes: data.Dislikes,
            likes_vs_dislikes_percent: data['Likes (vs. dislikes) (%)'],
            shares: data.Shares,
            comments_added: data['Comments added'],

            total_sales_usd: data['Total sales (USD)'],
            orders: data.Orders,
            approved_commissions_usd: data['Approved commissions (USD)'],
            pending_commissions_usd: data['Pending commissions (USD)'],
            removed_commission_usd: data['Removed commission (USD)'],

            youtube_premium_views: data['YouTube Premium views'],
            youtube_premium_watch_time_hours: data['YouTube Premium watch time (hours)'],
            playlist_watch_time_hours: data['Playlist watch time (hours)'],

            views_from_playlist: data['Views from playlist'],
            views_per_playlist_start: data['Views per playlist start'],
            hours_streamed: data['Hours streamed'],
            reminders_set: data['Reminders set'],
            chat_messages: data['Chat messages'],

            reactions: data.Reactions,
            remix_count: data['Remix count'],
            remix_views: data['Remix views'],
            community_clip_views: data['Community clip views'],
            watch_time_from_community_clips_hours: data['Watch time from community clips (hours)'],

            card_clicks: data['Card clicks'],
            cards_shown: data['Cards shown'],
            clicks_per_card_shown_percent: data['Clicks per card shown (%)'],
        };

        await createPostInformation(tableData);
    });
}