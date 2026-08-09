export interface GameCsv {
    GameName: string,
    Id: number,
    UpdateDate: string,
    NumberOfEpisodes: number,
    Views: number,
    VideoTitle: string,
    Queue: number,
    Ads: boolean,
    CanRecord: boolean,
    Discussed: boolean,
    Genre: string,
    Tags: string,
    Notes: string,
}


export interface ChannelDataCsv {
    Date: string,
    Views: number
}

export interface TableDataCsv {
    Content: string;
    'Video title': string;
    'Video publish time': string;
    Duration: number;
    'Engaged views': number;
    'Average view duration': string;
    'Average percentage viewed (%)': number;
    'Stayed to watch (%)': number;
    'Unique viewers': number;
    'Unique reach': number;
    'Average views per viewer': number;
    'New viewers': number;
    'Returning viewers': number;
    'Casual viewers': number;
    'Regular viewers': number;
    Hypes: number;
    'Hype points': number;
    'Subscribers gained': number;
    'Subscribers lost': number;
    Likes: number;
    Dislikes: number;
    'Likes (vs. dislikes) (%)': number;
    Shares: number;
    'Comments added': number;
    'Total sales (USD)': number;
    Orders: number;
    'Approved commissions (USD)': number;
    'Pending commissions (USD)': number;
    'Removed commission (USD)': number;
    'YouTube Premium views': number;
    'YouTube Premium watch time (hours)': number;
    'Playlist watch time (hours)': number;
    'Views from playlist': number;
    'Views per playlist start': number;
    'Hours streamed': number;
    'Reminders set': number;
    'Chat messages': number;
    Reactions: number;
    'Remix count': number;
    'Remix views': number;
    'Community clip views': number;
    'Watch time from community clips (hours)': number;
    'Card clicks': number;
    'Cards shown': number;
    'Clicks per card shown (%)': number;
    'Card teaser clicks': number;
}