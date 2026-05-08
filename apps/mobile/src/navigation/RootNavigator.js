import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../services/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';

const Stack = createStackNavigator();

export default function RootNavigator() {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
				<ActivityIndicator size="large" color="#15803d" />
			</View>
		);
	}

	if (!user) {
		return (
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="Login" component={LoginScreen} />
			</Stack.Navigator>
		);
	}

	if (user.role === 'ADMIN') {
		return <AdminNavigator />;
	}

	return <UserNavigator />;
}
