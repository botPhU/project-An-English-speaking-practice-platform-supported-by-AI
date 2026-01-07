import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';
import { socketService } from '../services/socketService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Auto-load user from token on mount
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await authService.getCurrentUser();
                    const loadedUser = {
                        id: String(response.data.id),
                        name: response.data.full_name || response.data.user_name,
                        email: response.data.email,
                        role: response.data.role as 'admin' | 'learner' | 'mentor'
                    } as User;
                    setUser(loadedUser);

                    // Connect to Socket.IO and emit online status
                    socketService.connect();
                    socketService.emitUserOnline(loadedUser.id);
                } catch (error) {
                    console.error('Failed to load user:', error);
                    localStorage.removeItem('accessToken');
                }
            }
            setLoading(false);
        };
        loadUser();

        // Cleanup on unmount
        return () => {
            socketService.disconnect();
        };
    }, []);

    const login = (user: User, token: string) => {
        setUser(user);
        localStorage.setItem('accessToken', token);

        // Connect to Socket.IO and notify user is online
        socketService.connect();
        socketService.emitUserOnline(user.id);
    };

    const logout = () => {
        // Notify server user is offline before disconnecting
        if (user) {
            socketService.emitUserOffline(user.id);
        }
        socketService.disconnect();

        setUser(null);
        localStorage.removeItem('accessToken');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
