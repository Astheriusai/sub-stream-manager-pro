
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from './services/authService';
import type { AuthState, User } from './types/auth';

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { session, user } = await authService.getSession();
        setSession(session);
        setUser(user);
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error, user, session } = await authService.signIn(email, password);
    
    if (!error && user && session) {
      setUser(user);
      setSession(session);
    }
    
    return { error };
  };

  const signUp = async (name: string, email: string, password: string) => {
    return await authService.signUp(name, email, password);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
