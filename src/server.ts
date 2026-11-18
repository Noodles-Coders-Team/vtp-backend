import app from './app';
import p from './lib/prisma';
import {settingsStartup} from "./startup/settings_startup";
import {apiPort, allowedOrigins} from "./config/origins";

const PORT = Number(apiPort);


async function startApp() {
    // await p.prisma.$connect();
    // console.log('Database connected.');

    await settingsStartup();

    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
        console.log(`Allowed frontend origins: ${allowedOrigins.join(', ')}`);
    });
}


startApp().catch((e) => {
    console.error('Startup failed:', e);
    process.exit(1);
});