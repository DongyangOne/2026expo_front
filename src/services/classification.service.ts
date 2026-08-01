import axios from 'axios';
import Config from 'react-native-config';

import type { ApiResponse, TabletClassificationData } from '@/types';

import instance from './instance';

export const requestHardwareClassification = async (clientId: string): Promise<void> => {
  const hardwareBaseUrl = Config.API_HARDWARE_URL?.replace(/\/$/, '');

  if (!hardwareBaseUrl) {
    throw new Error('API_HARDWARE_URL 환경 변수가 설정되지 않았습니다.');
  }

  const requestUrl = `${hardwareBaseUrl}/capture-and-classify`;
  const requestBody = { client_id: clientId };

  console.warn('[분류 흐름 7] 하드웨어 API 요청', { requestUrl, requestBody });

  try {
    const response = await axios.post(requestUrl, requestBody);

    console.warn('[분류 흐름 8] 하드웨어 API 응답', {
      status: response.status,
      data: response.data,
    });

    if (response.status !== 200) {
      throw new Error(`하드웨어 요청 실패: ${response.status}`);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('[분류 흐름 실패 - 하드웨어 API]', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error('[분류 흐름 실패 - 하드웨어 API]', error);
    }

    throw error;
  }
};

export const getTabletClassification = async (
  clientId: string,
): Promise<ApiResponse<TabletClassificationData>> => {
  const requestUrl = `/api/v1/tablet/classifications/${clientId}`;

  console.warn('[분류 흐름 9] 백엔드 분류 결과 조회 요청', { clientId, requestUrl });

  try {
    const response = await instance.get<ApiResponse<TabletClassificationData>>(requestUrl);

    console.warn('[분류 흐름 10] 백엔드 분류 결과 조회 응답', {
      httpStatus: response.status,
      body: response.data,
    });

    return response.data;
  } catch (error: unknown) {
    console.error('[분류 흐름 실패 - 백엔드 조회]', { clientId, error });
    throw error;
  }
};
