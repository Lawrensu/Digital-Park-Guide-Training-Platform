// src/navigation/AdminNavigator.js
import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import AdminDashboard from '../screens/AdminDashboard';
import AdminNotificationsScreen from '../screens/AdminNotificationsScreen';
import LiveAlertScreen from '../screens/LiveAlertScreen';
import { MOCK_ADMIN_NOTIFICATIONS, MOCK_ALERTS_COUNT } from '../data/seedData';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HEADER_STYLE = {
  headerStyle: { backgroundColor: '#15803d' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' },
};

function AdminStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_STYLE}>
      <Stack.Screen name="AdminHome" component={AdminDashboard} options={{ title: 'Admin Console' }} />
    </Stack.Navigator>
  );
}

function AdminNotifStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_STYLE}>
      <Stack.Screen name="AdminNotifs" component={AdminNotificationsScreen} options={{ title: 'Notifications' }} />
    </Stack.Navigator>
  );
}

function LiveAlertStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_STYLE}>
      <Stack.Screen name="LiveAlerts" component={LiveAlertScreen} options={{ title: 'Live Alerts' }} />
    </Stack.Navigator>
  );
}

export default function AdminNavigator() {
  const unreadNotifCount = MOCK_ADMIN_NOTIFICATIONS.filter((n) => !n.read).length;
  const pendingAlertCount = 1; // pending alerts count

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#15803d',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e5e7eb',
          paddingBottom: 8, paddingTop: 6, height: 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Dashboard:     focused ? 'grid'          : 'grid-outline',
            Notifications: focused ? 'notifications' : 'notifications-outline',
            LiveAlerts:    focused ? 'warning'       : 'warning-outline',
          };
          const iconName = icons[route.name] || 'ellipse-outline';
          const badgeCount = route.name === 'Notifications' ? unreadNotifCount : route.name === 'LiveAlerts' ? pendingAlertCount : 0;

          if (badgeCount > 0) {
            return (
              <View style={{ position: 'relative' }}>
                <Ionicons name={iconName} size={22} color={color} />
                <View style={{
                  position: 'absolute', top: -4, right: -6,
                  width: 16, height: 16, borderRadius: 8,
                  backgroundColor: route.name === 'LiveAlerts' ? '#dc2626' : '#dc2626',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 9, color: '#fff', fontWeight: '800' }}>
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </Text>
                </View>
              </View>
            );
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard"     component={AdminStack} />
      <Tab.Screen name="Notifications" component={AdminNotifStack} />
      <Tab.Screen name="LiveAlerts"    component={LiveAlertStack} options={{ tabBarLabel: 'Live Alerts' }} />
    </Tab.Navigator>
  );
}
