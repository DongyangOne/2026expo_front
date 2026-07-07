import React from 'react';
import { useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  HomeIcon,
  SearchIcon,
  QuizIcon,
  FeedbackIcon,
  AccountIcon,
  TabBarLabel,
} from '@/components/ui';
import { COLORS } from '@/constants';
import HomeScreen from '@/screens/HomeScreen';
import SearchScreen from '@/screens/SearchScreen';
import QuizScreen from '@/screens/QuizScreen';
import FeedbackScreen from '@/screens/FeedbackScreen';
import AccountScreen from '@/screens/AccountScreen';
import TabletMain from '@/screens/tablet/TabletMain';
import TabletLogin from '@/screens/tablet/TabletLogin';
import TabletReport from '@/screens/tablet/TabletReport';
import TabletSignup from '@/screens/tablet/TabletSignup';
import FindPasswordScreen from '@/screens/FindPasswordScreen';
import FindPasswordSuccessScreen from '@/screens/FindPasswordSuccessScreen';
import ResetPasswordScreen from '@/screens/ResetPasswordScreen';
import ResetPasswordSuccessScreen from '@/screens/ResetPasswordSuccessScreen';

import type { RootStackParamList, RootTabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const INACTIVE_COLOR = '#9CA3AF';
const TABLET_MIN_DP = 600;

const MobileTabs = () => {
  const insets = useSafeAreaInsets();

  const screenOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarShowLabel: true,
    tabBarStyle: {
      height: 60 + insets.bottom,
      paddingTop: 8,
      paddingBottom: insets.bottom + 8,
      backgroundColor: COLORS.white,
      borderTopColor: COLORS.gray[200],
      borderTopWidth: 1,
    },
  };

  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <HomeIcon active={focused} color={INACTIVE_COLOR} size={size} />
          ),
          tabBarLabel: ({ focused }) => <TabBarLabel label="홈" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <SearchIcon active={focused} color={INACTIVE_COLOR} size={size} />
          ),
          tabBarLabel: ({ focused }) => <TabBarLabel label="검색" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Quiz"
        component={QuizScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <QuizIcon active={focused} color={INACTIVE_COLOR} size={size} />
          ),
          tabBarLabel: ({ focused }) => <TabBarLabel label="퀴즈" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <FeedbackIcon active={focused} color={INACTIVE_COLOR} size={size} />
          ),
          tabBarLabel: ({ focused }) => <TabBarLabel label="피드백" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <AccountIcon active={focused} color={INACTIVE_COLOR} size={size} />
          ),
          tabBarLabel: ({ focused }) => <TabBarLabel label="마이" focused={focused} />,
        }}
      />
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
      <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
      <Stack.Screen name="FindPasswordSuccess" component={FindPasswordSuccessScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="ResetPasswordSuccess" component={ResetPasswordSuccessScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
