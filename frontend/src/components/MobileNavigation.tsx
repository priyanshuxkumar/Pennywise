import { Link, useLocation } from 'react-router-dom';
import { navigationItems } from '../utils/constant';

export function MobileBottomNav() {
    const location = useLocation();

    return (
        <nav
            aria-label="Primary"
            className="sm:hidden fixed inset-x-0 bottom-0 z-50
              border-t border-gray-200 dark:border-neutral-800
              bg-white/90 dark:bg-neutral-900/90 backdrop-blur
            "
        >
            <ul className="mx-auto max-w-md grid grid-cols-3 gap-2 px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+8px)]">
                {navigationItems.map((item) => {
                    const isActive = location.pathname === item.link;
                    return (
                        <li key={item.title}>
                            <Link
                                to={item.link}
                                className={`flex flex-col items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                                    isActive
                                        ? 'bg-gray-100 text-blue-600 dark:bg-neutral-800 dark:text-blue-400'
                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                                }`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <div
                                    className={`h-5 w-5 transition-colors duration-150 ${
                                        isActive
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100'
                                    }`}
                                >
                                    {item.icon}
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
