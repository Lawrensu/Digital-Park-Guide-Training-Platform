// src/screens/NotificationsScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';
import { MOCK_NOTIFICATIONS } from '../data/seedData';

// Icon and color config per notification type
const TYPE_CONFIG = {
  course:       { icon: 'book',            color: '#16a34a', bg: '#dcfce7' },
  result_pass:  { icon: 'trophy',          color: '#16a34a', bg: '#dcfce7' },
  result_fail:  { icon: 'refresh-circle',  color: '#dc2626', bg: '#fee2e2' },
  reminder:     { icon: 'alarm',           color: '#d97706', bg: '#fef3c7' },
  cert:         { icon: 'ribbon',          color: '#0891b2', bg: '#dbeafe' },
  announcement: { icon: 'megaphone',       color: '#7c3aed', bg: '#ede9fe' },
  alert:        { icon: 'warning',         color: '#dc2626', bg: '#fee2e2' },
  registration: { icon: 'person-add',      color: '#0891b2', bg: '#dbeafe' },
  cert_approval:{ icon: 'checkmark-circle',color: '#16a34a', bg: '#dcfce7' },
  quiz:         { icon: 'help-circle',     color: '#d97706', bg: '#fef3c7' },
  default:      { icon: 'notifications',   color: '#6b7280', bg: '#f3f4f6' },
};

const NotifItem = ({ notif, onRead, onAction }) => {
  const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.default;

  return (
    <TouchableOpacity
      onPress={() => onRead(notif.id)}
      style={{
        flexDirection: 'row', padding: 16,
        borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
        backgroundColor: notif.read ? '#fff' : '#f0fdf4',
      }}
    >
      {/* Icon */}
      <View style={{
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: config.bg,
        alignItems: 'center', justifyContent: 'center',
        marginRight: 12, flexShrink: 0,
      }}>
        <Ionicons name={config.icon} size={20} color={config.color} />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
          <Text style={{
            fontSize: 13, fontWeight: '700', color: '#111827',
            flex: 1, marginRight: 8, fontFamily: FONTS.title,
          }}>
            {notif.title}
          </Text>
          <Text style={{ fontSize: 10, color: '#9ca3af', fontFamily: FONTS.body, flexShrink: 0 }}>
            {notif.time}
          </Text>
        </View>
        <Text style={{
          fontSize: 12, color: '#6b7280', lineHeight: 18, fontFamily: FONTS.body,
        }}>
          {notif.message}
        </Text>

        {/* Retake button for failed quiz */}
        {notif.type === 'result_fail' && (
          <TouchableOpacity
            onPress={() => onAction('retake', notif)}
            style={{
              marginTop: 8, alignSelf: 'flex-start',
              backgroundColor: '#fee2e2', borderRadius: 8,
              paddingHorizontal: 12, paddingVertical: 6,
              flexDirection: 'row', alignItems: 'center', gap: 4,
            }}
          >
            <Ionicons name="refresh" size={12} color="#dc2626" />
            <Text style={{ fontSize: 11, color: '#dc2626', fontWeight: '700', fontFamily: FONTS.label }}>
              Retake Quiz
            </Text>
          </TouchableOpacity>
        )}

        {/* View cert button */}
        {notif.type === 'cert' && (
          <TouchableOpacity
            onPress={() => onAction('cert', notif)}
            style={{
              marginTop: 8, alignSelf: 'flex-start',
              backgroundColor: '#dbeafe', borderRadius: 8,
              paddingHorizontal: 12, paddingVertical: 6,
              flexDirection: 'row', alignItems: 'center', gap: 4,
            }}
          >
            <Ionicons name="ribbon" size={12} color="#0891b2" />
            <Text style={{ fontSize: 11, color: '#0891b2', fontWeight: '700', fontFamily: FONTS.label }}>
              View Certificate
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Unread dot */}
      {!notif.read && (
        <View style={{
          width: 8, height: 8, borderRadius: 4,
          backgroundColor: '#16a34a', marginLeft: 8, marginTop: 4, flexShrink: 0,
        }} />
      )}
    </TouchableOpacity>
  );
};

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('All');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filters = ['All', 'Unread', 'Courses', 'Results', 'Reminders'];

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !n.read;
    if (activeFilter === 'Courses') return n.type === 'course';
    if (activeFilter === 'Results') return n.type === 'result_pass' || n.type === 'result_fail';
    if (activeFilter === 'Reminders') return n.type === 'reminder' || n.type === 'announcement';
    return true;
  });

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleAction = (action, notif) => {
    if (action === 'retake') {
      Alert.alert('Retake Quiz', 'Navigate to the quiz to retake it.');
    } else if (action === 'cert') {
      navigation.navigate('Certifications');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>

      {/* Header */}
      <View style={{ backgroundColor: '#15803d', padding: 20, paddingTop: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#fff', fontFamily: FONTS.title }}>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontFamily: FONTS.body }}>
                {unreadCount} unread
              </Text>
            )}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={markAllRead}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
              }}
            >
              <Text style={{ fontSize: 12, color: '#fff', fontWeight: '700', fontFamily: FONTS.label }}>
                Mark all read
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 12, gap: 8 }}
        style={{ flexGrow: 0, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}
      >
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={{
              paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
              backgroundColor: activeFilter === f ? '#15803d' : '#f3f4f6',
            }}
          >
            <Text style={{
              fontSize: 12, fontWeight: '700', fontFamily: FONTS.label,
              color: activeFilter === f ? '#fff' : '#374151',
            }}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notification list */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{
          backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12,
          borderRadius: 16, overflow: 'hidden',
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
        }}>
          {filtered.length === 0 ? (
            <View style={{ padding: 48, alignItems: 'center' }}>
              <Ionicons name="notifications-off-outline" size={48} color="#d1d5db" />
              <Text style={{ fontSize: 16, color: '#6b7280', marginTop: 12, fontFamily: FONTS.body }}>
                No notifications
              </Text>
            </View>
          ) : (
            filtered.map((notif) => (
              <NotifItem
                key={notif.id}
                notif={notif}
                onRead={markRead}
                onAction={handleAction}
              />
            ))
          )}
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}
