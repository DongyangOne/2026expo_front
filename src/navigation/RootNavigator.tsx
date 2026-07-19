import React from 'react';
import { useWindowDimensions } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FeedbackdetailScreen from '@/screens/FeedbackdetailScreen';
import FindIdScreen from '@/screens/FindIdScreen';
import FindIdSuccessScreen from '@/screens/FindIdSuccessScreen';
import FindIdResultScreen from '@/screens/FindIdResultScreen';

import TabletMain from '@/screens/tablet/TabletMain';
import TabletLogin from '@/screens/tablet/TabletLogin';
import TabletReport from '@/screens/tablet/TabletReport';
import TabletSignup from '@/screens/tablet/TabletSignup';
import TabNavigator from './TabNavigator';
import TabletTrashFeedbackScreen from '@/screens/tablet/TabletTrashFeedbackScreen';

import type { RootStackParamList } from './types';
import EditProfileScreen from '@/screens/EditProfileScreen';
import UserAuthScreen from '@/screens/UserAuthScreen';
import LoginScreen from '@/screens/LoginScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const TABLET_MIN_DP = 600;

const RootNavigator = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = Math.min(width, height) >= TABLET_MIN_DP;

  return (
    <Stack.Navigator
      initialRouteName={isTablet ? 'TabletLogin' : 'MobileTabs'}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MobileTabs" component={TabNavigator} />
      <Stack.Screen name="TabletMain" component={TabletMain} />
      <Stack.Screen name="TabletLogin" component={TabletLogin} />
      <Stack.Screen name="TabletSignup" component={TabletSignup} />
      <Stack.Screen name="TabletReport" component={TabletReport} />
      <Stack.Screen name="FindId" component={FindIdScreen} />
      <Stack.Screen name="FindIdSuccess" component={FindIdSuccessScreen} />
      <Stack.Screen name="FindIdResult" component={FindIdResultScreen} />
      <Stack.Screen name="TabletTrashFeedback" component={TabletTrashFeedbackScreen} />
      <Stack.Screen name="FeedbackDetail" component={FeedbackdetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="UserAuth" component={UserAuthScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
