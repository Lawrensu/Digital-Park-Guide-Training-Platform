import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  display: { fontFamily: sans,  fontSize: 36, fontWeight: '600' },
  h1:      { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h2:      { fontFamily: sans,  fontSize: 24, fontWeight: '600' },
  h3:      { fontFamily: sans,  fontSize: 20, fontWeight: '500' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodyLg:  { fontFamily: serif, fontSize: 18, fontWeight: '400' },
  bodyDef: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const ROLES = [
  {
    key: 'super_admin',
    label: 'Super Admin',
    description: 'Full system access',
    badgeBg: '#fee2e2',
    badgeColor: '#dc2626',
  },
  {
    key: 'content_manager',
    label: 'Content Manager',
    description: 'Manage courses and modules',
    badgeBg: '#ccfbf1',
    badgeColor: '#0d9488',
  },
  {
    key: 'quiz_manager',
    label: 'Quiz Manager',
    description: 'Manage quizzes and grading',
    badgeBg: '#fef3c7',
    badgeColor: '#d97706',
  },
  {
    key: 'certification_manager',
    label: 'Certification Manager',
    description: 'Issue certifications',
    badgeBg: '#ede9fe',
    badgeColor: '#7c3aed',
  },
];

function SectionCard({ title, children }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={[T.h3, { color: '#111827', marginBottom: 12 }]}>{title}</Text>
      <View style={{
        backgroundColor: '#fff', borderRadius: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        overflow: 'hidden',
      }}>
        {children}
      </View>
    </View>
  );
}

function FieldRow({ label, children, isLast }) {
  return (
    <View style={{
      paddingHorizontal: 18, paddingTop: 16,
      paddingBottom: isLast ? 18 : 14,
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: '#f3f4f6',
    }}>
      <Text style={[T.caption, { color: '#6b7280', marginBottom: 8, letterSpacing: 0.3 }]}>
        {label}
      </Text>
      {children}
    </View>
  );
}

export default function CreateAdminScreen() {
  const navigation = useNavigation();

  const [fullName,    setFullName]    = useState('');
  const [email,       setEmail]       = useState('');
  const [authMethod,  setAuthMethod]  = useState('password');
  const [password,    setPassword]    = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20,
        flexDirection: 'row', alignItems: 'center', gap: 14,
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={[T.h2, { color: '#fff' }]}>Create Admin</Text>
          <Text style={[T.caption, { color: 'rgba(255,255,255,0.75)', marginTop: 2 }]}>
            Add a new administrator
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >

        {/* ── Admin Details ── */}
        <SectionCard title="Admin Details">
          <FieldRow label="Full Name">
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
              placeholderTextColor="#9ca3af"
              style={[T.bodyDef, {
                borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
                paddingHorizontal: 14, paddingVertical: 11, color: '#111827',
              }]}
            />
          </FieldRow>
          <FieldRow label="Email Address" isLast>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="admin@parkguide.org"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              style={[T.bodyDef, {
                borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
                paddingHorizontal: 14, paddingVertical: 11, color: '#111827',
              }]}
            />
          </FieldRow>
        </SectionCard>

        {/* ── Authentication ── */}
        <SectionCard title="Authentication">
        {/* Send Invite Email option */}
          <TouchableOpacity
            onPress={() => setAuthMethod('invite')}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 14,
              paddingHorizontal: 18, paddingVertical: 16,
              borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
            }}
            activeOpacity={0.7}
          >
            <View style={{
              width: 22, height: 22, borderRadius: 11,
              borderWidth: 2,
              borderColor: authMethod === 'invite' ? '#15803d' : '#d1d5db',
              alignItems: 'center', justifyContent: 'center',
            }}>
              {authMethod === 'invite' && (
                <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: '#15803d' }} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[T.h4, { color: '#111827' }]}>Send Invite Email</Text>
              <Text style={[T.caption, { color: '#6b7280', marginTop: 2 }]}>
                Admin sets their own password via email
              </Text>
            </View>
          </TouchableOpacity>
        </SectionCard>

        {/* ── Buttons ── */}
        <TouchableOpacity style={{
          backgroundColor: '#15803d', borderRadius: 14,
          paddingVertical: 17, alignItems: 'center', marginBottom: 12,
        }}>
          <Text style={[T.label, { color: '#fff', fontWeight: '700', fontSize: 15 }]}>
            Create Admin Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 14,
            paddingVertical: 17, alignItems: 'center',
            backgroundColor: '#fff',
          }}
        >
          <Text style={[T.label, { color: '#374151', fontWeight: '600', fontSize: 15 }]}>
            Cancel
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
