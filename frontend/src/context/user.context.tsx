import { useCallback, useEffect, useState } from 'react';
import { UserContext } from '../components/UserProvider';
import { SERVER_URL } from '../utils/env';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    emailVerified: boolean;
    role: 'admin' | 'user';
    createdAt: Date;
    updatedAt: Date;
}

export interface UserContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface UserProviderProps {
    children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch(`${SERVER_URL}/auth/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!res.ok) {
                throw new Error(`Error fetching: ${res.statusText}`);
            }
            const data = await res.json();
            setUser(data.data);
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const value: UserContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
