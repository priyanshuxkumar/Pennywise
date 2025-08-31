import { useCallback, useEffect, useState } from 'react';
import { SERVER_URL } from '../utils/env';
import type { TransactionDataProps } from '../utils/types';

export const useTransaction = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [transactions, setTransactions] = useState<TransactionDataProps[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

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
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [endDate, startDate]);

    const handleEdit = async (id: string) => {
        try {
            const res = await fetch(`${SERVER_URL}/api/transactions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await res.json();
            const updated = data.data;
            setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
            console.log(data);
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

    return {
        isLoading,
        transactions,
        handleDelete,
        handleEdit,
        setStartDate,
        setEndDate,
        addTransaction,
    };
};
