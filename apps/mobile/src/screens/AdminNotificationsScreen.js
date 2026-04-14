// src/screens/AdminNotificationsScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Modal, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';
import { MOCK_ADMIN_NOTIFICATIONS, MOCK_USERS } from '../data/seedData';

const TYPE_CONFIG = {
  registration:  { icon: 'person-add',       color: '#0891b2', bg: '#dbeafe' },
  alert:         { icon: 'warning',           color: '#dc2626', bg: '#fee2e2' },
  cert_approval: { icon: 'ribbon',            color: '#16a34a', bg: '#dcfce7' },
  announcement:  { icon: 'megaphone',         color: '#7c3aed', bg: '#ede9fe' },
  default:       { icon: 'notifications',     color: '#6b7280', bg: '#f3f4f6' },
};

const AdminNotifItem = ({ notif, onRead, onAction }) => {
  const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.default;
  return (
    <View style={{
      flexDirection: 'row', padding: 16,
      borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
      backgroundColor: notif.read ? '#fff' : '#f0fdf4',
    }}>
      <View style={{
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: config.bg,
        alignItems: 'center', justifyContent: 'center',
        marginRight: 12, flexShrink: 0,
      }}>
        <Ionicons name={config.icon} size={20} color={config.color} />
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827', flex: 1, marginRight: 8, fontFamily: FONTS.title }}>
            {notif.title}
          </Text>
          <Text style={{ fontSize: 10, color: '#9ca3af', fontFamily: FONTS.body }}>{notif.time}</Text>
        </View>
        <Text style={{ fontSize: 12, color: '#6b7280', lineHeight: 18, fontFamily: FONTS.body, marginBottom: 10 }}>
          {notif.message}
        </Text>

        {/* Registration actions */}
        {notif.type === 'registration' && (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => onAction('approve', notif)}
              style={{ backgroundColor: '#dcfce7', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <Ionicons name="checkmark" size={13} color="#16a34a" />
              <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '700', fontFamily: FONTS.label }}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onAction('reject', notif)}
              style={{ backgroundColor: '#fee2e2', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <Ionicons name="close" size={13} color="#dc2626" />
              <Text style={{ fontSize: 12, color: '#dc2626', fontWeight: '700', fontFamily: FONTS.label }}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Alert actions */}
        {notif.type === 'alert' && (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => onAction('confirm_violation', notif)}
              style={{ backgroundColor: '#fee2e2', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <Ionicons name="warning" size={13} color="#dc2626" />
              <Text style={{ fontSize: 12, color: '#dc2626', fontWeight: '700', fontFamily: FONTS.label }}>Confirm Violation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onAction('false_detection', notif)}
              style={{ backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <Ionicons name="checkmark-circle" size={13} color="#6b7280" />
              <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: '700', fontFamily: FONTS.label }}>False Detection</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Cert approval actions */}
        {notif.type === 'cert_approval' && (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => onAction('approve_cert', notif)}
              style={{ backgroundColor: '#dcfce7', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <Ionicons name="ribbon" size={13} color="#16a34a" />
              <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '700', fontFamily: FONTS.label }}>Issue Certificate</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!notif.read && (
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#16a34a', marginLeft: 8, marginTop: 4, flexShrink: 0 }} />
      )}
    </View>
  );
};

export default function AdminNotificationsScreen() {
  const [notifications, setNotifications] = useState(MOCK_ADMIN_NOTIFICATIONS);
  const [sendModal, setSendModal] = useState(false);
  const [customForm, setCustomForm] = useState({ title: '', message: '', recipient: 'all' });
  const [formErrors, setFormErrors] = useState({});

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleAction = (action, notif) => {
    const messages = {
      approve:           'Registration approved. Guide will be notified.',
      reject:            'Registration rejected.',
      confirm_violation: 'Violation confirmed and flagged. Authorities notified.',
      false_detection:   'Marked as false detection.',
      approve_cert:      'Certificate issued! Guide will be notified.',
    };
    Alert.alert('Action', messages[action] || 'Done.');
    setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n));
  };

  const validateForm = () => {
    const errors = {};
    if (!customForm.title.trim()) errors.title = 'Title is required';
    if (!customForm.message.trim()) errors.message = 'Message is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSend = () => {
    if (!validateForm()) return;
    const recipientLabel = customForm.recipient === 'all'
      ? 'all park guides'
      : MOCK_USERS.find((u) => u.id === parseInt(customForm.recipient))?.name || 'selected guide';
    Alert.alert('Notification Sent', `"${customForm.title}" sent to ${recipientLabel}.`);
    setSendModal(false);
    setCustomForm({ title: '', message: '', recipient: 'all' });
    setFormErrors({});
  };

  const guides = MOCK_USERS.filter((u) => u.role === 'user');

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>

      {/* Header */}
      <View style={{ backgroundColor: '#15803d', padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#fff', fontFamily: FONTS.title }}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontFamily: FONTS.body }}>
                {unreadCount} unread
              </Text>
            )}
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllRead} style={{ backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 }}>
                <Text style={{ fontSize: 11, color: '#fff', fontWeight: '700', fontFamily: FONTS.label }}>Mark all read</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => setSendModal(true)}
              style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 5 }}
            >
              <Ionicons name="send" size={13} color="#15803d" />
              <Text style={{ fontSize: 11, color: '#15803d', fontWeight: '700', fontFamily: FONTS.label }}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{
          backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16,
          borderRadius: 16, overflow: 'hidden',
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
        }}>
          {notifications.length === 0 ? (
            <View style={{ padding: 48, alignItems: 'center' }}>
              <Ionicons name="notifications-off-outline" size={48} color="#d1d5db" />
              <Text style={{ fontSize: 16, color: '#6b7280', marginTop: 12, fontFamily: FONTS.body }}>No notifications</Text>
            </View>
          ) : (
            notifications.map((notif) => (
              <AdminNotifItem key={notif.id} notif={notif} onRead={() => {}} onAction={handleAction} />
            ))
          )}
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Send Custom Notification Modal */}
      <Modal visible={sendModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%' }}>

            {/* Modal header */}
            <View style={{ backgroundColor: '#15803d', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff', fontFamily: FONTS.title }}>Send Notification</Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontFamily: FONTS.body }}>Send to a guide or all guides</Text>
              </View>
              <TouchableOpacity
                onPress={() => { setSendModal(false); setFormErrors({}); }}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 24 }} keyboardShouldPersistTaps="handled">

              {/* Recipient */}
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#374151', marginBottom: 8, fontFamily: FONTS.label }}>SEND TO</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
                <TouchableOpacity
                  onPress={() => setCustomForm((p) => ({ ...p, recipient: 'all' }))}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5,
                    borderColor: customForm.recipient === 'all' ? '#15803d' : '#e5e7eb',
                    backgroundColor: customForm.recipient === 'all' ? '#f0fdf4' : '#fff',
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', fontFamily: FONTS.label, color: customForm.recipient === 'all' ? '#15803d' : '#374151' }}>
                    All Park Guides
                  </Text>
                </TouchableOpacity>
                {guides.map((g) => (
                  <TouchableOpacity
                    key={g.id}
                    onPress={() => setCustomForm((p) => ({ ...p, recipient: String(g.id) }))}
                    style={{
                      paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5,
                      borderColor: customForm.recipient === String(g.id) ? '#15803d' : '#e5e7eb',
                      backgroundColor: customForm.recipient === String(g.id) ? '#f0fdf4' : '#fff',
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '700', fontFamily: FONTS.label, color: customForm.recipient === String(g.id) ? '#15803d' : '#374151' }}>
                      {g.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Title */}
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#374151', marginBottom: 8, fontFamily: FONTS.label }}>TITLE</Text>
              <TextInput
                value={customForm.title}
                onChangeText={(t) => { setCustomForm((p) => ({ ...p, title: t })); setFormErrors((p) => ({ ...p, title: null })); }}
                placeholder="e.g. Safety Reminder"
                placeholderTextColor="#d1d5db"
                style={{
                  borderWidth: 1.5, borderColor: formErrors.title ? '#ef4444' : '#e5e7eb',
                  borderRadius: 12, padding: 12, fontSize: 14, color: '#111827',
                  fontFamily: FONTS.body, backgroundColor: '#fff', marginBottom: 4,
                }}
              />
              {formErrors.title && <Text style={{ fontSize: 11, color: '#ef4444', marginBottom: 10, fontFamily: FONTS.body }}>{formErrors.title}</Text>}

              {/* Message */}
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#374151', marginTop: 12, marginBottom: 8, fontFamily: FONTS.label }}>MESSAGE</Text>
              <TextInput
                value={customForm.message}
                onChangeText={(t) => { setCustomForm((p) => ({ ...p, message: t })); setFormErrors((p) => ({ ...p, message: null })); }}
                placeholder="Type your notification message here..."
                placeholderTextColor="#d1d5db"
                multiline
                numberOfLines={4}
                style={{
                  borderWidth: 1.5, borderColor: formErrors.message ? '#ef4444' : '#e5e7eb',
                  borderRadius: 12, padding: 12, fontSize: 14, color: '#111827',
                  fontFamily: FONTS.body, backgroundColor: '#fff',
                  textAlignVertical: 'top', minHeight: 100, marginBottom: 4,
                }}
              />
              {formErrors.message && <Text style={{ fontSize: 11, color: '#ef4444', marginBottom: 10, fontFamily: FONTS.body }}>{formErrors.message}</Text>}

              {/* Send button */}
              <TouchableOpacity
                onPress={handleSend}
                style={{
                  backgroundColor: '#15803d', borderRadius: 14, padding: 16,
                  alignItems: 'center', marginTop: 16,
                  flexDirection: 'row', justifyContent: 'center', gap: 8,
                  shadowColor: '#15803d', shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
                }}
              >
                <Ionicons name="send" size={18} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800', fontFamily: FONTS.button }}>Send Notification</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { setSendModal(false); setFormErrors({}); }}
                style={{ padding: 14, alignItems: 'center', marginTop: 8 }}
              >
                <Text style={{ fontSize: 14, color: '#9ca3af', fontFamily: FONTS.body }}>Cancel</Text>
              </TouchableOpacity>
              <View style={{ height: 32 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
