import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import AdminDashboard      from '../screens/admin/AdminDashboard';
import GuideDetails        from '../screens/admin/GuideDetails';
import CourseManagement    from '../screens/admin/Course';
import ContentBuild        from '../screens/admin/ContentBuild';
import CourseModules       from '../screens/admin/ModuleList';
import QuizGrading         from '../screens/admin/QuizGrading';
import QuizCreate          from '../screens/admin/Quizzes';
import QuizEdit            from '../screens/admin/QuizEdit';
import Certifications      from '../screens/admin/Certification';
import GradeSubmission     from '../screens/admin/GradeSubmission';
import ModuleEdit          from '../screens/admin/ModuleEdit';
import ModuleView          from '../screens/admin/ModuleView';
import RegistrationsScreen from '../screens/admin/Registration';
import RegistrationDetails from '../screens/admin/RegistrationDetails';
import NotificationsScreen from '../screens/admin/Notification';
import SettingsScreen      from '../screens/admin/Setting';
import AdminListScreen     from '../screens/admin/AdminList';
import GuideListScreen     from '../screens/admin/GuideList';
import CreateAdminScreen   from '../screens/admin/CreateAdmin';
import IoTAlert            from '../screens/admin/IoTAlert';
import IoTDetails          from '../screens/admin/IoTDetails';
import AdminNavigationBar  from '../components/adminnavigationbar';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="GuideDetails"   component={GuideDetails} />
    </Stack.Navigator>
  );
}

function CoursesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CourseManagement" component={CourseManagement} />
      <Stack.Screen name="ContentBuild"     component={ContentBuild} />
      <Stack.Screen name="CourseModules"    component={CourseModules} />
      <Stack.Screen name="ModuleEdit"       component={ModuleEdit} />
      <Stack.Screen name="ModuleView"       component={ModuleView} />
      <Stack.Screen name="QuizGrading"      component={QuizGrading} />
      <Stack.Screen name="GradeSubmission"  component={GradeSubmission} />
      <Stack.Screen name="QuizCreate"       component={QuizCreate} />
      <Stack.Screen name="QuizEdit"         component={QuizEdit} />
      <Stack.Screen name="Certifications"   component={Certifications} />
    </Stack.Navigator>
  );
}

function RegistrationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RegistrationsList"    component={RegistrationsScreen} />
      <Stack.Screen name="RegistrationDetails"  component={RegistrationDetails} />
    </Stack.Navigator>
  );
}

function NotificationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotificationsHome"    component={NotificationsScreen} />
      <Stack.Screen name="RegistrationDetails"  component={RegistrationDetails} />
      <Stack.Screen name="IoTDetails"           component={IoTDetails} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} />
      <Stack.Screen name="AdminList"    component={AdminListScreen} />
      <Stack.Screen name="GuideList">
        {(props) => <GuideListScreen {...props} standalone />}
      </Stack.Screen>
      <Stack.Screen name="GuideDetails" component={GuideDetails} />
      <Stack.Screen name="CreateAdmin"  component={CreateAdminScreen} />
      <Stack.Screen name="IoTAlert"     component={IoTAlert} />
      <Stack.Screen name="IoTDetails"   component={IoTDetails} />
    </Stack.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <AdminNavigationBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"          component={HomeStack} />
      <Tab.Screen name="Courses"       component={CoursesStack} />
      <Tab.Screen name="Registrations" component={RegistrationsStack} />
      <Tab.Screen name="Notifications" component={NotificationsStack} />
      <Tab.Screen name="Settings"      component={SettingsStack} />
    </Tab.Navigator>
  );
}
