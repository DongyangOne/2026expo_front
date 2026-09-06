import type {
  AdminFeedbackListData,
  ApiResponse,
  FeedbackDetectionData,
  FeedbackDetailData,
  FeedbackListData,
  PageRequest,
} from '@/types';

import instance from './instance';

export const createFeedbackDetection = async (): Promise<ApiResponse<FeedbackDetectionData>> => {
  const response = await instance.post<ApiResponse<FeedbackDetectionData>>(
    '/api/v1/feedback-detail/detections',
  );

  return response.data;
};

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

export const getAdminFeedbackList = async (
  pageRequest: PageRequest,
): Promise<ApiResponse<AdminFeedbackListData>> => {
  const response = await instance.get<ApiResponse<AdminFeedbackListData>>(
    '/api/v1/feedback-detail',
    {
      params: pageRequest,
    },
  );

  return response.data;
};
