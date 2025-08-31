import { Check, SparklesIcon } from 'lucide-react';

function HomePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
            <header className="border-b border-gray-200 dark:border-neutral-700">
                <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
                    <a href="#" className="flex items-center gap-2">
                        <span className="font-semibold">Pennywise</span>
                    </a>
                    <nav className="hidden sm:flex items-center gap-6 text-sm">
                        <a href="#how-it-works" className="hover:text-neutral-600 dark:hover:text-neutral-400">
                            How it works
                        </a>
                        <a href="#features" className="hover:text-neutral-600 dark:hover:text-neutral-400">
                            Features
                        </a>
                        <a href="#faq" className="hover:text-neutral-600 dark:hover:text-neutral-400">
                            FAQ
                        </a>
                        <a
                            href="/dashboard"
                            className="rounded-md bg-neutral-600 dark:bg-neutral-500 px-3 py-1.5 font-medium text-white hover:bg-neutral-700 dark:hover:bg-neutral-600"
                        >
                            Open dashboard
                        </a>
                    </nav>
                </div>
            </header>

            <main>
                <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-neutral-700 px-3 py-1 text-xs text-gray-600 dark:text-gray-400">
                                <SparklesIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                AI-powered finance tracking
                            </p>
                            <h1 className="mt-4 text-3xl font-bold leading-tight text-balance md:text-4xl">
                                Type what you bought. We categorize, confirm, and keep your budget up to date.
                            </h1>
                            <p className="mt-3 text-gray-600 dark:text-gray-400">
                                Stop fighting forms. Log expenses in plain English and see your dashboard update
                                instantly.
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <a
                                    href="/dashboard"
                                    className="inline-flex items-center justify-center rounded-md bg-neutral-600 dark:bg-neutral-500 px-4 py-2.5 text-white font-medium hover:bg-neutral-700 dark:hover:bg-neutral-600"
                                >
                                    Open dashboard
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-neutral-700 px-4 py-2.5 font-medium hover:border-gray-300 dark:hover:border-neutral-600"
                                >
                                    See how it works
                                </a>
                            </div>
                            <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                                No setup needed. Works on mobile.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 shadow-sm dark:bg-neutral-800">
                            <p className="text-sm font-medium">Quick add</p>
                            <label htmlFor="nl" className="sr-only">
                                Natural language input
                            </label>
                            <input
                                id="nl"
                                defaultValue={`Bought Samsung watch $250`}
                                className="mt-2 w-full rounded-md border border-gray-300 dark:border-neutral-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-600 dark:focus:ring-neutral-400 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                                placeholder='e.g. "Coffee with team $14"'
                            />

                            <div className="mt-4 rounded-lg bg-gray-50 dark:bg-neutral-700 p-3">
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">AI parse</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <Chip label="Amount: $250" />
                                    <Chip label="Category: Electronics" />
                                    <Chip label="Vendor: Samsung" />
                                    <Chip label="Payment: Card" />
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <Check className="h-4 w-4 text-green-500" />
                                    Looks good? Confirm to save.
                                </div>
                            </div>

                            <div className="mt-4 flex gap-3">
                                <button className="flex-1 rounded-md bg-neutral-600 dark:bg-neutral-500 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:hover:bg-neutral-600">
                                    Confirm
                                </button>
                                <button className="flex-1 rounded-md border border-gray-300 dark:border-neutral-600 px-3 py-2 text-sm font-medium hover:border-gray-400 dark:hover:border-neutral-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100">
                                    Edit
                                </button>
                            </div>

                            <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                                On confirm, your dashboard cards and charts update.
                            </p>
                        </div>
                    </div>
                </section>

                <section
                    id="how-it-works"
                    className="border-t border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800"
                >
                    <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
                        <h2 className="text-xl font-semibold">Transaction Entry Flow</h2>
                        <ol className="mt-6 grid gap-4 md:grid-cols-4">
                            <Step num={1} title="Type it" desc='Write "Bought Samsung watch $250"' />
                            <Step num={2} title="AI parses" desc="Amount, category, vendor, payment" />
                            <Step num={3} title="Confirm" desc="One tap to save the transaction" />
                            <Step num={4} title="Auto-update" desc="Dashboard cards and charts refresh" />
                        </ol>
                    </div>
                </section>
            </main>

            <footer className="border-t border-gray-200 dark:border-neutral-700">
                <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} PennyWise</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-neutral-600 dark:hover:text-neutral-400">
                            Privacy
                        </a>
                        <a href="#" className="hover:text-neutral-600 dark:hover:text-neutral-400">
                            Terms
                        </a>
                        <a href="#" className="hover:text-neutral-600 dark:hover:text-neutral-400">
                            Contact
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function Chip({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center rounded-md border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-2 py-1 text-xs text-gray-700 dark:text-gray-300">
            {label}
        </span>
    );
}

function Step({ num, title, desc }: { num: number; title: string; desc: string }) {
    return (
        <li className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-600 dark:bg-neutral-500 text-xs font-semibold text-white">
                {num}
            </span>
            <div>
                <p className="font-medium">{title}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
        </li>
    );
}

export default HomePage;
