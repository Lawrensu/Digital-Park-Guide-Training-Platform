import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform,
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

const SEVERITY = {
  HIGH:   { color: '#dc2626', bg: '#fee2e2', border: '#dc2626' },
  MEDIUM: { color: '#d97706', bg: '#fef3c7', border: '#d97706' },
  LOW:    { color: '#6b7280', bg: '#f3f4f6', border: '#9ca3af' },
};

const STATUS_STYLE = {
  'PENDING REVIEW':  { color: '#d97706', bg: '#fef3c7' },
  'CONFIRMED':       { color: '#16a34a', bg: '#dcfce7' },
  'FALSE DETECTION': { color: '#0891b2', bg: '#e0f2fe' },
};

const FILTERS = ['All', 'High', 'Medium', 'Low', 'Resolved'];

const ALERTS = [
  {
    id: 1,
    group: 'TODAY',
    sector: 'Sector 7B — Northern Trail',
    severity: 'HIGH',
    status: 'PENDING REVIEW',
    time: '14:32',
    sensor: 'Motion Sensor Node #14',
    description: 'Unusual movement detected near protected nesting area. Multiple frames captured with high confidence levels.',
    evidence: [87, 92, 85],
  },
  {
    id: 2,
    group: 'TODAY',
    sector: 'Sector 3A — Western Ridge',
    severity: 'MEDIUM',
    status: 'CONFIRMED',
    time: '11:15',
    sensor: 'Camera Trap #08',
    description: 'Confirmed wildlife activity in monitored zone.',
    evidence: [78, 81],
  },
  {
    id: 3,
    group: 'YESTERDAY',
    sector: 'Sector 5C — Eastern Trail',
    severity: 'LOW',
    status: 'FALSE DETECTION',
    time: '16:48',
    sensor: 'Motion Sensor Node #22',
    description: 'Wind-triggered false positive. No action required.',
    evidence: [45],
  },
];

function EvidenceThumbnail({ confidence }) {
  return (
    <View style={{ position: 'relative', marginRight: 8 }}>
      <View style={{
        width: 76, height: 62, borderRadius: 8,
        backgroundColor: '#e5e7eb',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Ionicons name="camera" size={20} color="#9ca3af" />
      </View>
      <View style={{
        position: 'absolute', bottom: 4, right: 4,
        backgroundColor: '#dc2626', borderRadius: 4,
        paddingHorizontal: 5, paddingVertical: 2,
      }}>
        <Text style={[T.caption, { color: '#fff', fontWeight: '700', fontSize: 10 }]}>
          {confidence}%
        </Text>
      </View>
    </View>
  );
}

function AlertCard({ alert, onReview }) {
  const sev    = SEVERITY[alert.severity];
  const stat   = STATUS_STYLE[alert.status];

  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
      marginBottom: 12,
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
      flexDirection: 'row',
    }}>
      {/* Left accent border */}
      <View style={{ width: 4, backgroundColor: sev.color }} />

      {/* Card content */}
      <View style={{ flex: 1, padding: 16 }}>
        {/* Top row: icon + sector + badges */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
          <View style={{
            width: 38, height: 38, borderRadius: 19,
            backgroundColor: '#fef3c7',
            alignItems: 'center', justifyContent: 'center',
            marginRight: 10,
          }}>
            <Ionicons name="warning" size={20} color="#d97706" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[T.h4, { color: '#111827', marginBottom: 5 }]}>
              {alert.sector}
            </Text>
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
              {/* Severity badge */}
              <View style={{
                paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
                backgroundColor: sev.bg,
              }}>
                <Text style={[T.caption, { color: sev.color, fontWeight: '700' }]}>
                  {alert.severity}
                </Text>
              </View>
              {/* Status badge */}
              <View style={{
                paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
                backgroundColor: stat.bg,
              }}>
                <Text style={[T.caption, { color: stat.color, fontWeight: '700' }]}>
                  {alert.status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Time + sensor */}
        <Text style={[T.caption, { color: '#9ca3af', marginBottom: 8 }]}>
          {alert.time} · {alert.sensor}
        </Text>

        {/* Description */}
        <Text style={[T.bodySmall, { color: '#374151', lineHeight: 20, marginBottom: 12 }]}>
          {alert.description}
        </Text>

        {/* Evidence thumbnails */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 14 }}
        >
          {alert.evidence.map((conf, i) => (
            <EvidenceThumbnail key={i} confidence={conf} />
          ))}
        </ScrollView>

        {/* Review button */}
        <TouchableOpacity
          onPress={onReview}
          style={{
            borderWidth: 1.5, borderColor: sev.border, borderRadius: 10,
            paddingVertical: 10, alignItems: 'center',
          }}
        >
          <Text style={[T.label, { color: sev.color }]}>
            Review Evidence →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function IoTAlert() {
  const navigation          = useNavigation();
  const [filter, setFilter] = useState('All');

  const groups = ['TODAY', 'YESTERDAY'];

  const filterMap = { High: 'HIGH', Medium: 'MEDIUM', Low: 'LOW' };

  const getFiltered = (group) =>
    ALERTS.filter((a) => {
      const matchGroup = a.group === group;
      const matchFilter =
        filter === 'All'      ? true :
        filter === 'Resolved' ? a.status === 'FALSE DETECTION' || a.status === 'CONFIRMED' :
                                a.severity === filterMap[filter];
      return matchGroup && matchFilter;
    });

  const totalAlerts = ALERTS.length;

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{ backgroundColor: '#15803d', paddingTop: 52, paddingBottom: 16, paddingHorizontal: 20 }}>

        {/* Title row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={[T.h1, { color: '#fff' }]}>Live Alerts</Text>
          </View>
          <View style={{
            width: 28, height: 28, borderRadius: 14,
            backgroundColor: '#dc2626', alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={[T.caption, { color: '#fff', fontWeight: '700' }]}>{totalAlerts}</Text>
          </View>
        </View>

        {/* Live indicator */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14, paddingLeft: 36 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#9ca3af' }} />
          <Text style={[T.caption, { color: 'rgba(255,255,255,0.8)' }]}>
            Live · Last update: 2m ago
          </Text>
        </View>

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 4 }}
        >
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={{
                  paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
                  backgroundColor: active ? '#fff' : 'rgba(0,0,0,0.25)',
                }}
              >
                <Text style={[T.caption, {
                  color: active ? '#15803d' : '#fff',
                  fontWeight: '600',
                }]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Alert list ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {groups.map((group) => {
          const groupAlerts = getFiltered(group);
          if (groupAlerts.length === 0) return null;
          return (
            <View key={group}>
              <Text style={[T.caption, {
                color: '#9ca3af', letterSpacing: 0.8,
                marginBottom: 10, marginLeft: 2,
              }]}>
                {group}
              </Text>
              {groupAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onReview={() => navigation.navigate('IoTDetails', { alert })}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>

    </View>
  );
}
