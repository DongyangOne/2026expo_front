/// <reference types="jest" />

import { getGuidanceMessage } from './guidance';

describe('getGuidanceMessage', (): void => {
  it.each([
    ['EMPTY_CONTENTS', '내용물을 비워주세요.'],
    ['WEIGHT_ANOMALY', '내용물을 비우고 다시 시도해 주세요.'],
    ['FOREIGN_MATERIAL', '이물질을 제거해 주세요.'],
    ['REMOVE_LABEL', '라벨을 제거해 주세요.'],
    ['COMPRESS', '용기를 압축해 주세요.'],
  ])('%s 코드의 안내 문구를 반환한다', (guidanceCode, expectedMessage): void => {
    expect(getGuidanceMessage(guidanceCode)).toBe(expectedMessage);
  });

  it('미문서 코드는 처리하지 않는다', (): void => {
    expect(getGuidanceMessage('LOW_CONFIDENCE')).toBeUndefined();
  });
});
