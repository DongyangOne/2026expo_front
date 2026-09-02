export interface QuizSessionRequest {
  quantity: number;
}

export interface QuizSessionData {
  sessionId: string;
  quizId: number;
  question: string;
}

export interface QuizAnswerRequest {
  currentQuizId: number;
  answer: string;
}

export interface QuizAnswerData {
  explan: string;
  isCorrect: boolean;
  finished: boolean;
  nextQuizId: number;
  nextQuestion: string;
}
