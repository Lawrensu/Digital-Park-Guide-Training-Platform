// App.js
import { registerRootComponent } from 'expo';
import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/services/AuthContext';
import { DatabaseProvider } from './src/database/DatabaseContext';
import { registerForPushNotifications } from './src/services/notificationService';

function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Register for push notifications on app start
    registerForPushNotifications();

    // Listen for incoming notifications while app is open
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification.request.content.title);
    });

    // Listen for user tapping a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log('Notification tapped:', data);
      // Navigation based on notification type can be added here
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#15803d" />
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
export default App;
