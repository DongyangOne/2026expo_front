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
  Login: undefined;
  Tabs: NavigatorScreenParams<RootTabParamList>;
  FeedbackDetail: { id: number };
  MobileTabs: NavigatorScreenParams<RootTabParamList> | undefined;
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
  FindIdSuccess: undefined;
  FindIdResult: { userId: string };
  TabletTrashFeedback: undefined;
  EditProfile: {
    email: string;
  };
  UserAuth: undefined;
};
