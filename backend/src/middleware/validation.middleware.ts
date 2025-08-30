import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { HTTP_RESPONSE_CODE } from '../constant';

export function validateRequestBody<T extends z.ZodTypeAny>(schema: T) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const parsed = schema.parse(req.body);
            req.body = parsed;
            next();
        } catch (err: unknown) {
            if (err instanceof ZodError) {
                const errorMessages = err.issues.map((issue) => ({
                    [issue.path.join('.')]: `${issue.message}`,
                }));

                res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({
                    message: 'Validation failed',
                    error: errorMessages,
                });
                return;
            } else {
                res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({
                    message: 'Something went wrong',
                });
            }
        }
    };
}
