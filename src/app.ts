import cors from 'cors';
import express from 'express';
import usersRouter from './routes/users';
import gamesRouter from './routes/games';
import postRouter from './routes/post';
import postInformationRouter from './routes/post_information';
import rankRouter from './routes/rank';
import importRouter from './routes/import';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
// import { validate } from './middleware/validate';
// import { CreateUserSchema } from './schemas/user';

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
app.use('/import', importRouter);
// Another wy for adding validation
//app.use('/users', validate(CreateUserSchema), usersRouter);


app.get('/', (request, response) => {
    console.info('Get to page');
    response.json({message: "Hello world!"});
});

export default app;