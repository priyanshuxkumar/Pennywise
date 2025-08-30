import { Router } from 'express';
import {
    destroyTransaction,
    generateTransaction,
    getTransactions,
    transaction,
    updateTransaction,
} from './transaction.controller';
import { validateRequestBody } from '../../middleware/validation.middleware';
import { CreateTransactionSchema, TransactionParseSchema, UpdateTransactionSchema } from './transaction.schema';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.route('/parse').post(authMiddleware, validateRequestBody(TransactionParseSchema), generateTransaction);
router.route('/').post(authMiddleware, validateRequestBody(CreateTransactionSchema), transaction);
router.route('/').get(authMiddleware, getTransactions);
router.route('/:id').put(authMiddleware, validateRequestBody(UpdateTransactionSchema), updateTransaction);
router.route('/:id').delete(authMiddleware, destroyTransaction);

export const transactionRouter = router;
