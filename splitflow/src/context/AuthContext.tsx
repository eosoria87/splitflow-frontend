import { useState, useEffect, type ReactNode } from 'react';
import authService, { type AuthUser, type AuthSession } from '../services/authService';
import { AuthContext } from './authContextDef';

const SESSION_KEY = 'sf_session';
const USER_KEY = 'sf_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [session, setSession] = useState<AuthSession | null>(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);

  const signup = async (payload: Parameters<typeof authService.signup>[0]) => {
    setIsLoading(true);
    try {
      const data = await authService.signup(payload);
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      setSession(data.session);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (payload: Parameters<typeof authService.login>[0]) => {
    setIsLoading(true);
    sessionStorage.clear();
    try {
      const data = await authService.login(payload);
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      setSession(data.session);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOAuth = async (accessToken: string, refreshToken: string, expiresAt: number) => {
    setIsLoading(true);
    sessionStorage.clear();
    try {
      const user = await authService.getMe(accessToken);
      const session = { access_token: accessToken, refresh_token: refreshToken, expires_at: expiresAt };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setUser(user);
      setSession(session);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signup, login, loginWithOAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
