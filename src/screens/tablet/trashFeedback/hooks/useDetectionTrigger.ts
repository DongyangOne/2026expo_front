import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import { triggerDetection } from '@/services';

const DETECTION_TRIGGER_FALLBACK_MESSAGE = '쓰레기 감지에 실패했어요. 다시 시도해 주세요.';
const DETECTION_TIMEOUT_MESSAGE =
  '무게를 감지하지 못했어요.\n 다음을 눌러 계속하거나 다시 시도해 주세요.';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isDetectionCompleted = (response: unknown): boolean => {
  if (typeof response === 'string') {
    const status = response.trim();
    return (
      !/(timeout|timed.?out|failed|failure|not.?detected|시간.?초과|실패|미감지)/i.test(status) &&
      /success|detected|completed|complete|ok|감지|완료/i.test(status)
    );
  }

  if (!isRecord(response)) {
    return false;
  }

  const responseData = isRecord(response.data) ? response.data : response;
  const success = response.success ?? responseData.success;
  const completed = response.completed ?? responseData.completed;
  const detected = response.detected ?? responseData.detected;
  const statusText = [
    response.status,
    response.state,
    response.result,
    response.message,
    responseData.status,
    responseData.state,
    responseData.result,
    responseData.message,
  ]
    .filter((value): value is string => typeof value === 'string')
    .join(' ')
    .trim();

  if (
    success === false ||
    completed === false ||
    detected === false ||
    /(timeout|timed.?out|failed|failure|not.?detected|시간.?초과|실패|미감지)/i.test(statusText)
  ) {
    return false;
  }

  if (success === true || completed === true || detected === true) {
    return true;
  }

  return /success|detected|completed|complete|ok|감지|완료/i.test(statusText);
};

interface UseDetectionTriggerResult {
  detectionErrorMessage: string | null;
  retryDetection: () => void;
}

interface UseDetectionTriggerParams {
  isActive: boolean;
  onSuccess: () => void;
}

const useDetectionTrigger = ({
  isActive,
  onSuccess,
}: UseDetectionTriggerParams): UseDetectionTriggerResult => {
  const [retryCount, setRetryCount] = useState(0);
  const [detectionErrorMessage, setDetectionErrorMessage] = useState<string | null>(null);

  const retryDetection = useCallback((): void => {
    setDetectionErrorMessage(null);
    setRetryCount((currentRetryCount) => currentRetryCount + 1);
  }, []);

  useEffect((): (() => void) | undefined => {
    if (!isActive) {
      return undefined;
    }

    let isCancelled = false;
    console.warn('[분류 흐름 6] 하드웨어 감지 트리거 요청 시작');

    void triggerDetection()
      .then((response: unknown): void => {
        if (isCancelled) {
          return;
        }

        console.warn('[분류 흐름 7] 하드웨어 감지 트리거 응답 수신', { response });

        if (!isDetectionCompleted(response)) {
          // 무게가 가벼운 물건은 센서가 놓칠 수 있어 사용자가 다음 단계로 우회할 수 있다.
          console.warn('[분류 흐름 실패 - 무게 감지 미완료]', { response });
          setDetectionErrorMessage(DETECTION_TIMEOUT_MESSAGE);
          return;
        }

        onSuccess();
      })
      .catch((error: unknown): void => {
        if (isCancelled) {
          return;
        }

        console.error('[분류 흐름 실패 - 하드웨어 감지 트리거]', {
          error,
          response: axios.isAxiosError(error) ? error.response?.data : undefined,
          status: axios.isAxiosError(error) ? error.response?.status : undefined,
        });
        setDetectionErrorMessage(DETECTION_TRIGGER_FALLBACK_MESSAGE);
      });

    return (): void => {
      isCancelled = true;
    };
  }, [isActive, onSuccess, retryCount]);

  return {
    detectionErrorMessage,
    retryDetection,
  };
};

export default useDetectionTrigger;
