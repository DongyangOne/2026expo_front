// navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FeedbackdetailScreen from '@/screens/FeedbackdetailScreen';

import RootTabNavigator from './RootTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={RootTabNavigator} />
      <Stack.Screen name="FeedbackDetail" component={FeedbackdetailScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
