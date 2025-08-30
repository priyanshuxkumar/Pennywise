import { NextFunction, Request, Response } from 'express';
import { config, cookieOptions } from '../../config';
import { createUser, getUser, updateUser } from '../../lib/db/queries';
import { genAccessAndRefreshToken, parseGoogleToken } from '../../utils/auth';
import { HTTP_RESPONSE_CODE, TOKEN_NAME } from '../../constant';
import { ApiError } from '../../utils/ApiError';
import { User } from '../../lib/db/schema';

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
            maxAge: 1000 * 60 * 15,
        });
        _res.redirect(`${config.clientUrl}/dashboard`);
    } catch (err: unknown) {
        _res.redirect(`${config.clientUrl}/dashboard`);
    }
};

export { handleGoogleLogin, handleGoogleCallback };
