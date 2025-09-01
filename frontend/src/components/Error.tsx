import { TriangleAlert } from 'lucide-react';

const ErrorCard = ({ error }: { error: string}) => {
    return (
        <div className="border px-3 py-3 rounded-2xl border-slate-200 dark:border-neutral-700 w-full md:w-2/3 h-fit">
            <h2 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Spending Categories</h2>
            <div className="rounded-xl bg-white shadow-sm border border-black/5 dark:bg-neutral-900 dark:border-white/10 p-4 sm:p-5">
                <div className="flex flex-col items-center justify-center h-80 text-center">
                    <div className="text-red-500 mb-2">
                        <TriangleAlert size={40} />
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
};

export default ErrorCard;
