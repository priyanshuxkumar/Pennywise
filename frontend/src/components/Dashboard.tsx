import React from 'react';
import Summary from './SummaryCard';
import PieChart from './PieChart';
import Transactions from './Transactions';

export interface CategoriesProps {
    category: string;
    amount: number;
    percentage: number;
}

const Dashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                <div className="space-y-5">
                    <div className="border-b border-gray-200 pb-5 dark:border-neutral-900">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Dashboard
                        </h1>
                        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">Track your spendings</p>
                    </div>
                    {/* Spening Summary  */}
                    <div className="flex flex-col md:flex-row gap-5 justify-between w-full">
                        <Summary />
                    </div>

                    {/* Spening categories  */}
                    <div className="flex flex-col md:flex-row gap-5 justify-between w-full">
                        {/* Pie Chart  */}
                        <PieChart />
                        {/* Transaction  */}
                        <Transactions />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
