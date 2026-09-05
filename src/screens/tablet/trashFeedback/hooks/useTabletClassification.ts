import { useCallback, useEffect, useState } from 'react';

import { getTabletClassification } from '@/services';
import type { TabletClassificationData } from '@/types';

const CLASSIFICATION_POLL_INTERVAL_MS = 1000;
const CLASSIFICATION_TIMEOUT_MS = 30000;
const CLASSIFICATION_MAX_CONSECUTIVE_FAILURE_COUNT = 3;
const CLASSIFICATION_ERROR_MESSAGE = '분류 결과를 불러오지 못했어요.';
const CLASSIFICATION_TIMEOUT_MESSAGE = '인식 시간이 초과됐어요. 다시 시도해 주세요.';

interface UseTabletClassificationResult {
  classificationResult: TabletClassificationData | null;
  classificationErrorMessage: string | null;
  resetClassification: () => void;
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

  const resetClassification = useCallback((): void => {
    setClassificationResult(null);
    setClassificationErrorMessage(null);
  }, []);

  useEffect((): (() => void) | undefined => {
    if (!isActive) {
      return undefined;
    }

    let isCancelled = false;
    let hasTimedOut = false;
    let pollTimerId: ReturnType<typeof setTimeout> | undefined;
    let consecutiveFailureCount = 0;

    const scheduleNextPoll = (classificationClientId: string): void => {
      pollTimerId = setTimeout((): void => {
        void fetchClassificationResult(classificationClientId);
      }, CLASSIFICATION_POLL_INTERVAL_MS);
    };

    const fetchClassificationResult = async (classificationClientId: string): Promise<void> => {
      try {
        const response = await getTabletClassification(classificationClientId);

        if (isCancelled || hasTimedOut) {
          return;
        }

        if (!response.success) {
          throw new Error(response.message);
        }

        consecutiveFailureCount = 0;

        // 백엔드 스펙상 결과가 없거나 아직 완료되지 않은 경우에만 WAITING을 내려주므로
        // status를 완료 판정의 유일한 기준으로 사용한다.
        if (response.data.status !== 'WAITING') {
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
        scheduleNextPoll(classificationClientId);
      } catch (error: unknown) {
        if (isCancelled || hasTimedOut) {
          return;
        }

        consecutiveFailureCount += 1;
        console.error('[useTabletClassification] 분류 결과 조회 실패', {
          consecutiveFailureCount,
          error,
        });

        // 키오스크 환경에서는 순간적인 네트워크 끊김이 잦으므로
        // 연속 실패가 임계값에 도달하기 전까지는 폴링을 이어간다.
        if (consecutiveFailureCount >= CLASSIFICATION_MAX_CONSECUTIVE_FAILURE_COUNT) {
          clearTimeout(timeoutTimerId);
          setClassificationErrorMessage(CLASSIFICATION_ERROR_MESSAGE);
          return;
        }

        scheduleNextPoll(classificationClientId);
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

        clearTimeout(timeoutTimerId);
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
  }, [clientId, isActive, onCompleted]);

  return {
    classificationResult,
    classificationErrorMessage,
    resetClassification,
  };
};

export default useTabletClassification;
