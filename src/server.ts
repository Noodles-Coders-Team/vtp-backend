import app from './app';
import p from './lib/prisma';
import {settingsStartup} from "./startup/settings_startup";
const PORT = 8080;


async function startApp() {
    // await p.prisma.$connect();
    // console.log('Database connected.');

    await settingsStartup();

    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
}


startApp().catch((e) => {
    console.error('Startup failed:', e);
    process.exit(1);
});