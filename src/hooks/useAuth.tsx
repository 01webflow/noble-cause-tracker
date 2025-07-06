
import { useState, useEffect } from 'react';
import { UserRole } from '@/pages/Index';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('donation_system_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string, role: UserRole = 'admin') => {
    // Mock authentication - in real app, this would validate against backend
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      role
    };
    
    setUser(mockUser);
    localStorage.setItem('donation_system_user', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('donation_system_user');
  };

  return { user, login, logout };
};
