import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';

import schema from '../../src/schema';
import Post from '../../src/models/Post';
import User from '../../src/models/User';


const connectToDb = async () => {
    await mongoose.connect(process.env.MONGODB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => console.error(error));
}

const dropTestDb = async () => {
    if (process.env.NODE_ENV === 'development') {
        await mongoose.connection.db.dropDatabase().catch(error => console.error(error));
    }
}

const closeDbConnection = async () => {
    await mongoose.connection.close().catch(error => console.error(error));
}


const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
        req,
        res,
        Post,
        User,
    })
})

const testClient = createTestClient(server);

export {
    testClient,
    connectToDb,
    closeDbConnection,
    dropTestDb
}