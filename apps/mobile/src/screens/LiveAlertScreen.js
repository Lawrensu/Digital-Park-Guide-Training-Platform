// src/screens/LiveAlertScreen.js
// Admin screen for reviewing abnormal activity/violation alerts
// Shows evidence frames, allows confirm or mark as false detection

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Image, Alert, Modal, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock alert data — in production this would come from the backend
const MOCK_ALERTS = [
  {
    id: 1,
    timestamp: '2026-04-13T14:32:00Z',
    location: 'Sector 7B — Northern Trail',
    severity: 'high',
    status: 'pending',
    description: 'Unusual movement pattern detected near restricted zone. Multiple frames captured over 4 minutes.',
    coordinates: { lat: 3.1402, lng: 101.6866 },
    detectedBy: 'Motion Sensor Node #14',
    evidenceFrames: [
      {
        id: 1,
        time: '14:32:04',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
        confidence: 87,
      },
      {
        id: 2,
        time: '14:32:48',
        url: 'https://images.unsplash.com/photo-1564166174574-a9f1b7a0d6b3?w=400&q=80',
        confidence: 92,
      },
      {
        id: 3,
        time: '14:33:21',
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
        confidence: 78,
      },
    ],
  },
  {
    id: 2,
    timestamp: '2026-04-12T09:15:00Z',
    location: 'East Boundary — Checkpoint C',
    severity: 'medium',
    status: 'confirmed',
    description: 'Unauthorised entry detected at boundary checkpoint. Individual observed carrying large bag.',
    coordinates: { lat: 3.1502, lng: 101.6966 },
    detectedBy: 'Camera Node #07',
    evidenceFrames: [
      {
        id: 1,
        time: '09:15:12',
        url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80',
        confidence: 95,
      },
      {
        id: 2,
        time: '09:15:44',
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80',
        confidence: 91,
      },
    ],
  },
  {
    id: 3,
    timestamp: '2026-04-11T20:45:00Z',
    location: 'Sector 3A — Waterhole',
    severity: 'low',
    status: 'false_detection',
    description: 'Movement detected near waterhole after hours. Identified as large animal movement.',
    coordinates: { lat: 3.1302, lng: 101.6766 },
    detectedBy: 'Motion Sensor Node #09',
    evidenceFrames: [
      {
        id: 1,
        time: '20:45:33',
        url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&q=80',
        confidence: 45,
      },
    ],
  },
];

const SEVERITY_CONFIG = {
  high:   { color: '#dc2626', bg: '#fee2e2', label: 'High',   icon: 'warning' },
  medium: { color: '#d97706', bg: '#fef3c7', label: 'Medium', icon: 'alert-circle' },
  low:    { color: '#6b7280', bg: '#f3f4f6', label: 'Low',    icon: 'information-circle' },
};

const STATUS_CONFIG = {
  pending:         { color: '#d97706', bg: '#fef3c7', label: 'Pending Review' },
  confirmed:       { color: '#dc2626', bg: '#fee2e2', label: 'Violation Confirmed' },
  false_detection: { color: '#16a34a', bg: '#dcfce7', label: 'False Detection' },
};

