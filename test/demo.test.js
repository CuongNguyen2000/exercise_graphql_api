import {jest} from '@jest/globals';
import { graphql } from 'graphql';
import { UserMutation } from '../src/schema/composer';
import { User, UserTC } from '../src/models/User';
import { Post, PostTC } from '../src/models/Post';

describe("User Resolvers: Delete Post", () => {

    test("Delete Post", async () => {
        const userId = "61435afa76c49012c7c2655b";
        const postId = "614c1694abb477e6fad8aa81";

        const deletePostMockFn = jest.fn().mockImplementation(()=>{
            return Promise.resolve({code: 200});
        });
        // const deletePostMockFn = jest.fn().mockResolvedValue(true);

        UserMutation.userRemovePost = deletePostMockFn;

        const result = await UserMutation.userRemovePost(userId,postId);

        expect(deletePostMockFn).toHaveBeenCalledWith(userId, postId);
        expect(result.code).toBe(200);
    });

    test("Update user posts", async () => {
        const userId = "61435afa76c49012c7c2655b";
        const postId = "614c1694abb477e6fad8aa81";

        const deletePostMockFn = jest.fn().mockImplementation(()=>{
            return Promise.resolve({code: 200});
        });

        const userUpdate = User.findOneAndUpdate();
        // userUpdate= deletePostMockFn;
        User.findOneAndUpdate = deletePostMockFn;

        // UserMutation.userRemovePost = deletePostMockFn;

        // const result = await UserMutation.userRemovePost(userId,postId);
        const result = await User.findOneAndUpdate(postId);

        expect(deletePostMockFn).toHaveBeenCalledWith(postId);
        expect(result.code).toBe(200);
    });
})