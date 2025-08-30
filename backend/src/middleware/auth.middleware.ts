import { Request, NextFunction, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { HTTP_RESPONSE_CODE, TOKEN_NAME } from '../constant';
import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import { config } from '../config';
import { ApiResponse } from '../utils/ApiResponse';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: string = req.headers.authorization?.split(' ')[1] || req.cookies[TOKEN_NAME.ACCESS_TOKEN];
        if (token.trim() == '') {
            throw new ApiError(false, HTTP_RESPONSE_CODE.UNAUTHORIZED, 'Unauthenticated. Please login');
        }

        const payload = jwt.verify(token, config.jwtAccessSecret);
        if (typeof payload !== 'string' && payload.id) {
            req.id = payload.id;
            return next();
        }
        throw new ApiError(false, HTTP_RESPONSE_CODE.FORBIDDEN, 'Invalid token payload');
    } catch (err: unknown) {
        if (err instanceof JsonWebTokenError) {
            return res
                .status(HTTP_RESPONSE_CODE.FORBIDDEN)
                .json(new ApiResponse(false, HTTP_RESPONSE_CODE.FORBIDDEN, 'Invalid Access Token'));
        } else if (err instanceof TokenExpiredError) {
            return res
                .status(HTTP_RESPONSE_CODE.FORBIDDEN)
                .json(new ApiResponse(false, HTTP_RESPONSE_CODE.FORBIDDEN, 'Token has expired'));
        } else if (err instanceof NotBeforeError) {
            return res
                .status(HTTP_RESPONSE_CODE.UNAUTHORIZED)
                .json(new ApiResponse(false, HTTP_RESPONSE_CODE.UNAUTHORIZED, 'Token not yet active'));
        } else {
            return res
                .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
                .json(new ApiResponse(false, HTTP_RESPONSE_CODE.SERVER_ERROR, 'Internal server error'));
        }
    }
};
