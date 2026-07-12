import React from 'react';
import { useWindowDimensions } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RootTabNavigator from './RootTabNavigator';
import EditProfileScreen from '@/screens/EditProfileScreen';
import UserAuthScreen from '@/screens/UserAuthScreen';
import TabletMain from '@/screens/tablet/TabletMain';
import TabletLogin from '@/screens/tablet/TabletLogin';
import TabletReport from '@/screens/tablet/TabletReport';
import TabletSignup from '@/screens/tablet/TabletSignup';
import TabletTrashFeedbackScreen from '@/screens/tablet/TabletTrashFeedbackScreen';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const TABLET_MIN_DP = 600;

// 모바일용 Stack: 탭 구조(RootTabNavigator) + EditProfile/UserAuth
const MobileTabs = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={RootTabNavigator} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="UserAuth" component={UserAuthScreen} />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = Math.min(width, height) >= TABLET_MIN_DP;

  return (
    <Stack.Navigator
      initialRouteName={isTablet ? 'TabletMain' : 'MobileTabs'}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MobileTabs" component={MobileTabs} />
      <Stack.Screen name="TabletMain" component={TabletMain} />
      <Stack.Screen name="TabletLogin" component={TabletLogin} />
      <Stack.Screen name="TabletSignup" component={TabletSignup} />
      <Stack.Screen name="TabletReport" component={TabletReport} />
      <Stack.Screen name="TabletTrashFeedback" component={TabletTrashFeedbackScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;