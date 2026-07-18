export interface GameCsv {
    GameName: string,
    Id: number,
    UpdateDate: Date,
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

export interface ChannelDataCsv{
    Date: string,
    Views: number
}