import type { EvolutionStage } from '@/types';

// TODO: 레벨/XP/경험치 필드 BE 확인 중 (계획서: 맥스 100 시작, 200씩 증가, 프로그레스바로만 표시).
// 응답에는 아직 숫자 레벨/경험치가 없고 evolutionStage(1=알 ~ 5=초등학생 추정 순번)만 내려와
// 단계별 대표 레벨로 임시 역산한다. BE 필드가 확정되면 이 함수만 실제 level/currentXp로 교체하면 된다.
const EVOLUTION_STAGE_TO_LEVEL: Record<number, number> = {
  1: 0,
  2: 2,
  3: 5,
  4: 8,
  5: 10,
};

export interface CharacterLevelInput {
  level: number;
  currentXp: number;
}

export const mapEvolutionStageToLevelInput = (
  evolutionStage: EvolutionStage,
): CharacterLevelInput => ({
  level: EVOLUTION_STAGE_TO_LEVEL[evolutionStage] ?? 0,
  currentXp: 0,
});
