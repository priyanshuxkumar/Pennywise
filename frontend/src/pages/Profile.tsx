import { UserIcon, Mail, Calendar, Shield } from 'lucide-react';
import { useUser } from '../components/UserProvider';
import ErrorCard from '../components/Error';
import NoDataFound from '../components/NoDataFound';

export default function Profile() {
    const { user, error } = useUser();

    if (error) {
        return <ErrorCard error={error} />;
    }

    if (!user) {
        return <NoDataFound message="User not found" description="" />;
    }
    return (
        <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
            <section
                aria-labelledby="profile-heading"
                className="rounded-2xl bg-white dark:bg-neutral-900 ring-1 ring-gray-200 dark:ring-neutral-800 shadow-sm"
            >
                <header className="p-6 sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div
                            className="relative mx-auto size-20 rounded-full  sm:mx-0 flex items-center justify-center shadow"
                            aria-hidden="true"
                        >
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="user-avatar"
                                    className="size-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-xl font-semibold tracking-wide">{user?.name}</span>
                            )}
                            <span className="pointer-events-none absolute inset-0 rounded-full" />
                        </div>

                        <div className="text-center sm:text-left">
                            <h1
                                id="profile-heading"
                                className="text-pretty text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
                            >
                                {user?.name}
                            </h1>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                                Manage your account settings and preferences
                            </p>
                        </div>
                    </div>
                </header>

                <div className="h-px w-full bg-gray-200 dark:bg-neutral-800" />

                <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2">
                    <section aria-labelledby="info-heading" className="space-y-4">
                        <h2 id="info-heading" className="sr-only">
                            Account information
                        </h2>

                        <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/40 p-4">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-white dark:bg-neutral-800 ring-1 ring-gray-200 dark:ring-neutral-700">
                                <Mail size={18} className="text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {user?.email || 'user@example.com'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/40 p-4">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-white dark:bg-neutral-800 ring-1 ring-gray-200 dark:ring-neutral-700">
                                <Calendar size={18} className="text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Member since</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/40 p-4">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-white dark:bg-neutral-800 ring-1 ring-gray-200 dark:ring-neutral-700">
                                <Shield size={18} className="text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                                <p className="font-medium capitalize text-gray-900 dark:text-white">
                                    {user?.role || 'User'}
                                </p>
                            </div>
                        </div>
                    </section>
                    <section aria-labelledby="status-heading" className="space-y-4">
                        <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/20 p-4">
                            <h3 id="status-heading" className="mb-2 font-semibold text-blue-900 dark:text-blue-200">
                                Account status
                            </h3>
                            <div className="flex items-center gap-2">
                                <span
                                    aria-hidden="true"
                                    className={`size-2.5 rounded-full ${
                                        user?.emailVerified ? 'bg-green-500' : 'bg-gray-400 dark:bg-neutral-600'
                                    }`}
                                />
                                <span className="text-sm text-blue-900 dark:text-blue-200">
                                    {user?.emailVerified ? 'Email verified' : 'Email not verified'}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/40 p-4">
                            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Quick actions</h3>
                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    className="w-full rounded-lg border border-transparent bg-white dark:bg-neutral-800 px-3 py-2 text-left text-sm font-medium text-gray-800 dark:text-gray-100 hover:border-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
                                >
                                    Edit profile
                                </button>
                                <button
                                    type="button"
                                    className="w-full rounded-lg border border-transparent bg-white dark:bg-neutral-800 px-3 py-2 text-left text-sm font-medium text-gray-800 dark:text-gray-100 hover:border-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
                                >
                                    Change password
                                </button>
                                <button
                                    type="button"
                                    className="w-full rounded-lg border border-transparent bg-white dark:bg-neutral-800 px-3 py-2 text-left text-sm font-medium text-gray-800 dark:text-gray-100 hover:border-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
                                >
                                    Notification settings
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="px-6 pb-6 sm:px-8 sm:pb-8">
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center gap-1">
                            <UserIcon size={14} aria-hidden="true" />
                            <span className="sr-only">Profile</span>
                            Keep your information up to date for a better experience.
                        </span>
                    </div>
                </footer>
            </section>
        </main>
    );
}
