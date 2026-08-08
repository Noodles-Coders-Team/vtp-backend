import cors from 'cors';
import express from 'express';
import usersRouter from './routes/users';
import gamesRouter from './routes/games';
import postRouter from './routes/post';
import postInformationRouter from './routes/post_information';
import chanelDataRouter from './routes/chanel_data';
import dropDownDataRouter from './routes/drop_down_data';
import rankRouter from './routes/rank';
import importRouter from './routes/import';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


app.use('/users', usersRouter);
app.use('/games', gamesRouter);
app.use('/post', postRouter);
app.use('/post/information', postInformationRouter);
app.use('/rank', rankRouter);
app.use('/channel-data', chanelDataRouter);
app.use('/import', importRouter);
app.use('/drop-down-data', dropDownDataRouter);
// Another wy for adding validation
//app.use('/users', validate(CreateUserSchema), usersRouter);


export default app;