import React, { useState } from 'react';
import {
  View, Text, Modal, ScrollView, TouchableOpacity,
  TextInput, Switch, Platform, KeyboardAvoidingView,
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

const LEVELS = ['Foundation', 'Intermediate', 'Advanced', 'Expert'];

function FieldLabel({ text }) {
  return (
    <Text style={[T.caption, {
      color: '#9ca3af', letterSpacing: 0.5, marginBottom: 6, marginTop: 16,
    }]}>
      {text}
    </Text>
  );
}

function InputBox({ value, onChangeText, placeholder, editable = true }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      editable={editable}
      style={[T.bodyDef, {
        borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
        paddingHorizontal: 14, paddingVertical: 12,
        color: editable ? '#111827' : '#6b7280',
        backgroundColor: editable ? '#fff' : '#f9fafb',
      }]}
    />
  );
}

export default function CertIssueModal({ visible, onClose, cert, onIssued }) {
  const [certTitle,  setCertTitle]  = useState('Certified Biodiversity Guide');
  const [level,      setLevel]      = useState('Foundation');
  const [expiryDate, setExpiryDate] = useState('01/15/2026');
  const [notify,     setNotify]     = useState(true);
  const [showLevels, setShowLevels] = useState(false);

  if (!cert) return null;

  const initial = cert.name.charAt(0).toUpperCase();

  const handleIssue = () => {
    onIssued?.(cert.id);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            overflow: 'hidden',
            maxHeight: '92%',
          }}>

            {/* ── Green modal header ── */}
            <View style={{
              backgroundColor: '#15803d',
              paddingTop: 24, paddingBottom: 20, paddingHorizontal: 20,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={[T.h2, { color: '#fff' }]}>Issue Certificate</Text>
                  <Text style={[T.caption, { color: 'rgba(255,255,255,0.75)', marginTop: 4 }]}>
                    Confirm and send to guide
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

              {/* Guide profile row */}
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                paddingBottom: 16, marginBottom: 4,
                borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
              }}>
                <View style={{
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: '#15803d',
                  alignItems: 'center', justifyContent: 'center',
                  marginRight: 12,
                }}>
                  <Text style={[T.h4, { color: '#fff' }]}>{initial}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[T.h4, { color: '#111827' }]}>{cert.name}</Text>
                  <Text style={[T.caption, { color: '#6b7280', marginTop: 2 }]}>
                    Wildlife Conservation
                  </Text>
                </View>
                <Text style={[T.caption, { color: '#0d9488', fontWeight: '700', letterSpacing: 0.3 }]}>
                  VERIFIED
                </Text>
              </View>

              {/* Certificate details label */}
              <FieldLabel text="CERTIFICATE DETAILS" />

              {/* Course name (read-only) */}
              <InputBox value={cert.course} editable={false} />

              {/* Score row */}
              <View style={{
                backgroundColor: '#f0fdf4',
                borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
                marginTop: 10,
                flexDirection: 'row', alignItems: 'center',
              }}>
                <Text style={[T.label, { color: '#16a34a' }]}>
                  Score: {cert.score}%{'  '}✓ Passed
                </Text>
              </View>

              {/* Cert Title */}
              <FieldLabel text="CERT TITLE" />
              <InputBox
                value={certTitle}
                onChangeText={setCertTitle}
                placeholder="Enter certificate title"
              />

              {/* Level dropdown */}
              <FieldLabel text="LEVEL" />
              <TouchableOpacity
                onPress={() => setShowLevels(!showLevels)}
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
                  paddingHorizontal: 14, paddingVertical: 13,
                  backgroundColor: '#fff',
                }}
              >
                <Text style={[T.bodyDef, { color: '#111827' }]}>{level}</Text>
                <Ionicons
                  name={showLevels ? 'chevron-up' : 'chevron-down'}
                  size={18} color="#6b7280"
                />
              </TouchableOpacity>
              {showLevels && (
                <View style={{
                  borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
                  marginTop: 4, backgroundColor: '#fff', overflow: 'hidden',
                }}>
                  {LEVELS.map((l, i) => (
                    <TouchableOpacity
                      key={l}
                      onPress={() => { setLevel(l); setShowLevels(false); }}
                      style={{
                        paddingHorizontal: 14, paddingVertical: 13,
                        borderBottomWidth: i < LEVELS.length - 1 ? 1 : 0,
                        borderBottomColor: '#f3f4f6',
                        backgroundColor: level === l ? '#f0fdf4' : '#fff',
                      }}
                    >
                      <Text style={[T.bodyDef, { color: level === l ? '#15803d' : '#374151' }]}>
                        {l}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Expiry Date */}
              <FieldLabel text="EXPIRY DATE" />
              <InputBox
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="MM/DD/YYYY"
              />

              {/* Notify toggle */}
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                marginTop: 20, marginBottom: 6,
              }}>
                <Text style={[T.label, { flex: 1, color: '#111827' }]}>
                  Notify Guide via Push Notification
                </Text>
                <Switch
                  value={notify}
                  onValueChange={setNotify}
                  trackColor={{ false: '#d1d5db', true: '#15803d' }}
                  thumbColor="#fff"
                />
              </View>
              <Text style={[T.caption, { color: '#9ca3af', marginBottom: 28 }]}>
                Guide will receive a notification when certificate is issued
              </Text>

              {/* Issue button */}
              <TouchableOpacity
                onPress={handleIssue}
                activeOpacity={0.85}
                style={{
                  backgroundColor: '#15803d', borderRadius: 14,
                  paddingVertical: 16, alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Text style={[T.h4, { color: '#fff' }]}>Issue Certificate Now</Text>
              </TouchableOpacity>

              {/* Cancel */}
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
