import dotenv from 'dotenv';
import { CookieOptions } from 'express';
dotenv.config();

const config = {
    port: parseInt(process.env.PORT || '8080'),
    nodeEnv: process.env.NODE_ENV,
    clientUrl: process.env.CLIENT_URL,
    serverUrl: process.env.SERVER_URL,
    dbUrl: process.env.DATABASE_URL!,
    googleClientId: process.env.GOOGLE_CLIENT_ID!,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
    openAiApiKey: process.env.OPENAI_API_KEY!,
};

const corsOptions = {
    origin: config.clientUrl ? [config.clientUrl] : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    maxAge: 1000 * 60 * 15, // 15m
    path: '/',
    sameSite: 'none',
};
export { config, corsOptions, cookieOptions };
