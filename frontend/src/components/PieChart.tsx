import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CategoriesProps } from './Dashboard';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import { SERVER_URL } from '../utils/env';
import ErrorCard from './Error';
import NoDataFound from './NoDataFound';

const COLORS = ['#a259f7', '#ff5a5f', '#feb72b', '#0077f7'];

const SpendingPieChart = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<CategoriesProps[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError('');

                const res = await fetch(`${SERVER_URL}/api/analytics/categories`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!res.ok) {
                    throw new Error(`Error fetching data: ${res.status} ${res.statusText}`);
                }

                const data = await res.json();
                setData(data.data);
            } catch (err: unknown) {
                console.error('Error fetching categories data:', err);
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <Loader strokeWidth="2" size="3" />;
    }

    if (error) {
        return <ErrorCard error={error} />;
    }

    if (!data || data.length === 0) {
        return (
            <NoDataFound
                message="No spending data available"
                description="Add some transactions to see your spending categories"
            />
        );
    }

    return (
        <div className="border px-3 py-3 rounded-2xl border-slate-200 dark:border-neutral-700 w-full md:w-2/3 h-fit">
            <h2 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Spending Categories</h2>
            <div className="rounded-xl bg-white shadow-sm border border-black/5 dark:bg-neutral-900 dark:border-white/10 p-4 sm:p-5">
                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="amount"
                                nameKey="category"
                                label={({ category, amount }) => `${category}: ${amount}`}
                            >
                                {data.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [`$${value}`, 'Amount']}
                                labelFormatter={(label) => `Category: ${label}`}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SpendingPieChart;
