import {
    ChannelDataDto,
    type CreateGameDto,
    type CreateGameInfoDto,
    CreatePostInformationDto,
    CreateRankDto,
    PostDto
} from "@nct/vtp-common";
import {ChannelDataCsv, GameCsv, TableDataCsv} from "../lib/class";
import {createGame} from "./gameService";
import {createGameInfo} from "./gameInfoService";
import {createChannelData} from "./channelDataService";
import {createPost, createPostInformation} from "./postService";
import {createRank} from "./rankService";


export async function importGameCsv(gameCsv: GameCsv[]) {
    for (const game of gameCsv) {
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

        await createGameInfo(createGameInfoSchema);

        const createRankDto: CreateRankDto = {
            game_id: createdGame.id,
            date: convertDate(game.UpdateDate),
            rank: Number(game.Id)
        };

        await createRank(createRankDto);
    }
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
    return val === "TRUE";
}


export async function importChannelDataCsv(channel_data: ChannelDataCsv[]) {
    for (const data of channel_data) {
        const channelDataDto: ChannelDataDto = {
            id: data.Date,
            views: Number(data.Views) as number
        };

        await createChannelData(channelDataDto);
    }
}


export async function importTableDataCsv(table_data: TableDataCsv[]) {
    for (const data of table_data) {
        const post: PostDto = {
            id: data['Content'],
        };

        await createPost(post);

        const tableData: CreatePostInformationDto = {
            post_id: data['Content'],
            post_title: data['Video title'],
            publish_time: formatDate(data['Video publish time']),

            duration: Number(data.Duration),
            engaged_views: parseNumber(data['Engaged views']),

            average_view_duration: data['Average view duration'], // Keep as '0:12:34' string

            average_viewed_percent: parseNumber(data['Average percentage viewed (%)']),
            stayed_to_watch_percent: parseNumber(data['Stayed to watch (%)']),

            unique_viewers: parseNumber(data['Unique viewers']),
            unique_reach: parseNumber(data['Unique reach']),
            average_views_per_viewer: parseNumber(data['Average views per viewer']),
            new_viewers: parseNumber(data['New viewers']),
            returning_viewers: parseNumber(data['Returning viewers']),
            casual_viewers: parseNumber(data['Casual viewers']),
            regular_viewers: parseNumber(data['Regular viewers']),

            hypes: parseNumber(data.Hypes),
            hype_points: parseNumber(data['Hype points']),
            subscribers_gained: parseNumber(data['Subscribers gained']),
            subscribers_lost: parseNumber(data['Subscribers lost']),

            likes: parseNumber(data.Likes),
            dislikes: parseNumber(data.Dislikes),
            likes_vs_dislikes_percent: parseNumber(data['Likes (vs. dislikes) (%)']),
            shares: parseNumber(data.Shares),
            comments_added: parseNumber(data['Comments added']),

            total_sales_usd: parseNumber(data['Total sales (USD)']),
            orders: parseNumber(data.Orders),
            approved_commissions_usd: parseNumber(data['Approved commissions (USD)']),
            pending_commissions_usd: parseNumber(data['Pending commissions (USD)']),
            removed_commission_usd: parseNumber(data['Removed commission (USD)']),

            youtube_premium_views: parseNumber(data['YouTube Premium views']),
            youtube_premium_watch_time_hours: parseNumber(data['YouTube Premium watch time (hours)']),
            playlist_watch_time_hours: parseNumber(data['Playlist watch time (hours)']),

            views_from_playlist: parseNumber(data['Views from playlist']),
            views_per_playlist_start: parseNumber(data['Views per playlist start']),
            hours_streamed: parseNumber(data['Hours streamed']),
            reminders_set: parseNumber(data['Reminders set']),
            chat_messages: parseNumber(data['Chat messages']),

            reactions: parseNumber(data.Reactions),
            remix_count: parseNumber(data['Remix count']),
            remix_views: parseNumber(data['Remix views']),
            community_clip_views: parseNumber(data['Community clip views']),
            watch_time_from_community_clips_hours: parseNumber(data['Watch time from community clips (hours)']),

            card_clicks: parseNumber(data['Card clicks']),
            cards_shown: parseNumber(data['Cards shown']),
            clicks_per_card_shown_percent: parseNumber(data['Clicks per card shown (%)']),
        };

        await createPostInformation(tableData);
    }
}

function parseNumber(n: any): number | undefined {
    const result = Number(n);
    if (Number.isNaN(result))
        return undefined;
    return result;
}

function formatDate(dateI: string): string | undefined {
    if (dateI == "")
        return undefined;

    //May 16, 2026
    const date = dateI.split(" ");
    let month: number = -1;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let j = 0; j < months.length; j++) {
        if (date[0] == months[j]) {
            month = months.indexOf(months[j]) + 1;
        }
    }
    const monthString = month < 10 ? `0${month.toString()}` : month.toString();
    const day = date[1].slice(0, -1);
    const dateString = Number(day) < 10 ? `0${day}` : day;
    return `${date[2]}-${monthString}-${dateString}`;
}