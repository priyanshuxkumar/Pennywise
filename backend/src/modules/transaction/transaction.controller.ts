import { Request, Response, NextFunction } from 'express';
import { parseContent } from '../../services/ai/transaction';
import { ApiResponse } from '../../utils/ApiResponse';
import { HTTP_RESPONSE_CODE } from '../../constant';
import {
    createTransaction,
    getUserTransactions,
    removeTransactionById,
    updateTransactionById,
} from '../../lib/db/queries';
import { Transaction } from '../../lib/db/schema';
import { ApiError } from '../../utils/ApiError';

const generateTransaction = async (_req: Request, _res: Response, _next: NextFunction) => {
    try {
        const { content } = _req.body;
        const parsedTransaction = await parseContent(content);
        _res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(true, HTTP_RESPONSE_CODE.SUCCESS, parsedTransaction, 'transaction parsed successful'),
        );
    } catch (err: unknown) {
        _next(err);
    }
};

const transaction = async (_req: Request, _res: Response, _next: NextFunction) => {
    const userId = _req.id;
    try {
        const { amount, currency, type, category, description } = _req.body;
        const newTransaction: Transaction | null = await createTransaction({
            amount,
            currency,
            type,
            category,
            description,
            userId,
        });
        if (!newTransaction) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.SERVER_ERROR, 'Something went wrong while adding transaction');
        }
        _res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(true, HTTP_RESPONSE_CODE.SUCCESS, newTransaction, 'Transaction added successful'),
        );
    } catch (err: unknown) {
        _next(err);
    }
};

const getTransactions = async (_req: Request, _res: Response, _next: NextFunction) => {
    const { category, stDate, enDate } = _req.query as {
        category?: string;
        stDate?: Date | string;
        enDate?: Date | string;
    };

    const userId = _req.id;
    try {
        const transactions = await getUserTransactions(userId, category, stDate, enDate);
        _res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(true, HTTP_RESPONSE_CODE.SUCCESS, transactions, 'Transaction fetched successfully'),
        );
    } catch (err: unknown) {
        _next(err);
    }
};

const updateTransaction = async (_req: Request, _res: Response, _next: NextFunction) => {
    const userId = _req.id;
    const id = _req.params.id;
    try {
        const { amount, currency } = _req.body;
        const transactions = await updateTransactionById(id, userId, {
            amount,
            currency,
        });
        _res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(true, HTTP_RESPONSE_CODE.SUCCESS, transactions, 'Transaction updated'),
        );
    } catch (err: unknown) {
        _next(err);
    }
};

const destroyTransaction = async (_req: Request, _res: Response, _next: NextFunction) => {
    const userId = _req.id;
    const id = _req.params.id;
    try {
        const deletedTransaction = await removeTransactionById(id, userId);
        _res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(true, HTTP_RESPONSE_CODE.SUCCESS, deletedTransaction.id, 'Transaction deleted'),
        );
    } catch (err: unknown) {
        _next(err);
    }
};

export { generateTransaction, transaction, getTransactions, updateTransaction, destroyTransaction };
