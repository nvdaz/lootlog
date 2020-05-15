import {} from 'dotenv/config';
import http from 'http';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
// import * as Sentry from '@sentry/node';

import setupDatabase from './setup/database';
import { apolloServer } from './apollo';
import applyAuth from './auth';

// Sentry.init({ dsn: process.env.DSN });

setupDatabase();

const app = express();

app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json());
applyAuth(app);
// setupRoutes(app);
apolloServer.applyMiddleware({ app, path: '/graphql' });

app.use(
  express.static(path.join(__dirname, '..', 'client', 'dist'), {
    maxAge: 31536000000,
  }),
);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
});

const httpServer = http.createServer(app);

apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(80, () => console.log('Server started!'));
