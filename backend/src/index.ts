import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { transactionRouter } from './modules/transaction/transaction.route';
import { authRouter } from './modules/auth/auth.route';
import { corsOptions } from './config';
import { analyticsRouter } from './modules/analytics/analytics.route';
import { error } from './middleware/error.middleware';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send('Express server is running...');
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// routes
app.use('/auth', authRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/analytics', analyticsRouter);

// Error handling middleware
app.use(error);

export default app;
