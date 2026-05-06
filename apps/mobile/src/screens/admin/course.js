import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';
import useNetworkStatus from '../../services/connectivityService';

// Outfit → sans-serif (swap fontFamily to 'Outfit' once installed)
// Source Serif 4 → serif (swap fontFamily to 'SourceSerif4' once installed)
const sans   = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif  = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h1:          { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h3:          { fontFamily: sans,  fontSize: 20, fontWeight: '500' },
  h4:          { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodyDefault: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySmall:   { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:       { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption:     { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const MENU_ITEMS = [
  {
    label: 'Content Build',
    description: 'Create and manage course content',
    icon: 'document-text',
    iconColor: '#0891b2',
    iconBg: '#e0f2fe',
    screen: 'ContentBuild',
  },
  {
    label: 'Modules',
    description: 'View all course modules',
    icon: 'albums',
    iconColor: '#16a34a',
    iconBg: '#dcfce7',
    screen: 'CourseModules',
  },
  {
    label: 'Quiz Grading',
    description: 'Grade submitted quizzes',
    icon: 'clipboard',
    iconColor: '#d97706',
    iconBg: '#fef3c7',
    screen: 'QuizGrading',
  },
  {
    label: 'Quiz',
    description: 'Create new quizzes',
    icon: 'add-circle',
    iconColor: '#dc2626',
    iconBg: '#fee2e2',
    screen: 'QuizCreate',
  },
  {
    label: 'Certifications',
    description: 'Manage and issue certifications',
    icon: 'ribbon',
    iconColor: '#7c3aed',
    iconBg: '#ede9fe',
    screen: 'Certifications',
  },
];

export default function CourseManagement() {
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20,
      }}>
        <Text style={[T.h1, { color: '#fff', marginBottom: 4 }]}>
          Course Management
        </Text>
        <Text style={[T.bodyDefault, { color: 'rgba(255,255,255,0.8)' }]}>
          Manage all training content and assessments
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>

        {/* ── Menu cards ── */}
        <View style={{ marginBottom: 24 }}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: '#fff', borderRadius: 16,
                padding: 18, marginBottom: 10,
                shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
              }}
            >
              <View style={{
                width: 52, height: 52, borderRadius: 14,
                backgroundColor: item.iconBg,
                alignItems: 'center', justifyContent: 'center',
                marginRight: 16,
              }}>
                <Ionicons name={item.icon} size={24} color={item.iconColor} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[T.h4, { color: '#111827', marginBottom: 3 }]}>
                  {item.label}
                </Text>
                <Text style={[T.bodySmall, { color: '#6b7280', lineHeight: 20 }]}>
                  {item.description}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Quick Stats ── */}
        <View style={{ marginBottom: 16 }}>
          <Text style={[T.h3, { color: '#111827', marginBottom: 12 }]}>Quick Stats</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{
              flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 20,
              alignItems: 'center',
              shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
            }}>
              <Text style={[T.h1, { color: '#16a34a', marginBottom: 4 }]}>11</Text>
              <Text style={[T.caption, { color: '#6b7280' }]}>Active Modules</Text>
            </View>
            <View style={{
              flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 20,
              alignItems: 'center',
              shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
            }}>
              <Text style={[T.h1, { color: '#d97706', marginBottom: 4 }]}>5</Text>
              <Text style={[T.caption, { color: '#6b7280' }]}>Pending Grades</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
