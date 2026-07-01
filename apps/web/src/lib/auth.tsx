import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from './api';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  role: string;
  betsCount?: number;
  betsWon?: number;
  profit?: number;
  roi?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function safeGetToken(): string | null {
  try { return localStorage.getItem('token'); } catch { return null; }
}
function safeSetToken(token: string) {
  try { localStorage.setItem('token', token); } catch {}
}
function safeRemoveToken() {
  try { localStorage.removeItem('token'); } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = safeGetToken();
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;

    api.get('/users/me', { timeout: 5000 })
      .then(({ data }) => { if (active) setUser(data); })
      .catch(() => { if (active) safeRemoveToken(); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    safeSetToken(data.token);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    safeSetToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    safeRemoveToken();
    setUser(null);
  };

  const refreshUser = async () => {
    const token = safeGetToken();
    if (!token) { setUser(null); return; }
    try {
      const { data } = await api.get('/users/me', { timeout: 5000 });
      setUser(data);
    } catch {
      setUser(null);
      safeRemoveToken();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
