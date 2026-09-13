import axios from 'axios';

export const NETWORK_ERROR_MESSAGE = '네트워크 연결을 확인한 후 다시 시도해 주세요.';

export interface ApiErrorDetails {
  status?: number;
  code?: string;
  data?: unknown;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly data?: unknown;

  constructor(message: string, details: ApiErrorDetails = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = details.status;
    this.code = details.code;
    this.data = details.data;
  }
}

// 응답을 받지 못한 경우(연결 끊김·타임아웃)에는 인터셉터가 AxiosError를
// 그대로 넘기므로, 'Network Error' 같은 내부 문구가 노출되지 않도록 걸러낸다.
export const isNetworkError = (error: unknown): boolean =>
  axios.isAxiosError(error) && !error.response;

// 서버 오류를 ApiError로 전달하므로 화면에서는 필요할 때 code와 status도 함께 확인할 수 있다.
export const getServerMessage = (error: unknown): string | null => {
  if (isNetworkError(error) || !(error instanceof Error)) {
    return null;
  }

  const message = error.message.trim();

  return message.length > 0 ? message : null;
};

export const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData;
    }

    if (responseData !== undefined && responseData !== null) {
      const serializedResponse = JSON.stringify(responseData);

      if (serializedResponse) {
        return serializedResponse;
      }
    }

    if (error.response?.status) {
      return `HTTP ${error.response.status}`;
    }

    return error.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};
