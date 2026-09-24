import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { AuthState, User } from '../lib/auth/types';
import { authService } from '../lib/auth/authService';

// ── State & Actions ──────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'CLEAR_USER':
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

interface AuthContextValue {
  state: AuthState;
  setUser: (user: User) => void;
  clearUser: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Restore session on mount
  useEffect(() => {
    authService.getSession()
      .then(user => {
        if (user) dispatch({ type: 'SET_USER', payload: user });
        else      dispatch({ type: 'CLEAR_USER' });
      })
      .catch(() => dispatch({ type: 'CLEAR_USER' }));
  }, []);

  const setUser = useCallback((user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const clearUser = useCallback(() => {
    dispatch({ type: 'CLEAR_USER' });
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    dispatch({ type: 'CLEAR_USER' });
  }, []);

  return (
    <AuthContext.Provider value={{ state, setUser, clearUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
