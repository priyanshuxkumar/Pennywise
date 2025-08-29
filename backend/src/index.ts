import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Express server is running...');
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime });
});

export default app;
