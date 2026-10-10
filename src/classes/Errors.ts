export class SteamRequestLimitExceeded extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SteamRequestLimitExceeded";
    }
}