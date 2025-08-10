import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, signup as apiSignup } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // You might decode user info from token or fetch it

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // In a real app, you'd decode the token or fetch user data here
      // For now, we'll just assume a user is logged in if a token exists
      setUser({ email: 'Authenticated User' }); 
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const data = await apiLogin(credentials);
      if (data.token) {
        setToken(data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error or server unavailable' };
    }
  };

  const signup = async (userData) => {
    try {
      const data = await apiSignup(userData);
      if (data.message) {
        // Assuming success message indicates successful signup
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Network error or server unavailable' };
    }
  };

  const logout = () => {
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};