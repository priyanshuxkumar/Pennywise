import { BarChart3, User, Home, DollarSign } from 'lucide-react';

export const navigationItems = [
    {
        icon: <Home size={20} />,
        title: 'Home',
        link: '/',
    },
    {
        icon: <BarChart3 size={20} />,
        title: 'Dashboard',
        link: '/dashboard',
    },
    {
        icon: <DollarSign size={20} />,
        title: 'Entry',
        link: '/entry',
    },
    {
        icon: <User size={20} />,
        title: 'Profile',
        link: '/profile',
    },
];
