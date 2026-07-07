import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AdminLoginData } from '@/types';

const ADMIN_SESSION_STORAGE_KEY = 'adminSession';

export const saveAdminSession = async (adminLoginData: AdminLoginData): Promise<void> => {
  try {
    await AsyncStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(adminLoginData));
  } catch {
    return;
  }
};

export const getAdminSession = async (): Promise<AdminLoginData | null> => {
  try {
    const adminSession = await AsyncStorage.getItem(ADMIN_SESSION_STORAGE_KEY);

    if (!adminSession) {
      return null;
    }

    return JSON.parse(adminSession) as AdminLoginData;
  } catch {
    return null;
  }
};

export const clearAdminSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  } catch {
    return;
  }
};
