import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieSession from 'cookie-session';

import routers from './routers';
import connectDB from './config/db';
import env from '../src/util/validate_env';
import apiErrorHandler from './middlewares/apiErrorHandler';

const app = express();

// Use common 3rd-party middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    maxAge: 60 * 60 * 24 * 1000, // a day
    keys: [env.COOKIE_KEY],
  }),
);

connectDB();

app.set('port', env.PORT);

// to enable retrieval and send ability of json
app.use(express.json());

// Use routers
app.use('/api/books', routers.books);
app.use('/api/users', routers.users);
app.use('/api/borrows', routers.borrows);

// Custom API error handler
app.use(apiErrorHandler);

export default app;
