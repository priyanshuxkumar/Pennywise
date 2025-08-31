import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CategoriesProps } from './Dashboard';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import { BarChart } from 'lucide-react';
import { SERVER_URL } from '../utils/env';

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
        return (
            <div className="border px-3 py-3 rounded-2xl border-slate-200 dark:border-neutral-700 w-full md:w-2/3 h-fit">
                <h2 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Spending Categories</h2>
                <div className="rounded-xl bg-white shadow-sm border border-black/5 dark:bg-neutral-900 dark:border-white/10 p-4 sm:p-5">
                    <div className="flex flex-col items-center justify-center h-80 text-center">
                        <div className="text-red-500 mb-2">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Failed to load spending categories</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="border px-3 py-3 rounded-2xl border-slate-200 dark:border-neutral-700 w-full md:w-2/3 h-fit">
                <h2 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Spending Categories</h2>
                <div className="rounded-xl bg-white shadow-sm border border-black/5 dark:bg-neutral-900 dark:border-white/10 p-4 sm:p-5">
                    <div className="flex flex-col items-center justify-center h-80 text-center">
                        <div className="text-gray-400 mb-2">
                           <BarChart/>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">No spending data available</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Add some transactions to see your spending categories</p>
                    </div>
                </div>
            </div>
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
