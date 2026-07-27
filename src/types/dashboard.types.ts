// 실기기 확인 결과 evolutionStage는 문자열 enum이 아니라 숫자(1=알 단계부터 시작)로 내려온다.
export type EvolutionStage = number;

export type WasteType =
  | 'PLASTIC'
  | 'CAN'
  | 'PAPER'
  | 'VINYL'
  | 'GLASS'
  | 'BATTERY'
  | 'FLUORESCENT'
  | 'STYROFOAM';

export interface CharacterInfo {
  characterId: number;
  characterName: string;
  imageUrl: string;
  evolutionStage: EvolutionStage;
}

export interface QuizProfileInfo {
  correctQuiz: number;
  solvedQuiz: number;
}

export interface RecyclingLogInfo {
  wasteType: WasteType;
  recycledAt: string;
}

export interface MyDashboardData {
  characterInfo: CharacterInfo;
  quizProfileInfo: QuizProfileInfo;
  recyclingLogInfo: RecyclingLogInfo[];
}
