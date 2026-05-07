import React, { useState } from 'react';
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
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const FILTERS = ['All', 'Unread', 'Courses', 'Results', 'Reminders'];

const NOTIFICATIONS = [
  {
    id: 1,
    group: 'TODAY',
    icon: 'book',
    iconColor: '#15803d',
    iconBg: '#dcfce7',
    title: 'New Content Available',
    time: '2 hours ago',
    unread: true,
    description: '"Advanced Bird Watching Techniques" is now available in your Rainforest Biodiversity course.',
    action: { label: 'START MODULE', color: '#15803d', bg: 'transparent', pill: false },
    type: 'Courses',
    navAction: {
      tab: 'Modules',
      screen: 'Lesson',
      params: {
        course: {
          id: 1, title: 'Rainforest Biodiversity Fundamentals',
          categoryLabel: 'BIODIVERSITY', level: 'BEGINNER',
          rating: 4.8, duration: '4h 30m', lessons: 8, progress: 68,
          instructor: 'Dr. Maria Santos', instructorInitials: 'MS', instructorBg: '#f97316',
        },
      },
    },
  },
  {
    id: 2,
    group: 'TODAY',
    icon: 'ribbon',
    iconColor: '#15803d',
    iconBg: '#dcfce7',
    title: 'Quiz Passed!',
    time: '5 hours ago',
    unread: true,
    description: 'Congratulations! You scored 85% on the Conservation Ethics Quiz.',
    action: { label: 'VIEW RESULT', color: '#15803d', bg: 'transparent', pill: false },
    type: 'Results',
    navAction: {
      tab: 'Modules',
      screen: 'QuizResult',
      params: {
        score: 85, correct: 17, total: 20, passed: true,
        quizTitle: 'Conservation Ethics Quiz',
        course: { title: 'Rainforest Biodiversity Fundamentals' },
      },
    },
  },
  {
    id: 3,
    group: 'TODAY',
    icon: 'alarm',
    iconColor: '#d97706',
    iconBg: '#fef3c7',
    title: 'Quiz Due Tomorrow',
    time: '6 hours ago',
    unread: true,
    description: 'Reminder: "Rainforest Ecosystems Quiz" is due tomorrow at 5:00 PM.',
    action: null,
    type: 'Reminders',
  },
  {
    id: 4,
    group: 'YESTERDAY',
    icon: 'ribbon',
    iconColor: '#3b82f6',
    iconBg: '#dbeafe',
    title: 'Certificate Issued',
    time: '1 day ago',
    unread: false,
    description: 'Your "Certified Biodiversity Guide" certificate is ready to download.',
    action: { label: 'VIEW CERTIFICATE', color: '#0891b2', bg: '#e0f2fe', pill: true },
    type: 'Results',
    navAction: {
      tab: 'Profile',
      screen: 'GuideViewCert',
      params: {
        cert: {
          id: 1, title: 'Certified Biodiversity Guide',
          course: 'Rainforest Biodiversity Fundamentals',
          color: '#15803d', iconBg: '#dcfce7',
        },
      },
    },
  },
  {
    id: 5,
    group: 'YESTERDAY',
    icon: 'refresh-circle',
    iconColor: '#e11d48',
    iconBg: '#ffe4e6',
    title: 'Quiz Needs Retake',
    time: '1 day ago',
    unread: false,
    description: 'You scored 62% on Wildlife Identification Assessment. Pass score is 70%. You have 2 attempts remaining.',
    action: { label: 'RETAKE QUIZ', color: '#e11d48', bg: '#ffe4e6', pill: true },
    type: 'Results',
  },
  {
    id: 6,
    group: '2026-04-29',
    icon: 'megaphone',
    iconColor: '#7c3aed',
    iconBg: '#ede9fe',
    title: 'New Course Launch',
    time: '2 days ago',
    unread: false,
    description: 'Check out our new course: "Climate Change Impact on Ecosystems" - Enrollment now open!',
    action: null,
    type: 'Courses',
  },
];

