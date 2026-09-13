import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import { triggerDetection } from '@/services';
import { getApiErrorMessage } from '@/utils';

const DETECTION_TRIGGER_FALLBACK_MESSAGE = '감지 준비에 실패했어요. 다시 시도해 주세요.';

interface UseDetectionTriggerResult {
  detectionErrorMessage: string | null;
  isTriggering: boolean;
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
  const [isTriggering, setIsTriggering] = useState(isActive);
  const [detectionErrorMessage, setDetectionErrorMessage] = useState<string | null>(null);

  const retryDetection = useCallback((): void => {
    setIsTriggering(true);
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
        if (!isCancelled) {
          console.warn('[분류 흐름 7] 하드웨어 감지 트리거 응답 수신', { response });
          setIsTriggering(false);
          onSuccess();
        }
      })
      .catch((error: unknown): void => {
        if (isCancelled) {
          return;
        }

        const errorMessage = getApiErrorMessage(error, DETECTION_TRIGGER_FALLBACK_MESSAGE);

        console.error('[분류 흐름 실패 - 하드웨어 감지 트리거]', {
          message: errorMessage,
          response: axios.isAxiosError(error) ? error.response?.data : undefined,
          status: axios.isAxiosError(error) ? error.response?.status : undefined,
        });
        setIsTriggering(false);
        setDetectionErrorMessage(errorMessage);
      });

    return (): void => {
      isCancelled = true;
    };
  }, [isActive, onSuccess, retryCount]);

  return {
    detectionErrorMessage,
    isTriggering,
    retryDetection,
  };
};

export default useDetectionTrigger;
