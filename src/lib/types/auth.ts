
export interface User {
  id: string;
  name: string;
  email: string;
  role_id: string;
  subscriber_id: string | null;
}

export interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (name: string, email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}
