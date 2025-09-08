import React, { useCallback, useEffect, useState } from 'react';
import type { TransactionDataProps } from '../utils/types';
import { SERVER_URL } from '../utils/env';
import { TransactionContext } from '../hooks/useTransaction';

interface TransactionProviderProp {
    children: React.ReactNode;
}

export interface TransactionContextType {
    transactions: TransactionDataProps[];

    isLoading: boolean;

    setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;

    setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;

    error: string;

    handleDelete: (id: string) => void;
    handleEdit: (data: TransactionDataProps) => void;
    addTransaction: (newT: TransactionDataProps) => void;
}

export const TransactionProvider: React.FC<TransactionProviderProp> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [transactions, setTransactions] = useState<TransactionDataProps[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [error, setError] = useState<string>('Error occured on loaoidn');

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch(`${SERVER_URL}/api/transactions?stDate=${startDate}&enDate=${endDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error(`Error fetching: ${res.statusText}`);
            }
            const data = await res.json();
            setTransactions(data.data);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while parsing';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [endDate, startDate]);

    const handleEdit = async (form: TransactionDataProps) => {
        try {
            const res = await fetch(`${SERVER_URL}/api/transactions/${form.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ description: form.description ,amount: Number(form.amount), currency: form.currency }),
            });
            const data = await res.json();
            const updated = data.data;
            setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        } catch (err: unknown) {
            console.log(err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${SERVER_URL}/api/transactions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await res.json();
            const deletedTransactionId = data.data;
            setTransactions((prev) => prev.filter((t) => t.id != deletedTransactionId));
        } catch (err: unknown) {
            console.log(err);
        }
    };

    const addTransaction = (newT: TransactionDataProps) => {
        setTransactions((prev) => [newT, ...prev]);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const value = {
        transactions,
        isLoading,
        handleDelete,
        handleEdit,
        setStartDate,
        setEndDate,
        addTransaction,
        error,
    };
    return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};
