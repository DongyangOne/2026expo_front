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
  beforeLevel: number;
  beforeExp: number;
  currentLevel: number;
  currentExp: number;
  levelUp: boolean;
  maxExp: number;
  expPercent: number;
  remainingExp: number;
  userCharacterId: number;
  characterId: number;
  characterName: string;
  characterImageUrl: string;
  evolutionStage: number;
}
