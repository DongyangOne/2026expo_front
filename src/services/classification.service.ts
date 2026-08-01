import type { ApiResponse, TabletClassificationData } from '@/types';

import instance from './instance';

export const getTabletClassification = async (
  clientId: string,
): Promise<ApiResponse<TabletClassificationData>> => {
  const response = await instance.get<ApiResponse<TabletClassificationData>>(
    `/api/v1/tablet/classifications/${clientId}`,
  );

  return response.data;
};
