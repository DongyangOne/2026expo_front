/**
 * 인증번호 만료 시각(expiredAt)으로 남은 초를 구한다.
 *
 * 서버가 타임존 오프셋 없는 시각('2026-09-06T00:44:50')을 내려주면 기기 로컬 시간으로
 * 해석되어 실제와 몇 시간씩 어긋난다. 그래서 계산 결과가 정상 범위(0초 초과 ~ 기본 시간 이하)를
 * 벗어나면 서버 값을 신뢰하지 않고 기본 시간을 사용한다.
 */
export const getRemainingSeconds = (expiredAt: string, defaultSeconds: number): number => {
  const remaining = Math.round((new Date(expiredAt).getTime() - Date.now()) / 1000);

  if (!Number.isFinite(remaining) || remaining <= 0 || remaining > defaultSeconds) {
    return defaultSeconds;
  }

  return remaining;
};
