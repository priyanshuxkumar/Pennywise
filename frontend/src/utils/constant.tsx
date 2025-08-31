import { BarChart3, User, DollarSign } from 'lucide-react';

export const navigationItems = [
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
