import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
  status: 'active' | 'suspended';
}

interface AuthState {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: async (email, password) => {
        // In a real app, you would make an API call here
        const mockUser = {
          id: '1',
          name: 'John Doe',
          email,
          role: email.includes('admin') ? 'admin' as const : 'user' as const,
          createdAt: new Date(),
          status: 'active' as const
        };
        set({ user: mockUser });
      },
      signUp: async (name, email, password) => {
        // In a real app, you would make an API call here
        const mockUser = {
          id: Math.random().toString(36).substring(2),
          name,
          email,
          role: 'user' as const,
          createdAt: new Date(),
          status: 'active' as const
        };
        set({ user: mockUser });
      },
      signOut: () => {
        set({ user: null });
      },
      updateUserStatus: (userId, status) => {
        set((state) => ({
          user: state.user?.id === userId 
            ? { ...state.user, status }
            : state.user
        }));
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);