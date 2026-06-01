import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from './types';
import HomeScreen from '@/screens/HomeScreen';
import SearchScreen from '@/screens/SearchScreen';
import QuizScreen from '@/screens/QuizScreen';
import FeedbackScreen from '@/screens/FeedbackScreen';
import AccountScreen from '@/screens/AccountScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

const RootNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
        },
        tabBarActiveTintColor: '#6b7280',
        tabBarInactiveTintColor: '#9ca3af',
      }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: '검색' }} />
      <Tab.Screen name="Quiz" component={QuizScreen} options={{ title: '퀴즈' }} />
      <Tab.Screen name="Feedback" component={FeedbackScreen} options={{ title: '피드백' }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{ title: '계정' }} />
    </Tab.Navigator>
  );
};

export default RootNavigator;
