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
  bodyDef: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const STATS = [
  { icon: 'book',             iconBg: '#dcfce7', iconColor: '#15803d', value: 11, label: 'Courses'   },
  { icon: 'checkmark-circle', iconBg: '#dbeafe', iconColor: '#0891b2', value: 3,  label: 'Completed' },
  { icon: 'ribbon',           iconBg: '#fef3c7', iconColor: '#d97706', value: 5,  label: 'Certs'     },
];

const IN_PROGRESS = [
  {
    id: 1, category: 'BIODIVERSITY', title: 'Rainforest Biodiversity Fundamentals',
    progress: 68, imageBg: '#78350f',
  },
  {
    id: 3, category: 'ECO-TOURISM', title: 'Sustainable Tourism Practices',
    progress: 35, imageBg: '#92400e',
  },
];

const DEADLINES = [
  {
    id: 1,
    title: 'Rainforest Ecosystems Quiz',
    course: 'Rainforest Biodiversity Fundamentals',
    daysLabel: '1 day',
    iconBg: '#fee2e2',  iconColor: '#ef4444',
    badgeBg: '#fee2e2', badgeColor: '#ef4444',
  },
  {
    id: 2,
    title: 'Wildlife Identification Assessment',
    course: 'Rainforest Biodiversity Fundamentals',
    daysLabel: '7 days',
    iconBg: '#fef3c7',  iconColor: '#d97706',
    badgeBg: '#fef3c7', badgeColor: '#d97706',
  },
];

const NOTIFICATIONS = [
  {
    id: 1,
    icon: 'book',   iconBg: '#dcfce7', iconColor: '#15803d',
    title: 'New Module Available',
    desc: '"Advanced Bird Watching Techniques" is now available in your Rainforest Biodiversity course.',
    time: '2 hours ago',
  },
  {
    id: 2,
    icon: 'ribbon', iconBg: '#dcfce7', iconColor: '#15803d',
    title: 'Quiz Passed!',
    desc: 'Congratulations! You scored 85% on the Conservation Ethics Quiz.',
    time: '5 hours ago',
  },
  {
    id: 3,
    icon: 'alarm',  iconBg: '#fef3c7', iconColor: '#d97706',
    title: 'Quiz Due Tomorrow',
    desc: 'Reminder: "Rainforest Ecosystems Quiz" is due tomorrow at 5:00 PM.',
    time: '6 hours ago',
  },
];

/* ── Sub-components ── */

function StatCard({ icon, iconBg, iconColor, value, label }) {
  return (
    <View style={{
      flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16,
      alignItems: 'center', marginHorizontal: 5,
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
    }}>
      <View style={{
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center',
        marginBottom: 8,
      }}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={[T.h4, { color: '#111827', fontSize: 22 }]}>{value}</Text>
      <Text style={[T.caption, { color: '#6b7280', marginTop: 3, textAlign: 'center' }]}>{label}</Text>
    </View>
  );
}

