import { createContext, useContext  } from 'react';
import type { UserContextType } from '../context/user.context';

export const UserContext = createContext<UserContextType | null>(null);

export function useUser() {
    const context = useContext(UserContext);
    if (context === null) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
