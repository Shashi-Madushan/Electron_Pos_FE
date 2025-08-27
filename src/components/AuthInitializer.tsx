import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const { login } = useAuth();

    useEffect(() => {
        // Check for stored authentication data when the app loads
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const userDTO = JSON.parse(storedUser);
                // Reconstruct the login response format
                const storedAuth = {
                    token,
                    userDTO,
                    statusCode: 200,
                    message: "Restored session",
                    expirationTime: "7 Days"
                };
                login(storedAuth);
            } catch (error) {
                // If there's an error parsing the stored data, clear it
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, [login]);

    return <>{children}</>;
};
