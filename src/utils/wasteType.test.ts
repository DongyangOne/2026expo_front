/// <reference types="jest" />

import { getWasteTypeLabel } from './wasteType';

describe('wasteType', (): void => {
  it.each([
    ['CAN', '캔'],
    ['PAPER', '종이'],
    ['GLASS', '유리병'],
  ])('%s 코드를 한글로 변환한다', (wasteType, expectedLabel): void => {
    expect(getWasteTypeLabel(wasteType)).toBe(expectedLabel);
  });

  it('미지의 영문 코드를 화면에 노출하지 않는다', (): void => {
    expect(getWasteTypeLabel('UNKNOWN_TYPE')).toBe('분리배출 품목');
  });
});
