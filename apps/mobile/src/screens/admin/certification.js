import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CertIssueModal from './certissue';

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
  PENDING:  { label: 'PENDING APPROVAL', color: '#d97706', bg: '#fef3c7' },
  ISSUED:   { label: 'ISSUED',           color: '#16a34a', bg: '#dcfce7' },
  REJECTED: { label: 'REJECTED',         color: '#dc2626', bg: '#fee2e2' },
};

const FILTERS = ['All', 'Pending', 'Issued', 'Rejected'];

const CERTIFICATIONS = [
  {
    id: 1,
    name: 'Amira Hassan',
    course: 'Rainforest Biodiversity Fundamentals',
    score: 85,
    passed: true,
    completedDate: '13 Apr',
    status: 'PENDING',
  },
  {
    id: 2,
    name: 'James Okafor',
    course: 'Wildlife Conservation Ethics',
    score: 92,
    passed: true,
    completedDate: '10 Apr',
    status: 'ISSUED',
  },
  {
    id: 3,
    name: 'Sarah Chen',
    course: 'Safety Protocols Advanced',
    score: 65,
    passed: false,
    completedDate: '8 Apr',
    status: 'REJECTED',
  },
  {
    id: 4,
    name: 'Ahmad bin Abdullah',
    course: 'Eco-tourism Fundamentals',
    score: 88,
    passed: true,
    completedDate: '7 Apr',
    status: 'PENDING',
  },
  {
    id: 5,
    name: 'Maria Santos',
    course: 'Wildlife Conservation Ethics',
    score: 78,
    passed: true,
    completedDate: '5 Apr',
    status: 'ISSUED',
  },
];

const PENDING_COUNT = CERTIFICATIONS.filter((c) => c.status === 'PENDING').length;

function StatusBadge({ status }) {
  const { label, color, bg } = STATUS[status];
  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: bg }}>
      <Text style={[T.caption, { color, fontWeight: '700', letterSpacing: 0.3 }]}>{label}</Text>
    </View>
  );
}

function CertCard({ cert, onIssue, onReject, onOpenIssueModal }) {
  const initial   = cert.name.charAt(0).toUpperCase();
  const isPending = cert.status === 'PENDING';
  const isIssued  = cert.status === 'ISSUED';

  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    }}>
      {/* Top row */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
        <View style={{
          width: 46, height: 46, borderRadius: 23,
          backgroundColor: '#15803d', alignItems: 'center', justifyContent: 'center',
          marginRight: 12,
        }}>
          <Text style={[T.h4, { color: '#fff' }]}>{initial}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={[T.h4, { color: '#111827', flex: 1, marginRight: 8 }]}>{cert.name}</Text>
            <StatusBadge status={cert.status} />
          </View>
          <Text style={[T.bodySmall, { color: '#374151', marginTop: 3 }]}>{cert.course}</Text>

          {/* Score row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <Text style={[T.caption, {
              color: cert.passed ? '#16a34a' : '#dc2626', fontWeight: '600',
            }]}>
              Score: {cert.score}%{'  '}
              {cert.passed
                ? <Text>{'✓ Passed'}</Text>
                : <Text>{'✗ Failed'}</Text>}
            </Text>
            <Text style={[T.caption, { color: '#6b7280' }]}>
              Completed: {cert.completedDate}
            </Text>
          </View>
        </View>
      </View>

      {/* Action buttons */}
      {isPending ? (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPress={() => onOpenIssueModal(cert)}
            style={{
              flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#15803d', borderRadius: 10, paddingVertical: 11, gap: 6,
            }}
          >
            <Ionicons name="checkmark" size={16} color="#fff" />
            <Text style={[T.label, { color: '#fff' }]}>Issue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onReject(cert.id)}
            style={{
              flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              borderWidth: 1.5, borderColor: '#dc2626', borderRadius: 10, paddingVertical: 11, gap: 6,
            }}
          >
            <Ionicons name="close" size={16} color="#dc2626" />
            <Text style={[T.label, { color: '#dc2626' }]}>Reject</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={{
          borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 10,
          paddingVertical: 11, alignItems: 'center', justifyContent: 'center',
          flexDirection: 'row', gap: 6,
        }}>
          <Text style={[T.label, { color: '#374151' }]}>
            {isIssued ? 'View Certificate' : 'View Details'}
          </Text>
          <Text style={[T.label, { color: '#374151' }]}>→</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function Certifications() {
  const navigation                      = useNavigation();
  const [search,      setSearch]        = useState('');
  const [filter,      setFilter]        = useState('All');
  const [certs,       setCerts]         = useState(CERTIFICATIONS);
  const [issuingCert, setIssuingCert]   = useState(null);

  const handleIssue  = (id) => setCerts((prev) =>
    prev.map((c) => c.id === id ? { ...c, status: 'ISSUED' } : c)
  );
  const handleReject = (id) => setCerts((prev) =>
    prev.map((c) => c.id === id ? { ...c, status: 'REJECTED' } : c)
  );

  const pendingCount = certs.filter((c) => c.status === 'PENDING').length;

  const filtered = certs.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'All'      ? true :
      filter === 'Pending'  ? c.status === 'PENDING'  :
      filter === 'Issued'   ? c.status === 'ISSUED'   :
                              c.status === 'REJECTED';
    return matchSearch && matchFilter;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{ backgroundColor: '#15803d', paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20 }}>

        {/* Title row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={[T.h1, { color: '#fff', lineHeight: 34 }]}>Certifications</Text>
              <View style={{
                backgroundColor: '#16a34a', borderRadius: 12,
                paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start', marginTop: 4,
              }}>
                <Text style={[T.caption, { color: '#fff', fontWeight: '700' }]}>
                  {pendingCount} pending
                </Text>
              </View>
            </View>
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
            placeholder="Search certifications..."
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

      {/* ── Cert list ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <Ionicons name="ribbon-outline" size={44} color="#d1d5db" />
            <Text style={[T.label, { color: '#9ca3af', marginTop: 12 }]}>No certifications found</Text>
          </View>
        ) : (
          filtered.map((cert) => (
            <CertCard
              key={cert.id}
              cert={cert}
              onIssue={handleIssue}
              onReject={handleReject}
              onOpenIssueModal={(c) => setIssuingCert(c)}
            />
          ))
        )}
      </ScrollView>

    </View>
  );
}
