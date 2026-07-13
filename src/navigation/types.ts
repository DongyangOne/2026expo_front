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
  Signup: { agreed?: boolean } | undefined;
  SignupComplete: undefined;
  Terms: undefined;
  TabletMain: undefined;
  TabletLogin: undefined;
  TabletSignup: undefined;
  TabletReport: undefined;
};
