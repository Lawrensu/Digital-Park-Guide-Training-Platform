// src/navigation/UserNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

import UserDashboard from '../screens/UserDashboard';
import CourseListScreen from '../screens/CourseListScreen';
import LessonScreen from '../screens/LessonScreen';
import QuizScreen from '../screens/QuizScreen';
import CertificationScreen from '../screens/CertificationScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator wrapping courses + lessons + quiz
function CoursesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#15803d' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="CourseList" component={CourseListScreen} options={{ title: 'My Courses' }} />
      <Stack.Screen name="Lesson" component={LessonScreen} options={{ title: 'Lesson' }} />
      <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz' }} />
    </Stack.Navigator>
  );
}

function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#15803d' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="Dashboard" component={UserDashboard} options={{ title: 'Park Guide Hub' }} />
    </Stack.Navigator>
  );
}

export default function UserNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#15803d',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 6,
          height: 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Courses: focused ? 'book' : 'book-outline',
            Certifications: focused ? 'ribbon' : 'ribbon-outline',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardStack} />
      <Tab.Screen name="Courses" component={CoursesStack} />
      <Tab.Screen name="Certifications" component={CertificationScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#15803d' },
          headerTintColor: '#fff',
          headerTitle: 'My Certifications',
        }}
      />
    </Tab.Navigator>
  );
}
