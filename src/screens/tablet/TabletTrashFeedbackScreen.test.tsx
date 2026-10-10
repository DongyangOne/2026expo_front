/// <reference types="jest" />

import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import type { TabletClassificationData } from '@/types';

import TabletTrashFeedbackScreen from './TabletTrashFeedbackScreen';
import { useTabletClassification } from './trashFeedback';

jest.mock('./trashFeedback', () => {
  const react = jest.requireActual<typeof import('react')>('react');
  return {
    RetryGuideStep: jest.requireActual('./trashFeedback/components/RetryGuideStep').default,
    getGuidanceMessage: jest.requireActual('./trashFeedback/guidance').getGuidanceMessage,
    useTabletClassification: jest.fn(),
    useDetectionTrigger: () => ({ detectionErrorMessage: null, retryDetection: jest.fn() }),
    issueClassificationClientId: jest.fn(),
    WaitingTrashStep: ({ onNext }: { onNext: () => void }) =>
      react.createElement('Text', { onPress: onNext }, '분류 시작'),
    LoadingStep: () => react.createElement('Text', null, '기존 로딩 화면'),
    CanResultStep: () => react.createElement('Text', null, '분류 결과'),
    SuccessStep: () => react.createElement('Text', null, '성공'),
    GeneralWasteStep: () => react.createElement('Text', null, '일반 쓰레기'),
  };
});
jest.mock('@/constants', () => ({ GRADIENT_ACTIVE: { from: '#7B61FF', to: '#FF4FD8' } }));
jest.mock('@/assets/icons/x.svg', () => () => null);
jest.mock('react-native-safe-area-context', () => ({ SafeAreaView: 'View' }));
jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Defs: 'Defs',
  LinearGradient: 'LinearGradient',
  Stop: 'Stop',
  Rect: 'Rect',
}));
jest.mock('react-native-video', () => {
  const react = jest.requireActual<typeof import('react')>('react');
  return {
    __esModule: true,
    ResizeMode: { COVER: 'cover' },
    default: (props: Record<string, unknown>) => {
      react.useEffect(() => {
        mockVideoMount();
      }, []);
      return react.createElement('View', { ...props, testID: 'guide-video' });
    },
  };
});
jest.mock('react-native-css-interop', () => ({
  createInteropElement: jest.requireActual('react').createElement,
}));

const mockVideoMount = jest.fn();
let mockClassificationResult: TabletClassificationData | null = null;
const props: React.ComponentProps<typeof TabletTrashFeedbackScreen> = {
  navigation: {} as React.ComponentProps<typeof TabletTrashFeedbackScreen>['navigation'],
  route: { key: 'feedback', name: 'TabletTrashFeedback', params: { clientId: 'test-client' } },
};
const VIDEO_RESULT: TabletClassificationData = {
  clientId: 'test-client',
  completed: true,
  status: 'REJECTED',
  guideVideoUrl: 'https://example.com/guide.mp4',
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
};

const completeClassification = async (result = VIDEO_RESULT): Promise<void> => {
  await render(<TabletTrashFeedbackScreen {...props} />);
  await fireEvent.press(screen.getByText('분류 시작'));
  const calls = jest.mocked(useTabletClassification).mock.calls;
  await act(async () => {
    mockClassificationResult = result;
    calls[calls.length - 1][0].onCompleted(result);
  });
};

describe('안내 영상 준비 후 화면 전환', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockClassificationResult = null;
    jest.mocked(useTabletClassification).mockImplementation(() => ({
      classificationResult: mockClassificationResult,
      classificationErrorMessage: null,
      resetClassification: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('응답 후에도 로딩을 유지하고 준비된 같은 플레이어로 재생한다', async () => {
    await completeClassification();
    expect(screen.getByText('기존 로딩 화면')).toBeTruthy();
    expect(screen.getByTestId('guide-video', { includeHiddenElements: true }).props.paused).toBe(
      true,
    );
    const calls = jest.mocked(useTabletClassification).mock.calls;
    expect(calls[calls.length - 1][0].isActive).toBe(false);

    await fireEvent(
      screen.getByTestId('guide-video', { includeHiddenElements: true }),
      'readyForDisplay',
    );

    expect(screen.queryByText('기존 로딩 화면')).toBeNull();
    expect(screen.getByTestId('guide-video').props.paused).toBe(false);
    expect(mockVideoMount).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(15000));
    expect(screen.getByTestId('guide-video')).toBeTruthy();
    expect(screen.queryByText('동영상을 불러오지 못했어요.')).toBeNull();
  });

  it('준비 중 오류가 발생하면 로딩을 종료하고 기존 오류 안내를 보여준다', async () => {
    await completeClassification();
    await fireEvent(screen.getByTestId('guide-video', { includeHiddenElements: true }), 'error');

    expect(screen.queryByText('기존 로딩 화면')).toBeNull();
    expect(screen.getByText('동영상을 불러오지 못했어요.')).toBeTruthy();
    expect(screen.getByText('재시도')).toBeTruthy();
  });

  it('15초 동안 준비되지 않으면 오류 안내와 재시도를 제공한다', async () => {
    await completeClassification();
    await act(async () => jest.advanceTimersByTime(14999));
    expect(screen.getByText('기존 로딩 화면')).toBeTruthy();

    await act(async () => jest.advanceTimersByTime(1));
    expect(screen.queryByText('기존 로딩 화면')).toBeNull();
    expect(screen.getByText('동영상을 불러오지 못했어요.')).toBeTruthy();
  });

  it('영상 URL이 없으면 준비를 기다리지 않고 기존 안내를 보여준다', async () => {
    await completeClassification({ ...VIDEO_RESULT, guideVideoUrl: null });
    expect(screen.queryByText('기존 로딩 화면')).toBeNull();
    expect(screen.getByText('안내 동영상이 없어요.')).toBeTruthy();
    expect(mockVideoMount).not.toHaveBeenCalled();
  });

  it('인식 실패는 URL이 있어도 영상 준비를 건너뛴다', async () => {
    await completeClassification({ ...VIDEO_RESULT, status: 'NOT_DETECTED' });
    expect(screen.queryByText('기존 로딩 화면')).toBeNull();
    expect(screen.getByText('인식에 실패했어요!')).toBeTruthy();
    expect(mockVideoMount).not.toHaveBeenCalled();
  });

  it.each([
    ['ALLOWED', '분류 결과'],
    ['GENERAL_WASTE', '일반 쓰레기'],
  ] as const)('%s 결과는 기존 화면으로 바로 이동한다', async (status, label) => {
    await completeClassification({ ...VIDEO_RESULT, status });
    expect(screen.queryByText('기존 로딩 화면')).toBeNull();
    expect(screen.getByText(label)).toBeTruthy();
    expect(mockVideoMount).not.toHaveBeenCalled();
  });

  it('영상 표시 후 기존 3회 재생 제한을 유지한다', async () => {
    await completeClassification();
    await fireEvent(
      screen.getByTestId('guide-video', { includeHiddenElements: true }),
      'readyForDisplay',
    );
    await fireEvent(screen.getByTestId('guide-video'), 'end');
    await fireEvent(screen.getByTestId('guide-video'), 'end');
    await fireEvent(screen.getByTestId('guide-video'), 'end');

    expect(mockVideoMount).toHaveBeenCalledTimes(3);
    expect(screen.getByTestId('guide-video').props.paused).toBe(false);
  });
});
