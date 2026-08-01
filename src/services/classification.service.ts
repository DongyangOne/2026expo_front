import axios from 'axios';
import Config from 'react-native-config';

import type { ApiResponse, TabletClassificationData } from '@/types';

import instance from './instance';

export const requestHardwareClassification = async (clientId: string): Promise<void> => {
  const hardwareBaseUrl = Config.API_HARDWARE_URL?.replace(/\/$/, '');

  if (!hardwareBaseUrl) {
    throw new Error('API_HARDWARE_URL 환경 변수가 설정되지 않았습니다.');
  }

  await axios.post(`${hardwareBaseUrl}/capture-and-classify`, { clientId });
};

export const getTabletClassification = async (
  clientId: string,
): Promise<ApiResponse<TabletClassificationData>> => {
  const response = await instance.get<ApiResponse<TabletClassificationData>>(
    `/api/v1/tablet/classifications/${clientId}`,
  );

  return response.data;
};
