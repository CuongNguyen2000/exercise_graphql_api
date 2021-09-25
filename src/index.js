import dotenv from 'dotenv';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import mongoose from 'mongoose';

import './utils/db';
import schema from './schema';

dotenv.config();

const startServer = async () => {
    const app = express();

    const server = new ApolloServer({
        schema,
        cors: true,
        playground: process.env.NODE_ENV === 'development' ? true : false,
        introspection: true,
        tracing: true,
        path: '/',
    });

    await server.start();

    server.applyMiddleware({
        app,
        path: '/',
        cors: true,
        onHealthCheck: () =>
            // eslint-disable-next-line no-undef
            new Promise((resolve, reject) => {
                if (mongoose.connection.readyState > 0) {
                    resolve();
                } else {
                    reject();
                }
            }),
    });

    app.listen({ port: process.env.PORT }, () => {
        console.log(
            `🚀 Server listening on port http://localhost:${process.env.PORT}`
        );
    });
};

startServer();
