/// <reference types="jest" />

import { getObjectParticle } from './koreanParticle';

describe('getObjectParticle', (): void => {
  it.each([
    ['캔', '을'],
    ['종이', '를'],
  ])('%s의 목적격 조사를 반환한다', (word, expectedParticle): void => {
    expect(getObjectParticle(word)).toBe(expectedParticle);
  });
});
