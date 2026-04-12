import { registerRootComponent } from 'expo';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/services/AuthContext';
import { DatabaseProvider } from './src/database/DatabaseContext';
import RootNavigator from './src/navigation/RootNavigator';

function App() {
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
