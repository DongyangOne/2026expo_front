/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import { triggerDetection } from '@/services';

import useDetectionTrigger from './useDetectionTrigger';

jest.mock('@/services', () => ({
  triggerDetection: jest.fn(),
}));

describe('useDetectionTrigger', (): void => {
  const handleSuccess = jest.fn();

  beforeEach((): void => {
    jest.mocked(triggerDetection).mockReset();
    handleSuccess.mockClear();
    jest.spyOn(console, 'error').mockImplementation((): void => undefined);
    jest.spyOn(console, 'warn').mockImplementation((): void => undefined);
  });

  afterEach((): void => {
    jest.restoreAllMocks();
  });

  it('무게 감지 타임아웃 응답에서는 촬영 단계로 넘어가지 않는다', async (): Promise<void> => {
    jest.mocked(triggerDetection).mockResolvedValue({ success: false, status: 'timeout' });

    const { result } = await renderHook(() =>
      useDetectionTrigger({ isActive: true, onSuccess: handleSuccess }),
    );

    await act(async (): Promise<void> => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(handleSuccess).not.toHaveBeenCalled();
    expect(result.current.detectionErrorMessage).toBe(
      '무게를 감지하지 못했어요. 다음을 눌러 계속하거나 다시 시도해 주세요.',
    );
  });

  it('detected가 true인 무게 감지 응답에서 촬영 단계로 넘어간다', async (): Promise<void> => {
    jest.mocked(triggerDetection).mockResolvedValue({ detected: true, weight_g: 15.8 });

    await renderHook(() => useDetectionTrigger({ isActive: true, onSuccess: handleSuccess }));

    await act(async (): Promise<void> => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(handleSuccess).toHaveBeenCalledTimes(1);
  });
});
