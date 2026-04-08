// src/screens/CertificationScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { MOCK_CERTIFICATIONS, MOCK_COURSES } from '../data/seedData';
import { FONTS } from '../theme/fonts';

const CertCard = ({ cert, course }) => {
  const isExpiringSoon = () => {
    const expiry = new Date(cert.expiryDate);
    const today = new Date();
    const daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    return daysLeft <= 90;
  };

  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 20, marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.09, shadowRadius: 12, elevation: 4,
    }}>
      {/* Color bar */}
      <View style={{ height: 6, backgroundColor: cert.badgeColor }} />

      <View style={{ padding: 20 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <View style={{
            width: 52, height: 52, borderRadius: 26,
            backgroundColor: `${cert.badgeColor}18`,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="ribbon" size={26} color={cert.badgeColor} />
          </View>
          <View style={{
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
            backgroundColor: '#f0fdf4',
          }}>
            <Text style={{ fontSize: 11, color: '#16a34a', fontWeight: '700' }}>{cert.level}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 17, fontWeight: '800', color: '#111827', marginBottom: 4 }}>
          {cert.title}
        </Text>
        {course && (
          <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>
            {course.title}
          </Text>
        )}

        {/* Dates */}
        <View style={{ flexDirection: 'row', gap: 20, marginBottom: 16 }}>
          <View>
            <Text style={{ fontSize: 10, color: '#9ca3af', fontWeight: '700', marginBottom: 2 }}>ISSUED</Text>
            <Text style={{ fontSize: 13, color: '#374151', fontWeight: '600' }}>
              {new Date(cert.issuedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 10, color: '#9ca3af', fontWeight: '700', marginBottom: 2 }}>EXPIRES</Text>
            <Text style={{
              fontSize: 13, fontWeight: '600',
              color: isExpiringSoon() ? '#d97706' : '#374151',
            }}>
              {new Date(cert.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
        </View>

        {isExpiringSoon() && (
          <View style={{
            flexDirection: 'row', alignItems: 'center', padding: 10,
            backgroundColor: '#fffbeb', borderRadius: 8, marginBottom: 14,
            borderWidth: 1, borderColor: '#fde68a',
          }}>
            <Ionicons name="warning-outline" size={14} color="#d97706" />
            <Text style={{ fontSize: 12, color: '#92400e', marginLeft: 6 }}>
              Expiring soon — renew to maintain certification
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPress={() => Alert.alert('Download', 'Certificate downloaded to your device (UI demo).')}
            style={{
              flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              padding: 11, borderRadius: 10, borderWidth: 1.5, borderColor: cert.badgeColor, gap: 6,
            }}
          >
            <Ionicons name="download-outline" size={16} color={cert.badgeColor} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: cert.badgeColor }}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert('Share', 'Share link copied to clipboard (UI demo).')}
            style={{
              flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              padding: 11, borderRadius: 10, backgroundColor: cert.badgeColor, gap: 6,
            }}
          >
            <Ionicons name="share-outline" size={16} color="#fff" />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const EmptyState = () => (
  <View style={{ alignItems: 'center', padding: 48 }}>
    <View style={{
      width: 96, height: 96, borderRadius: 48,
      backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    }}>
      <Ionicons name="ribbon-outline" size={48} color="#86efac" />
    </View>
    <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 8 }}>
      No Certifications Yet
    </Text>
    <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 21 }}>
      Complete courses and pass their quizzes to earn your park guide certifications.
    </Text>
  </View>
);

export default function CertificationScreen() {
  const { user } = useAuth();
  const certs = MOCK_CERTIFICATIONS;

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary banner */}
        <View style={{ margin: 20, padding: 20, backgroundColor: '#15803d', borderRadius: 20 }}>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 2 }}>
            {user?.name}
          </Text>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 8 }}>
            {certs.length} Certification{certs.length !== 1 ? 's' : ''}
          </Text>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <View>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>ACTIVE</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#4ade80' }}>{certs.length}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>EXPIRING SOON</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#fbbf24' }}>1</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827' }}>My Certificates</Text>
        </View>

        <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
          {certs.length === 0 ? (
            <EmptyState />
          ) : (
            certs.map((cert) => {
              const course = MOCK_COURSES.find((c) => c.id === cert.courseId);
              return <CertCard key={cert.id} cert={cert} course={course} />;
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
