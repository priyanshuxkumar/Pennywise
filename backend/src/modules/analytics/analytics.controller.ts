import { Request, Response, NextFunction } from 'express';
import { getSummary, getTxnInCategories, getTxnInTrends } from '../../utils/analytics';
import { HTTP_RESPONSE_CODE } from '../../constant';
import { ApiResponse } from '../../utils/ApiResponse';

const summary = async (_req: Request, _res: Response, _next: NextFunction) => {
    const userId = _req.id;
    try {
        const summary = await getSummary(userId);
        return _res
            .status(HTTP_RESPONSE_CODE.SUCCESS)
            .json(new ApiResponse(true, HTTP_RESPONSE_CODE.SUCCESS, summary, 'Summary fetched successfully'));
    } catch (err: unknown) {
        _next(err);
    }
};

const categories = async (_req: Request, _res: Response, _next: NextFunction) => {
    const userId = _req.id;
    try {
        const txn = await getTxnInCategories(userId);
        return _res
            .status(HTTP_RESPONSE_CODE.SUCCESS)
            .json(
                new ApiResponse(
                    true,
                    HTTP_RESPONSE_CODE.SUCCESS,
                    txn,
                    'Transactions by categories fetched successfully',
                ),
            );
    } catch (err: unknown) {
        _next(err);
    }
};

const trends = async (_req: Request, _res: Response, _next: NextFunction) => {
    const userId = _req.id;
    try {
        const txns = await getTxnInTrends(userId);
        return _res
            .status(HTTP_RESPONSE_CODE.SUCCESS)
            .json(
                new ApiResponse(
                    true,
                    HTTP_RESPONSE_CODE.SUCCESS,
                    txns,
                    'Transactions by trends fetched successfully',
                ),
            );
    } catch (err: unknown) {
        _next(err);
    }
};

export { summary, categories, trends };
