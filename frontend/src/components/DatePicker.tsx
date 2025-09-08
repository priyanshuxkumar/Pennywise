import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from './Button';

interface TransactionFilterProps {
    onFilter: (start: Date | null, end: Date | null) => void;
}

export default function TransactionFilter({ onFilter }: TransactionFilterProps) {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 py-3 px-3 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800">
            <div className="flex flex-col text-sm w-full sm:w-auto">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="text-black dark:text-white w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholderText="Select start date"
                />
            </div>
            <div className="flex flex-col text-sm w-full sm:w-auto">
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="text-black dark:text-white w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholderText="Select end date"
                />
            </div>
            <Button
                onClick={() => onFilter(startDate, endDate)}
                content="Apply"
                className="w-full lg:w-fit bg-black dark:bg-white py-2 text-white dark:text-black text-xs "
            />
        </div>
    );
}
