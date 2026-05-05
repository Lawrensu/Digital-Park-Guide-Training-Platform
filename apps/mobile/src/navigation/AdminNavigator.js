import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import AdminDashboard      from '../screens/admin/AdminDashboard';
import GuideDetails        from '../screens/admin/guidedetails';
import CourseManagement    from '../screens/admin/course';
import ContentBuild        from '../screens/admin/contentbuild';
import CourseModules       from '../screens/admin/modulelist';
import QuizGrading         from '../screens/admin/quizgrading';
import QuizCreate          from '../screens/admin/quizzes';
import QuizEdit            from '../screens/admin/quizedit';
import Certifications      from '../screens/admin/certification';
import GradeSubmission    from '../screens/admin/gradesubmission';
import ModuleEdit         from '../screens/admin/moduleedit';
import ModuleView         from '../screens/admin/moduleview';
import RegistrationsScreen   from '../screens/admin/registration';
import RegistrationDetails   from '../screens/admin/registrationdetails';
import NotificationsScreen from '../screens/admin/notification';
import SettingsScreen      from '../screens/admin/setting';
import AdminListScreen     from '../screens/admin/adminlist';
import GuideListScreen     from '../screens/admin/guidelist';
import CreateAdminScreen   from '../screens/admin/createadmin';
import IoTAlert            from '../screens/admin/iotalert';
import IoTDetails          from '../screens/admin/iotdetails';
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
