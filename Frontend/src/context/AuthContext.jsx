import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on init
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.success) {
            setUser(data.data);
            localStorage.setItem('userInfo', JSON.stringify(data.data));
            return { success: true };
        }
        return { success: false, message: data.message };
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        if (data.success) {
            setUser(data.data);
            localStorage.setItem('userInfo', JSON.stringify(data.data));
            return { success: true };
        }
        return { success: false, message: data.message };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
