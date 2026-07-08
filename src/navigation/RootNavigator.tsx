import React from 'react';
import { useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '@/screens/Home';
import SearchScreen from '@/screens/SearchScreen';
import QuizScreen from '@/screens/QuizScreen';
import FeedbackScreen from '@/screens/FeedbackScreen';
import AccountScreen from '@/screens/AccountScreen';
import TabletMain from '@/screens/tablet/TabletMain';
import TabletLogin from '@/screens/tablet/TabletLogin';
import TabletReport from '@/screens/tablet/TabletReport';
import TabletSignup from '@/screens/tablet/TabletSignup';
import TabletTrashFeedbackScreen from '@/screens/tablet/TabletTrashFeedbackScreen';

import type { RootStackParamList, RootTabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const TABLET_MIN_DP = 600;

// TODO: 다른 브랜치에서 작업 중인 하단 네비게이션 바 머지 후 이 자리에 연결
const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarStyle: { display: 'none' },
};

const MobileTabs = () => {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Quiz" component={QuizScreen} />
      <Tab.Screen name="Feedback" component={FeedbackScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
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
