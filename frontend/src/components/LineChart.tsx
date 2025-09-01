import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Loader from './Loader';
import { SERVER_URL } from '../utils/env';
import ErrorCard from './Error';
import NoDataFound from './NoDataFound';

interface SpendingDataProps {
    date: string;
    month: string;
    amount: number;
}

const SpendingLineChart = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<SpendingDataProps[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const res = await fetch(`${SERVER_URL}/api/analytics/trends`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error('Please log in to view spending trends');
                } else if (res.status === 403) {
                    throw new Error('You do not have permission to view this data');
                } else if (res.status === 404) {
                    throw new Error('Analytics data not found');
                } else if (res.status >= 500) {
                    throw new Error('Server error. Please try again later');
                } else {
                    throw new Error(`Failed to load data: ${res.statusText}`);
                }
            }
            const responseData = await res.json();

            if (!responseData.data || !Array.isArray(responseData.data)) {
                throw new Error('Invalid data format received from server');
            }
            setData(responseData.data);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            console.error('Error fetching spending trends:', err);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
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
            <NoDataFound message="No Data Available" description="No spending data found for the selected period." />
        );
    }

    return (
        <div className="h-fit border px-3 py-3 rounded-2xl  border-slate-200 dark:border-neutral-700  w-full md:w-2/3">
            <h2 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Daily Spending</h2>
            <div className="rounded-xl bg-white shadow-sm border border-black/5 dark:bg-neutral-900 dark:border-white/10 p-4 sm:p-5">
                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{
                                top: 20,
                                right: 30,
                                bottom: 20,
                            }}
                        >
                            <CartesianGrid strokeDasharray="1 1" stroke="#e5e5e5" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                className="text-gray-500 dark:text-gray-400"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                className="text-gray-500 dark:text-gray-400"
                                tick={{ fontSize: 12 }}
                                domain={[0, 4]}
                                ticks={[0, 1, 2, 3, 4]}
                            />
                            <Tooltip
                                formatter={(value) => [`${value}`, 'Amount']}
                                labelFormatter={(label) => label}
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                }}
                            />
                            <Line
                                type="linear"
                                dataKey="amount"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
                                activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SpendingLineChart;
