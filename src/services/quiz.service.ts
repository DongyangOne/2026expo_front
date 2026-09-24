import type {
  ApiResponse,
  QuizAnswerData,
  QuizAnswerRequest,
  QuizResultData,
  QuizSessionData,
  QuizSessionRequest,
  RetryQuizSessionData,
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

/** 기존 퀴즈 세션에서 틀린 문제만 가져와 다시풀기 세션을 시작한다. */
export const startRetrySession = (
  sessionId: string,
): Promise<ApiResponse<RetryQuizSessionData>> =>
  apiInstance
    .post<ApiResponse<RetryQuizSessionData>>(`/api/v1/quiz/sessions/${sessionId}/retry`)
    .then((res) => res.data);

/** 다시풀기 세션에서 정답을 제출하고 다음 퀴즈를 조회한다. */
export const submitRetryAnswer = (
  sessionId: string,
  payload: QuizAnswerRequest,
): Promise<ApiResponse<QuizAnswerData>> =>
  apiInstance
    .post<ApiResponse<QuizAnswerData>>(`/api/v1/quiz/retry-sessions/${sessionId}/answers`, payload)
    .then((res) => res.data);

/** 완료된 다시풀기 세션의 결과를 조회한다. */
export const finishRetrySession = (sessionId: string): Promise<ApiResponse<QuizResultData>> =>
  apiInstance
    .post<ApiResponse<QuizResultData>>(`/api/v1/quiz/retry-sessions/${sessionId}/result`)
    .then((res) => res.data);
