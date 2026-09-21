const HANGUL_SYLLABLE_START_CODE = 0xac00;
const HANGUL_SYLLABLE_END_CODE = 0xd7a3;
const JONGSEONG_COUNT = 28;

export const getObjectParticle = (word: string): '을' | '를' => {
  const lastCharacter = word.trim().at(-1);

  if (!lastCharacter) {
    return '를';
  }

  const lastCharacterCode = lastCharacter.charCodeAt(0);
  const isHangulSyllable =
    lastCharacterCode >= HANGUL_SYLLABLE_START_CODE &&
    lastCharacterCode <= HANGUL_SYLLABLE_END_CODE;
  const hasFinalConsonant =
    isHangulSyllable && (lastCharacterCode - HANGUL_SYLLABLE_START_CODE) % JONGSEONG_COUNT !== 0;

  return hasFinalConsonant ? '을' : '를';
};
