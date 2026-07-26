import type { ApiResponse, FeedbackListData, PageRequest } from '@/types';

import instance from './instance';

export const getFeedbackList = async (
  pageRequest: PageRequest,
): Promise<ApiResponse<FeedbackListData>> => {
  const response = await instance.get<ApiResponse<FeedbackListData>>('/api/v1/feedback', {
    params: pageRequest,
  });

  return response.data;
};
