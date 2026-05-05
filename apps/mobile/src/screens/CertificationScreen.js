// src/screens/CertificationScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { MOCK_CERTIFICATIONS, MOCK_COURSES } from '../data/seedData';
import { FONTS } from '../theme/fonts';

const STATUS_CONFIG = {
  approved:  { label: 'Approved',  color: '#16a34a', bg: '#dcfce7' },
  pending:   { label: 'Pending',   color: '#d97706', bg: '#fef3c7' },
  expired:   { label: 'Expired',   color: '#dc2626', bg: '#fee2e2' },
};

const CertCard = ({ cert, course, onDownload, onShare, onView }) => {
  const getDaysLeft = () => {
    const expiry = new Date(cert.expiryDate);
    const today = new Date();
    return Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysLeft();
  const isExpiringSoon = daysLeft <= 90 && daysLeft > 0;
  const isExpired = daysLeft <= 0;

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
        {/* Header row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <View style={{
            width: 52, height: 52, borderRadius: 26,
            backgroundColor: `${cert.badgeColor}18`,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="ribbon" size={26} color={cert.badgeColor} />
          </View>
          <View style={{ alignItems: 'flex-end', gap: 4 }}>
            <View style={{
              paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
              backgroundColor: STATUS_CONFIG[cert.status || 'approved'].bg,
            }}>
              <Text style={{
                fontSize: 11, fontWeight: '700', fontFamily: FONTS.label,
                color: STATUS_CONFIG[cert.status || 'approved'].color,
              }}>
                {STATUS_CONFIG[cert.status || 'approved'].label}
              </Text>
            </View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: '#f0fdf4' }}>
              <Text style={{ fontSize: 11, color: '#16a34a', fontWeight: '700', fontFamily: FONTS.label }}>
                {cert.level}
              </Text>
            </View>
          </View>
        </View>

        <Text style={{ fontSize: 17, fontWeight: '800', color: '#111827', marginBottom: 4, fontFamily: FONTS.title }}>
          {cert.title}
        </Text>
        {course && (
          <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 14, fontFamily: FONTS.body }}>
            {course.title}
          </Text>
        )}

        {/* Dates */}
        <View style={{ flexDirection: 'row', gap: 24, marginBottom: 14 }}>
          <View>
            <Text style={{ fontSize: 10, color: '#9ca3af', fontWeight: '700', marginBottom: 2, fontFamily: FONTS.label }}>
              ISSUED
            </Text>
            <Text style={{ fontSize: 13, color: '#374151', fontWeight: '600', fontFamily: FONTS.body }}>
              {new Date(cert.issuedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 10, color: '#9ca3af', fontWeight: '700', marginBottom: 2, fontFamily: FONTS.label }}>
              EXPIRES
            </Text>
            <Text style={{
              fontSize: 13, fontWeight: '600', fontFamily: FONTS.body,
              color: isExpired ? '#dc2626' : isExpiringSoon ? '#d97706' : '#374151',
            }}>
              {new Date(cert.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* Expiry warning */}
        {isExpiringSoon && !isExpired && (
          <View style={{
            flexDirection: 'row', alignItems: 'center', padding: 10,
            backgroundColor: '#fffbeb', borderRadius: 8, marginBottom: 14,
            borderWidth: 1, borderColor: '#fde68a', gap: 6,
          }}>
            <Ionicons name="warning-outline" size={14} color="#d97706" />
            <Text style={{ fontSize: 12, color: '#92400e', flex: 1, fontFamily: FONTS.body }}>
              Expires in {daysLeft} days — renew to maintain certification
            </Text>
          </View>
        )}

        {isExpired && (
          <View style={{
            flexDirection: 'row', alignItems: 'center', padding: 10,
            backgroundColor: '#fff5f5', borderRadius: 8, marginBottom: 14,
            borderWidth: 1, borderColor: '#fca5a5', gap: 6,
          }}>
            <Ionicons name="close-circle-outline" size={14} color="#dc2626" />
            <Text style={{ fontSize: 12, color: '#dc2626', flex: 1, fontFamily: FONTS.body }}>
              This certification has expired. Please retake the course.
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPress={() => onView(cert)}
            style={{
              flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              padding: 11, borderRadius: 10, borderWidth: 1.5, borderColor: cert.badgeColor, gap: 6,
            }}
          >
            <Ionicons name="eye-outline" size={15} color={cert.badgeColor} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: cert.badgeColor, fontFamily: FONTS.button }}>
              View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDownload(cert)}
            style={{
              flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              padding: 11, borderRadius: 10, borderWidth: 1.5, borderColor: '#e5e7eb', gap: 6,
            }}
          >
            <Ionicons name="download-outline" size={15} color="#374151" />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', fontFamily: FONTS.button }}>
              Download
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onShare(cert)}
            style={{
              flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              padding: 11, borderRadius: 10, backgroundColor: cert.badgeColor, gap: 6,
            }}
          >
            <Ionicons name="share-outline" size={15} color="#fff" />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: FONTS.button }}>
              Share
            </Text>
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
    <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 8, fontFamily: FONTS.title }}>
      No Certifications Yet
    </Text>
    <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 21, fontFamily: FONTS.body }}>
      Complete courses and pass their quizzes to earn your park guide certifications.
    </Text>
  </View>
);

