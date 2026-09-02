import type { ApiResponse, TabletClassificationData } from '@/types';

import instance from './instance';

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
