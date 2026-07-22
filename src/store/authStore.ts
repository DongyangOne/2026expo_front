import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { Admin, AdminLoginData, User } from '@/types';

interface AuthState {
  // 상태
  user: User | null;
  admin: Admin | null;
  adminAccessToken: string | null;
  adminRefreshToken: string | null;
  isLoading: boolean;
  // 액션
  setUser: (user: User) => void;
  setAdminSession: (adminLoginData: AdminLoginData) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    admin: null,
    adminAccessToken: null,
    adminRefreshToken: null,
    isLoading: false,

    setUser: (user) => set({ user }),
    setAdminSession: (adminLoginData) =>
      set({
        admin: {
          adminLoginId: adminLoginData.adminLoginId,
          team: adminLoginData.team,
        },
        adminAccessToken: adminLoginData.adminAccessToken,
        adminRefreshToken: adminLoginData.adminRefreshToken,
      }),
    logout: () =>
      set({
        user: null,
        admin: null,
        adminAccessToken: null,
        adminRefreshToken: null,
      }),
  })),
);
