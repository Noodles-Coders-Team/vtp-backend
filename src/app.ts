import cors from 'cors';
import express from 'express';
import steamAppRouter from './routes/steam_apps';
import steamAppRefDataRouter from './routes/steam_app_reference_data';
import userGameScoreRouter from './routes/user_game_score';
import settingsRouter from './routes/settings';
import swaggerUi from 'swagger-ui-express';
import {swaggerSpec} from './config/swagger';
import {toNodeHandler} from "better-auth/node";
import {auth} from "./lib/auth";
import {validateAuth} from "./middleware/validateAuth";
import {requireRole} from "./middleware/requireRole";
import {UserRoles} from "@nct/vtp-common";


const app = express();
app.use(cors({
    //That's why my post request won't work no longer (most probably)
    origin: ' http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express.json());


app.use('/docs', validateAuth, requireRole([UserRoles.Admin]),  swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Another way for adding validation
// app.use('/users', validate(CreateUserSchema), usersRouter);
app.use('/steam-apps', validateAuth, steamAppRouter);
app.use('/steam-app-ref-data', validateAuth, steamAppRefDataRouter);
app.use('/user-game-score', validateAuth, userGameScoreRouter);
app.use('/settings', validateAuth, requireRole([UserRoles.Admin]), settingsRouter);

app.use((req, res) =>
    res.status(404).json({error: 'Not found'}));

/*app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error

    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});*/

export default app;