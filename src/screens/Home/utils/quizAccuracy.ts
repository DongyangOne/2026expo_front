// TODO: 화면 계획서는 "최근 세션" 정답률을 요구하지만 API는 누적값(correctQuiz/solvedQuiz)만
// 제공함 — 필요 시 PM 확인, 현재는 누적으로 표시.
export const computeAccuracyPercent = (correctQuiz: number, solvedQuiz: number): number => {
  if (solvedQuiz <= 0) return 0;

  return Math.round((correctQuiz / solvedQuiz) * 100);
};
