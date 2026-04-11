import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../services/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  if (user.role === 'admin') {
    return <AdminNavigator />;
  }

  return <UserNavigator />;
}