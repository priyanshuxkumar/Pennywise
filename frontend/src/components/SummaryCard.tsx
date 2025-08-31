import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import { SERVER_URL } from '../utils/env';

type SummaryProps = {
    label: string;
    type: string;
    value: number;
};

export const Summary: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [summaryData, setSummaryData] = useState<SummaryProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${SERVER_URL}/api/analytics/summary`, {
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
                setSummaryData(data.data);
            } catch (err: unknown) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <Loader strokeWidth="2" size="3" />;
    }
    return (
        <div className='h-fit border px-3 py-3 rounded-2xl  border-slate-200 dark:border-neutral-700  w-full md:w-1/3'>
            <div>
                <p className='font-bold text-lg mb-4 text-gray-900 dark:text-gray-100'>Spendings summary</p>
            </div>
            <div className='flex flex-col gap-4'>
            {summaryData.map((item, idx) => (
                <section
                    key={idx}
                    className="w-full rounded-xl border shadow-sm
                        bg-white border-black/5
                        dark:bg-neutral-900 dark:border-white/10
                        p-4 sm:p-5
                        flex items-center justify-between gap-4
                    "
                >
                    <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium tracking-wide uppercase text-neutral-500 dark:text-neutral-400">
                            {item.label}
                        </p>

                        <p
                            className={`mt-1 text-2xl sm:text-3xl font-semibold 
                            ${item.type == 'expense' ? 'text-red-500' : 'text-emerald-600'}
                            `}
                        >
                            ${item.value}
                        </p>
                    </div>

                    <div
                        className={`
                            flex items-center justify-center rounded-full
                            h-10 w-10 sm:h-12 sm:w-12
                            ${item.type == 'expense' ? 'bg-red-500/10' : 'bg-emerald-500/10'}
                        `}
                    >
                        {item.type.toLowerCase() == 'savings' ? (
                            <DollarSign />
                        ) : item.type == 'income' ? (
                            <TrendingUp />
                        ) : (
                            <TrendingDown color="red" />
                        )}
                    </div>
                </section>
            ))}
            </div>
        </div>
    );
};

export default Summary;
