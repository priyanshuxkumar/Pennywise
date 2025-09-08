import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { TransactionProvider } from './context/transaction.context.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <TransactionProvider>
                <App />
            </TransactionProvider>
        </BrowserRouter>
    </StrictMode>,
);
