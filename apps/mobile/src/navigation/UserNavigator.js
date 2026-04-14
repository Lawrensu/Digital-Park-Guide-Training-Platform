// src/navigation/UserNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

import UserDashboard from '../screens/UserDashboard';
import CourseListScreen from '../screens/CourseListScreen';
import ModuleDetailScreen from '../screens/ModuleDetailScreen';
import LessonScreen from '../screens/LessonScreen';
import QuizScreen from '../screens/QuizScreen';
import QuizResultScreen from '../screens/QuizResultScreen';
import CertificationScreen from '../screens/CertificationScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BadgesScreen from '../screens/BadgesScreen';
import { MOCK_NOTIFICATIONS } from '../data/seedData';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HEADER_STYLE = {
  headerStyle: { backgroundColor: '#15803d' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_STYLE}>
      <Stack.Screen name="Dashboard" component={UserDashboard} options={{ title: 'Park Guide Hub' }} />
    </Stack.Navigator>
  );
}

function CoursesStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_STYLE}>
      <Stack.Screen name="CourseList"    component={CourseListScreen}   options={{ title: 'Training Modules' }} />
      <Stack.Screen name="ModuleDetail"  component={ModuleDetailScreen} options={{ title: 'Module' }} />
      <Stack.Screen name="Lesson"        component={LessonScreen}       options={{ title: 'Lesson' }} />
      <Stack.Screen name="Quiz"          component={QuizScreen}         options={{ title: 'Quiz' }} />
      <Stack.Screen name="QuizResult"    component={QuizResultScreen}   options={{ title: 'Result', headerLeft: () => null }} />
    </Stack.Navigator>
  );
}

function NotificationsStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_STYLE}>
      <Stack.Screen name="NotificationsList" component={NotificationsScreen} options={{ title: 'Notifications' }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_STYLE}>
      <Stack.Screen name="ProfileHome"    component={ProfileScreen}        options={{ title: 'My Profile' }} />
      <Stack.Screen name="Certifications" component={CertificationScreen}  options={{ title: 'My Certifications' }} />
      <Stack.Screen name="Badges"         component={BadgesScreen}         options={{ title: 'My Badges' }} />
    </Stack.Navigator>
  );
}

export default function UserNavigator() {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

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
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Home:          focused ? 'home'           : 'home-outline',
            Modules:       focused ? 'book'           : 'book-outline',
            Notifications: focused ? 'notifications'  : 'notifications-outline',
            Profile:       focused ? 'person'         : 'person-outline',
          };
          const iconName = icons[route.name] || 'ellipse-outline';

          if (route.name === 'Notifications' && unreadCount > 0) {
            return (
              <View style={{ position: 'relative' }}>
                <Ionicons name={iconName} size={22} color={color} />
                <View style={{
                  position: 'absolute', top: -4, right: -6,
                  width: 16, height: 16, borderRadius: 8,
                  backgroundColor: '#dc2626',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 9, color: '#fff', fontWeight: '800' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              </View>
            );
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"          component={HomeStack} />
      <Tab.Screen name="Modules"       component={CoursesStack} />
      <Tab.Screen name="Notifications" component={NotificationsStack} />
      <Tab.Screen name="Profile"       component={ProfileStack} />
    </Tab.Navigator>
  );
}
