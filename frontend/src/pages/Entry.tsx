import { Bot, Check } from 'lucide-react';
import { useState } from 'react';
import Loader from '../components/Loader';
import EntryEditor from '../components/EntryEdit';
import Transactions from '../components/Transactions';
import { SERVER_URL } from '../utils/env';
import { useTransaction } from '../hooks/useTransaction';
import { v4 as uuid } from 'uuid';

export interface ParseEntryProp {
    amount: number;
    currency: string;
    type: string;
    category: string;
    description: string;
}

const Entry = () => {
    const [input, setInput] = useState<string>('');
    const [parsedInputs, setParsedInputs] = useState<ParseEntryProp[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editParsedInput, setEditParsedInput] = useState<ParseEntryProp | null>(null);

    const [error, setError] = useState<string>('');
    const { addTransaction } = useTransaction();

    const parseUserInput = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${SERVER_URL}/api/transactions/parse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ content: input }),
            });

            if (!res.ok) {
                throw new Error(`Error parsing input: ${res.statusText}`);
            }
            const data = await res.json();
            setParsedInputs(data.data);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while parsing';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const createTransaction = async (form: ParseEntryProp) => {
        console.log('up',form);
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${SERVER_URL}/api/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error(`Error creating transaction: ${res.statusText}`);
            }
            const data = await res.json();
            addTransaction(data.data);
            setParsedInputs((prev) => prev.filter(t => t.description != form.description));
            if(parsedInputs.length === 0) setInput('');
        } catch (err: unknown) {
            console.error('Error creating transaction:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (parsedInput: ParseEntryProp) => {
        setIsModalOpen(true)
        setEditParsedInput(parsedInput);
    }
    return (
        <>
            <div className="flex flex-col gap-5 md:flex-row justify-around bg-white dark:bg-black min-h-screen pt-4">
                <div>
                    <div>
                        <p className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Add transaction</p>
                    </div>

                    <TransactionEntry
                        input={input}
                        setInput={setInput}
                        onSubmit={parseUserInput}
                        isLoading={isLoading}
                        parsedInputs={parsedInputs as ParseEntryProp[]}
                        handleCreateTransaction={createTransaction}
                        handleEdit={handleEdit}
                        error={error}
                    />
                </div>

                {/* Recent transaction  */}
                <Transactions />
            </div>

            {/* Edit modal  */}
            {isModalOpen && editParsedInput && parsedInputs && (
                <EntryEditor parsedInput={editParsedInput} onSave={createTransaction} setIsOpen={setIsModalOpen} />
            )}
        </>
    );
};

function Chip({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700">
            {label}
        </span>
    );
}

function TransactionEntry({
    input,
    setInput,
    onSubmit,
    isLoading,
    parsedInputs,
    handleCreateTransaction,
    handleEdit,
    error,
}: {
    input: string;
    setInput: (value: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
    parsedInputs: ParseEntryProp[];
    handleCreateTransaction: (data: ParseEntryProp) => void;
    handleEdit: (parsedInput: ParseEntryProp) => void;
    error: string;
}) {
    return (
        <div className="w-full md:w-2xl max-w-2xl rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 p-4 shadow-sm">
            <div className="flex items-center gap-2 mt-2">
                <label htmlFor="nl" className="sr-only">
                    Natural language input
                </label>
                <input
                    id="nl"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    required
                    placeholder='e.g. "Coffee with team $14"'
                    className="w-full rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <button
                    onClick={onSubmit}
                    type="button"
                    disabled={input.trim() == ''}
                    className="flex items-center justify-center rounded-lg bg-blue-600 text-white w-10 py-2 shadow-sm hover:bg-blue-700 hover:shadow-md active:scale-95 transition"
                >
                    {isLoading ? <Loader strokeWidth="1" size="20" /> : <Bot className="w-5 h-5" />}
                </button>
            </div>

            {error && (
                <div className="mt-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                    <p className="text-sm text-red-800 dark:text-red-200 font-medium">Error</p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                </div>
            )}

            {parsedInputs.map((parsedInput) => (
                <div key={uuid()}>
                    <div key={uuid()} className="mt-4 rounded-lg bg-gray-50 dark:bg-neutral-800 p-3">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-300">AI parse</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {Object.entries(parsedInput).map(([key, value]) => {
                                const label = `${key.charAt(0).toUpperCase()}${key.slice(1)}: ${value}`;
                                return <Chip key={uuid()} label={label} />;
                            })}
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Check className="h-4 w-4 text-green-500" />
                            Looks good? Confirm to save.
                        </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={() => handleCreateTransaction(parsedInput as ParseEntryProp)}
                            disabled={input.trim() == ''}
                            className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={() => handleEdit(parsedInput)}
                            disabled={input.trim() == ''}
                            className="flex-1 rounded-md border border-gray-300 dark:border-white/10 px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-300 bg-white dark:bg-neutral-900"
                        >
                            Edit
                        </button>
                    </div>
                </div>
            ))}

            <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                On confirm, your dashboard cards and charts update.
            </p>
        </div>
    );
}
export default Entry;
