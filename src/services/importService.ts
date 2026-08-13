import { ChannelDataDto, CreatePostInformationDto, CreateRankDto, GameDto, GameInfoDto, GameInfoSchema, GameSchema, PostDto, RankDto, ValidateSchema, type CreateGameDto, type CreateGameInfoDto } from "@nct/vtp-common";
import { ChannelDataCsv, GameCsv, TableDataCsv } from "../lib/class";
import { createGame } from "./gameService";
import { createGameInfo } from "./gameInfoService";
import { _isoDateTime } from "zod/v4/core";
import { createChannelData } from "./chanelDataService";
import { createPost, createPostInformation } from "./postService";
import { createRank } from "./rankService";


export async function importGameCsv(gameCsv: GameCsv[]) {
    gameCsv.forEach(async (game: GameCsv) => {
        const createGameSchema: CreateGameDto = {
            name: game.GameName,
            recorded: false,
        };
        const createdGame = await createGame(createGameSchema);

        const createGameInfoSchema: CreateGameInfoDto = {
            game_id: createdGame.id,
            discussed: stringToBool(game.Discussed),
            can_record: stringToBool(game.CanRecord),
            genre: game.Genre.split(',').map((v) => v.trim()),
            tags: game.Tags.split(',').map((v) => v.trim()),
            notes: game.Notes
        };

        const createdInfo = await createGameInfo(createGameInfoSchema);

        const createRankDto: CreateRankDto = {
            game_id: createdGame.id,
            date: convertDate(game.UpdateDate),
            rank: Number(game.Id)
        };

        const createdRank = await createRank(createRankDto);
    });
}


function convertDate(date: string): string {
    const info = date.split(".");
    if (info.length == 3)
        return info.at(2) + '-' + info.at(1) + '-' + info.at(0) + 'T00:00:00.000Z';
    else
        return new Date(Date.now()).toISOString();
}


//Import files have only TRUE/FALSE values
function stringToBool(val: any): boolean {
    if (val === "TRUE")
        return true;
    return false;
}


export async function importChannelDataCsv(channel_data: ChannelDataCsv[]) {
    await channel_data.forEach(async (data: ChannelDataCsv) => {
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
            publish_time: formatDate(data['Video publish time']),

            duration: Number(data.Duration),
            engaged_views: Number(data['Engaged views']),

            average_view_duration: data['Average view duration'], // Keep as '0:12:34' string

            average_viewed_percent: Number(data['Average percentage viewed (%)']),
            stayed_to_watch_percent: Number(data['Stayed to watch (%)']),

            unique_viewers: Number(data['Unique viewers']),
            unique_reach: Number(data['Unique reach']),
            average_views_per_viewer: Number(data['Average views per viewer']),
            new_viewers: Number(data['New viewers']),
            returning_viewers: Number(data['Returning viewers']),
            casual_viewers: Number(data['Casual viewers']),
            regular_viewers: Number(data['Regular viewers']),

            hypes: Number(data.Hypes),
            hype_points: Number(data['Hype points']),
            subscribers_gained: Number(data['Subscribers gained']),
            subscribers_lost: Number(data['Subscribers lost']),

            likes: Number(data.Likes),
            dislikes: Number(data.Dislikes),
            likes_vs_dislikes_percent: Number(data['Likes (vs. dislikes) (%)']),
            shares: Number(data.Shares),
            comments_added: Number(data['Comments added']),

            total_sales_usd: Number(data['Total sales (USD)']),
            orders: Number(data.Orders),
            approved_commissions_usd: Number(data['Approved commissions (USD)']),
            pending_commissions_usd: Number(data['Pending commissions (USD)']),
            removed_commission_usd: Number(data['Removed commission (USD)']),

            youtube_premium_views: Number(data['YouTube Premium views']),
            youtube_premium_watch_time_hours: Number(data['YouTube Premium watch time (hours)']),
            playlist_watch_time_hours: Number(data['Playlist watch time (hours)']),

            views_from_playlist: Number(data['Views from playlist']),
            views_per_playlist_start: Number(data['Views per playlist start']),
            hours_streamed: Number(data['Hours streamed']),
            reminders_set: Number(data['Reminders set']),
            chat_messages: Number(data['Chat messages']),

            reactions: Number(data.Reactions),
            remix_count: Number(data['Remix count']),
            remix_views: Number(data['Remix views']),
            community_clip_views: Number(data['Community clip views']),
            watch_time_from_community_clips_hours: Number(data['Watch time from community clips (hours)']),

            card_clicks: Number(data['Card clicks']),
            cards_shown: Number(data['Cards shown']),
            clicks_per_card_shown_percent: Number(data['Clicks per card shown (%)']),
        };

        await createPostInformation(tableData);
    });
}


function formatDate(dateI: string): string | undefined {
    if (dateI == "")
        return undefined;

    //May 16, 2026
    const date = dateI.split(" ");
    let month: number = -1;
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (var j = 0; j < months.length; j++) {
        if (date[0] == months[j]) {
            month = months.indexOf(months[j]) + 1;
        }
    }
    const monthString = month < 10 ? `0${month.toString()}` : month.toString();
    const day = date[1].slice(0, -1);
    const dateString = Number(day) < 10 ? `0${day}` : day;
    const res = `${date[2]}-${monthString}-${dateString}`;
    return res;
}