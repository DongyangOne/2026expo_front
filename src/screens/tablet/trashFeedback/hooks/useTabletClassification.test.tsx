/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import { getTabletClassification } from '@/services';
import type { ApiResponse, TabletClassificationData } from '@/types';

import useTabletClassification from './useTabletClassification';

jest.mock('@/services', () => ({
  getTabletClassification: jest.fn(),
}));
jest.mock('react-native-css-interop', () => ({
  createInteropElement: jest.requireActual('react').createElement,
}));

const WAITING_RESPONSE: ApiResponse<TabletClassificationData> = {
  success: true,
  code: 'SUCCESS',
  message: '',
  data: {
    clientId: 'test-client',
    completed: false,
    status: 'WAITING',
    message: null,
    level: null,
    earnedExp: null,
    totalExp: null,
    userCharacterId: null,
    characterId: null,
    characterName: null,
    characterImageUrl: null,
    evolutionStage: null,
    beforeLevel: null,
    beforeExp: null,
    currentLevel: null,
    currentExp: null,
    levelUp: false,
    maxExp: null,
    expPercent: null,
    remainingExp: null,
  },
};
const COMPLETED_RESPONSE: ApiResponse<TabletClassificationData> = {
  ...WAITING_RESPONSE,
  data: {
    ...WAITING_RESPONSE.data,
    completed: true,
    status: 'ALLOWED',
    wasteType: 'CAN',
  },
};
const handleCompleted = jest.fn();

describe('useTabletClassification', (): void => {
  beforeEach((): void => {
    jest.spyOn(console, 'error').mockImplementation((): void => undefined);
    jest.spyOn(console, 'warn').mockImplementation((): void => undefined);
    jest.useFakeTimers();
    handleCompleted.mockClear();
    jest.mocked(getTabletClassification).mockReset();
    jest.mocked(getTabletClassification).mockResolvedValue(WAITING_RESPONSE);
  });

  afterEach((): void => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('30초 동안 분류가 완료되지 않으면 안내 문구를 표시한다', async (): Promise<void> => {
    const { result } = await renderHook(() =>
      useTabletClassification({
        clientId: 'test-client',
        isActive: true,
        onCompleted: handleCompleted,
      }),
    );

    await act(async (): Promise<void> => {
      jest.advanceTimersByTime(30000);
    });

    expect(result.current.classificationErrorMessage).toBe(
      '인식 시간이 초과됐어요. 다시 시도해 주세요.',
    );
  });

  it('일시적인 조회 실패는 폴링을 중단하지 않는다', async (): Promise<void> => {
    jest
      .mocked(getTabletClassification)
      .mockRejectedValueOnce(new Error('network error'))
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValue(COMPLETED_RESPONSE);

    const { result } = await renderHook(() =>
      useTabletClassification({
        clientId: 'test-client',
        isActive: true,
        onCompleted: handleCompleted,
      }),
    );

    await act(async (): Promise<void> => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.classificationErrorMessage).toBeNull();

    await act(async (): Promise<void> => {
      jest.advanceTimersByTime(1000);
    });

    expect(handleCompleted).toHaveBeenCalledWith(COMPLETED_RESPONSE.data);
    expect(result.current.classificationErrorMessage).toBeNull();
  });

  it('연속 3회 조회에 실패하면 안내 문구를 표시한다', async (): Promise<void> => {
    jest.mocked(getTabletClassification).mockRejectedValue(new Error('network error'));

    const { result } = await renderHook(() =>
      useTabletClassification({
        clientId: 'test-client',
        isActive: true,
        onCompleted: handleCompleted,
      }),
    );

    await act(async (): Promise<void> => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.classificationErrorMessage).toBeNull();

    await act(async (): Promise<void> => {
      jest.advanceTimersByTime(1000);
    });

    expect(getTabletClassification).toHaveBeenCalledTimes(3);
    expect(result.current.classificationErrorMessage).toBe('분류 결과를 불러오지 못했어요.');
  });
});
