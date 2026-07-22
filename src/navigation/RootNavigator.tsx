import React from 'react';
import { useWindowDimensions } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import SplashScreen from '@/screens/SplashScreen';
import FeedbackdetailScreen from '@/screens/FeedbackdetailScreen';
import FindIdScreen from '@/screens/FindIdScreen';
import FindIdSuccessScreen from '@/screens/FindIdSuccessScreen';
import FindIdResultScreen from '@/screens/FindIdResultScreen';
import LoginScreen from '@/screens/Login';
import TabletMain from '@/screens/tablet/TabletMain';
import TabletLogin from '@/screens/tablet/TabletLogin';
import TabletReport from '@/screens/tablet/TabletReport';
import TabletSignup from '@/screens/tablet/TabletSignup';
import FindPasswordScreen from '@/screens/FindPasswordScreen';
import FindPasswordSuccessScreen from '@/screens/FindPasswordSuccessScreen';
import ResetPasswordScreen from '@/screens/ResetPasswordScreen';
import ResetPasswordSuccessScreen from '@/screens/ResetPasswordSuccessScreen';
import TabNavigator from './TabNavigator';
import TabletTrashFeedbackScreen from '@/screens/tablet/TabletTrashFeedbackScreen';

import type { RootStackParamList } from './types';
import EditProfileScreen from '@/screens/EditProfileScreen';
import UserAuthScreen from '@/screens/UserAuthScreen';
import DeleteAccountScreen from '@/screens/DeleteAccountScreen';
import DeleteCompleteScreen from '@/screens/DeleteCompleteScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const TABLET_MIN_DP = 600;

const RootNavigator = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = Math.min(width, height) >= TABLET_MIN_DP;

  return (
    <Stack.Navigator
      initialRouteName={isTablet ? 'TabletMain' : 'Splash'}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MobileTabs" component={TabNavigator} />
      <Stack.Screen name="TabletMain" component={TabletMain} />
      <Stack.Screen name="TabletLogin" component={TabletLogin} />
      <Stack.Screen name="TabletSignup" component={TabletSignup} />
      <Stack.Screen name="TabletReport" component={TabletReport} />
      <Stack.Screen name="FindId" component={FindIdScreen} />
      <Stack.Screen name="FindIdSuccess" component={FindIdSuccessScreen} />
      <Stack.Screen name="FindIdResult" component={FindIdResultScreen} />
      <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
      <Stack.Screen name="FindPasswordSuccess" component={FindPasswordSuccessScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="ResetPasswordSuccess" component={ResetPasswordSuccessScreen} />
      <Stack.Screen name="TabletTrashFeedback" component={TabletTrashFeedbackScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <Stack.Screen name="DeleteComplete" component={DeleteCompleteScreen} />
      <Stack.Screen name="FeedbackDetail" component={FeedbackdetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="UserAuth" component={UserAuthScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
