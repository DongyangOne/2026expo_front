import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Quiz: undefined;
  Feedback: undefined;
  Account: undefined;
};

/**
 * 모바일 전용 스택(MobileStack) 내부의 파라미터 타입 정의
 * 바텀탭 + 프로필편집/인증/계정삭제 화면을 포함합니다.
 */
export type MobileStackParamList = {
  MobileTabs: NavigatorScreenParams<RootTabParamList> | undefined;
  EditProfile: undefined;
  UserAuth: undefined;
  DeleteAccount: undefined;
  DeleteComplete: undefined;
};

/**
 * 루트 스택 네비게이터의 파라미터 타입 정의
 * 모바일 스택 전체와 태블릿 화면들을 등록합니다.
 */
export type RootStackParamList = {
  // 모바일
  MobileStack: NavigatorScreenParams<MobileStackParamList> | undefined;

  // 태블릿
  TabletMain: undefined;
  TabletLogin: undefined;
  TabletSignup: undefined;
  TabletReport: undefined;
  FindId: undefined;
  FindIdSuccess: undefined;
  FindIdResult: { userId: string };
  TabletTrashFeedback: undefined;
};
