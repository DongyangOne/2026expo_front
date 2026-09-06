/**
 * 루트 탭 네비게이터의 파라미터 타입 정의
 * 새 탭을 추가할 때 여기에 먼저 타입을 등록합니다.
 */
import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Quiz: undefined;
  Feedback: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: { qrToken?: string; loginId?: string } | undefined;
  KakaoLogin: { qrToken?: string; rememberMe?: 'Y' | 'N' } | undefined;
  NaverLogin: { qrToken?: string; rememberMe?: 'Y' | 'N' } | undefined;
  Tabs: NavigatorScreenParams<RootTabParamList>;
  FeedbackDetail: { id: number };
  MobileTabs: NavigatorScreenParams<RootTabParamList> | undefined;
  Signup:
    | {
        socialType: 'KAKAO' | 'NAVER' | 'GOOGLE';
        socialProviderId: string;
        prefillEmail: string;
        prefillUsername: string;
      }
    | undefined;
  SignupComplete: undefined;
  Terms: { onAgree: () => void } | undefined;
  DeleteAccount: undefined;
  DeleteComplete: undefined;
  TabletMain: undefined;
  TabletLogin: undefined;
  TabletSignup: undefined;
  TabletReport: undefined;
  FindPassword: undefined;
  FindPasswordSuccess: undefined;
  ResetPassword: undefined;
  ResetPasswordSuccess: undefined;
  FindId: undefined;
  FindIdSuccess: { userId: string };
  FindIdResult: { userId: string };
  TabletTrashFeedback: { clientId?: string } | undefined;
  EditProfile: undefined;

  UserAuth: undefined;
  QrLogin: { qrToken?: string };
};
