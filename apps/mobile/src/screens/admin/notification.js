import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomNotificationModal from './customnotification';
import CertIssueModal         from './certissue';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h1:        { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h4:        { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodySmall: { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:     { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption:   { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'registration',
    icon: 'person',
    iconColor: '#f59e0b',
    iconBg: '#fef3c7',
    title: 'New Registration Request',
    subtitle: 'Ahmad bin Abdullah applied',
    time: '5m ago',
    unread: true,
    unreadColor: '#3b82f6',
    actions: [
      { label: 'View Details', color: '#16a34a', border: '#16a34a' },
    ],
  },
  {
    id: 2,
    type: 'alert',
    icon: 'warning',
    iconColor: '#d97706',
    iconBg: '#fef3c7',
    title: 'Abnormal Activity Detected',
    subtitle: 'Sector 7B — unusual movement',
    time: '12m ago',
    unread: true,
    unreadColor: '#ef4444',
    actions: [
      { label: 'View Evidence', color: '#16a34a', border: '#16a34a' },
    ],
  },
  {
    id: 3,
    type: 'certificate',
    icon: 'ribbon',
    iconColor: '#f59e0b',
    iconBg: '#fef3c7',
    title: 'Certificate Pending Approval',
    subtitle: 'Amira Hassan completed module',
    time: '1h ago',
    unread: false,
    unreadColor: null,
    cert: { id: 3, name: 'Amira Hassan', course: 'Rainforest Biodiversity Fundamentals', score: 85 },
    actions: [
      { label: 'Issue Certificate', color: '#16a34a', border: '#16a34a' },
    ],
  },
];

function NotifItem({ notif, isLast, onActionPress }) {
  return (
    <View style={{
      paddingHorizontal: 18, paddingVertical: 16,
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: '#f3f4f6',
    }}>
      {/* Top row: icon + title + time + dot */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
        <View style={{
          width: 42, height: 42, borderRadius: 21,
          backgroundColor: notif.iconBg,
          alignItems: 'center', justifyContent: 'center',
          marginRight: 12,
        }}>
          <Ionicons name={notif.icon} size={20} color={notif.iconColor} />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={[T.h4, { color: '#111827', flex: 1, marginRight: 8 }]}>
              {notif.title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[T.caption, { color: '#9ca3af' }]}>{notif.time}</Text>
              {notif.unread && (
                <View style={{
                  width: 8, height: 8, borderRadius: 4,
                  backgroundColor: notif.unreadColor,
                }} />
              )}
            </View>
          </View>
          <Text style={[T.bodySmall, { color: '#6b7280', marginTop: 3, lineHeight: 20 }]}>
            {notif.subtitle}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={{ flexDirection: 'row', gap: 10, paddingLeft: 54 }}>
        {notif.actions.map((action) => (
          <TouchableOpacity
            key={action.label}
            onPress={() => onActionPress && onActionPress(action.label)}
            style={{
              paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
              borderWidth: 1.5, borderColor: action.border,
              backgroundColor: action.color === '#16a34a' ? '#f0fdf4' :
                               action.color === '#dc2626' ? '#fff5f5' : '#f9fafb',
            }}
          >
            <Text style={[T.caption, { color: action.color, fontWeight: '600' }]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function NotificationsScreen() {
  const navigation                            = useNavigation();
  const [notifications,   setNotifications]   = useState(INITIAL_NOTIFICATIONS);
  const [showSendModal,   setShowSendModal]   = useState(false);
  const [activeCert,      setActiveCert]      = useState(null);

  function getActionHandler(notif) {
    if (notif.type === 'registration') return () => navigation.navigate('RegistrationDetails');
    if (notif.type === 'alert')        return () => navigation.navigate('IoTDetails');
    if (notif.type === 'certificate')  return () => setActiveCert(notif.cert);
    return null;
  }

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20,
        flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
      }}>
        <View>
          <Text style={[T.h1, { color: '#fff' }]}>Notifications</Text>
          <Text style={[T.caption, { color: 'rgba(255,255,255,0.8)', marginTop: 4 }]}>
            {unreadCount} unread
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowSendModal(true)}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            borderWidth: 1.5, borderColor: '#fff', borderRadius: 20,
            paddingHorizontal: 16, paddingVertical: 8,
          }}
        >
          <Text style={[T.label, { color: '#fff' }]}>Send</Text>
          <Ionicons name="arrow-up-right" size={14} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {/* Notifications card */}
        {notifications.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <Ionicons name="notifications-off-outline" size={44} color="#d1d5db" />
            <Text style={[T.label, { color: '#9ca3af', marginTop: 12 }]}>No notifications</Text>
          </View>
        ) : (
          <View style={{
            backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
            shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
          }}>
            {notifications.map((notif, i) => (
              <NotifItem
                key={notif.id}
                notif={notif}
                isLast={i === notifications.length - 1}
                onActionPress={getActionHandler(notif)}
              />
            ))}
          </View>
        )}

        {/* Mark all read */}
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={markAllRead}
            style={{ alignItems: 'center', marginTop: 16 }}
          >
            <Text style={[T.caption, { color: '#15803d', fontWeight: '600' }]}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <CustomNotificationModal
        visible={showSendModal}
        onClose={() => setShowSendModal(false)}
      />

      <CertIssueModal
        visible={activeCert !== null}
        cert={activeCert}
        onClose={() => setActiveCert(null)}
        onIssued={() => setActiveCert(null)}
      />
    </View>
  );
}
