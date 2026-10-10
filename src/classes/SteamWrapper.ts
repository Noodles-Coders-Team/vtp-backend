import {SteamRequestLimitExceeded} from "./Errors";
import {AppListResponse, SteamAppDetails, SteamAppDetailsResponse, SteamSpyResponse} from "../lib/Interfaces";

const STEAM_API_KEY = process.env.STEAM_API_KEY;
if (!STEAM_API_KEY) {
    throw new Error('STEAM_API_KEY is empty!');
}

const MONTHS: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};


class SteamWrapper {

    public async getSteamGames(results: number, last_app_id: string | undefined) {
        // last_appid - for continuation to know where to continue from
        const requestConfig = {
            'max_results': results,
            "last_appid": last_app_id,
            "have_description_language": "english",
            "include_games": true,
            "include_dlc": false,
            "include_software": false,
            "include_videos": false,
            "include_hardware": false
        };

        const request = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${STEAM_API_KEY}&format=json&input_json=${JSON.stringify(requestConfig)}`;
        // console.log(JSON.stringify(requestConfig));
        const response = await fetch(request);

        // STEAM returns 429 if I'm requesting too much. 200 otherwise
        // https://partner.steamgames.com/doc/webapi_overview/responses
        if (response.status == 429) {
            throw new SteamRequestLimitExceeded('Exceeded Steam API limits');
        } else if (response.ok) {
            const responseData = (await response.json()) as AppListResponse;
            return responseData.response?.apps;
        } else {
            console.warn(`SteamApi unknown response. Message: ${await response.text()}`);
        }
    }

    public async getAppInformation(appId: string): Promise<SteamAppDetails | undefined> {
        const URL = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
        const response = await fetch(URL);

        if (response.status == 429) {
            throw new SteamRequestLimitExceeded('Exceeded Steam API limits');
        } else if (response.ok) {
            const body: SteamAppDetailsResponse = await response.json();
            return this.mapSteamApp(body, Number(appId));
        } else {
            console.warn(`SteamApi unknown response. Message: ${await response.text()}`);
        }
    }


    mapSteamApp(body: SteamAppDetailsResponse, appId: number): SteamAppDetails | undefined {
        const entry = body[appId];
        if (!entry?.success || !entry.data) return undefined;

        const data = entry.data;

        return {
            appId,
            name: data.name,
            metacritic: data.metacritic?.score ?? null,
            recommendations: data.recommendations?.total ?? null,
            categories: data.categories?.map((c) => c.description) ?? [],
            genres: data.genres?.map((g) => g.description) ?? [],
            releaseDate: this.parseSteamDate(data.release_date?.date),
        };
    }

    parseSteamDate(raw?: string): Date | null {
        if (!raw) return null;

        let m = raw.match(/^(\d{1,2})\s+([A-Za-z]{3})\w*,?\s+(\d{4})$/);
        if (m) {
            const month = MONTHS[m[2].toLowerCase()];
            return month === undefined ? null : new Date(Date.UTC(+m[3], month, +m[1]));
        }

        m = raw.match(/^([A-Za-z]{3})\w*\s+(\d{1,2}),?\s+(\d{4})$/);
        if (m) {
            const month = MONTHS[m[1].toLowerCase()];
            return month === undefined ? null : new Date(Date.UTC(+m[3], month, +m[2]));
        }

        return null; // e.g. "Coming soon", "Q1 2027"
    }
}

export default SteamWrapper;