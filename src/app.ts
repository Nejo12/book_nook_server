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
// app.use(cors());
app.use(
  cors({
    origin: ['https://the-booknook.netlify.app'], // the link of my front-end app on Netlify
    methods: ['GET', 'POST'],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://the-booknook.netlify.app',
  ); // the link of my front-end app on Netlify
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS',
  );
  res.setHeader('content-type', 'application/json');
  next();
});
// app.use(
//   cors({
//     origin: 'https://the-booknook.netlify.app',
//   }),
// );
// app.options('*', cors());

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

// app.set('port', env.PORT || process.env.PORT || 3000); // PORT changed to 3000 as suggested by Adaptable deployment.

// to enable retrieval and send ability of json
app.use(express.json());

// Use routers
app.use('/api/users', routers.users);
app.use('/api/books', routers.books);
app.use('/api/borrows', routers.borrows);

// Custom API error handler
app.use(apiErrorHandler);

export default app;
