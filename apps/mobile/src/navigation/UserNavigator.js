import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import UserDashboard      from '../screens/parkguide/UserDashboard';
import CourseListScreen   from '../screens/parkguide/CourseListScreen';
import LessonScreen       from '../screens/parkguide/LessonScreen';
import QuizScreen          from '../screens/parkguide/QuizScreen';
import QuizResultScreen    from '../screens/parkguide/quizresult';
import CertificationScreen from '../screens/parkguide/CertificationScreen';
import ContentScreen       from '../screens/parkguide/content';
import GuideNotification   from '../screens/parkguide/guidenotification';
import GuideProfile       from '../screens/parkguide/guideprofile';
import BadgeScreen        from '../screens/parkguide/badge';
import GuideViewCert      from '../screens/parkguide/guideviewcert';
import GuideNavigationBar from '../components/guidenavigationbar';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={UserDashboard} />
    </Stack.Navigator>
  );
}

function ModulesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CourseList" component={CourseListScreen} />
      <Stack.Screen name="Lesson"        component={LessonScreen} />
      <Stack.Screen name="Content"       component={ContentScreen} />
      {/* registered but not yet triggered from any screen */}
      <Stack.Screen name="Quiz"          component={QuizScreen} />
      <Stack.Screen name="QuizResult"    component={QuizResultScreen} />
      <Stack.Screen name="Certification" component={CertificationScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome"   component={GuideProfile} />
      <Stack.Screen name="Badges"        component={BadgeScreen} />
      <Stack.Screen name="Certification" component={CertificationScreen} />
      <Stack.Screen name="GuideViewCert" component={GuideViewCert} />
    </Stack.Navigator>
  );
}

export default function UserNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <GuideNavigationBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"          component={HomeStack} />
      <Tab.Screen name="Modules"       component={ModulesStack} />
      <Tab.Screen name="Notifications" component={GuideNotification} />
      <Tab.Screen name="Profile"       component={ProfileStack} />
    </Tab.Navigator>
  );
}
