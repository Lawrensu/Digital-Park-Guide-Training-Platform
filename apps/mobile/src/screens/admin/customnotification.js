import React, { useState } from 'react';
import {
  View, Text, Modal, ScrollView, TouchableOpacity,
  TextInput, Platform, KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h2:      { fontFamily: sans,  fontSize: 24, fontWeight: '600' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodyDef: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const RECIPIENTS = [
  { id: 'all',   label: 'All Park Guides' },
  { id: 'amira', label: 'Amira Hassan' },
  { id: 'james', label: 'James Okafor' },
];

const NOTIF_TYPES = [
  { id: 'general',   label: 'General',   icon: 'megaphone',     iconColor: '#e11d48', iconBg: '#fff1f2' },
  { id: 'reminder',  label: 'Reminder',  icon: 'alarm',         iconColor: '#ea580c', iconBg: '#fff7ed' },
  { id: 'urgent',    label: 'Urgent',    icon: 'warning',       iconColor: '#d97706', iconBg: '#fef3c7' },
  { id: 'module',    label: 'Module',    icon: 'albums',        iconColor: '#16a34a', iconBg: '#f0fdf4' },
];

function FieldLabel({ text }) {
  return (
    <Text style={[T.caption, {
      color: '#9ca3af', letterSpacing: 0.5,
      marginBottom: 8, marginTop: 20,
    }]}>
      {text}
    </Text>
  );
}

export default function CustomNotificationModal({ visible, onClose }) {
  const [selectedRecipients, setSelectedRecipients] = useState(['all']);
  const [notifType,          setNotifType]          = useState('general');
  const [title,              setTitle]              = useState('');
  const [message,            setMessage]            = useState('');
  const [schedule,           setSchedule]           = useState('now');

  const toggleRecipient = (id) => {
    if (id === 'all') {
      setSelectedRecipients(['all']);
      return;
    }
    setSelectedRecipients((prev) => {
      const withoutAll = prev.filter((r) => r !== 'all');
      if (withoutAll.includes(id)) {
        const next = withoutAll.filter((r) => r !== id);
        return next.length === 0 ? ['all'] : next;
      }
      return [...withoutAll, id];
    });
  };

  const handleSend = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1, justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.45)',
      }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            overflow: 'hidden', maxHeight: '94%',
          }}>

            {/* ── Green modal header ── */}
            <View style={{
              backgroundColor: '#15803d',
              paddingTop: 24, paddingBottom: 20, paddingHorizontal: 20,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={[T.h2, { color: '#fff' }]}>Send Notification</Text>
                  <Text style={[T.caption, { color: 'rgba(255,255,255,0.75)', marginTop: 4 }]}>
                    Customise and send to guides
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
                  <Ionicons name="close" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Scrollable body ── */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 20, paddingBottom: 36 }}
              keyboardShouldPersistTaps="handled"
            >

              {/* ── SEND TO ── */}
              <FieldLabel text="SEND TO" />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {RECIPIENTS.map((r) => {
                  const active = selectedRecipients.includes(r.id);
                  return (
                    <TouchableOpacity
                      key={r.id}
                      onPress={() => toggleRecipient(r.id)}
                      style={{
                        paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20,
                        backgroundColor: active ? '#15803d' : '#fff',
                        borderWidth: 1.5,
                        borderColor: active ? '#15803d' : '#d1d5db',
                      }}
                    >
                      <Text style={[T.label, { color: active ? '#fff' : '#374151' }]}>
                        {r.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* ── NOTIFICATION TYPE ── */}
              <FieldLabel text="NOTIFICATION TYPE" />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {NOTIF_TYPES.map((type) => {
                  const active = notifType === type.id;
                  return (
                    <TouchableOpacity
                      key={type.id}
                      onPress={() => setNotifType(type.id)}
                      style={{
                        width: '47%', flexDirection: 'row', alignItems: 'center',
                        gap: 10, paddingHorizontal: 14, paddingVertical: 14,
                        borderRadius: 12, backgroundColor: '#fff',
                        borderWidth: 1.5,
                        borderColor: active ? '#15803d' : '#e5e7eb',
                      }}
                    >
                      <View style={{
                        width: 32, height: 32, borderRadius: 8,
                        backgroundColor: type.iconBg,
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Ionicons name={type.icon} size={18} color={type.iconColor} />
                      </View>
                      <Text style={[T.label, { color: active ? '#15803d' : '#374151' }]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* ── TITLE ── */}
              <FieldLabel text="TITLE" />
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter notification title"
                placeholderTextColor="#9ca3af"
                style={[T.bodyDef, {
                  borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
                  paddingHorizontal: 14, paddingVertical: 12,
                  color: '#111827',
                }]}
              />

              {/* ── MESSAGE ── */}
              <FieldLabel text="MESSAGE" />
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Enter your message..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                style={[T.bodyDef, {
                  borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
                  paddingHorizontal: 14, paddingVertical: 12,
                  color: '#111827', minHeight: 120, lineHeight: 22,
                }]}
              />

              {/* ── SCHEDULE ── */}
              <FieldLabel text="SCHEDULE" />
              {[
                { id: 'now',  label: 'Send Now' },
                { id: 'later', label: 'Schedule for Later' },
              ].map((opt) => {
                const active = schedule === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setSchedule(opt.id)}
                    style={{
                      flexDirection: 'row', alignItems: 'center',
                      gap: 12, paddingVertical: 10,
                    }}
                  >
                    <View style={{
                      width: 20, height: 20, borderRadius: 10,
                      borderWidth: 2,
                      borderColor: active ? '#15803d' : '#9ca3af',
                      backgroundColor: active ? '#15803d' : 'transparent',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      {active && (
                        <View style={{
                          width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff',
                        }} />
                      )}
                    </View>
                    <Text style={[T.label, { color: active ? '#111827' : '#6b7280' }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* ── Send button ── */}
              <TouchableOpacity
                onPress={handleSend}
                activeOpacity={0.85}
                style={{
                  backgroundColor: '#15803d', borderRadius: 14,
                  paddingVertical: 16, marginTop: 24, marginBottom: 10,
                  flexDirection: 'row', alignItems: 'center',
                  justifyContent: 'center', gap: 10,
                }}
              >
                <Ionicons name="notifications" size={18} color="#fff" />
                <Text style={[T.h4, { color: '#fff' }]}>Send Notification</Text>
              </TouchableOpacity>

              {/* ── Cancel ── */}
              <TouchableOpacity onPress={onClose} style={{ alignItems: 'center', paddingVertical: 8 }}>
                <Text style={[T.label, { color: '#6b7280' }]}>Cancel</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
