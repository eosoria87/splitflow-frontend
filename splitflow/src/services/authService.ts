const API_URL = import.meta.env.VITE_API_URL;

// ── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  session: AuthSession;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ── Service ──────────────────────────────────────────────────────────────────

const authService = {
  async signup(payload: SignUpPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? 'Signup failed');
    }

    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? 'Login failed');
    }

    return data;
  },

  async googleAuth(): Promise<{ url: string }> {
    const response = await fetch(`${API_URL}/api/auth/google`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? 'Google auth failed');
    return data;
  },

  async getMe(accessToken: string): Promise<AuthUser> {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? 'Failed to get user');
    return data.user;
  },
};

export default authService;
