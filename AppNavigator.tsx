// AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserProfile from './screens/UserProfile';
import ListarPosts from './screens/ListarPosts';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="ListarPosts" component={ListarPosts} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
