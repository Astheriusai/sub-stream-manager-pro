
import { useEffect, useState, createContext, useContext } from 'react';
import { supabase } from './supabase';

interface User {
  id: string;
  name: string;
  email: string;
  role_id: string;
  subscriber_id: string | null;
}

interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (name: string, email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
};

const AuthContext = createContext<AuthState>(initialState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const getSession = async () => {
      setState((prev) => ({ ...prev, loading: true }));
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Get user details from our custom users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (userError) {
          console.error('Error fetching user data:', userError);
          setState((prev) => ({ 
            ...prev, 
            session,
            user: null,
            loading: false 
          }));
          return;
        }
        
        setState((prev) => ({ 
          ...prev, 
          session,
          user: userData as User,
          loading: false 
        }));
      } else {
        setState((prev) => ({ 
          ...prev, 
          session: null,
          user: null,
          loading: false 
        }));
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState((prev) => ({ ...prev, session }));
        getSession();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (name: string, email: string, password: string) => {
    try {
      // Try to get the worker role ID, but handle the case where the table might not exist yet
      const { data: workerRole, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'worker')
        .single();
        
      if (roleError) {
        console.error('Error fetching role:', roleError);
        
        // Register the user in auth without role for now
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/login',
            data: {
              name
            }
          }
        });

        if (error) {
          console.error('Signup error:', error);
          return { error };
        }

        // Since we can't add to the users table yet (no roles table), 
        // we'll just consider the signup successful at the auth level
        return { error: null };
      }

      // If we got here, the roles table exists, so continue with the original flow
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login',
          data: {
            name
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { error };
      }

      // Create entry in our custom users table
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          { 
            id: data.user?.id,
            name,
            email,
            role_id: workerRole.id,
            subscriber_id: null
          }
        ]);

      if (insertError) {
        console.error('Error creating user record:', insertError);
        return { error: insertError };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { error };
      }

      // Get user details from our custom users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (userError) {
        console.error('Error fetching user data:', userError);
        return { error: userError };
      }
      
      setState((prev) => ({ 
        ...prev, 
        session: data.session,
        user: userData as User
      }));

      return { error: null };
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setState((prev) => ({ 
      ...prev, 
      session: null,
      user: null
    }));
  };

  const value: AuthState = {
    ...state,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
