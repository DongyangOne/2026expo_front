import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_SESSION_STORAGE_KEY = 'adminSession';

export const clearAdminSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  } catch {
    return;
  }
};
