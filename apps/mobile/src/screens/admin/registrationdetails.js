import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h1:      { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h2:      { fontFamily: sans,  fontSize: 24, fontWeight: '600' },
  h3:      { fontFamily: sans,  fontSize: 20, fontWeight: '500' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodyDef: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const STATUS_STYLE = {
  PENDING:  { label: 'PENDING REVIEW', color: '#fff', bg: '#16a34a' },
  APPROVED: { label: 'APPROVED',       color: '#fff', bg: '#16a34a' },
  REJECTED: { label: 'REJECTED',       color: '#fff', bg: '#dc2626' },
};

const DETAIL_ROWS = [
  { icon: 'person',     iconColor: '#6b7280', iconBg: '#f3f4f6', field: 'name',  label: 'FULL NAME' },
  { icon: 'card',       iconColor: '#6366f1', iconBg: '#eef2ff', field: 'nric',  label: 'NRIC' },
  { icon: 'call',       iconColor: '#3b82f6', iconBg: '#eff6ff', field: 'phone', label: 'PHONE' },
  { icon: 'mail',       iconColor: '#8b5cf6', iconBg: '#f5f3ff', field: 'email', label: 'EMAIL' },
];

function DetailRow({ icon, iconColor, iconBg, label, value, isLast }) {
  return (
    <View>
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 14, paddingHorizontal: 16,
      }}>
        <View style={{
          width: 38, height: 38, borderRadius: 10,
          backgroundColor: iconBg,
          alignItems: 'center', justifyContent: 'center',
          marginRight: 14,
        }}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[T.caption, { color: '#9ca3af', marginBottom: 3, letterSpacing: 0.4 }]}>
            {label}
          </Text>
          <Text style={[T.bodyDef, { color: '#111827' }]}>{value}</Text>
        </View>
      </View>
      {!isLast && <View style={{ height: 1, backgroundColor: '#f3f4f6', marginLeft: 68 }} />}
    </View>
  );
}

export default function RegistrationDetails() {
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();
  const route      = useRoute();

  const reg = route.params?.reg ?? {
    id:          1,
    name:        'Ahmad bin Abdullah',
    email:       'ahmad.abdullah@example.com',
    nric:        '881234-56-7890',
    phone:       '+60 12-345 6789',
    appliedDate: '13 Apr 2026',
    cvAttached:  true,
    cvFilename:  'Ahmad_CV.pdf',
    status:      'PENDING',
  };

  const [notes,    setNotes]    = useState('');
  const [decision, setDecision] = useState(null);

  const statusStyle = STATUS_STYLE[reg.status] ?? STATUS_STYLE.PENDING;
  const initial     = reg.name.charAt(0).toUpperCase();

  const detailValues = {
    name:  reg.name,
    nric:  reg.nric  ?? '881234-56-7890',
    phone: reg.phone ?? '+60 12-345 6789',
    email: reg.email,
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 4, marginRight: 14 }}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={[T.h1, { color: '#fff', fontSize: 26 }]}>Registration{'\n'}Detail</Text>
          </View>

          {/* Status badge */}
          <View style={{
            backgroundColor: statusStyle.bg,
            borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
            marginTop: 4,
          }}>
            <Text style={[T.caption, { color: statusStyle.color, fontWeight: '700', letterSpacing: 0.4 }]}>
              {statusStyle.label}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* ── Profile card ── */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 24,
          alignItems: 'center', marginBottom: 24,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        }}>
          <View style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: '#15803d',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 14,
          }}>
            <Text style={[T.h2, { color: '#fff' }]}>{initial}</Text>
          </View>
          <Text style={[T.h2, { color: '#111827', marginBottom: 6 }]}>{reg.name}</Text>
          <Text style={[T.caption, { color: '#9ca3af' }]}>Applied {reg.appliedDate}</Text>
        </View>

        {/* ── Applicant Details ── */}
        <Text style={[T.h3, { color: '#111827', marginBottom: 12, marginLeft: 2 }]}>
          Applicant Details
        </Text>
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
          marginBottom: 24,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        }}>
          {DETAIL_ROWS.map((row, i) => (
            <DetailRow
              key={row.label}
              icon={row.icon}
              iconColor={row.iconColor}
              iconBg={row.iconBg}
              label={row.label}
              value={detailValues[row.field]}
              isLast={i === DETAIL_ROWS.length - 1}
            />
          ))}
        </View>

        {/* ── CV / Resume ── */}
        <Text style={[T.h3, { color: '#111827', marginBottom: 12, marginLeft: 2 }]}>
          CV / Resume
        </Text>
        {reg.cvAttached ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              backgroundColor: '#f0fdf4',
              borderRadius: 14, padding: 16,
              flexDirection: 'row', alignItems: 'center',
              marginBottom: 24,
              borderWidth: 1, borderColor: '#bbf7d0',
            }}
          >
            <View style={{
              width: 42, height: 42, borderRadius: 10,
              backgroundColor: '#e9d5ff',
              alignItems: 'center', justifyContent: 'center',
              marginRight: 14,
            }}>
              <Ionicons name="document-text" size={20} color="#7c3aed" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[T.label, { color: '#15803d' }]}>
                {reg.cvFilename ?? 'CV_Resume.pdf'}
              </Text>
              <Text style={[T.caption, { color: '#9ca3af', marginTop: 3 }]}>Tap to download</Text>
            </View>
            <View style={{
              width: 36, height: 36, borderRadius: 10,
              backgroundColor: '#3b82f6',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name="download" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{
            backgroundColor: '#fff', borderRadius: 14, padding: 20,
            alignItems: 'center', marginBottom: 24,
            borderWidth: 1, borderColor: '#f3f4f6',
          }}>
            <Ionicons name="document-outline" size={32} color="#d1d5db" />
            <Text style={[T.caption, { color: '#9ca3af', marginTop: 8 }]}>No CV attached</Text>
          </View>
        )}

        {/* ── Reject reason ── */}
        <Text style={[T.h3, { color: '#111827', marginBottom: 12, marginLeft: 2 }]}>
          Reject reason
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Add reject reason..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={[T.bodyDef, {
            backgroundColor: '#fff',
            borderRadius: 14, borderWidth: 1, borderColor: '#e5e7eb',
            padding: 16, minHeight: 110,
            color: '#111827', lineHeight: 22,
            marginBottom: 28,
          }]}
        />

        {/* ── Action buttons ── */}
        <TouchableOpacity
          onPress={() => setDecision('approved')}
          activeOpacity={0.85}
          style={{
            backgroundColor: decision === 'approved' ? '#166534' : '#15803d',
            borderRadius: 14, paddingVertical: 16,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            gap: 8, marginBottom: 12,
          }}
        >
          <Ionicons name="checkmark" size={18} color="#fff" />
          <Text style={[T.h4, { color: '#fff' }]}>Approve &amp; Send Credentials</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setDecision('rejected')}
          activeOpacity={0.85}
          style={{
            backgroundColor: '#fff',
            borderRadius: 14, paddingVertical: 16,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            gap: 8,
            borderWidth: 1.5, borderColor: '#dc2626',
          }}
        >
          <Ionicons name="close" size={18} color="#dc2626" />
          <Text style={[T.h4, { color: '#dc2626' }]}>Reject Application</Text>
        </TouchableOpacity>
      </ScrollView>

    </View>
  );
}
