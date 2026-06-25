import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../api/endpoints';

export type Role = 'PACIENTE' | 'MEDICO' | 'ADMIN';

export interface User {
  id: number;
  role: Role;
  nombre: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('hospital_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password?: string) => {
    const pwd = password || '123456';
    const response = await api.auth.login({ identifier, password: pwd });
    const userData = { id: response.id, role: response.role, nombre: response.nombre, token: response.token };
    setUser(userData);
    localStorage.setItem('hospital_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hospital_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
