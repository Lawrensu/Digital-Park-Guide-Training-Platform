import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


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

const CERTS = [
  {
    id: 1,
    title: 'Certified Biodiversity Guide',
    course: 'Rainforest Biodiversity Fundamentals',
    level: 'FOUNDATION',
    status: 'APPROVED',
    issued: '15 Jan 2024',
    expires: '30 Jul 2026',
    expiresDate: new Date('2026-07-30'),
    color: '#15803d',
    iconBg: '#dcfce7',
    levelBg: '#ccfbf1',
    levelColor: '#0f766e',
  },
  {
    id: 2,
    title: 'Eco-Tourism Professional',
    course: 'Sustainable Tourism Practices',
    level: 'INTERMEDIATE',
    status: 'APPROVED',
    issued: '10 Mar 2024',
    expires: '10 Mar 2027',
    expiresDate: new Date('2027-03-10'),
    color: '#0891b2',
    iconBg: '#e0f2fe',
    levelBg: '#e0f2fe',
    levelColor: '#0369a1',
  },
  {
    id: 3,
    title: 'Wildlife Tracking Specialist',
    course: 'Wildlife Tracking & Monitoring',
    level: 'ADVANCED',
    status: 'APPROVED',
    issued: '22 Apr 2024',
    expires: '22 Apr 2027',
    expiresDate: new Date('2027-04-22'),
    color: '#15803d',
    iconBg: '#dcfce7',
    levelBg: '#dcfce7',
    levelColor: '#15803d',
  },
  {
    id: 4,
    title: 'Park Safety Officer',
    course: 'Park Safety & Emergency Response',
    level: 'FOUNDATION',
    status: 'APPROVED',
    issued: '05 Feb 2024',
    expires: '18 Jun 2026',
    expiresDate: new Date('2026-06-18'),
    color: '#7c3aed',
    iconBg: '#ede9fe',
    levelBg: '#ede9fe',
    levelColor: '#6d28d9',
  },
  {
    id: 5,
    title: 'Conservation Ethics Guide',
    course: 'Conservation Ethics & Practices',
    level: 'INTERMEDIATE',
    status: 'APPROVED',
    issued: '18 Mar 2024',
    expires: '18 Mar 2027',
    expiresDate: new Date('2027-03-18'),
    color: '#0891b2',
    iconBg: '#e0f2fe',
    levelBg: '#e0f2fe',
    levelColor: '#0369a1',
  },
];

const WARN_DAYS = 90;

function daysUntil(date) {
  return Math.floor((date - new Date()) / (1000 * 60 * 60 * 24));
}

