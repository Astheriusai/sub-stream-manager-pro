
import { supabase } from '../supabase';
import type { User } from '../types/auth';

export const authService = {
  signUp: async (name: string, email: string, password: string) => {
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
  },

  signIn: async (email: string, password: string) => {
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

      return { error: null, user: userData as User, session: data.session };
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { error };
    }
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { session: null, user: null };

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    if (userError) {
      console.error('Error fetching user data:', userError);
      return { session, user: null };
    }

    return { session, user: userData as User };
  }
};
