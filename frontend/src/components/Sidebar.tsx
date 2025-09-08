import { ChevronUp, Moon, Sun, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from './UserProvider';
import Loader from './Loader';
import { navigationItems } from '../utils/constant';
import { useState } from 'react';
import { SERVER_URL } from '../utils/env';
import { useTheme } from '../hooks/useTheme';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isLoading } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const handleLogout = async () => {
        try {
            const res = await fetch(`${SERVER_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!res.ok) {
                throw new Error(`Error fetching: ${res.statusText}`);
            }
            navigate('/login');
        } catch (err: unknown) {
            console.error(err);
        }
    };

    const handleThemeChange = () => {
        setTheme(theme == 'light' ? 'dark' : 'light');
    };
    const menuButtons = [
        { onClick: handleThemeChange, button: 'Theme' },
        { onClick: handleLogout, button: 'Logout' },
    ];
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
                    <div className="relative flex items-center gap-3">
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
                            <p className="max-w-1/2 text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user?.email || 'user@example.com'}
                            </p>
                        </div>
                        <ChevronUp
                            onClick={() => setIsOpen(!isOpen)}
                            size={17}
                            className="text-black dark:text-neutral-300 cursor-pointer"
                        />

                        {isOpen && (
                            <div className="h-fit py-2 px-1 rounded-xl w-48 bg-white dark:bg-neutral-900 absolute -right-4 -top-28 flex flex-col shadow-lg border border-neutral-100 dark:border-neutral-800">
                                {menuButtons.map((btn, idx) => {
                                    const isLogout = btn.button === 'Logout';
                                    return (
                                        <button
                                            key={idx}
                                            onClick={btn.onClick}
                                            className={`${
                                                isLogout
                                                    ? 'bg-red-500/90 hover:bg-red-400 text-white'
                                                    : 'flex justify-between items-center text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-neutral-800'
                                            } text-start px-3 py-2 rounded-lg mx-1 transition-colors duration-300 text-sm font-medium cursor-pointer my-1`}
                                        >
                                            {btn.button}
                                            {btn.button == 'Theme' &&
                                                (theme === 'light' ? <Sun size={14} /> : <Moon size={14} />)}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
