import cors from 'cors';
import express, {NextFunction} from 'express';
import usersRouter from './routes/users';
import steamAppRouter from './routes/steam_apps';
import steamAppRefDataRouter from './routes/steam_app_reference_data';
import userGameScoreRouter from './routes/user_game_score';
import swaggerUi from 'swagger-ui-express';
import {swaggerSpec} from './config/swagger';

const app = express();
app.use(express.json());


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


// Another way for adding validation
//app.use('/users', validate(CreateUserSchema), usersRouter);
app.use('/users', usersRouter);
app.use('/steam-apps', steamAppRouter);
app.use('/steam-app-ref-data', steamAppRefDataRouter);
app.use('/user-game-score', userGameScoreRouter);

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