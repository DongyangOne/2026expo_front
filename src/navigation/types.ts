/**
 * 루트 탭 네비게이터의 파라미터 타입 정의
 * 새 탭을 추가할 때 여기에 먼저 타입을 등록합니다.
 */
export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Quiz: undefined;
  Feedback: undefined;
  Account: undefined;
};

/**
 * 루트 스택 네비게이터의 파라미터 타입 정의
 * 탭 전체(Tabs)와 탭 위에 쌓이는 화면들을 등록합니다.
 */
export type RootStackParamList = {
  Tabs: undefined;
  EditProfile: undefined;
  UserAuth: undefined;
  DeleteAccount: undefined;
  DeleteComplete: undefined;
};
