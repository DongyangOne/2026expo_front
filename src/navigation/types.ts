import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Quiz: undefined;
  Feedback: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  MobileTabs: NavigatorScreenParams<RootTabParamList> | undefined;
  Signup: undefined;
  SignupComplete: undefined;
  Terms: { onAgree: () => void } | undefined;
  TabletMain: undefined;
  TabletLogin: undefined;
  TabletSignup: undefined;
  TabletReport: undefined;
  TabletTrashFeedback: undefined;
};
