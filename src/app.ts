import cors from 'cors';
import express from 'express';
import usersRouter from './routes/users';
import temperatureRouter from './routes/temperature';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
// import { validate } from './middleware/validate';
// import { CreateUserSchema } from './schemas/user';

const app = express();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

app.use('/users', usersRouter);
// Another wy for adding validation
//app.use('/users', validate(CreateUserSchema), usersRouter);

app.use('/temperature', temperatureRouter);

app.get('/', (request, response) => {
    console.info('Get to page');
    response.json({message: "Hello world!"});
});

export default app;