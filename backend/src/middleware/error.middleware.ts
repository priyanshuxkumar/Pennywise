import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { ZodError } from 'zod';
import { HTTP_RESPONSE_CODE } from '../constant';

export const error = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`Error occurred: ${req.method} ${req.path}`, err);

    let statusCode = HTTP_RESPONSE_CODE.SERVER_ERROR;
    let message = 'Internal Server Error';

    // Custom ApiError
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Zod Validation Error
    else if (err instanceof ZodError) {
        statusCode = HTTP_RESPONSE_CODE.BAD_REQUEST;
        message = 'Validation Error';
    }
    // Database Errors
    else if (err.code === '23505') {
        statusCode = HTTP_RESPONSE_CODE.CONFLICT;
        message = 'Duplicate entry found';
    } else if (err.code === '23503') {
        statusCode = HTTP_RESPONSE_CODE.BAD_REQUEST;
        message = 'Foreign key constraint failed';
    } else if (err.message && err.message.includes('not found')) {
        statusCode = HTTP_RESPONSE_CODE.NOT_FOUND;
        message = 'Record not found';
    }

    // JWT Errors
    else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = HTTP_RESPONSE_CODE.UNAUTHORIZED;
        message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    }

    // Native Error
    else if (err instanceof Error) {
        message = err.message;
    } 

    else {
        message = 'Something went wrong'
    }

    return res.status(statusCode).json({
        status: 'error',
        message,
        statusCode,
    });
};
