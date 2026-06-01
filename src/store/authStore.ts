import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { User } from '@/types';

interface AuthState {
  // 상태
  user: User | null;
  isLoading: boolean;
  // 액션
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isLoading: false,

    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
  })),
);
