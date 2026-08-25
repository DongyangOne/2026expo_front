import type { WrongQuizInfo } from './dashboard.types';

export interface QuizSessionRequest {
  quantity: number;
  wrongQuizInfo?: WrongQuizInfo;
}

export interface QuizSessionData {
  sessionId: string;
  quizId: number;
  question: string;
}
