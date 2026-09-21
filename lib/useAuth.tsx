'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 
  | 'ir_partner' 
  | 'sales_director' 
  | 'ciso_secops' 
  | 'equity_analyst' 
  | 'other';

export type TeamSize = '1-10' | '11-50' | '51-200' | '200+';

export interface WatchpostAuthUser {
  isLoggedIn: boolean;
  userEmail: string;
  workspaceName: string;
  userRole: UserRole;
  teamSize?: TeamSize;
  watchlist: string[];
  createdAt: string;
  lastLoginAt: string;
}

const STORAGE_KEY = 'watchpost_auth_user_session';

export const getStoredUser = (): WatchpostAuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) return null;
    const parsed = JSON.parse(item) as WatchpostAuthUser;
    if (parsed && typeof parsed.isLoggedIn === 'boolean') {
      return parsed;
    }
    return null;
  } catch (e) {
    console.error('Failed to parse watchpost auth user session:', e);
    return null;
  }
};

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('storage'));
  }
};

interface AuthContextType {
  user: WatchpostAuthUser | null;
  isLoggedIn: boolean;
  isMounted: boolean;
  login: (userData: Omit<WatchpostAuthUser, 'isLoggedIn' | 'createdAt' | 'lastLoginAt'>) => void;
  logout: () => void;
  updateWatchlist: (watchlist: string[]) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isMounted: false,
  login: () => {},
  logout: () => {},
  updateWatchlist: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WatchpostAuthUser | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = getStoredUser();
    if (stored && stored.isLoggedIn) {
      setUser(stored);
    }
  }, []);

  // Listen to cross-tab storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const updated = getStoredUser();
        setUser(updated && updated.isLoggedIn ? updated : null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userData: Omit<WatchpostAuthUser, 'isLoggedIn' | 'createdAt' | 'lastLoginAt'>) => {
    const now = new Date().toISOString();
    const fullUser: WatchpostAuthUser = {
      ...userData,
      isLoggedIn: true,
      createdAt: user?.createdAt || now,
      lastLoginAt: now,
    };
    setUser(fullUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullUser));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const logout = () => {
    setUser(null);
    logoutUser();
  };

  const updateWatchlist = (watchlist: string[]) => {
    if (!user) return;
    const updated: WatchpostAuthUser = { ...user, watchlist, lastLoginAt: new Date().toISOString() };
    setUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user?.isLoggedIn,
        isMounted,
        login,
        logout,
        updateWatchlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
