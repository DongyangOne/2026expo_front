import axios from 'axios';
import Config from 'react-native-config';

const DETECTION_TRIGGER_TIMEOUT_SECONDS = 19;
const DETECTION_TRIGGER_REQUEST_TIMEOUT_MS = 20000;

const getHardwareBaseUrl = (): string => {
  const hardwareBaseUrl = Config.HARDWARE_BASE_URL?.replace(/\/$/, '');

  if (!hardwareBaseUrl) {
    throw new Error('HARDWARE_BASE_URL 환경 변수가 설정되지 않았습니다.');
  }

  return hardwareBaseUrl;
};

export const triggerDetection = async (): Promise<unknown> => {
  const hardwareBaseUrl = getHardwareBaseUrl();
  const response = await axios.post<unknown>(`${hardwareBaseUrl}/detect-trigger`, null, {
    params: {
      timeout: DETECTION_TRIGGER_TIMEOUT_SECONDS,
    },
    timeout: DETECTION_TRIGGER_REQUEST_TIMEOUT_MS,
  });

  return response.data;
};

export const captureAndClassify = async (clientId: string): Promise<unknown> => {
  const hardwareBaseUrl = getHardwareBaseUrl();
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