function CourseCard({ course, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: '#fff', borderRadius: 16, marginBottom: 12,
        flexDirection: 'row', overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
      }}
    >
      {/* Image placeholder */}
      <View style={{ width: 84, backgroundColor: course.imageBg }} />

      {/* Content */}
      <View style={{ flex: 1, padding: 12, justifyContent: 'center' }}>
        <Text style={[T.caption, { color: '#15803d', fontWeight: '700', marginBottom: 4 }]}>
          {course.category}
        </Text>
        <Text
          numberOfLines={1}
          style={[T.label, { color: '#111827', fontWeight: '600', marginBottom: 8 }]}
        >
          {course.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ flex: 1, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
            <View style={{
              width: `${course.progress}%`, height: '100%',
              backgroundColor: '#15803d', borderRadius: 2,
            }} />
          </View>
          <Text style={[T.caption, { color: '#15803d', fontWeight: '700' }]}>{course.progress}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function DeadlineRow({ deadline, isLast }) {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
        <View style={{
          width: 44, height: 44, borderRadius: 22,
          backgroundColor: deadline.iconBg,
          alignItems: 'center', justifyContent: 'center',
          marginRight: 12,
        }}>
          <Ionicons name="alarm" size={20} color={deadline.iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={[T.label, { color: '#111827', fontWeight: '600', marginBottom: 3 }]}
          >
            {deadline.title}
          </Text>
          <Text numberOfLines={1} style={[T.caption, { color: '#9ca3af' }]}>
            {deadline.course}
          </Text>
        </View>
        <View style={{
          backgroundColor: deadline.badgeBg, borderRadius: 8,
          paddingHorizontal: 10, paddingVertical: 5, marginLeft: 10,
        }}>
          <Text style={[T.caption, { color: deadline.badgeColor, fontWeight: '700' }]}>
            {deadline.daysLabel}
          </Text>
        </View>
      </View>
      {!isLast && (
        <View style={{ height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 16 }} />
      )}
    </View>
  );
}

function NotifCard({ notif }) {
  return (
    <View style={{
      backgroundColor: '#f0fdf4', borderRadius: 14, padding: 14, marginBottom: 10,
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={{
          width: 40, height: 40, borderRadius: 20,
          backgroundColor: notif.iconBg,
          alignItems: 'center', justifyContent: 'center',
          marginRight: 12,
        }}>
          <Ionicons name={notif.icon} size={18} color={notif.iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[T.label, { color: '#111827', fontWeight: '700', marginBottom: 4 }]}>
            {notif.title}
          </Text>
          <Text style={[T.bodySm, { color: '#374151', lineHeight: 19, marginBottom: 5 }]}>
            {notif.desc}
          </Text>
          <Text style={[T.caption, { color: '#9ca3af' }]}>{notif.time}</Text>
        </View>
        <View style={{
          width: 8, height: 8, borderRadius: 4,
          backgroundColor: '#15803d', marginTop: 4, marginLeft: 8,
        }} />
      </View>
    </View>
  );
}

/* ── Main screen ── */

export default function UserDashboard() {
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();
  const UNREAD     = 3;

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >

        {/* ── Green header ── */}
        <View style={{
          backgroundColor: '#15803d',
          paddingTop: isOnline === false ? 12 : 52, paddingBottom: 36, paddingHorizontal: 20,
        }}>
          {/* Top row: greeting + icons */}
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between',
            alignItems: 'flex-start', marginBottom: 16,
          }}>
            <View>
              <Text style={[T.caption, { color: '#fff', marginBottom: 4, fontSize: 25, fontWeight: '600' }]}>
                Welcome back🌿
              </Text>
              <Text style={[T.h1, { color: '#fff' }]}>Amira!</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              {/* Notification bell */}
              <TouchableOpacity
                onPress={() => navigation.getParent()?.navigate('Notifications')}
                activeOpacity={0.8}
                style={{ position: 'relative' }}
              >
                <View style={{
                  width: 40, height: 40, borderRadius: 20,
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Ionicons name="notifications-outline" size={20} color="#fff" />
                </View>
                {UNREAD > 0 && (
                  <View style={{
                    position: 'absolute', top: -2, right: -2,
                    width: 18, height: 18, borderRadius: 9,
                    backgroundColor: '#ef4444',
                    alignItems: 'center', justifyContent: 'center',
                    borderWidth: 1.5, borderColor: '#15803d',
                  }}>
                    <Text style={{ fontFamily: sans, fontSize: 10, color: '#fff', fontWeight: '800' }}>
                      {UNREAD}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Avatar */}
              <TouchableOpacity
                onPress={() => navigation.getParent()?.navigate('Profile')}
                activeOpacity={0.8}
                style={{
                  width: 40, height: 40, borderRadius: 20,
                  backgroundColor: '#86efac',
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
                }}
              >
                <Text style={[T.caption, { color: '#15803d', fontWeight: '700' }]}>AH</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Overall progress card */}
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 16, padding: 16,
          }}>
            <Text style={[T.caption, { color: 'rgba(255,255,255,0.75)', letterSpacing: 0.5, marginBottom: 6 }]}>
              OVERALL TRAINING PROGRESS
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={[T.label, { color: '#fff', fontWeight: '600' }]}>3 of 11 courses completed</Text>
              <Text style={[T.label, { color: '#4ade80', fontWeight: '700' }]}>27%</Text>
            </View>
            <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3, overflow: 'hidden' }}>
              <View style={{ width: '27%', height: '100%', backgroundColor: '#4ade80', borderRadius: 3 }} />
            </View>
          </View>
        </View>

        {/* ── Stats row (overlaps header) ── */}
        <View style={{ flexDirection: 'row', marginHorizontal: 16, marginTop: -24, marginBottom: 8 }}>
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </View>

        {/* ── Continue Learning ── */}
        <View style={{ paddingHorizontal: 16, marginTop: 20, marginBottom: 24 }}>
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 14,
          }}>
            <Text style={[T.h3, { color: '#111827' }]}>Continue Learning</Text>
            <TouchableOpacity onPress={() => navigation.getParent()?.navigate('Modules')}>
              <Text style={[T.label, { color: '#15803d' }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {IN_PROGRESS.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() => navigation.getParent()?.navigate('Modules')}
            />
          ))}
        </View>

        {/* ── Upcoming Deadlines ── */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text style={[T.h3, { color: '#111827', marginBottom: 14 }]}>Upcoming Deadlines</Text>
          <View style={{
            backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
            shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
          }}>
            {DEADLINES.map((d, i) => (
              <DeadlineRow key={d.id} deadline={d} isLast={i === DEADLINES.length - 1} />
            ))}
          </View>
        </View>

        {/* ── Recent Notifications ── */}
        <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
          <Text style={[T.h3, { color: '#111827', marginBottom: 14 }]}>Recent Notifications</Text>
          {NOTIFICATIONS.map((n) => (
            <NotifCard key={n.id} notif={n} />
          ))}
        </View>

      </ScrollView>
    </View>
  );
}
