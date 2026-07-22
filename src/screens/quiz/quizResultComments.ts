const ENCOURAGEMENT_COMMENTS = [
  '조금만 더 집중하면 정답에 가까워져요 🔥',
  '아직 괜찮아요! 다음 문제는 꼭 맞혀봐요 😊',
  '분리수거 고수까지 한 걸음 남았어요 👀',
  '헷갈릴 땐 재질 표시를 다시 확인해보세요!',
  '아쉽지만 실력이 점점 늘고 있어요 💪',
  '환경 지킴이 레벨업에 도전 중! 🌱',
  '이번엔 틀렸지만 경험치는 쌓였어요 🌿',
  '다시 도전하면 더 잘할 수 있어요 😄',
  '분리배출 마스터는 반복 연습에서 시작됩니다 😎',
  '조금 더 공부해서 지구를 지켜봐요 🌍',
  '거의 다 왔어요! 한 번 더 도전해봐요 ✨',
  '다음 문제는 분명 정답일 거예요 🙌',
];

const PRAISE_COMMENTS = [
  '완벽해요! 진짜 분리수거 박사네요 🏆',
  '정답입니다! 환경 지킴이 인정 🌱',
  '대단해요! 정확하게 알고 있었네요 👏',
  '센스 최고! 올바르게 분리했어요 😆',
  '지구가 고마워하고 있어요 🌍',
  '분리배출 실력이 엄청난데요? 🔥',
  '아주 좋아요! 오늘도 환경 보호 성공 💚',
  '정답! 이제 거의 전문가 수준이에요 😎',
  '멋져요! 올바른 습관이 지구를 바꿔요 ✨',
  '클리어! 친환경 능력치 상승 ⬆',
  '최고예요! 분리수거 마스터에 한 발짝 더 👑',
  '완전 정답! 환경 사랑이 느껴져요 🍃',
];

const PRAISE_RATIO_THRESHOLD = 0.8;

export const getRandomResultComment = (correctCount: number, totalCount: number): string => {
  const isPraiseWorthy = totalCount > 0 && correctCount / totalCount >= PRAISE_RATIO_THRESHOLD;
  const pool = isPraiseWorthy ? PRAISE_COMMENTS : ENCOURAGEMENT_COMMENTS;
  return pool[Math.floor(Math.random() * pool.length)];
};
