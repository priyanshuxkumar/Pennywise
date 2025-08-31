import { User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from './UserProvider';
import Loader from './Loader';
import { navigationItems } from '../utils/constant';

export default function Sidebar() {
    const location = useLocation();
    const { user, isLoading } = useUser();
    return (
        <div className="h-screen w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-neutral-900 flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-neutral-900">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pennywise</h1>
            </div>
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navigationItems.map((item) => {
                        const isActive = location.pathname === item.link;
                        return (
                            <li key={item.title}>
                                <Link
                                    to={item.link}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200
                                        ${
                                            isActive
                                                ? 'bg-blue-100 dark:bg-neutral-900 text-blue-700 dark:text-white'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-900'
                                        }
                                    `}
                                >
                                    <div
                                        className={`${
                                            isActive ? 'text-black dark:text-white' : 'text-black dark:text-white'
                                        }`}
                                    >
                                        {item.icon}
                                    </div>
                                    {item.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-neutral-900">
                {isLoading ? (
                    <div className="flex items-center justify-center h-12">
                        <Loader strokeWidth="2" size="30" />
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="user-avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <User size={16} className="text-white dark:text-black" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user?.email || 'user@example.com'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
