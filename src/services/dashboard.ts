import type { ApiResponse, MyDashboardData } from '@/types';

import apiInstance from './instance';

export const getMyDashboard = (): Promise<ApiResponse<MyDashboardData>> =>
  apiInstance.get<ApiResponse<MyDashboardData>>('/api/v1/user/me').then((res) => res.data);
