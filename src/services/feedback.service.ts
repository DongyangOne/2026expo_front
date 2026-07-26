import type { ApiResponse, FeedbackListData, FeedbackDetailData, PageRequest } from '@/types';

import instance from './instance';

export const getFeedbackList = async (
  pageRequest: PageRequest,
): Promise<ApiResponse<FeedbackListData>> => {
  const response = await instance.get<ApiResponse<FeedbackListData>>('/api/v1/feedback', {
    params: pageRequest,
  });

  return response.data;
};

export const getFeedbackDetail = async (
  feedbackId: number,
): Promise<ApiResponse<FeedbackDetailData>> => {
  const response = await instance.get<ApiResponse<FeedbackDetailData>>(
    `/api/v1/feedback-detail/${feedbackId}`,
  );

  return response.data;
};
