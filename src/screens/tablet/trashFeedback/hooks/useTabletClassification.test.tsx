/// <reference types="jest" />

import React from 'react';

import { act, create } from 'react-test-renderer';

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
const handleCompleted = jest.fn();

const TestComponent = (): React.JSX.Element => {
  const { classificationErrorMessage } = useTabletClassification({
    clientId: 'test-client',
    isActive: true,
    onCompleted: handleCompleted,
  });

  return React.createElement('Text', null, classificationErrorMessage);
};

describe('useTabletClassification', (): void => {
  beforeEach((): void => {
    jest.spyOn(console, 'error').mockImplementation((): void => undefined);
    jest.spyOn(console, 'warn').mockImplementation((): void => undefined);
    jest.useFakeTimers();
    jest.mocked(getTabletClassification).mockResolvedValue(WAITING_RESPONSE);
  });

  afterEach((): void => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('30초 동안 분류가 완료되지 않으면 안내 문구를 표시한다', async (): Promise<void> => {
    let testRenderer: ReturnType<typeof create> | undefined;

    await act(async (): Promise<void> => {
      testRenderer = create(React.createElement(TestComponent));
    });

    await act(async (): Promise<void> => {
      jest.advanceTimersByTime(30000);
    });

    expect(testRenderer?.toJSON()).toMatchObject({
      children: ['인식 시간이 초과됐어요. 다시 시도해 주세요.'],
    });

    act((): void => {
      testRenderer?.unmount();
    });
  });
});
