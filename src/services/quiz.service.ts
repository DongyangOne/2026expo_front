import type {
  ApiResponse,
  QuizAnswerData,
  QuizAnswerRequest,
  QuizResultData,
  QuizSessionData,
  QuizSessionRequest,
} from '@/types';

import apiInstance from './instance';

export const startQuizSession = (
  payload: QuizSessionRequest,
): Promise<ApiResponse<QuizSessionData>> =>
  apiInstance
    .post<ApiResponse<QuizSessionData>>('/api/v1/quiz/sessions', payload)
    .then((res) => res.data);

export const submitQuizAnswer = (
  sessionId: string,
  payload: QuizAnswerRequest,
): Promise<ApiResponse<QuizAnswerData>> =>
  apiInstance
    .post<ApiResponse<QuizAnswerData>>(`/api/v1/quiz/sessions/${sessionId}/answers`, payload)
    .then((res) => res.data);

export const finishQuizSession = (sessionId: string): Promise<ApiResponse<QuizResultData>> =>
  apiInstance
    .post<ApiResponse<QuizResultData>>(`/api/v1/quiz/sessions/${sessionId}/result`)
    .then((res) => res.data);
