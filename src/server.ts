import app from './app';
import {settingsStartup} from "./startup/settings_startup";
import {allowedOrigins, apiPort} from "./config/origins";
import {jobsStartup} from "./startup/jobs_startup";

const PORT = Number(apiPort);


async function startApp() {
    // await p.prisma.$connect();
    // console.log('Database connected.');

    await settingsStartup();
    await jobsStartup();

    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
        console.log(`Allowed frontend origins: ${allowedOrigins.join(', ')}`);
    });
}


startApp().catch((e) => {
    console.error('Startup failed:', e);
    process.exit(1);
});