export default function CertificationScreen() {
  const { user } = useAuth();
  const [certs] = useState(MOCK_CERTIFICATIONS);
  const [viewModal, setViewModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  const activeCerts = certs.filter((c) => {
    const daysLeft = Math.floor((new Date(c.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0;
  });
  const expiredCerts = certs.filter((c) => {
    const daysLeft = Math.floor((new Date(c.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 0;
  });
  const expiringSoon = certs.filter((c) => {
    const daysLeft = Math.floor((new Date(c.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 90 && daysLeft > 0;
  });

  const handleView = (cert) => {
    setSelectedCert(cert);
    setViewModal(true);
  };

  const handleDownload = (cert) => {
    Alert.alert('Download', `"${cert.title}" certificate downloaded to your device. (UI demo)`);
  };

  const handleShare = (cert) => {
    Alert.alert('Share', `Share link for "${cert.title}" copied to clipboard. (UI demo)`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Summary banner */}
        <View style={{ margin: 20, padding: 20, backgroundColor: '#15803d', borderRadius: 20 }}>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 2, fontFamily: FONTS.body }}>
            {user?.name}
          </Text>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 12, fontFamily: FONTS.title }}>
            {certs.length} Certification{certs.length !== 1 ? 's' : ''}
          </Text>
          <View style={{ flexDirection: 'row', gap: 24 }}>
            <View>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontFamily: FONTS.label }}>ACTIVE</Text>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#4ade80', fontFamily: FONTS.title }}>{activeCerts.length}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontFamily: FONTS.label }}>EXPIRING SOON</Text>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#fbbf24', fontFamily: FONTS.title }}>{expiringSoon.length}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontFamily: FONTS.label }}>EXPIRED</Text>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#fca5a5', fontFamily: FONTS.title }}>{expiredCerts.length}</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', fontFamily: FONTS.title }}>
            My Certificates
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
          {certs.length === 0 ? (
            <EmptyState />
          ) : (
            certs.map((cert) => {
              const course = MOCK_COURSES.find((c) => c.id === cert.courseId);
              return (
                <CertCard
                  key={cert.id}
                  cert={cert}
                  course={course}
                  onView={handleView}
                  onDownload={handleDownload}
                  onShare={handleShare}
                />
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Certificate View Modal */}
      <Modal visible={viewModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          {selectedCert && (
            <View style={{ backgroundColor: '#fff', borderRadius: 24, width: '100%', overflow: 'hidden' }}>
              {/* Cert top bar */}
              <View style={{ height: 8, backgroundColor: selectedCert.badgeColor }} />
              <View style={{ padding: 28 }}>
                {/* Logo area */}
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                  <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: `${selectedCert.badgeColor}18`, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Ionicons name="ribbon" size={32} color={selectedCert.badgeColor} />
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 2, fontFamily: FONTS.label }}>
                    CERTIFICATE OF COMPLETION
                  </Text>
                </View>

                {/* Cert details */}
                <Text style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginBottom: 6, fontFamily: FONTS.body }}>
                  This certifies that
                </Text>
                <Text style={{ fontSize: 22, fontWeight: '900', color: '#111827', textAlign: 'center', marginBottom: 6, fontFamily: FONTS.title }}>
                  {user?.name}
                </Text>
                <Text style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', marginBottom: 16, fontFamily: FONTS.body }}>
                  has successfully completed
                </Text>
                <Text style={{ fontSize: 18, fontWeight: '800', color: selectedCert.badgeColor, textAlign: 'center', marginBottom: 20, fontFamily: FONTS.title }}>
                  {selectedCert.title}
                </Text>

                {/* Divider */}
                <View style={{ height: 1, backgroundColor: '#e5e7eb', marginBottom: 16 }} />

                {/* Meta */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#9ca3af', fontWeight: '700', fontFamily: FONTS.label }}>ISSUED</Text>
                    <Text style={{ fontSize: 13, color: '#374151', fontWeight: '600', fontFamily: FONTS.body }}>
                      {new Date(selectedCert.issuedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#9ca3af', fontWeight: '700', fontFamily: FONTS.label }}>LEVEL</Text>
                    <Text style={{ fontSize: 13, color: '#374151', fontWeight: '600', fontFamily: FONTS.body }}>{selectedCert.level}</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#9ca3af', fontWeight: '700', fontFamily: FONTS.label }}>EXPIRES</Text>
                    <Text style={{ fontSize: 13, color: '#374151', fontWeight: '600', fontFamily: FONTS.body }}>
                      {new Date(selectedCert.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => handleDownload(selectedCert)}
                    style={{ flex: 1, padding: 13, borderRadius: 12, borderWidth: 1.5, borderColor: selectedCert.badgeColor, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
                  >
                    <Ionicons name="download-outline" size={16} color={selectedCert.badgeColor} />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: selectedCert.badgeColor, fontFamily: FONTS.button }}>Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleShare(selectedCert)}
                    style={{ flex: 1, padding: 13, borderRadius: 12, backgroundColor: selectedCert.badgeColor, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
                  >
                    <Ionicons name="share-outline" size={16} color="#fff" />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: FONTS.button }}>Share</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => setViewModal(false)}
                  style={{ padding: 14, alignItems: 'center', marginTop: 8 }}
                >
                  <Text style={{ fontSize: 14, color: '#9ca3af', fontFamily: FONTS.body }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
