import { getRemainingSeconds } from './verificationCode';

const DEFAULT_SECONDS = 5 * 60;
const NOW = new Date('2026-09-06T00:00:00.000Z').getTime();

describe('getRemainingSeconds', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('정상 범위의 만료 시각이면 남은 초를 그대로 반환한다', () => {
    expect(getRemainingSeconds('2026-09-06T00:03:00.000Z', DEFAULT_SECONDS)).toBe(180);
  });

  it('이미 지난 만료 시각이면 기본 시간을 반환한다', () => {
    expect(getRemainingSeconds('2026-09-05T23:55:00.000Z', DEFAULT_SECONDS)).toBe(DEFAULT_SECONDS);
  });

  it('기본 시간보다 큰 값(타임존 어긋남)이면 기본 시간을 반환한다', () => {
    expect(getRemainingSeconds('2026-09-06T09:00:00.000Z', DEFAULT_SECONDS)).toBe(DEFAULT_SECONDS);
  });

  it('파싱할 수 없는 값이면 기본 시간을 반환한다', () => {
    expect(getRemainingSeconds('', DEFAULT_SECONDS)).toBe(DEFAULT_SECONDS);
  });
});
