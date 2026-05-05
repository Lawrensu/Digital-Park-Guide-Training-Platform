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

const ROLE_CFG = {
  'Super Admin':          { bg: '#fee2e2', color: '#dc2626' },
  'Content Manager':      { bg: '#dbeafe', color: '#2563eb' },
  'Quiz Manager':         { bg: '#fef3c7', color: '#d97706' },
  'Certification Manager':{ bg: '#ede9fe', color: '#7c3aed' },
};

const ADMINS = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    initials: 'SC',
    email: 'sarah.chen@parkguide.org',
    role: 'Super Admin',
    status: 'Active',
    lastActive: '2 hours ago',
  },
  {
    id: 2,
    name: 'Ahmad bin Abdullah',
    initials: 'AA',
    email: 'ahmad@parkguide.org',
    role: 'Content Manager',
    status: 'Active',
    lastActive: '1 day ago',
  },
  {
    id: 3,
    name: 'Maria Santos',
    initials: 'MS',
    email: 'maria.santos@parkguide.org',
    role: 'Quiz Manager',
    status: 'Active',
    lastActive: '3 hours ago',
  },
  {
    id: 4,
    name: 'James Okafor',
    initials: 'JO',
    email: 'james.okafor@parkguide.org',
    role: 'Certification Manager',
    status: 'Inactive',
    lastActive: '2 weeks ago',
  },
];

function AdminCard({ admin }) {
  const role      = ROLE_CFG[admin.role] ?? { bg: '#f3f4f6', color: '#6b7280' };
  const isActive  = admin.status === 'Active';

  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>

        {/* Avatar */}
        <View style={{
          width: 52, height: 52, borderRadius: 26,
          backgroundColor: '#15803d',
          alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Text style={[T.h4, { color: '#fff', fontSize: 18 }]}>{admin.initials}</Text>
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          {/* Name + status badge */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 3 }}>
            <Text style={[T.h4, { color: '#111827', flex: 1, marginRight: 8, lineHeight: 22 }]}>
              {admin.name}
            </Text>
            <View style={{
              paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8,
              backgroundColor: isActive ? '#dcfce7' : '#f3f4f6',
            }}>
              <Text style={[T.caption, {
                color: isActive ? '#15803d' : '#9ca3af', fontWeight: '700',
              }]}>
                {admin.status}
              </Text>
            </View>
          </View>

          {/* Email */}
          <Text style={[T.caption, { color: '#6b7280', marginBottom: 8 }]}>
            {admin.email}
          </Text>

          {/* Role badge */}
          <View style={{
            alignSelf: 'flex-start',
            backgroundColor: role.bg, borderRadius: 6,
            paddingHorizontal: 10, paddingVertical: 4,
            marginBottom: 8,
          }}>
            <Text style={[T.caption, { color: role.color, fontWeight: '700' }]}>
              {admin.role}
            </Text>
          </View>

          {/* Last active */}
          <Text style={[T.caption, { color: '#9ca3af' }]}>
            Last active: {admin.lastActive}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function AdminListScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');

  const filtered = ADMINS.filter((a) =>
    !search.trim() ||
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={[T.h2, { color: '#fff' }]}>Admin List</Text>
              <Text style={[T.caption, { color: 'rgba(255,255,255,0.75)', marginTop: 2 }]}>
                {ADMINS.length} administrators
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('CreateAdmin')}
            style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: '#fff',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name="add" size={24} color="#15803d" />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 10,
          backgroundColor: '#fff', borderRadius: 12,
          paddingHorizontal: 14, paddingVertical: 12,
          marginTop: 14,
        }}>
          <Ionicons name="search" size={18} color="#15803d" />
          <TextInput
            style={[T.bodySm, { flex: 1, color: '#374151', padding: 0 }]}
            placeholder="Search admins..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {filtered.map((admin) => (
          <AdminCard key={admin.id} admin={admin} />
        ))}

        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Ionicons name="search-outline" size={44} color="#d1d5db" />
            <Text style={[T.label, { color: '#9ca3af', marginTop: 12 }]}>No admins found</Text>
          </View>
        )}

        {/* Add New Admin dashed button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateAdmin')}
          style={{
            borderWidth: 1.5, borderColor: '#15803d', borderStyle: 'dashed',
            borderRadius: 16, paddingVertical: 18,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginTop: 4,
          }}
        >
          <Ionicons name="add" size={20} color="#15803d" />
          <Text style={[T.label, { color: '#15803d', fontWeight: '700' }]}>Add New Admin</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
