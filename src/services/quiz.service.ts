import type { ApiResponse, QuizSessionData, QuizSessionRequest } from '@/types';

import apiInstance from './instance';

export const startQuizSession = (
  payload: QuizSessionRequest,
): Promise<ApiResponse<QuizSessionData>> =>
  apiInstance
    .post<ApiResponse<QuizSessionData>>('/api/v1/quiz/sessions', payload)
    .then((res) => res.data);
