import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV: 'development' | 'production' | 'test' = (() => {
    const validEnv = ['development', 'production', 'test'] as const;
    if (!process.env.NODE_ENV) return 'production';
    if (validEnv.includes(process.env.NODE_ENV as typeof validEnv[number])) {
        return process.env.NODE_ENV as typeof validEnv[number];
    }
    console.log(`Unrecognized env: ${process.env.NODE_ENV}`);
    return 'production';
})();

export const {
    PORT = 5000,
    CLICK_UP_API_KEY = 'CLICK_UP_API_KEY',
    CLICK_UP_TEAM = 'CLICK_UP_TEAM',
    MONGO_URI = 'dqsdqsd',
} = process.env;
