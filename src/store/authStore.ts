import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { STORAGE_KEYS } from '@/constants';
import type { AuthUser, LoginResponse, User } from '@/types';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  // 상태
  user: User | null;
  authUser: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  rememberMe: 'Y' | 'N' | null;
  isLoading: boolean;
  isRestoring: boolean;
  // 액션
  setUser: (user: User) => void;
  setAuth: (res: LoginResponse) => void;
  setTokens: (tokens: AuthTokens) => void;
  restoreSession: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    authUser: null,
    accessToken: null,
    refreshToken: null,
    rememberMe: null,
    isLoading: false,
    isRestoring: true,

    setUser: (user) => set({ user }),

    setAuth: (res) =>
      set((state) => {
        state.authUser = {
          userId: res.userId,
          loginId: res.loginId,
          email: res.email,
          username: res.username,
          team: res.team,
        };
        state.accessToken = res.accessToken;
        state.refreshToken = res.refreshToken;
        state.rememberMe = res.rememberMe;
      }),

    setTokens: (tokens) =>
      set((state) => {
        state.accessToken = tokens.accessToken;
        state.refreshToken = tokens.refreshToken;
      }),

    restoreSession: async () => {
      try {
        const entries = await AsyncStorage.multiGet([
          STORAGE_KEYS.ACCESS_TOKEN,
          STORAGE_KEYS.REFRESH_TOKEN,
          STORAGE_KEYS.AUTH_USER,
        ]);
        const values = Object.fromEntries(entries);
        const accessToken = values[STORAGE_KEYS.ACCESS_TOKEN];
        const refreshToken = values[STORAGE_KEYS.REFRESH_TOKEN];
        const authUserJson = values[STORAGE_KEYS.AUTH_USER];

        if (!accessToken || !refreshToken) {
          return false;
        }

        const authUser = authUserJson ? (JSON.parse(authUserJson) as AuthUser) : null;

        set((state) => {
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.authUser = authUser;
          state.rememberMe = 'Y';
        });

        return true;
      } catch {
        return false;
      } finally {
        set((state) => {
          state.isRestoring = false;
        });
      }
    },

    logout: async () => {
      set((state) => {
        state.user = null;
        state.authUser = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.rememberMe = null;
      });

      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.AUTH_USER,
      ]);
    },
  })),
);
