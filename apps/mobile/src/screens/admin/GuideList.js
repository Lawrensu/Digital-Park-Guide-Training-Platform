import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';

const sans = Platform.select({ ios: 'System', android: 'sans-serif' });
const T = {
  h2:      { fontFamily: sans, fontSize: 24, fontWeight: '600' },
  caption: { fontFamily: sans, fontSize: 12, fontWeight: '500' },
};

const GUIDES = [
  {
    name: 'Amira Hassan',
    role: 'Wildlife Conservation',
    email: 'amira.hassan@example.com',
    joined: 'Mar 2023',
    statuses: ['ACTIVE', 'VERIFIED'],
    enrolled: 8,
    completed: 3,
    certs: 2,
    courseProgress: [
      { name: 'Rainforest Biodiversity',    pct: 85 },
      { name: 'Wildlife Conservation',      pct: 100 },
      { name: 'Eco-tourism Fundamentals',   pct: 45 },
    ],
    quizResults: [
      { name: 'Biodiversity Quiz',    date: '13 Apr', status: 'PASSED', score: 85 },
      { name: 'Conservation Ethics',  date: '10 Apr', status: 'PASSED', score: 92 },
      { name: 'Safety Protocols',     date: '8 Apr',  status: 'FAILED', score: 65 },
    ],
    certifications: [
      'Wildlife Conservation Specialist',
      'Biodiversity Guide Level 1',
    ],
  },
  {
    name: 'James Okafor',
    role: 'Eco-tourism Guide',
    email: 'james.okafor@example.com',
    joined: 'Jan 2023',
    statuses: ['ACTIVE', 'VERIFIED'],
    enrolled: 5,
    completed: 5,
    certs: 3,
    courseProgress: [
      { name: 'Eco-tourism Fundamentals',   pct: 100 },
      { name: 'Wildlife Conservation',      pct: 100 },
      { name: 'Rainforest Biodiversity',    pct: 90 },
    ],
    quizResults: [
      { name: 'Eco-tourism Quiz',     date: '20 Apr', status: 'PASSED', score: 91 },
      { name: 'Wildlife Quiz',        date: '15 Apr', status: 'PASSED', score: 88 },
    ],
    certifications: [
      'Eco-tourism Specialist',
      'Wildlife Conservation Specialist',
      'Safety & First Aid',
    ],
  },
  {
    name: 'Sarah Chen',
    role: 'Biodiversity Specialist',
    email: 'sarah.chen@example.com',
    joined: 'Jun 2023',
    statuses: ['ACTIVE'],
    enrolled: 6,
    completed: 2,
    certs: 1,
    courseProgress: [
      { name: 'Rainforest Biodiversity',    pct: 100 },
      { name: 'Conservation Ethics',        pct: 75 },
      { name: 'Safety Protocols',           pct: 30 },
    ],
    quizResults: [
      { name: 'Biodiversity Quiz',    date: '22 Apr', status: 'PASSED', score: 94 },
      { name: 'Safety Protocols',     date: '18 Apr', status: 'FAILED', score: 58 },
    ],
    certifications: [
      'Biodiversity Guide Level 1',
    ],
  },
];

function GuideCard({ guide, onPress }) {
  const initial = guide.name.charAt(0).toUpperCase();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 14,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
      }}
    >
      {/* Top row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        <View style={{
          width: 48, height: 48, borderRadius: 24,
          backgroundColor: '#15803d', alignItems: 'center', justifyContent: 'center', marginRight: 12,
        }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>{initial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>{guide.name}</Text>
          <Text style={{ fontSize: 13, color: '#15803d', marginTop: 2 }}>{guide.role}</Text>
        </View>
        <Ionicons name="arrow-forward" size={18} color="#9ca3af" />
      </View>

      {/* Stats row */}
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>{guide.enrolled}</Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Enrolled</Text>
        </View>
        <View style={{ width: 1, backgroundColor: '#f3f4f6' }} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>{guide.completed}</Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Completed</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function GuideList({ standalone = false }) {
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header (only when navigated to as a screen) ── */}
      {standalone && (
        <View style={{
          backgroundColor: '#15803d',
          paddingTop: isOnline === false ? 12 : 52, paddingBottom: 18, paddingHorizontal: 20,
          flexDirection: 'row', alignItems: 'center', gap: 14,
        }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={[T.h2, { color: '#fff' }]}>Guides List</Text>
            <Text style={[T.caption, { color: 'rgba(255,255,255,0.75)', marginTop: 2 }]}>
              {GUIDES.length} park guides
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {GUIDES.map((guide) => (
          <GuideCard
            key={guide.name}
            guide={guide}
            onPress={() => navigation.navigate('GuideDetails', { guide })}
          />
        ))}
      </ScrollView>
    </View>
  );
}
