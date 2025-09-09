import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config, cookieOptions } from '../../config';
import { createUser, getUser, getUserById, updateUser } from '../../lib/db/queries';
import { accessTokenBlacklist, genAccessAndRefreshToken, getAccessToken, parseGoogleToken } from '../../utils/auth';
import { HTTP_RESPONSE_CODE, TOKEN_NAME } from '../../constant';
import { ApiError } from '../../utils/ApiError';
import { User } from '../../lib/db/schema';
import { ApiResponse } from '../../utils/ApiResponse';

const handleGoogleLogin = (_req: Request, _res: Response, _next: NextFunction) => {
    try {
        const redirectUri = `${config.serverUrl}/auth/google/callback`;
        const clientId = config.googleClientId;
        const scope = ['openid', 'profile', 'email'].join(' ');
        const responseType = 'code';
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
        _res.redirect(url);
    } catch (err: unknown) {
        _next(err);
    }
};

const handleGoogleCallback = async (_req: Request, _res: Response, _next: NextFunction) => {
    const code = _req.query.code as string;
    try {
        if (!code) {
            return _res.redirect(`${config.clientUrl}/login`);
        }

        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: config.googleClientId,
                client_secret: config.googleClientSecret,
                redirect_uri: `${config.serverUrl}/auth/google/callback`,
                grant_type: 'authorization_code',
            }),
        });

        const tokenData = await tokenRes.json();
        const idToken = tokenData.id_token;
        const { email, email_verified: emailVerified, name, picture: avatar } = parseGoogleToken(idToken);

        let user: User | null = await getUser(email);
        if (!user) {
            user = await createUser({ name, email, emailVerified, avatar });
        }

        if (!user) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.SERVER_ERROR, 'User login failed');
        }

        const tokens = genAccessAndRefreshToken(user.id, user.role);
        const accessToken = tokens?.accessToken ?? '';
        const refreshToken = tokens?.refreshToken ?? '';

        if (!accessToken || !refreshToken) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.SERVICE_UNAVAILABLE, 'Something went wrong while login');
        }

        await updateUser(user.id, {
            refreshToken,
        });

        _res.cookie(TOKEN_NAME.ACCESS_TOKEN, accessToken, cookieOptions);
        _res.cookie(TOKEN_NAME.REFRESH_TOKEN, refreshToken, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        _res.redirect(`${config.clientUrl}/dashboard`);
    } catch (err: unknown) {
        _res.redirect(`${config.clientUrl}/dashboard`);
    }
};

const refresh = async (_req: Request, _res: Response, _next: NextFunction) => {
    try {
        const token: string | null = getAccessToken(_req, TOKEN_NAME.REFRESH_TOKEN);
        if (!token || token.trim() == '') {
            throw new ApiError(false, HTTP_RESPONSE_CODE.UNAUTHORIZED, 'Please login again');
        }

        const decoded = jwt.verify(token, config.jwtRefreshSecret) as jwt.JwtPayload;

        const user: User | null = await getUserById(decoded.id);
        if (!user || user.refreshToken !== token) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.UNAUTHORIZED, 'Invalid refresh token');
        }

        const tokens = genAccessAndRefreshToken(user.id, user.role);
        const accessToken = tokens?.accessToken;
        const refreshToken = tokens?.refreshToken;

        await updateUser(user.id, { refreshToken });

        _res.cookie(TOKEN_NAME.ACCESS_TOKEN, accessToken, cookieOptions);
        _res.cookie(TOKEN_NAME.REFRESH_TOKEN, refreshToken, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 15,
        });

        return _res
            .status(HTTP_RESPONSE_CODE.SUCCESS)
            .json(new ApiResponse(true, HTTP_RESPONSE_CODE.SUCCESS, accessToken, 'Token refresh successfully'));
    } catch (err: unknown) {
        _next(err);
    }
};

const profile = async (_req: Request, _res: Response, _next: NextFunction) => {
    const userId = _req.id;
    try {
        const user = await getUserById(userId);
        if (!user) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.NOT_FOUND, 'User not found');
        }
        const { refreshToken, ...userProfile } = user;

        _res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(true, HTTP_RESPONSE_CODE.SUCCESS, userProfile, 'User fetched successfully'),
        );
    } catch (err: unknown) {
        _next(err);
    }
};

const logout = async (_req: Request, _res: Response, _next: NextFunction) => {
    const userId = _req.id;
    try {
        const accessToken: string | null = getAccessToken(_req, TOKEN_NAME.ACCESS_TOKEN);
        if (!accessToken || accessToken.trim() == '') {
            return _res.json(HTTP_RESPONSE_CODE.NO_CONTENT);
        }

        accessTokenBlacklist.set(accessToken, true);
        await updateUser(userId, { refreshToken: null });

        _res.clearCookie(TOKEN_NAME.ACCESS_TOKEN);
        _res.clearCookie(TOKEN_NAME.REFRESH_TOKEN);
        _res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(true, HTTP_RESPONSE_CODE.SUCCESS, null, 'Logout successful'),
        );
    } catch (err: unknown) {
        _next(err);
    }
};

export { handleGoogleLogin, handleGoogleCallback, refresh, profile, logout };
