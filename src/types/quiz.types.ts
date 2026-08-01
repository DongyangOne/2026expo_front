export interface QuizSessionRequest {
  quantity: number;
}

export interface QuizSessionData {
  sessionId: string;
  quizId: number;
  question: string;
}
