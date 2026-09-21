import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { getMyDashboard } from '@/services';
import type { MyDashboardData } from '@/types';

interface UseDashboardResult {
  data: MyDashboardData | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * 홈 대시보드(GET /api/v1/user/me) 조회.
 * 홈 탭은 하단 탭 전환 시 언마운트되지 않으므로, 마운트 시 1회가 아니라
 * 홈 탭에 포커스될 때마다(예: 퀴즈 풀고 돌아왔을 때) 다시 불러온다.
 * 이때 한 번이라도 데이터를 받아둔 뒤라면 로딩/에러 상태를 갱신하지 않고 조용히 다시 불러온다.
 * 전체 화면 스피너나 에러 화면으로 바뀌면 스크롤 위치가 초기화되고 이미 보고 있던 정보가 사라지기 때문이다.
 * 401 재발급/로그아웃은 axios 인터셉터가 이미 처리하므로 여기서는 성공/실패만 다룬다.
 */
export const useDashboard = (): UseDashboardResult => {
  const [data, setData] = useState<MyDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const latestRequestIdRef = useRef(0);
  const hasLoadedOnceRef = useRef(false);

  const fetchDashboard = useCallback(() => {
    const requestId = latestRequestIdRef.current + 1;
    latestRequestIdRef.current = requestId;

    const isBackgroundRefetch = hasLoadedOnceRef.current;

    if (!isBackgroundRefetch) {
      setIsLoading(true);
      setIsError(false);
    }

    getMyDashboard()
      .then((response) => {
        if (requestId !== latestRequestIdRef.current) return;
        hasLoadedOnceRef.current = true;
        setData(response.data);
        setIsError(false);
      })
      .catch(() => {
        if (requestId !== latestRequestIdRef.current || isBackgroundRefetch) return;
        setIsError(true);
      })
      .finally(() => {
        if (requestId !== latestRequestIdRef.current || isBackgroundRefetch) return;
        setIsLoading(false);
      });
  }, []);

  useFocusEffect(fetchDashboard);

  return { data, isLoading, isError, refetch: fetchDashboard };
};
