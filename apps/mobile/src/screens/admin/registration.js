import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h1:        { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h4:        { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodySmall: { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:     { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption:   { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const STATUS = {
  PENDING:  { label: 'PENDING REVIEW', color: '#d97706', bg: '#fef3c7' },
  APPROVED: { label: 'APPROVED',       color: '#16a34a', bg: '#dcfce7' },
  REJECTED: { label: 'REJECTED',       color: '#dc2626', bg: '#fee2e2' },
};

const FILTERS = ['All', 'Pending', 'Approved', 'Rejected'];

const REGISTRATIONS = [
  {
    id: 1,
    name: 'Ahmad bin Abdullah',
    email: 'ahmad.abdullah@example.com',
    appliedDate: '13 Apr 2026',
    cvAttached: true,
    status: 'PENDING',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    appliedDate: '10 Apr 2026',
    cvAttached: true,
    status: 'APPROVED',
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    email: 'marcus.j@example.com',
    appliedDate: '8 Apr 2026',
    cvAttached: false,
    status: 'REJECTED',
  },
  {
    id: 4,
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    appliedDate: '6 Apr 2026',
    cvAttached: true,
    status: 'PENDING',
  },
  {
    id: 5,
    name: 'David Osei',
    email: 'david.osei@example.com',
    appliedDate: '4 Apr 2026',
    cvAttached: true,
    status: 'PENDING',
  },
];

function StatusBadge({ status }) {
  const { label, color, bg } = STATUS[status];
  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: bg }}>
      <Text style={[T.caption, { color, fontWeight: '700', letterSpacing: 0.3 }]}>{label}</Text>
    </View>
  );
}

function RegistrationCard({ reg }) {
  const navigation = useNavigation();
  const initial    = reg.name.charAt(0).toUpperCase();
  const isPending  = reg.status === 'PENDING';

  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    }}>
      {/* Top row */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 }}>
        <View style={{
          width: 46, height: 46, borderRadius: 23,
          backgroundColor: '#15803d', alignItems: 'center', justifyContent: 'center',
          marginRight: 12,
        }}>
          <Text style={[T.h4, { color: '#fff' }]}>{initial}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={[T.h4, { color: '#111827', flex: 1, marginRight: 8 }]}>{reg.name}</Text>
            <StatusBadge status={reg.status} />
          </View>
          <Text style={[T.caption, { color: '#6b7280', marginTop: 4 }]}>{reg.email}</Text>
          <Text style={[T.caption, { color: '#9ca3af', marginTop: 3 }]}>
            Applied: {reg.appliedDate}
          </Text>
          {reg.cvAttached && (
            <Text style={[T.caption, { color: '#16a34a', fontWeight: '600', marginTop: 4 }]}>
              CV Attached
            </Text>
          )}
        </View>
      </View>

      {/* Action button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('RegistrationDetails', { reg })}
        style={{
          borderRadius: 10, paddingVertical: 12,
          alignItems: 'center', justifyContent: 'center',
          flexDirection: 'row', gap: 6,
          backgroundColor: isPending ? '#15803d' : 'transparent',
          borderWidth: isPending ? 0 : 1.5,
          borderColor: isPending ? undefined : '#e5e7eb',
        }}
      >
        <Text style={[T.label, { color: isPending ? '#fff' : '#374151' }]}>
          View Details →
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RegistrationsScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [regs,   setRegs]   = useState(REGISTRATIONS);

  const pendingCount = regs.filter((r) => r.status === 'PENDING').length;

  const filtered = regs.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'All'      ? true :
      filter === 'Pending'  ? r.status === 'PENDING'  :
      filter === 'Approved' ? r.status === 'APPROVED' :
                              r.status === 'REJECTED';
    return matchSearch && matchFilter;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{ backgroundColor: '#15803d', paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20 }}>

        {/* Title + pending badge */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <Text style={[T.h1, { color: '#fff' }]}>Registrations</Text>
          <View style={{
            backgroundColor: '#16a34a', borderRadius: 20,
            paddingHorizontal: 12, paddingVertical: 6,
          }}>
            <Text style={[T.caption, { color: '#fff', fontWeight: '700' }]}>
              {pendingCount} pending
            </Text>
          </View>
        </View>

        {/* Search bar */}
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: '#fff', borderRadius: 12,
          paddingHorizontal: 12, marginBottom: 14, height: 46,
        }}>
          <Ionicons name="search" size={18} color="#15803d" style={{ marginRight: 8 }} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search applicants..."
            placeholderTextColor="#9ca3af"
            style={[T.label, { flex: 1, color: '#111827' }]}
          />
        </View>

        {/* Filter tabs */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={{
                  paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
                  backgroundColor: active ? '#fff' : 'transparent',
                  borderWidth: active ? 0 : 1,
                  borderColor: 'rgba(255,255,255,0.4)',
                }}
              >
                <Text style={[T.caption, {
                  color: active ? '#15803d' : 'rgba(255,255,255,0.9)',
                  fontWeight: '600',
                }]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Registration list ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <Ionicons name="person-add-outline" size={44} color="#d1d5db" />
            <Text style={[T.label, { color: '#9ca3af', marginTop: 12 }]}>No registrations found</Text>
          </View>
        ) : (
          filtered.map((reg) => <RegistrationCard key={reg.id} reg={reg} />)
        )}
      </ScrollView>

    </View>
  );
}
