import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: parseInt(process.env.PORT || '8080'),
    nodeEnv: process.env.NODE_ENV,
    serverUrl: process.env.SERVER_URL,
    dbUrl: process.env.DATABASE_URL!
};

export { config };