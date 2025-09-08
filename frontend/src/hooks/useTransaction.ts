import { createContext, useContext } from 'react';
import type { TransactionContextType } from '../context/transaction.context';

export const TransactionContext = createContext<TransactionContextType | null>(null);

export const useTransaction = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('Transaction must be use in transaction provider');
    }
    return context;
};