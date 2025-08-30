import { Request, NextFunction, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { HTTP_RESPONSE_CODE, TOKEN_NAME } from '../constant';
import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import { config } from '../config';
import { ApiResponse } from '../utils/ApiResponse';
import { accessTokenBlacklist, getAccessToken } from '../utils/auth';

export const authMiddleware = (_req: Request, _res: Response, _next: NextFunction) => {
    try {
        const token: string | null = getAccessToken(_req, TOKEN_NAME.ACCESS_TOKEN);
        if (!token || token.trim() == '') {
            throw new ApiError(false, HTTP_RESPONSE_CODE.UNAUTHORIZED, 'Unauthenticated. Please login');
        }

        if (accessTokenBlacklist.has(token)) {
            return _res
                .status(HTTP_RESPONSE_CODE.UNAUTHORIZED)
                .json(
                    new ApiResponse(
                        false,
                        HTTP_RESPONSE_CODE.UNAUTHORIZED,
                        'Token has been revoked. Please login again.',
                    ),
                );
        }

        const payload = jwt.verify(token, config.jwtAccessSecret);
        if (typeof payload !== 'string' && payload.id) {
            _req.id = payload.id;
            return _next();
        }
        throw new ApiError(false, HTTP_RESPONSE_CODE.FORBIDDEN, 'Invalid token payload');
    } catch (err: unknown) {
        if (err instanceof ApiError) {
            return _res.status(err.statusCode).json(new ApiResponse(false, err.statusCode, null, err.message));
        } else if (err instanceof JsonWebTokenError) {
            return _res
                .status(HTTP_RESPONSE_CODE.FORBIDDEN)
                .json(new ApiResponse(false, HTTP_RESPONSE_CODE.FORBIDDEN, null, 'Invalid Access Token'));
        } else if (err instanceof TokenExpiredError) {
            return _res
                .status(HTTP_RESPONSE_CODE.FORBIDDEN)
                .json(new ApiResponse(false, HTTP_RESPONSE_CODE.FORBIDDEN, null, 'Token has expired'));
        } else if (err instanceof NotBeforeError) {
            return _res
                .status(HTTP_RESPONSE_CODE.UNAUTHORIZED)
                .json(new ApiResponse(false, HTTP_RESPONSE_CODE.UNAUTHORIZED, null, 'Token not yet active'));
        } else {
            return _res
                .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
                .json(new ApiResponse(false, HTTP_RESPONSE_CODE.SERVER_ERROR, null, 'Internal server error'));
        }
    }
};
