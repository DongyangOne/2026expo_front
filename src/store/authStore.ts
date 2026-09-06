import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { STORAGE_KEYS } from '@/constants';
import type {
  Admin,
  AdminLoginData,
  AdminReissueData,
  AuthUser,
  LoginResponse,
  User,
} from '@/types';

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
  admin: Admin | null;
  adminAccessToken: string | null;
  adminRefreshToken: string | null;
  isLoading: boolean;
  isRestoring: boolean;
  // 액션
  setUser: (user: User) => void;
  setAuth: (res: LoginResponse) => void;
  persistAuth: (res: LoginResponse, rememberMe: 'Y' | 'N') => Promise<void>;
  setTokens: (tokens: AuthTokens) => void;
  restoreSession: () => Promise<boolean>;
  logout: () => Promise<void>;
  setAdminSession: (adminLoginData: AdminLoginData) => void;
  setAdminTokens: (tokens: AdminReissueData) => void;
  adminLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    authUser: null,
    accessToken: null,
    refreshToken: null,
    rememberMe: null,
    admin: null,
    adminAccessToken: null,
    adminRefreshToken: null,
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

    persistAuth: async (res, rememberMe) => {
      useAuthStore.getState().setAuth({ ...res, rememberMe });

      if (rememberMe === 'Y') {
        const { authUser } = useAuthStore.getState();

        await AsyncStorage.multiSet([
          [STORAGE_KEYS.ACCESS_TOKEN, res.accessToken],
          [STORAGE_KEYS.REFRESH_TOKEN, res.refreshToken],
          [STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser)],
        ]);
      }
    },

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

      try {
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.ACCESS_TOKEN,
          STORAGE_KEYS.REFRESH_TOKEN,
          STORAGE_KEYS.AUTH_USER,
        ]);
      } catch (err) {
        console.error('[authStore] AsyncStorage 토큰 삭제 실패:', err);
        // TODO: 에러 리포팅 도구 연동 시 여기에 추가 (예: Sentry.captureException(err))
      }
    },

    setAdminSession: (adminLoginData) =>
      set((state) => {
        state.admin = {
          adminLoginId: adminLoginData.adminLoginId,
          team: adminLoginData.team,
        };
        state.adminAccessToken = adminLoginData.adminAccessToken;
        state.adminRefreshToken = adminLoginData.adminRefreshToken;
      }),

    setAdminTokens: (tokens) =>
      set((state) => {
        state.adminAccessToken = tokens.accessToken;
        state.adminRefreshToken = tokens.refreshToken;
      }),

    adminLogout: () =>
      set((state) => {
        state.admin = null;
        state.adminAccessToken = null;
        state.adminRefreshToken = null;
      }),
  })),
);
