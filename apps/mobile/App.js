// App.js — wired with authService silent refresh + connectivity banner
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/services/AuthContext';
import { DatabaseProvider } from './src/database/DatabaseContext';
import OfflineBanner from './src/components/OfflineBanner';
import useNetworkStatus from './src/services/connectivityService';

// Inner component so hooks can access AuthContext
function AppInner() {
  const { isOnline, lastSynced } = useNetworkStatus();

  return (
    <NavigationContainer>
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
