import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRY } from '../constant';
import { config } from '../config';

const accessTokenBlacklist = new Map<string, boolean>();

function parseGoogleToken(token: string) {
    const [, payload] = token.split('.');
    return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
}

function getAccessToken(req: Request, tokenName: string): string | null {
    return req.headers.authorization?.split(' ')[1] || req.cookies[tokenName];
}

function genAccessAndRefreshToken(userId: string, role: string): Record<string, string> | null {
    try {
        const accessToken = jwt.sign({ id: userId, role }, config.jwtAccessSecret, {
            expiresIn: JWT_EXPIRY.ACCESS_TOKEN_EXPIRY,
        } as jwt.SignOptions);

        const refreshToken = jwt.sign({ id: userId, role }, config.jwtRefreshSecret, {
            expiresIn: JWT_EXPIRY.REFRESH_TOKEN_EXPIRY,
        } as jwt.SignOptions);

        return {
            accessToken,
            refreshToken,
        };
    } catch (err: unknown) {
        return null;
    }
}

export { accessTokenBlacklist, parseGoogleToken, getAccessToken, genAccessAndRefreshToken };
