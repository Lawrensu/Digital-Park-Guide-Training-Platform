// src/screens/ProfileScreen.js
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { FONTS } from '../theme/fonts';
import { MOCK_CERTIFICATIONS, MOCK_COURSES } from '../data/seedData';

// Mock badges data
const MOCK_BADGES = [
  { id: 1, name: 'First Steps',      icon: 'footsteps',    color: '#16a34a', bg: '#dcfce7', earned: true,  earnedDate: '2024-01-10', description: 'Complete your first lesson' },
  { id: 2, name: 'Quiz Master',      icon: 'trophy',       color: '#d97706', bg: '#fef3c7', earned: true,  earnedDate: '2024-02-05', description: 'Pass 3 quizzes in a row' },
  { id: 3, name: 'Conservation Pro', icon: 'leaf',         color: '#0891b2', bg: '#dbeafe', earned: true,  earnedDate: '2024-03-12', description: 'Complete all conservation modules' },
  { id: 4, name: 'Safety Expert',    icon: 'shield',       color: '#7c3aed', bg: '#ede9fe', earned: false, earnedDate: null,         description: 'Complete all safety modules' },
  { id: 5, name: 'Field Ready',      icon: 'compass',      color: '#dc2626', bg: '#fee2e2', earned: false, earnedDate: null,         description: 'Complete 10 field training modules' },
  { id: 6, name: 'Top Guide',        icon: 'star',         color: '#d97706', bg: '#fef3c7', earned: false, earnedDate: null,         description: 'Achieve 100% in any module' },
];

const StatCard = ({ icon, value, label, color }) => (
  <View style={{
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14,
    alignItems: 'center', marginHorizontal: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  }}>
    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: `${color}18`, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <Text style={{ fontSize: 20, fontWeight: '900', color: '#111827', fontFamily: FONTS.title }}>{value}</Text>
    <Text style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center', marginTop: 2, fontFamily: FONTS.body }}>{label}</Text>
  </View>
);

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const earnedBadges = MOCK_BADGES.filter((b) => b.earned);
  const certCount = MOCK_CERTIFICATIONS.length;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Profile header */}
        <View style={{ backgroundColor: '#15803d', padding: 24, paddingTop: 16, alignItems: 'center' }}>
          <View style={{ position: 'relative', marginBottom: 12 }}>
            <Image
              source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=47' }}
              style={{ width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' }}
            />
            <View style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 26, height: 26, borderRadius: 13,
              backgroundColor: '#4ade80', borderWidth: 2, borderColor: '#15803d',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />
            </View>
          </View>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff', fontFamily: FONTS.title }}>{user?.name}</Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontFamily: FONTS.body }}>
            {user?.department || 'Park Guide'}
          </Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4, fontFamily: FONTS.body }}>
            {user?.email}
          </Text>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', margin: 16, marginTop: 16 }}>
          <StatCard icon="book-outline"   value="3"  label="Completed"     color="#16a34a" />
          <StatCard icon="ribbon-outline" value={certCount} label="Certifications" color="#0891b2" />
          <StatCard icon="medal-outline"  value={earnedBadges.length} label="Badges" color="#d97706" />
        </View>

        {/* Guide info */}
        <View style={{
          marginHorizontal: 16, marginBottom: 16, backgroundColor: '#fff',
          borderRadius: 16, overflow: 'hidden',
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
        }}>
          <View style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#111827', fontFamily: FONTS.title }}>Account Info</Text>
          </View>
          {[
            { icon: 'person-outline',    label: 'Full Name',   value: user?.name },
            { icon: 'mail-outline',      label: 'Email',       value: user?.email },
            { icon: 'briefcase-outline', label: 'Department',  value: user?.department || 'Wildlife Conservation' },
            { icon: 'calendar-outline',  label: 'Member Since', value: user?.joinDate || '2023-03-15' },
          ].map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Ionicons name={item.icon} size={16} color="#16a34a" />
              </View>
              <View>
                <Text style={{ fontSize: 10, color: '#9ca3af', fontWeight: '700', fontFamily: FONTS.label }}>{item.label.toUpperCase()}</Text>
                <Text style={{ fontSize: 13, color: '#374151', fontWeight: '600', fontFamily: FONTS.body }}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Badges section */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', fontFamily: FONTS.title }}>Badges</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Badges')}>
              <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '700', fontFamily: FONTS.label }}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {MOCK_BADGES.slice(0, 6).map((badge) => (
              <View key={badge.id} style={{
                width: 72, alignItems: 'center',
                opacity: badge.earned ? 1 : 0.4,
              }}>
                <View style={{
                  width: 56, height: 56, borderRadius: 28,
                  backgroundColor: badge.earned ? badge.bg : '#f3f4f6',
                  alignItems: 'center', justifyContent: 'center', marginBottom: 5,
                  borderWidth: badge.earned ? 2 : 1,
                  borderColor: badge.earned ? badge.color + '40' : '#e5e7eb',
                }}>
                  <Ionicons name={badge.icon} size={24} color={badge.earned ? badge.color : '#9ca3af'} />
                </View>
                <Text style={{ fontSize: 9, color: badge.earned ? '#374151' : '#9ca3af', textAlign: 'center', fontFamily: FONTS.body }} numberOfLines={2}>
                  {badge.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Certifications quick link */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Certifications')}
          style={{
            marginHorizontal: 16, marginBottom: 16, backgroundColor: '#fff',
            borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center',
            shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
          }}
        >
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Ionicons name="ribbon" size={22} color="#0891b2" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827', fontFamily: FONTS.title }}>My Certifications</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', fontFamily: FONTS.body }}>{certCount} certificates earned</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </TouchableOpacity>

        {/* Settings / actions */}
        <View style={{
          marginHorizontal: 16, marginBottom: 16, backgroundColor: '#fff',
          borderRadius: 14, overflow: 'hidden',
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
        }}>
          {[
            { icon: 'notifications-outline', label: 'Notification Preferences', action: () => Alert.alert('Coming Soon', 'Notification settings will be available soon.') },
            { icon: 'lock-closed-outline',   label: 'Change Password',            action: () => Alert.alert('Coming Soon', 'Password change coming soon.') },
            { icon: 'help-circle-outline',   label: 'Help & Support',             action: () => Alert.alert('Help', 'Contact your trainer or admin for support.') },
          ].map((item, i) => (
            <TouchableOpacity key={item.label} onPress={item.action} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: '#f3f4f6' }}>
              <Ionicons name={item.icon} size={20} color="#6b7280" style={{ marginRight: 12 }} />
              <Text style={{ flex: 1, fontSize: 14, color: '#374151', fontFamily: FONTS.body }}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            marginHorizontal: 16, marginBottom: 32, backgroundColor: '#fff',
            borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center',
            justifyContent: 'center', borderWidth: 1.5, borderColor: '#fee2e2', gap: 8,
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#dc2626', fontFamily: FONTS.button }}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
