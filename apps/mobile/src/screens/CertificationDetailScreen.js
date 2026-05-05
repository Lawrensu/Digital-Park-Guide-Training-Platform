// src/screens/CertificationDetailScreen.js
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { FONTS } from '../theme/fonts';

// QR code rendered as SVG pattern (no external library needed)
const QRCodePlaceholder = ({ value, size = 140 }) => (
  <View style={{
    width: size, height: size, backgroundColor: '#fff',
    borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', padding: 8,
  }}>
    {/* Simulate QR code grid pattern */}
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: size - 28 }}>
      {Array.from({ length: 49 }).map((_, i) => {
        // Corner squares pattern
        const row = Math.floor(i / 7);
        const col = i % 7;
        const isCorner = (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2);
        const isDark = isCorner || Math.random() > 0.55;
        return (
          <View key={i} style={{
            width: (size - 28) / 7, height: (size - 28) / 7,
            backgroundColor: isDark ? '#111827' : '#fff',
          }} />
        );
      })}
    </View>
    <Text style={{ fontSize: 7, color: '#9ca3af', marginTop: 4, fontFamily: FONTS.body, textAlign: 'center' }} numberOfLines={1}>
      {value?.slice(0, 20)}...
    </Text>
  </View>
);

export default function CertificationDetailScreen({ route }) {
  const { cert, course } = route.params || {};
  const { user } = useAuth();

  // Mock full cert data (in production from GET /api/certifications/:id)
  const certData = cert || {
    id: 1,
    title: 'Certified Biodiversity Guide',
    issuedDate: '2024-01-15',
    expiryDate: '2026-01-15',
    level: 'Foundation',
    badgeColor: '#16a34a',
    certificationId: 'PGT-2024-001234',
    companyName: 'National Park Training Authority',
    issuerName: 'Dr. Ahmad Razali',
    issuerTitle: 'Director of Training & Certification',
  };

  const verifyUrl = `https://parkguide.gov/verify/${certData.certificationId}`;

  const handleDownload = () => {
    // GET /api/certifications/:id/download-url → open pre-signed URL
    Alert.alert('Download Certificate', 'Certificate PDF will open in your browser.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open', onPress: () => Linking.openURL(verifyUrl) },
    ]);
  };

  const handleShare = () => {
    Alert.alert('Share', 'Certificate link copied to clipboard. (UI demo)');
  };

  const courseName = course?.title || 'Rainforest Biodiversity Fundamentals';

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Certificate card */}
        <View style={{ margin: 16, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 6 }}>
          {/* Color bar */}
          <View style={{ height: 8, backgroundColor: certData.badgeColor }} />

          <View style={{ padding: 24 }}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: `${certData.badgeColor}18`, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Ionicons name="ribbon" size={36} color={certData.badgeColor} />
              </View>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 2, fontFamily: FONTS.label }}>
                CERTIFICATE OF COMPLETION
              </Text>
              <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4, fontFamily: FONTS.body }}>
                {certData.companyName}
              </Text>
            </View>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: '#f3f4f6', marginBottom: 20 }} />

            {/* Recipient */}
            <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', fontFamily: FONTS.body }}>This certifies that</Text>
            <Text style={{ fontSize: 26, fontWeight: '900', color: '#111827', textAlign: 'center', marginVertical: 6, fontFamily: FONTS.title }}>{user?.name}</Text>
            <Text style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', marginBottom: 6, fontFamily: FONTS.body }}>has successfully completed</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: certData.badgeColor, textAlign: 'center', marginBottom: 4, fontFamily: FONTS.title }}>{certData.title}</Text>
            <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginBottom: 20, fontFamily: FONTS.body }}>{courseName}</Text>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: '#f3f4f6', marginBottom: 20 }} />

            {/* Details grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'CERT ID',       value: certData.certificationId },
                { label: 'LEVEL',         value: certData.level },
                { label: 'ISSUED',        value: new Date(certData.issuedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                { label: 'EXPIRES',       value: new Date(certData.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                { label: 'ISSUED BY',     value: certData.issuerName },
                { label: 'ISSUER TITLE',  value: certData.issuerTitle },
              ].map((item) => (
                <View key={item.label} style={{ width: '47%' }}>
                  <Text style={{ fontSize: 9, color: '#9ca3af', fontWeight: '700', marginBottom: 2, fontFamily: FONTS.label }}>{item.label}</Text>
                  <Text style={{ fontSize: 12, color: '#374151', fontWeight: '600', fontFamily: FONTS.body }}>{item.value}</Text>
                </View>
              ))}
            </View>

            {/* QR Code section */}
            <View style={{ alignItems: 'center', padding: 16, backgroundColor: '#f9fafb', borderRadius: 14, marginBottom: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 12, fontFamily: FONTS.title }}>Verification QR Code</Text>
              <QRCodePlaceholder value={verifyUrl} size={140} />
              <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 10, textAlign: 'center', fontFamily: FONTS.body }}>
                Scan to verify this certificate
              </Text>
              <Text style={{ fontSize: 10, color: '#16a34a', marginTop: 4, textAlign: 'center', fontFamily: FONTS.body }}>
                {verifyUrl}
              </Text>
            </View>

            {/* Issuer signature area */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ width: 100, height: 1, backgroundColor: '#374151', marginBottom: 4 }} />
                <Text style={{ fontSize: 10, color: '#374151', fontWeight: '700', fontFamily: FONTS.label }}>ISSUER SIGNATURE</Text>
                <Text style={{ fontSize: 10, color: '#9ca3af', fontFamily: FONTS.body }}>{certData.issuerName}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <View style={{ width: 80, height: 1, backgroundColor: '#374151', marginBottom: 4 }} />
                <Text style={{ fontSize: 10, color: '#374151', fontWeight: '700', fontFamily: FONTS.label }}>DATE</Text>
                <Text style={{ fontSize: 10, color: '#9ca3af', fontFamily: FONTS.body }}>
                  {new Date(certData.issuedDate).toLocaleDateString('en-GB')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 32, gap: 10 }}>
          <TouchableOpacity onPress={handleDownload} style={{
            backgroundColor: certData.badgeColor, borderRadius: 14, padding: 16,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            shadowColor: certData.badgeColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
          }}>
            <Ionicons name="download-outline" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', fontFamily: FONTS.button }}>Download PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={{ borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 2, borderColor: certData.badgeColor, backgroundColor: '#fff' }}>
            <Ionicons name="share-outline" size={20} color={certData.badgeColor} />
            <Text style={{ color: certData.badgeColor, fontSize: 15, fontWeight: '700', fontFamily: FONTS.button }}>Share Certificate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
