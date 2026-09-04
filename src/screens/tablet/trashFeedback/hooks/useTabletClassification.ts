import { useCallback, useEffect, useState } from 'react';

import { getTabletClassification } from '@/services';
import type { TabletClassificationData } from '@/types';

const CLASSIFICATION_POLL_INTERVAL_MS = 1000;
const CLASSIFICATION_TIMEOUT_MS = 30000;
const CLASSIFICATION_ERROR_MESSAGE = '분류 결과를 불러오지 못했어요.';
const CLASSIFICATION_TIMEOUT_MESSAGE = '인식 시간이 초과됐어요. 다시 시도해 주세요.';

interface UseTabletClassificationResult {
  classificationResult: TabletClassificationData | null;
  classificationErrorMessage: string | null;
  resetClassification: () => void;
  retryClassification: () => void;
}

interface UseTabletClassificationParams {
  clientId: string | undefined;
  isActive: boolean;
  onCompleted: (classificationResult: TabletClassificationData) => void;
}

const useTabletClassification = ({
  clientId,
  isActive,
  onCompleted,
}: UseTabletClassificationParams): UseTabletClassificationResult => {
  const [classificationResult, setClassificationResult] = useState<TabletClassificationData | null>(
    null,
  );
  const [classificationErrorMessage, setClassificationErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const resetClassification = useCallback((): void => {
    setClassificationResult(null);
    setClassificationErrorMessage(null);
  }, []);

  const retryClassification = useCallback((): void => {
    setClassificationErrorMessage(null);
    setRetryCount((currentRetryCount) => currentRetryCount + 1);
  }, []);

  useEffect((): (() => void) | undefined => {
    if (!isActive) {
      return undefined;
    }

    let isCancelled = false;
    let hasTimedOut = false;
    let pollTimerId: ReturnType<typeof setTimeout> | undefined;

    const fetchClassificationResult = async (classificationClientId: string): Promise<void> => {
      try {
        const response = await getTabletClassification(classificationClientId);

        if (isCancelled || hasTimedOut) {
          return;
        }

        if (!response.success) {
          throw new Error(response.message);
        }

        if (response.data.completed && response.data.status !== 'WAITING') {
          console.warn('[분류 흐름 11] 분류 완료, 결과 화면 전환', {
            clientId: classificationClientId,
            status: response.data.status,
            wasteType: response.data.wasteType,
          });
          clearTimeout(timeoutTimerId);
          setClassificationResult(response.data);
          onCompleted(response.data);
          return;
        }

        console.warn('[분류 흐름 11] 분류 대기 중, 1초 후 재조회', {
          clientId: classificationClientId,
          status: response.data.status,
          completed: response.data.completed,
        });
        pollTimerId = setTimeout((): void => {
          void fetchClassificationResult(classificationClientId);
        }, CLASSIFICATION_POLL_INTERVAL_MS);
      } catch (error: unknown) {
        if (isCancelled || hasTimedOut) {
          return;
        }

        clearTimeout(timeoutTimerId);
        console.error('[useTabletClassification] 분류 결과 조회 실패', error);
        setClassificationErrorMessage(CLASSIFICATION_ERROR_MESSAGE);
      }
    };

    const startClassification = async (): Promise<void> => {
      try {
        if (!clientId) {
          throw new Error('clientId가 없습니다.');
        }

        console.warn('[분류 흐름 6] 로딩 화면 진입, 분류 결과 조회 시작', { clientId });
        await fetchClassificationResult(clientId);
      } catch (error: unknown) {
        if (isCancelled) {
          return;
        }

        console.error('[useTabletClassification] 감지 요청 실패', error);
        setClassificationErrorMessage(CLASSIFICATION_ERROR_MESSAGE);
      }
    };

    const timeoutTimerId = setTimeout((): void => {
      hasTimedOut = true;
      if (pollTimerId) {
        clearTimeout(pollTimerId);
      }
      console.error('[useTabletClassification] 분류 결과 조회 시간 초과');
      setClassificationErrorMessage(CLASSIFICATION_TIMEOUT_MESSAGE);
    }, CLASSIFICATION_TIMEOUT_MS);

    void startClassification();

    return (): void => {
      isCancelled = true;

      if (pollTimerId) {
        clearTimeout(pollTimerId);
      }

      clearTimeout(timeoutTimerId);
    };
  }, [clientId, isActive, onCompleted, retryCount]);

  return {
    classificationResult,
    classificationErrorMessage,
    resetClassification,
    retryClassification,
  };
};

export default useTabletClassification;
