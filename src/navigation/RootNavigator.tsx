import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RootTabNavigator from './RootTabNavigator';
import EditProfileScreen from '@/screens/EditProfileScreen';
import UserAuthScreen from '@/screens/UserAuthScreen';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={RootTabNavigator} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="UserAuth" component={UserAuthScreen} />
    </Stack.Navigator>
  );
};
export default RootNavigator;