function CertCard({ cert, onView }) {
  const days         = daysUntil(cert.expiresDate);
  const expiringSoon = days <= WARN_DAYS && days > 0;

  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 18, marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
    }}>
      {/* Coloured top border */}
      <View style={{ height: 5, backgroundColor: cert.color }} />

      <View style={{ padding: 18 }}>
        {/* Icon + badges row */}
        <View style={{
          flexDirection: 'row', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: 14,
        }}>
          <View style={{
            width: 56, height: 56, borderRadius: 28,
            backgroundColor: cert.iconBg,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="ribbon" size={28} color={cert.color} />
          </View>

          {/* Status + level badges stacked */}
          <View style={{ alignItems: 'flex-end', gap: 6 }}>
            <View style={{
              backgroundColor: '#dcfce7', borderRadius: 6,
              paddingHorizontal: 10, paddingVertical: 4,
            }}>
              <Text style={[T.caption, { color: '#15803d', fontWeight: '700', letterSpacing: 0.4 }]}>
                {cert.status}
              </Text>
            </View>
            <View style={{
              backgroundColor: cert.levelBg, borderRadius: 6,
              paddingHorizontal: 10, paddingVertical: 4,
            }}>
              <Text style={[T.caption, { color: cert.levelColor, fontWeight: '700', letterSpacing: 0.4 }]}>
                {cert.level}
              </Text>
            </View>
          </View>
        </View>

        {/* Title + course */}
        <Text style={[T.h4, { color: '#111827', marginBottom: 4, fontSize: 18 }]}>
          {cert.title}
        </Text>
        <Text style={[T.bodySm, { color: '#6b7280', marginBottom: 16 }]}>
          {cert.course}
        </Text>

        {/* Issued / Expires */}
        <View style={{ flexDirection: 'row', gap: 32, marginBottom: 14 }}>
          <View>
            <Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 4 }]}>
              ISSUED
            </Text>
            <Text style={[T.label, { color: '#111827' }]}>{cert.issued}</Text>
          </View>
          <View>
            <Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 4 }]}>
              EXPIRES
            </Text>
            <Text style={[T.label, { color: expiringSoon ? '#d97706' : '#111827' }]}>
              {cert.expires}
            </Text>
          </View>
        </View>

        {/* Expiry warning */}
        {expiringSoon && (
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 8,
            backgroundColor: '#fefce8', borderRadius: 10,
            paddingHorizontal: 14, paddingVertical: 10,
            marginBottom: 14,
            borderWidth: 1, borderColor: '#fde68a',
          }}>
            <Ionicons name="warning" size={16} color="#d97706" />
            <Text style={[T.caption, { color: '#92400e' }]}>
              Expires in {days} days — renew soon
            </Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {/* View */}
          <TouchableOpacity
            onPress={onView}
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              gap: 6, paddingVertical: 11, paddingHorizontal: 16, borderRadius: 10,
              borderWidth: 1.5, borderColor: cert.color,
            }}
          >
            <Ionicons name="eye-outline" size={16} color={cert.color} />
            <Text style={[T.label, { color: cert.color }]}>View</Text>
          </TouchableOpacity>

          {/* Download */}
          <TouchableOpacity style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            gap: 6, paddingVertical: 11, paddingHorizontal: 16, borderRadius: 10,
            borderWidth: 1.5, borderColor: '#e5e7eb',
          }}>
            <Ionicons name="download-outline" size={16} color="#374151" />
            <Text style={[T.label, { color: '#374151' }]}>Download</Text>
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity style={{
            flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            gap: 6, paddingVertical: 11, borderRadius: 10,
            backgroundColor: cert.color,
          }}>
            <Ionicons name="share-social-outline" size={16} color="#fff" />
            <Text style={[T.label, { color: '#fff' }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function CertificationScreen() {
  const navigation    = useNavigation();
  const activeCount   = CERTS.filter((c) => daysUntil(c.expiresDate) > WARN_DAYS).length;
  const expiringCount = CERTS.filter((c) => {
    const d = daysUntil(c.expiresDate);
    return d > 0 && d <= WARN_DAYS;
  }).length;
  const expiredCount  = CERTS.filter((c) => daysUntil(c.expiresDate) <= 0).length;

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: 52, paddingBottom: 24, paddingHorizontal: 20,
      }}>
        {/* Back + title */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={[T.h1, { color: '#fff' }]}>My Certifications</Text>
        </View>

        {/* Count */}
        <Text style={[T.h2, { color: '#fff', marginBottom: 14, fontSize: 28 }]}>
          {CERTS.length} Certificates
        </Text>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: 28 }}>
          <View>
            <Text style={[T.caption, { color: 'rgba(255,255,255,0.7)', marginBottom: 3 }]}>Active</Text>
            <Text style={[T.h3, { color: '#4ade80' }]}>{activeCount}</Text>
          </View>
          <View>
            <Text style={[T.caption, { color: 'rgba(255,255,255,0.7)', marginBottom: 3 }]}>Expiring Soon</Text>
            <Text style={[T.h3, { color: '#fb923c' }]}>{expiringCount}</Text>
          </View>
          <View>
            <Text style={[T.caption, { color: 'rgba(255,255,255,0.7)', marginBottom: 3 }]}>Expired</Text>
            <Text style={[T.h3, { color: 'rgba(255,255,255,0.5)' }]}>{expiredCount}</Text>
          </View>
        </View>
      </View>

      {/* ── Cert list ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        <Text style={[T.h3, { color: '#111827', marginBottom: 14 }]}>My Certificates</Text>

        {CERTS.map((cert) => (
          <CertCard
            key={cert.id}
            cert={cert}
            onView={() => navigation.navigate('GuideViewCert', { cert })}
          />
        ))}
      </ScrollView>

    </View>
  );
}
