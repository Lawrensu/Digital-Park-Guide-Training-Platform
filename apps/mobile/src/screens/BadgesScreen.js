// src/screens/BadgesScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';

const MOCK_BADGES = [
  { id: 1, name: 'First Steps',         icon: 'footsteps',    color: '#16a34a', bg: '#dcfce7', earned: true,  earnedDate: '10 Jan 2024', description: 'Complete your first lesson' },
  { id: 2, name: 'Quiz Master',          icon: 'trophy',       color: '#d97706', bg: '#fef3c7', earned: true,  earnedDate: '5 Feb 2024',  description: 'Pass 3 quizzes in a row' },
  { id: 3, name: 'Conservation Pro',     icon: 'leaf',         color: '#0891b2', bg: '#dbeafe', earned: true,  earnedDate: '12 Mar 2024', description: 'Complete all conservation modules' },
  { id: 4, name: 'Safety Expert',        icon: 'shield',       color: '#7c3aed', bg: '#ede9fe', earned: false, earnedDate: null,          description: 'Complete all safety modules' },
  { id: 5, name: 'Field Ready',          icon: 'compass',      color: '#dc2626', bg: '#fee2e2', earned: false, earnedDate: null,          description: 'Complete 10 field training modules' },
  { id: 6, name: 'Top Guide',            icon: 'star',         color: '#d97706', bg: '#fef3c7', earned: false, earnedDate: null,          description: 'Achieve 100% in any module' },
  { id: 7, name: 'Biodiversity Expert',  icon: 'flower',       color: '#16a34a', bg: '#dcfce7', earned: false, earnedDate: null,          description: 'Complete all biodiversity modules' },
  { id: 8, name: 'Eco Champion',         icon: 'earth',        color: '#0891b2', bg: '#dbeafe', earned: false, earnedDate: null,          description: 'Complete all eco-tourism modules' },
  { id: 9, name: 'Law Keeper',           icon: 'book',         color: '#7c3aed', bg: '#ede9fe', earned: false, earnedDate: null,          description: 'Complete all legislation modules' },
];

export default function BadgesScreen() {
  const earned = MOCK_BADGES.filter((b) => b.earned);
  const notEarned = MOCK_BADGES.filter((b) => !b.earned);

  const BadgeItem = ({ badge }) => (
    <View style={{
      width: '30%', alignItems: 'center', marginBottom: 20,
      opacity: badge.earned ? 1 : 0.45,
    }}>
      <View style={{
        width: 68, height: 68, borderRadius: 34,
        backgroundColor: badge.earned ? badge.bg : '#f3f4f6',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: badge.earned ? 2 : 1,
        borderColor: badge.earned ? badge.color + '50' : '#e5e7eb',
        marginBottom: 8,
        shadowColor: badge.earned ? badge.color : '#000',
        shadowOffset: { width: 0, height: badge.earned ? 3 : 0 },
        shadowOpacity: badge.earned ? 0.2 : 0,
        shadowRadius: 6, elevation: badge.earned ? 3 : 0,
      }}>
        <Ionicons name={badge.icon} size={28} color={badge.earned ? badge.color : '#9ca3af'} />
        {badge.earned && (
          <View style={{
            position: 'absolute', top: -4, right: -4,
            width: 18, height: 18, borderRadius: 9,
            backgroundColor: '#16a34a', borderWidth: 2, borderColor: '#fff',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="checkmark" size={10} color="#fff" />
          </View>
        )}
      </View>
      <Text style={{ fontSize: 11, fontWeight: '700', color: badge.earned ? '#374151' : '#9ca3af', textAlign: 'center', fontFamily: FONTS.title }} numberOfLines={2}>
        {badge.name}
      </Text>
      {badge.earned && badge.earnedDate && (
        <Text style={{ fontSize: 9, color: '#9ca3af', marginTop: 2, fontFamily: FONTS.body }}>{badge.earnedDate}</Text>
      )}
      {!badge.earned && (
        <Text style={{ fontSize: 9, color: '#9ca3af', marginTop: 2, textAlign: 'center', fontFamily: FONTS.body }} numberOfLines={2}>{badge.description}</Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Summary banner */}
        <View style={{ backgroundColor: '#15803d', padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#fff', fontFamily: FONTS.title }}>My Badges</Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4, fontFamily: FONTS.body }}>
            {earned.length} of {MOCK_BADGES.length} badges earned
          </Text>
          {/* Progress bar */}
          <View style={{ marginTop: 12, height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3 }}>
            <View style={{ width: `${(earned.length / MOCK_BADGES.length) * 100}%`, height: 6, backgroundColor: '#4ade80', borderRadius: 3 }} />
          </View>
        </View>

        {/* Earned badges */}
        {earned.length > 0 && (
          <View style={{ padding: 20, paddingBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16, fontFamily: FONTS.title }}>
              Earned ({earned.length})
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {earned.map((badge) => <BadgeItem key={badge.id} badge={badge} />)}
            </View>
          </View>
        )}

        {/* Locked badges */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16, fontFamily: FONTS.title }}>
            Keep Going ({notEarned.length} remaining)
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {notEarned.map((badge) => <BadgeItem key={badge.id} badge={badge} />)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
