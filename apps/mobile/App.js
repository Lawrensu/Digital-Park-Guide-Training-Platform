import './global.css';
import './src/services/notificationService'; // side effect: registers foreground notification handler
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/services/AuthContext';
import { DatabaseProvider } from './src/database/DatabaseContext';
import OfflineBanner from './src/components/OfflineBanner';
import useNetworkStatus from './src/services/connectivityService';

const navigationRef = createNavigationContainerRef();


function navigateForNotification(data) {
	if (!data || !navigationRef.isReady()) return;

	switch (data.type) {
		case 'course':
		case 'reminder':
			navigationRef.navigate('Modules');
			break;
		case 'result_pass':
		case 'result_fail':
			navigationRef.navigate('Modules');
			break;
		case 'cert':
			navigationRef.navigate('Profile');
			break;
		case 'alert':
			navigationRef.navigate('Notifications');
			break;
		default:
			navigationRef.navigate('Notifications');
	}
}


function AppInner() {
	const { isOnline } = useNetworkStatus();

	useEffect(() => {
		// Handle tap on notification that launched the app from killed/background state
		Notifications.getLastNotificationResponseAsync().then((response) => {
			if (response) {
				navigateForNotification(response.notification.request.content.data);
			}
		});

		const sub = Notifications.addNotificationResponseReceivedListener((response) => {
			navigateForNotification(response.notification.request.content.data);
		});

		return () => sub.remove();
	}, []);

	return (
		<NavigationContainer ref={navigationRef}>
			<StatusBar style="light" backgroundColor="#15803d" />
			<OfflineBanner visible={isOnline === false} />
			<RootNavigator />
		</NavigationContainer>
	);
}


export default function App() {
	return (
		<SafeAreaProvider>
			<DatabaseProvider>
				<AuthProvider>
					<AppInner />
				</AuthProvider>
			</DatabaseProvider>
		</SafeAreaProvider>
	);
}
