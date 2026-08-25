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
 * 401 재발급/로그아웃은 axios 인터셉터가 이미 처리하므로 여기서는 성공/실패만 다룬다.
 */
export const useDashboard = (): UseDashboardResult => {
  const [data, setData] = useState<MyDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const latestRequestIdRef = useRef(0);

  const fetchDashboard = useCallback(() => {
    const requestId = latestRequestIdRef.current + 1;
    latestRequestIdRef.current = requestId;

    setIsLoading(true);
    setIsError(false);

    getMyDashboard()
      .then((response) => {
        if (requestId !== latestRequestIdRef.current) return;
        setData(response.data);
        setIsError(false);
      })
      .catch(() => {
        if (requestId !== latestRequestIdRef.current) return;
        setIsError(true);
      })
      .finally(() => {
        if (requestId !== latestRequestIdRef.current) return;
        setIsLoading(false);
      });
  }, []);

  useFocusEffect(fetchDashboard);

  return { data, isLoading, isError, refetch: fetchDashboard };
};
