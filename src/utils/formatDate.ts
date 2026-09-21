/**
 * 날짜 문자열을 "YYYY년 MM월 DD일" 형태로 변환
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 한국어 형식의 날짜
 */
export const formatKoreanDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
};

/**
 * 날짜 문자열을 "YYYY.MM.DD" 형태로 변환
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 점(.)으로 구분된 날짜
 */
export const formatDotDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};
