import { createContext } from 'react';
import type { SignUpPayload, LoginPayload, AuthUser, AuthSession } from '../services/authService';

export interface AuthContextValue {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  signup: (payload: SignUpPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
