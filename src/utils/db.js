import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.Promise = global.Promise;

const connection = mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
});

// mongoose.set('useCreateIndex', true);

connection
    .then((db) => db)
    .catch((err) => {
        console.log(err);
    });

export default connection;
