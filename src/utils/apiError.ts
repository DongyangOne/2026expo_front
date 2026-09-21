import axios from 'axios';

export const NETWORK_ERROR_MESSAGE = '네트워크 연결을 확인한 후 다시 시도해 주세요.';

// 응답을 받지 못한 경우(연결 끊김·타임아웃)에는 인터셉터가 AxiosError를
// 그대로 넘기므로, 'Network Error' 같은 내부 문구가 노출되지 않도록 걸러낸다.
export const isNetworkError = (error: unknown): boolean =>
  axios.isAxiosError(error) && !error.response;

// 인터셉터가 에러 본문의 code를 버리고 message만 남기기 때문에
// 화면에서는 이 문구를 그대로 노출하거나 키워드로 분기한다.
// (code를 그대로 전달하도록 인터셉터를 고치면 문구 의존을 제거할 수 있다.)
export const getServerMessage = (error: unknown): string | null => {
  if (isNetworkError(error) || !(error instanceof Error)) {
    return null;
  }

  const message = error.message.trim();

  return message.length > 0 ? message : null;
};
