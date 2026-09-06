const GUIDANCE_MESSAGE_BY_CODE = new Map<string, string>([
  ['EMPTY_CONTENTS', '내용물을 비워주세요.'],
  ['WEIGHT_ANOMALY', '내용물을 비우고 다시 시도해 주세요.'],
  ['FOREIGN_MATERIAL', '이물질을 제거해 주세요.'],
  ['REMOVE_LABEL', '라벨을 제거해 주세요.'],
  ['COMPRESS', '용기를 압축해 주세요.'],
]);

export const getGuidanceMessage = (guidanceCode: string | null | undefined): string | undefined => {
  return guidanceCode ? GUIDANCE_MESSAGE_BY_CODE.get(guidanceCode) : undefined;
};
