import { useMemo } from 'react';

const BASE_XP = 100;
const XP_STEP = 200;
const MAX_STAGE_LEVEL = 10;

export type CharacterStage = 'egg' | 'cracking' | 'newborn' | 'kindergarten' | 'elementary';

export const CHARACTER_STAGE_LABEL: Record<CharacterStage, string> = {
  egg: '알',
  cracking: '알에 금가기',
  newborn: '갓 태어난 냥이',
  kindergarten: '유치원생',
  elementary: '초등학생',
};

/** 레벨 N에서 다음 레벨로 올라가기 위해 필요한 총 경험치 (100으로 시작해서 200씩 증가) */
export const getRequiredXp = (level: number) => BASE_XP + XP_STEP * level;

export const getCharacterStage = (level: number): CharacterStage => {
  if (level <= 0) return 'egg';
  if (level <= 3) return 'cracking';
  if (level <= 6) return 'newborn';
  if (level <= 9) return 'kindergarten';
  return 'elementary';
};

interface UseCharacterLevelResult {
  stage: CharacterStage;
  stageLabel: string;
  requiredXp: number;
  remainingXp: number;
  progressRatio: number;
  isMaxStage: boolean;
}

/** 캐릭터 박스에서 쓰는 레벨/경험치 파생값. 맥스 경험치 수치 자체는 사용자에게 노출하지 않고 진행률(progressRatio)만 노출한다. */
export const useCharacterLevel = (level: number, currentXp: number): UseCharacterLevelResult => {
  return useMemo(() => {
    const requiredXp = getRequiredXp(level);
    const clampedXp = Math.min(Math.max(currentXp, 0), requiredXp);

    return {
      stage: getCharacterStage(level),
      stageLabel: CHARACTER_STAGE_LABEL[getCharacterStage(level)],
      requiredXp,
      remainingXp: requiredXp - clampedXp,
      progressRatio: clampedXp / requiredXp,
      isMaxStage: level >= MAX_STAGE_LEVEL,
    };
  }, [level, currentXp]);
};