const AlertCard = ({ alert, onReview }) => {
  const severity = SEVERITY_CONFIG[alert.severity];
  const status = STATUS_CONFIG[alert.status];
  const date = new Date(alert.timestamp);
  const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <TouchableOpacity
      onPress={() => onReview(alert)}
      style={{
        backgroundColor: '#fff', borderRadius: 16, marginBottom: 14,
        overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
        borderLeftWidth: 4, borderLeftColor: severity.color,
      }}
    >
      <View style={{ padding: 16 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Ionicons name={severity.icon} size={15} color={severity.color} />
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#111827', fontFamily: FONTS.title }}>
                {alert.location}
              </Text>
            </View>
            <Text style={{ fontSize: 11, color: '#9ca3af', fontFamily: FONTS.body }}>
              {dateStr} at {timeStr} · {alert.detectedBy}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 5 }}>
            <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: severity.bg }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: severity.color, fontFamily: FONTS.label }}>
                {severity.label}
              </Text>
            </View>
            <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: status.bg }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: status.color, fontFamily: FONTS.label }}>
                {status.label}
              </Text>
            </View>
          </View>
        </View>

        <Text style={{ fontSize: 12, color: '#6b7280', lineHeight: 18, marginBottom: 12, fontFamily: FONTS.body }}>
          {alert.description}
        </Text>

        {/* Evidence frame thumbnails */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          {alert.evidenceFrames.slice(0, 3).map((frame) => (
            <View key={frame.id} style={{ position: 'relative' }}>
              <Image
                source={{ uri: frame.url }}
                style={{ width: 72, height: 54, borderRadius: 8 }}
                resizeMode="cover"
              />
              <View style={{
                position: 'absolute', bottom: 3, right: 3,
                backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 4,
                paddingHorizontal: 4, paddingVertical: 1,
              }}>
                <Text style={{ fontSize: 9, color: '#fff', fontWeight: '700', fontFamily: FONTS.label }}>
                  {frame.confidence}%
                </Text>
              </View>
            </View>
          ))}
          {alert.evidenceFrames.length > 3 && (
            <View style={{
              width: 72, height: 54, borderRadius: 8, backgroundColor: '#f3f4f6',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#374151', fontFamily: FONTS.title }}>
                +{alert.evidenceFrames.length - 3}
              </Text>
            </View>
          )}
        </View>

        {/* Review button — only for pending */}
        {alert.status === 'pending' && (
          <TouchableOpacity
            onPress={() => onReview(alert)}
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: 10, borderRadius: 10, backgroundColor: '#fef3c7',
              borderWidth: 1, borderColor: '#fde68a',
            }}
          >
            <Ionicons name="eye-outline" size={15} color="#d97706" />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#d97706', fontFamily: FONTS.button }}>
              Review Evidence
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function LiveAlertScreen() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [activeFrame, setActiveFrame] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');

  const pendingCount = alerts.filter((a) => a.status === 'pending').length;

  const filtered = alerts.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  const handleReview = (alert) => {
    setSelectedAlert(alert);
    setActiveFrame(0);
    setReviewModal(true);
  };

  const handleDecision = (decision) => {
    const isViolation = decision === 'confirmed';
    Alert.alert(
      isViolation ? 'Violation Confirmed' : 'Marked as False Detection',
      isViolation
        ? 'This incident has been flagged as a violation. Authorities have been notified and an email report has been sent.'
        : 'This alert has been marked as a false detection and will be used to improve the detection model.',
      [
        {
          text: 'OK',
          onPress: () => {
            setAlerts((prev) =>
              prev.map((a) => a.id === selectedAlert.id ? { ...a, status: decision } : a)
            );
            setReviewModal(false);
          },
        },
      ]
    );
  };

  const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'false_detection', label: 'False Detection' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>

      {/* Header */}
      <View style={{ backgroundColor: '#15803d', padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#fff', fontFamily: FONTS.title }}>
              Live Alerts
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontFamily: FONTS.body }}>
              {pendingCount > 0 ? `${pendingCount} pending review` : 'All alerts reviewed'}
            </Text>
          </View>
          {pendingCount > 0 && (
            <View style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: '#dc2626', alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff', fontFamily: FONTS.title }}>
                {pendingCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 12, gap: 8 }}
        style={{ flexGrow: 0, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilterStatus(f.key)}
            style={{
              paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
              backgroundColor: filterStatus === f.key ? '#15803d' : '#f3f4f6',
            }}
          >
            <Text style={{
              fontSize: 12, fontWeight: '700', fontFamily: FONTS.label,
              color: filterStatus === f.key ? '#fff' : '#374151',
            }}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Alert list */}
      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Ionicons name="checkmark-circle-outline" size={56} color="#86efac" />
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', marginTop: 14, fontFamily: FONTS.title }}>
              No alerts
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 6, fontFamily: FONTS.body }}>
              No alerts match this filter.
            </Text>
          </View>
        ) : (
          filtered.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onReview={handleReview} />
          ))
        )}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Evidence Review Modal */}
      <Modal visible={reviewModal} animationType="slide">
        {selectedAlert && (
          <View style={{ flex: 1, backgroundColor: '#111827' }}>

            {/* Modal header */}
            <View style={{ backgroundColor: '#15803d', padding: 20, paddingTop: 56, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.label }}>
                  EVIDENCE REVIEW
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff', fontFamily: FONTS.title }} numberOfLines={1}>
                  {selectedAlert.location}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setReviewModal(false)}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Main evidence frame */}
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: selectedAlert.evidenceFrames[activeFrame]?.url }}
                  style={{ width: SCREEN_WIDTH, height: 260 }}
                  resizeMode="cover"
                />
                {/* Frame overlay info */}
                <View style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: 12, backgroundColor: 'rgba(0,0,0,0.6)',
                  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <View>
                    <Text style={{ fontSize: 12, color: '#fff', fontWeight: '700', fontFamily: FONTS.label }}>
                      Frame {activeFrame + 1} of {selectedAlert.evidenceFrames.length}
                    </Text>
                    <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.body }}>
                      Captured at {selectedAlert.evidenceFrames[activeFrame]?.time}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: '#dc2626', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                    <Text style={{ fontSize: 12, color: '#fff', fontWeight: '700', fontFamily: FONTS.label }}>
                      {selectedAlert.evidenceFrames[activeFrame]?.confidence}% confidence
                    </Text>
                  </View>
                </View>
              </View>

              {/* Frame thumbnails */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 12, gap: 8 }}>
                {selectedAlert.evidenceFrames.map((frame, index) => (
                  <TouchableOpacity key={frame.id} onPress={() => setActiveFrame(index)}>
                    <Image
                      source={{ uri: frame.url }}
                      style={{
                        width: 80, height: 60, borderRadius: 8,
                        borderWidth: 2,
                        borderColor: activeFrame === index ? '#4ade80' : 'transparent',
                      }}
                      resizeMode="cover"
                    />
                    <Text style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center', marginTop: 3, fontFamily: FONTS.body }}>
                      {frame.time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Alert details */}
              <View style={{ padding: 20 }}>
                <View style={{ backgroundColor: '#1f2937', borderRadius: 14, padding: 16, marginBottom: 16 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 10, fontFamily: FONTS.title }}>
                    Alert Details
                  </Text>
                  {[
                    ['Location', selectedAlert.location],
                    ['Date & Time', new Date(selectedAlert.timestamp).toLocaleString('en-GB')],
                    ['Detected By', selectedAlert.detectedBy],
                    ['Coordinates', `${selectedAlert.coordinates.lat}, ${selectedAlert.coordinates.lng}`],
                    ['Frames', `${selectedAlert.evidenceFrames.length} evidence frames captured`],
                  ].map(([label, value]) => (
                    <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text style={{ fontSize: 12, color: '#9ca3af', fontFamily: FONTS.label }}>{label}</Text>
                      <Text style={{ fontSize: 12, color: '#e5e7eb', fontWeight: '600', fontFamily: FONTS.body, flex: 1, textAlign: 'right' }}>
                        {value}
                      </Text>
                    </View>
                  ))}
                </View>

                <Text style={{ fontSize: 13, color: '#9ca3af', lineHeight: 20, marginBottom: 24, fontFamily: FONTS.body }}>
                  {selectedAlert.description}
                </Text>

                {/* Decision buttons — only for pending */}
                {selectedAlert.status === 'pending' ? (
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 14, fontFamily: FONTS.title }}>
                      Your Decision
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDecision('confirmed')}
                      style={{
                        backgroundColor: '#dc2626', borderRadius: 14, padding: 16, marginBottom: 10,
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <Ionicons name="warning" size={18} color="#fff" />
                      <View>
                        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', fontFamily: FONTS.button }}>
                          Confirm Violation
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontFamily: FONTS.body }}>
                          Flag as genuine violation — notify authorities
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDecision('false_detection')}
                      style={{
                        backgroundColor: '#374151', borderRadius: 14, padding: 16,
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <Ionicons name="checkmark-circle" size={18} color="#9ca3af" />
                      <View>
                        <Text style={{ color: '#e5e7eb', fontSize: 15, fontWeight: '800', fontFamily: FONTS.button }}>
                          Mark as False Detection
                        </Text>
                        <Text style={{ color: '#9ca3af', fontSize: 11, fontFamily: FONTS.body }}>
                          No action needed — improve model accuracy
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{
                    padding: 16, borderRadius: 14,
                    backgroundColor: STATUS_CONFIG[selectedAlert.status].bg,
                    flexDirection: 'row', alignItems: 'center', gap: 10,
                  }}>
                    <Ionicons
                      name={selectedAlert.status === 'confirmed' ? 'warning' : 'checkmark-circle'}
                      size={20}
                      color={STATUS_CONFIG[selectedAlert.status].color}
                    />
                    <Text style={{
                      fontSize: 14, fontWeight: '700', fontFamily: FONTS.body,
                      color: STATUS_CONFIG[selectedAlert.status].color,
                    }}>
                      {STATUS_CONFIG[selectedAlert.status].label}
                    </Text>
                  </View>
                )}
              </View>
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}
