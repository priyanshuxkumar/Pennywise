import { useState } from 'react';
import { X } from 'lucide-react';
import type { ParseEntryProp } from '../pages/Entry';
import type { TransactionDataProps } from '../utils/types';

interface EntryEditor {
    parsedInput: ParseEntryProp | TransactionDataProps;
    onSave: (data: ParseEntryProp | TransactionDataProps) => void;
    setIsOpen: (value: boolean) => void;
}

export default function EntryEditor({ parsedInput, onSave, setIsOpen }: EntryEditor) {
    const [form, setForm] = useState(parsedInput);

    const handleChange = (field: string, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(form);
        setIsOpen(false);
    };

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center p-3"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-transaction-title"
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
                    <h2 id="edit-transaction-title" className="text-sm font-semibold text-gray-900 dark:text-white">
                        Edit Transaction
                    </h2>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="h-7 w-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        aria-label="Close modal"
                    >
                        <X />
                    </button>
                </div>
                <div className="px-4 py-4 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Amount</label>
                        <input
                            type="number"
                            value={form.amount}
                            onChange={(e) => handleChange('amount', e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                                Currency
                            </label>
                            <input
                                type="text"
                                value={form.currency}
                                onChange={(e) => handleChange('currency', e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="USD"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Type</label>
                            <select
                                value={form.type}
                                onChange={(e) => handleChange('type', e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Category</label>
                        <input
                            type="text"
                            value={form.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g. Groceries"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Description
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="mt-1 w-full min-h-[80px] rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Optional details…"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-neutral-800">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="rounded-md border border-gray-300 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
