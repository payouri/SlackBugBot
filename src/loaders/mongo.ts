import mongoose, { Connection } from 'mongoose';

import { MONGO_URI } from '../config';

export const loginToDatabase = async (): Promise<Connection> => {
    if (!MONGO_URI) throw new TypeError('env variable MONGO_URI is missing');

    const mongo = await mongoose.connect(MONGO_URI, {
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
    });

    return mongo.connection;
};

export const disconnectFromDatabase = async () => {
    await mongoose.disconnect();
};
