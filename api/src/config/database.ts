import mongoose from 'mongoose';
import { logger } from './logger.js';

const MONGODB_URI = process.env.MONGODB_URI!;

mongoose.connection.on('connected', () => {
    logger.color('cyan', 'MongoDB is Connected Successfully');
});

mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB runtime error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected! Attempting to reconnect...');
});

async function connectDb() {
    try {
        if (!MONGODB_URI) {
            logger.error('Mongodb Uri is undefined or null');
            console.log(MONGODB_URI)
            return;
        }
        if (mongoose.connection.readyState === 1) {
            logger.color('yellow', 'DataBase is Already connected');
            return;
        }

        await mongoose.connect(MONGODB_URI);

    } catch (error) {
        console.error('[Error] Database initialization ', error);
        process.exit();
    }
}

export default connectDb;