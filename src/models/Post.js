import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeWithMongoose } from 'graphql-compose-mongoose';

export const PostSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            trim: true,
            required: true,
        },
        content: {
            type: String,
            trim: true,
            required: true,
        },
    },
    {
        collection: 'posts',
    }
);

PostSchema.plugin(timestamps);

PostSchema.index({ createdAt: 1, updatedAt: 1 });

export const Post = mongoose.model('Post', PostSchema);
export const PostTC = composeWithMongoose(Post);
