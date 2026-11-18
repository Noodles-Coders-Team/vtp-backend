import "dotenv/config";
import os from "os";


export const apiPort = process.env.API_PORT?.trim() || "8080";
const frontendPort = process.env.FRONTEND_PORT?.trim() || "5173";


function localHosts(): string[] {
    const hosts = ["localhost", "127.0.0.1"];

    for (const addresses of Object.values(os.networkInterfaces())) {
        for (const address of addresses ?? []) {
            if (address.family === "IPv4" && !address.internal) {
                hosts.push(address.address);
            }
        }
    }

    return hosts;
}


const configuredOrigins = (process.env.FRONTEND_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter((origin) => origin.length > 0);


/** Browser origins allowed by CORS and trusted by better-auth for sign-in. */
export const allowedOrigins: string[] = configuredOrigins.length > 0
    ? configuredOrigins
    : localHosts().map((host) => `http://${host}:${frontendPort}`);

/**
 * better-auth resolves its own baseURL per request against this allow-list, so
 * a sign-in that arrives at http://<lan-ip>:8080 isn't answered as if it had
 * arrived at localhost. `undefined` leaves the static BETTER_AUTH_URL in charge.
 */
export const authBaseURL = configuredOrigins.length > 0
    ? undefined
    : {
        allowedHosts: localHosts().map((host) => `${host}:${apiPort}`),
        fallback: `http://localhost:${apiPort}`
    };
