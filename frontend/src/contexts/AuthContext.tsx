'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '@/services/auth';

// Types
interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  type: string;
  status: string;
  must_change_password?: boolean;
  permissions?: string[];
  organization?: {
    id: string;
    name: string;
    cnpj?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface LoginResult {
  user: User;
  token: string;
  mustChangePassword: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, userType?: 'internal' | 'external', turnstileToken?: string) => Promise<LoginResult>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// Actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN'; payload: { token: string } }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    case 'REFRESH_TOKEN':
      return {
        ...state,
        token: action.payload.token,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('ordoc_token');
        if (token) {
          // Validate token and get user data
          const userData = await authService.validateToken(token);
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: userData, token },
          });
        }
      } catch (error) {
        // Token is invalid, remove it
        localStorage.removeItem('ordoc_token');
        dispatch({ type: 'LOGIN_FAILURE' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, userType: 'internal' | 'external' = 'internal', turnstileToken?: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authService.login(email, password, userType, turnstileToken);
      console.log('🔍 Login response:', response);
      
      const { user, token } = response;
      console.log('👤 User data:', user);
      console.log('🔐 Must change password:', user.must_change_password);
      
      // Store token in localStorage
      localStorage.setItem('ordoc_token', token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
      
      // Always redirect to transition page for proper flow control
      // The transition page will handle the password change check
      console.log('🔄 Redirecting to transition page for flow control...');
      return { user, token, mustChangePassword: user.must_change_password || false };
    } catch (error) {
      console.error('❌ Login error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('ordoc_token');
    dispatch({ type: 'LOGOUT' });
  };

  const refreshToken = async () => {
    try {
      const currentToken = state.token || localStorage.getItem('ordoc_token');
      if (!currentToken) throw new Error('No token available');
      
      const newToken = await authService.refreshToken(currentToken);
      localStorage.setItem('ordoc_token', newToken);
      
      dispatch({
        type: 'REFRESH_TOKEN',
        payload: { token: newToken },
      });
    } catch (error) {
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
