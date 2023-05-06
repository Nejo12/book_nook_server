import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieSession from 'cookie-session';

import routers from './routers';
import connectDB from './config/db';
import apiErrorHandler from './middlewares/apiErrorHandler';

const app = express();

// Use common 3rd-party middlewares
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    maxAge: 60 * 60 * 24 * 1000, // a day
    keys: [process.env.COOKIE_KEY],
  }),
);

connectDB();

app.use(express.json());

// Use routers
app.use('/api/users', cors(corsOptions), routers.users);
app.use('/api/books', cors(corsOptions), routers.books);
app.use('/api/borrows', cors(corsOptions), routers.borrows);

// Custom API error handler
app.use(apiErrorHandler);

export default app;
