// 실기기 확인 결과 evolutionStage는 문자열 enum이 아니라 숫자(1=알 단계부터 시작)로 내려온다.
export type EvolutionStage = number;

export type WasteType = 'CAN' | 'PET' | 'PAPER' | 'TRASH';

export interface CharacterInfo {
  characterId: number;
  characterName: string;
  imageUrl: string;
  evolutionStage: EvolutionStage;
  level: number;
  currentExp: number;
  remainingExp: number;
  expPercentage: number;
}

export interface QuizProfileInfo {
  correctQuiz: number;
  solvedQuiz: number;
}

export interface RecyclingLogInfo {
  wasteType: WasteType;
  recycledAt: string;
}

// 실제 구조 미확인 (현재까지 확인된 값은 null뿐) — 필드 확정되면 정확한 인터페이스로 교체.
export interface WrongQuizInfo {
  [key: string]: unknown;
}

export interface MyDashboardData {
  characterInfo: CharacterInfo;
  quizProfileInfo: QuizProfileInfo;
  recyclingLogInfo: RecyclingLogInfo[];
  wrongQuizInfo: WrongQuizInfo | null;
}
