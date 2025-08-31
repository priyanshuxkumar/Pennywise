import { useState } from 'react';
import Loader from './Loader';
import { ChevronDown, Edit3, Trash2 } from 'lucide-react';
import { Button } from './Button';
import TransactionFilter from './DatePicker';
import { formatRelativeDate } from '../utils/lib';
import { useTransaction } from '../hooks/useTransaction';
import type { TransactionCardProp } from '../utils/types';

const getCurrencySign = (currency: string): string => {
    const currencySigns: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        INR: '₹',
        JPY: '¥',
    };
    return currencySigns[currency.toUpperCase()] || currency;
};

const Transactions = () => {
    const { isLoading, transactions, handleDelete, handleEdit, setStartDate, setEndDate } = useTransaction();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isOpen, setIsOpen] = useState(false);
    const allFilters = ['All', ...new Set(transactions.map((item) => item.category))];
    const filteredData =
        selectedCategory === 'All' ? transactions : transactions.filter((item) => item.category === selectedCategory);

    const onFilter = (stDate: Date | null, enDate: Date | null) => {
        setStartDate(stDate);
        setEndDate(enDate);
    };

    if (isLoading) {
        return <Loader strokeWidth="2" size="3" />;
    }
    return (
        <div className="h-fit border px-3 py-3 rounded-2xl  border-slate-200 dark:border-neutral-700 w-full md:w-1/3 overflow-hidden">
            <div>
                <p className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Recent Transaction</p>
                <div className="my-3">
                    <TransactionFilter onFilter={onFilter} />
                </div>
            </div>
            <div className="space-y-2">
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="mb-3 w-full rounded-xl bg-white dark:bg-neutral-900 backdrop-blur-sm border border-black/5 dark:border-white/10 text-black dark:text-white text-left px-4 py-2 text-sm md:text-base font-medium hover:bg-gray-50 dark:hover:bg-neutral-800/80 hover:border-black/10 dark:hover:border-white/20 transition-all duration-200 ease-in-out shadow-sm shadow-black/10 flex items-center justify-between"
                    >
                        <span>{selectedCategory}</span>
                        <div className="w-6 h-6 rounded bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                            <ChevronDown
                                className={`h-3 w-3 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${
                                    isOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </div>
                    </button>

                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 z-10 mt-2 rounded-2xl bg-white dark:bg-neutral-900 backdrop-blur-sm border border-black/5 dark:border-white/10 shadow-xl shadow-black/20 overflow-hidden">
                            {allFilters.map((category, index) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                      w-full text-left px-4 py-2 text-sm md:text-base
                                      hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors
                                      ${
                                          selectedCategory === category
                                              ? 'bg-gray-100 dark:bg-neutral-800 text-black dark:text-white'
                                              : 'text-black dark:text-gray-200'
                                      }
                                      ${index === 0 ? 'rounded-t-2xl' : ''}
                                      ${
                                          index === allFilters.length - 1
                                              ? 'rounded-b-2xl'
                                              : 'border-b border-gray-200 dark:border-gray-700'
                                      }
                                    `}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="my-scrollbox max-h-124 bg-white dark:bg-neutral-900 p-4 rounded-xl overflow-y-scroll">
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filteredData.map((item) => (
                            <Card key={item.id} {...item} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const Card: React.FC<TransactionCardProp> = ({
    id,
    amount,
    currency,
    category,
    description,
    type,
    createdAt,
    onEdit,
    onDelete,
}: TransactionCardProp) => {
    return (
        <div className="rounded-xl bg-white shadow-sm px-3 py-3 transition-colors duration-300 border border-black/5 dark:bg-neutral-900 dark:border-white/10">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                    <div
                        className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-2xl bg-gray-100 dark:bg-gray-700"
                        aria-hidden="true"
                    >
                        ⌚
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                        <span
                            className="text-black dark:text-white font-semibold text-sm leading-tight truncate"
                            title={description}
                        >
                            {description}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="w-fit bg-black dark:bg-white text-white dark:text-black text-xs px-1.5 py-0.5 rounded-sm">
                                {category}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatRelativeDate(createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3">
                    <span className="font-bold text-sm text-black dark:text-white tabular-nums">
                        <span className="sr-only">Amount: </span>
                        {type == 'expense' ? '-' : ''}
                        {getCurrencySign(currency)}
                        {amount}
                    </span>

                    <div className="flex items-center gap-1">
                        <Button
                            content={<Edit3 size={16} />}
                            className="text-white hover:bg-black"
                            onClick={() => onEdit(id)}
                        />
                        <Button
                            content={<Trash2 size={16} />}
                            className="text-red-400 hover:bg-red-300/20"
                            onClick={() => onDelete(id)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
