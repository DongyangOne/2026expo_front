import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

import { STORAGE_KEYS } from '@/constants';

const DETECTION_TRIGGER_TIMEOUT_SECONDS = 19;
const DETECTION_TRIGGER_REQUEST_TIMEOUT_MS = 20000;

const getEnvironmentHardwareBaseUrl = (): string => {
  const hardwareBaseUrl = Config.HARDWARE_BASE_URL?.replace(/\/$/, '');

  if (!hardwareBaseUrl) {
    throw new Error('HARDWARE_BASE_URL 환경 변수가 설정되지 않았습니다.');
  }

  return hardwareBaseUrl;
};

export const normalizeHardwareBaseUrl = (value: string): string => {
  const trimmedValue = value.trim();

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmedValue);
  } catch {
    throw new Error('http:// 또는 https://로 시작하는 주소를 입력해 주세요.');
  }

  if (
    !['http:', 'https:'].includes(parsedUrl.protocol) ||
    !parsedUrl.hostname ||
    parsedUrl.pathname !== '/' ||
    parsedUrl.search ||
    parsedUrl.hash ||
    parsedUrl.username ||
    parsedUrl.password
  ) {
    throw new Error('http:// 또는 https://로 시작하는 주소를 입력해 주세요.');
  }

  return `${parsedUrl.protocol}//${parsedUrl.host}`;
};

export const getHardwareBaseUrl = async (): Promise<string> => {
  const storedHardwareBaseUrl = await AsyncStorage.getItem(STORAGE_KEYS.HARDWARE_BASE_URL);

  if (storedHardwareBaseUrl) {
    console.warn('[hardware.service] 저장된 하드웨어 주소 사용', {
      hardwareBaseUrl: storedHardwareBaseUrl,
    });
    return storedHardwareBaseUrl;
  }

  const environmentHardwareBaseUrl = getEnvironmentHardwareBaseUrl();
  console.warn('[hardware.service] 환경변수 하드웨어 주소 사용', {
    hardwareBaseUrl: environmentHardwareBaseUrl,
  });
  return environmentHardwareBaseUrl;
};

export const saveHardwareBaseUrl = async (value: string): Promise<string> => {
  const normalizedHardwareBaseUrl = normalizeHardwareBaseUrl(value);

  await AsyncStorage.setItem(STORAGE_KEYS.HARDWARE_BASE_URL, normalizedHardwareBaseUrl);
  const savedHardwareBaseUrl = await AsyncStorage.getItem(STORAGE_KEYS.HARDWARE_BASE_URL);

  console.warn('[hardware.service] 하드웨어 주소 저장 완료', {
    inputValue: value,
    normalizedHardwareBaseUrl,
    savedHardwareBaseUrl,
  });

  return normalizedHardwareBaseUrl;
};

export const triggerDetection = async (): Promise<unknown> => {
  const hardwareBaseUrl = await getHardwareBaseUrl();
  const response = await axios.post<unknown>(`${hardwareBaseUrl}/detect-trigger`, null, {
    params: {
      timeout: DETECTION_TRIGGER_TIMEOUT_SECONDS,
    },
    timeout: DETECTION_TRIGGER_REQUEST_TIMEOUT_MS,
  });

  return response.data;
};

export const captureAndClassify = async (clientId: string): Promise<unknown> => {
  const hardwareBaseUrl = await getHardwareBaseUrl();
  const response = await axios.post<unknown>(
    `${hardwareBaseUrl}/capture-and-classify`,
    {
      client_id: clientId,
    },
    {
      timeout: DETECTION_TRIGGER_REQUEST_TIMEOUT_MS,
    },
  );

  return response.data;
};
