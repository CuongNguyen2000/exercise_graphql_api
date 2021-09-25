import { SchemaComposer } from 'graphql-compose';

import db from '../utils/db'; // eslint-disable-line no-unused-vars

const schemaComposer = new SchemaComposer();

import { UserQuery, PostQuery, UserMutation } from './composer';

schemaComposer.Query.addFields({
    ...UserQuery,
    ...PostQuery,
});

schemaComposer.Mutation.addFields({
    ...UserMutation,
});

export default schemaComposer.buildSchema();
