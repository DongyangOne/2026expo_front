import React from 'react';
import { useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AccountIcon,
  FeedbackIcon,
  HomeIcon,
  QuizIcon,
  SearchIcon,
  TabBarLabel,
} from '@/components/ui';
import { COLORS } from '@/constants';
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

/** 비활성 탭 아이콘 색상 (활성 탭은 아이콘/라벨 컴포넌트가 그라데이션으로 처리) */
const INACTIVE_TAB_COLOR = '#9CA3AF';

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
            <HomeIcon active={focused} color={INACTIVE_TAB_COLOR} size={size} />
          ),
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} label="홈" />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <SearchIcon active={focused} color={INACTIVE_TAB_COLOR} size={size} />
          ),
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} label="검색" />,
        }}
      />
      <Tab.Screen
        name="Quiz"
        component={QuizScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <QuizIcon active={focused} color={INACTIVE_TAB_COLOR} size={size} />
          ),
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} label="퀴즈" />,
        }}
      />
      <Tab.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <FeedbackIcon active={focused} color={INACTIVE_TAB_COLOR} size={size} />
          ),
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} label="피드백" />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <AccountIcon active={focused} color={INACTIVE_TAB_COLOR} size={size} />
          ),
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} label="마이" />,
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
      <Stack.Screen name="TabletTrashFeedback" component={TabletTrashFeedbackScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
