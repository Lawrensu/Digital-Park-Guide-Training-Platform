import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h1:      { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h3:      { fontFamily: sans,  fontSize: 20, fontWeight: '500' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const EARNED = [
  {
    id: 1,
    label: 'First Steps',
    date: '2026-03-15',
    icon: 'footsteps',
    iconColor: '#15803d',
    borderColor: '#15803d',
    iconBg: '#dcfce7',
  },
  {
    id: 2,
    label: 'Quiz Master',
    date: '2026-04-22',
    icon: 'trophy',
    iconColor: '#d97706',
    borderColor: '#d97706',
    iconBg: '#fef3c7',
  },
  {
    id: 3,
    label: 'Conservation Pro',
    date: '2026-04-28',
    icon: 'leaf',
    iconColor: '#0891b2',
    borderColor: '#0891b2',
    iconBg: '#e0f2fe',
  },
];

const LOCKED = [
  { id: 4, label: 'Safety Expert',      desc: 'Master all safety protocols'           },
  { id: 5, label: 'Field Ready',        desc: 'Complete 20 field exercises'           },
  { id: 6, label: 'Top Guide',          desc: 'Maintain 95%+ average across all courses' },
  { id: 7, label: 'Biodiversity Expert', desc: 'Complete all biodiversity modules'    },
  { id: 8, label: 'Eco Champion',       desc: 'Finish all eco-tourism training'       },
  { id: 9, label: 'Law Keeper',         desc: 'Pass all legislation assessments'      },
];

const TOTAL   = EARNED.length + LOCKED.length;
const EARNED_COUNT = EARNED.length;

function EarnedBadge({ badge }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <View style={{ position: 'relative', marginBottom: 10 }}>
        <View style={{
          width: 80, height: 80, borderRadius: 40,
          borderWidth: 3, borderColor: badge.borderColor,
          backgroundColor: badge.iconBg,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Ionicons name={badge.icon} size={32} color={badge.iconColor} />
        </View>
        {/* Earned indicator dot */}
        <View style={{
          position: 'absolute', top: 2, right: 2,
          width: 16, height: 16, borderRadius: 8,
          backgroundColor: '#15803d',
          borderWidth: 2, borderColor: '#fff',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Ionicons name="checkmark" size={9} color="#fff" />
        </View>
      </View>
      <Text style={[T.label, { color: '#111827', textAlign: 'center', marginBottom: 3 }]}>
        {badge.label}
      </Text>
      <Text style={[T.caption, { color: '#9ca3af' }]}>{badge.date}</Text>
    </View>
  );
}

function LockedBadge({ badge }) {
  return (
    <View style={{ alignItems: 'center', flex: 1, paddingHorizontal: 4 }}>
      <View style={{
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: '#f3f4f6',
        borderWidth: 2, borderColor: '#e5e7eb',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 10,
      }}>
        <Ionicons name="lock-closed" size={28} color="#d1d5db" />
      </View>
      <Text style={[T.label, { color: '#374151', textAlign: 'center', marginBottom: 4 }]}>
        {badge.label}
      </Text>
      <Text style={[T.caption, { color: '#9ca3af', textAlign: 'center', lineHeight: 16 }]}>
        {badge.desc}
      </Text>
    </View>
  );
}

export default function BadgeScreen() {
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();
  const progress   = EARNED_COUNT / TOTAL;

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20,
      }}>
        {/* Title row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={[T.h1, { color: '#fff' }]}>My Badges</Text>
        </View>

        {/* Progress subtitle */}
        <Text style={[T.caption, { color: 'rgba(255,255,255,0.8)', marginBottom: 10 }]}>
          {EARNED_COUNT} of {TOTAL} badges earned
        </Text>

        {/* Progress bar */}
        <View style={{
          height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, overflow: 'hidden',
        }}>
          <View style={{
            height: '100%', borderRadius: 3,
            backgroundColor: '#fff',
            width: `${Math.round(progress * 100)}%`,
          }} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >

        {/* ── Earned section ── */}
        <Text style={[T.h3, { color: '#111827', marginBottom: 20 }]}>
          Earned ({EARNED_COUNT})
        </Text>
        <View style={{ flexDirection: 'row', marginBottom: 36 }}>
          {EARNED.map((b) => (
            <EarnedBadge key={b.id} badge={b} />
          ))}
        </View>

        {/* ── Keep Going section ── */}
        <Text style={[T.h3, { color: '#111827', marginBottom: 20 }]}>
          Keep Going ({LOCKED.length} remaining)
        </Text>

        {/* 2-column rows of locked badges */}
        {[0, 1].map((rowIdx) => (
          <View
            key={rowIdx}
            style={{ flexDirection: 'row', marginBottom: 28 }}
          >
            {LOCKED.slice(rowIdx * 3, rowIdx * 3 + 3).map((b) => (
              <LockedBadge key={b.id} badge={b} />
            ))}
          </View>
        ))}

      </ScrollView>
    </View>
  );
}
