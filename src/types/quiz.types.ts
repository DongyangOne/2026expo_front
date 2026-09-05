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

export interface QuizAnswerRequest {
  currentQuizId: number;
  answer: 'O' | 'X';
}

export interface QuizAnswerData {
  explan: string;
  isCorrect: boolean;
  finished: boolean;
  nextQuizId: number;
  nextQuestion: string;
}

export interface QuizResultData {
  totalCount: number;
  correctCount: number;
  wrongCount: number;
  correctRate: number;
  earnedExp: number;
  resultMessage: string;
  currentLevel: number;
  currentExp: number;
  levelUp: boolean;
  expPercent: number;
  remainingExp: number;
  characterImageUrl: string;
}