function NotifCard({ notif, onMarkRead, onAction }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onMarkRead(notif.id)}
      style={{
        backgroundColor: notif.unread ? '#f0fdf4' : '#fff',
        borderRadius: 16, padding: 16, marginBottom: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
      }}
    >
      {/* Top row */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
        {/* Icon */}
        <View style={{
          width: 42, height: 42, borderRadius: 21,
          backgroundColor: notif.iconBg,
          alignItems: 'center', justifyContent: 'center',
          marginRight: 12,
        }}>
          <Ionicons name={notif.icon} size={20} color={notif.iconColor} />
        </View>

        {/* Title + time + dot */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={[T.h4, { color: '#111827', flex: 1, marginRight: 8 }]} numberOfLines={1}>
              {notif.title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text style={[T.caption, { color: '#9ca3af' }]}>{notif.time}</Text>
              {notif.unread && (
                <View style={{
                  width: 8, height: 8, borderRadius: 4, backgroundColor: '#15803d',
                }} />
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={[T.bodySm, { color: '#374151', lineHeight: 20, marginBottom: notif.action ? 12 : 0 }]}>
        {notif.description}
      </Text>

      {/* Action */}
      {notif.action && (
        notif.action.pill ? (
          <TouchableOpacity
            onPress={onAction}
            activeOpacity={0.75}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: notif.action.bg,
              borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7,
            }}
          >
            <Text style={[T.caption, { color: notif.action.color, fontWeight: '700', letterSpacing: 0.5 }]}>
              {notif.action.label}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onAction} activeOpacity={0.75}>
            <Text style={[T.caption, { color: notif.action.color, fontWeight: '700', letterSpacing: 0.5 }]}>
              {notif.action.label}
            </Text>
          </TouchableOpacity>
        )
      )}
    </TouchableOpacity>
  );
}

export default function GuideNotification() {
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter,        setFilter]        = useState('All');

  function handleAction(notif) {
    if (!notif.navAction) return;
    const { tab, screen, params } = notif.navAction;
    navigation.navigate(tab, { screen, params });
  }

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markRead = (id) =>
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const filtered = notifications.filter((n) => {
    if (filter === 'All')    return true;
    if (filter === 'Unread') return n.unread;
    return n.type === filter;
  });

  const groups = [...new Set(filtered.map((n) => n.group))];

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: isOnline === false ? 12 : 52, paddingBottom: 16, paddingHorizontal: 20,
      }}>
        {/* Title row */}
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 4,
        }}>
          <Text style={[T.h1, { color: '#fff' }]}>Notifications</Text>
          <TouchableOpacity
            onPress={markAllRead}
            style={{
              borderWidth: 1.5, borderColor: '#fff', borderRadius: 20,
              paddingHorizontal: 14, paddingVertical: 7,
            }}
          >
            <Text style={[T.caption, { color: '#fff', fontWeight: '700' }]}>Mark all read</Text>
          </TouchableOpacity>
        </View>

        <Text style={[T.caption, { color: 'rgba(255,255,255,0.8)', marginBottom: 14 }]}>
          {unreadCount} unread
        </Text>

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 4 }}
        >
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={{
                  paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
                  backgroundColor: active ? '#fff' : 'rgba(0,0,0,0.2)',
                }}
              >
                <Text style={[T.caption, {
                  color: active ? '#15803d' : '#fff',
                  fontWeight: '700',
                }]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Notification list ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {groups.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 56 }}>
            <Ionicons name="notifications-off-outline" size={44} color="#d1d5db" />
            <Text style={[T.label, { color: '#9ca3af', marginTop: 12 }]}>No notifications</Text>
          </View>
        ) : (
          groups.map((group) => (
            <View key={group} style={{ marginBottom: 8 }}>
              {/* Group label */}
              <Text style={[T.caption, {
                color: '#9ca3af', letterSpacing: 0.8,
                marginBottom: 10, marginLeft: 2,
              }]}>
                {group}
              </Text>

              {filtered
                .filter((n) => n.group === group)
                .map((notif) => (
                  <NotifCard
                    key={notif.id}
                    notif={notif}
                    onMarkRead={markRead}
                    onAction={() => handleAction(notif)}
                  />
                ))}
            </View>
          ))
        )}
      </ScrollView>

    </View>
  );
}
