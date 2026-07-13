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
  MobileTabs: NavigatorScreenParams<RootTabParamList> | undefined;
  TabletMain: undefined;
  TabletLogin: undefined;
  TabletSignup: undefined;
  TabletReport: undefined;
  TabletTrashFeedback: undefined;
};
