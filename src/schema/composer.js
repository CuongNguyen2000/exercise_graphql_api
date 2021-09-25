import { User, UserTC } from '../models/User';
import { Post, PostTC } from '../models/Post';

PostTC.addRelation('author', {
    resolver: () => UserTC.getResolver('findById'),
    prepareArgs: {
        _id: (source) => source.author,
        skip: null,
        sort: null,
    },
    projection: { author: true },
});

UserTC.addRelation('posts', {
    resolver: () => PostTC.getResolver('findMany'),
    prepareArgs: {
        filter: (source) => ({ author: source._id }),
    },
    projection: { id: true },
});

UserTC.addResolver({
    name: 'createPost',
    type: UserTC,
    args: { userId: 'MongoID!', title: 'String!', content: 'String' },
    resolve: async ({ args }) => {
        const newObj = {
            title: args.title,
            content: args.content,
            author: args.userId,
        };

        const newPost = await Post.create(newObj);
        const savePost = await newPost.save();

        const user = await User.findOneAndUpdate(
            { _id: args.userId },
            { $push: { posts: savePost } }
        );
        await user.save();
        if (!user) return null;
        // console.log(user);
        return User.findOne({ _id: args.userId }).populate('posts');
    },
});

UserTC.addResolver({
    name: 'removePost',
    type: UserTC,
    args: { userId: 'MongoID!', postId: 'MongoID!' },
    resolve: async ({ args }) => {
        await Post.findOneAndDelete({ _id: args.postId });

        await User.findOneAndUpdate(
            { posts: args.postId },
            { $pull: { posts: args.postId } },
            { new: true, useFindAndModify: false }
        );

        const msg = 'Delete Successfully';
        console.log(msg);

        return Post.findOne({ _id: args.postId });
    },
});

PostTC.addResolver({
    name: 'listPostByAuthor',
    type: PostTC.List,
    args: { userId: 'MongoID!', perPage: 'Int!', page: 'Int' },
    resolve: async ({ args}) => {
        const perPage = args.perPage;
        const page = args.page || 1;

        // const countPost = await Post.countDocuments({ author: args.userId});

        const posts = await Post.find({ author: args.userId })
            .skip(perPage * page - perPage)
            .limit(perPage);
        // console.log(posts)

        return posts;
    },
});

UserTC.addResolver({
    name: 'removeUser',
    type: UserTC,
    args: { userId: 'MongoID!' },
    resolve: async ({args }) => {
        const user = await User.findOne({ _id: args.userId });
        await Post.findOne({ _id: user.posts });
        if (!user) return null;

        await Post.deleteMany({ _id: user.posts });
        await User.findOneAndDelete({ _id: args.userId });

        return User.find({});
    },
});

const PostQuery = {
    postById: PostTC.getResolver('findById'),
    postByIds: PostTC.getResolver('findByIds'),
    postOne: PostTC.getResolver('findOne'),
    postMany: PostTC.getResolver('findMany'),
    postManyByAuthor: PostTC.getResolver('listPostByAuthor'),
    postCount: PostTC.getResolver('count'),
    postConnection: PostTC.getResolver('connection'),
    postPagination: PostTC.getResolver('pagination'),
};

const UserQuery = {
    userById: UserTC.getResolver('findById'),
    userByIds: UserTC.getResolver('findByIds'),
    userOne: UserTC.getResolver('findOne'),
    userMany: UserTC.getResolver('findMany'),
    userCount: UserTC.getResolver('count'),
    userConnection: UserTC.getResolver('connection'),
    userPagination: UserTC.getResolver('pagination'),
};

const UserMutation = {
    userCreateOne: UserTC.getResolver('createOne'),
    userCreateMany: UserTC.getResolver('createMany'),
    userUpdateById: UserTC.getResolver('updateById'),
    userUpdateOne: UserTC.getResolver('updateOne'),
    userUpdateMany: UserTC.getResolver('updateMany'),
    userRemoveById: UserTC.getResolver('removeUser'),
    // userRemoveOne: UserTC.getResolver('removeOne'),
    // userRemoveMany: UserTC.getResolver('removeMany'),
    userPushToArray: UserTC.getResolver('createPost'),
    userRemovePost: UserTC.getResolver('removePost'),
};

export { UserQuery, PostQuery, UserMutation };
