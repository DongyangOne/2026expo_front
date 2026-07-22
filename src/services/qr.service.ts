import type { ApiResponse, QrTokenData } from '@/types';

import instance from './instance';

export const issueQrToken = async (): Promise<ApiResponse<QrTokenData>> => {
  const response = await instance.post<ApiResponse<QrTokenData>>('/api/v1/auth/qr/token');

  return response.data;
};
