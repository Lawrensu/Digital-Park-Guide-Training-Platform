import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h1:      { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodyLg:  { fontFamily: serif, fontSize: 18, fontWeight: '400' },
  bodyDef: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const BG       = '#0d1117';
const CARD_BG  = '#1c2333';
const THUMB_BG = '#263040';
const DIVIDER  = '#263040';

function buildFrames(evidenceArr) {
  const BASE = 14 * 3600 + 32 * 60 + 4;
  return evidenceArr.map((conf, i) => {
    const totalSec = BASE + i * 2;
    const h = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    return { confidence: conf, time: `${h}:${m}:${s}` };
  });
}

function InfoRow({ icon, iconColor, label, value, isLast }) {
  return (
    <View>
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 14, paddingHorizontal: 16,
      }}>
        <View style={{
          width: 36, height: 36, borderRadius: 18,
          backgroundColor: THUMB_BG,
          alignItems: 'center', justifyContent: 'center',
          marginRight: 14,
        }}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[T.caption, { color: '#6b7280', marginBottom: 3 }]}>{label}</Text>
          <Text style={[T.h4, { color: '#d1d5db' }]}>{value}</Text>
        </View>
      </View>
      {!isLast && <View style={{ height: 1, backgroundColor: DIVIDER, marginLeft: 66 }} />}
    </View>
  );
}

export default function IoTDetails() {
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();
  const route      = useRoute();

  const alert = route.params?.alert ?? {
    sector:      'Sector 7B — Northern Trail',
    severity:    'HIGH',
    status:      'PENDING REVIEW',
    time:        '14:32',
    sensor:      'Motion Sensor Node #14',
    description: 'Unusual movement detected near protected nesting area. Multiple frames captured with high confidence levels. Immediate review recommended to determine if this represents a genuine violation requiring authorities notification.',
    evidence:    [87, 92, 85],
  };

  const frames            = buildFrames(alert.evidence);
  const [selected, setSelected] = useState(0);
  const [decision, setDecision] = useState(null);

  const infoRows = [
    { icon: 'location',  iconColor: '#ef4444', label: 'Location',    value: alert.sector },
    { icon: 'time',      iconColor: '#9ca3af', label: 'Date & Time', value: `1 May 2026, ${frames[selected].time}` },
    { icon: 'radio',     iconColor: '#60a5fa', label: 'Detected By', value: alert.sensor },
    { icon: 'map',       iconColor: '#34d399', label: 'Coordinates', value: '3.1390° N, 101.6869° E' },
    { icon: 'camera',    iconColor: '#a78bfa', label: 'Frames',      value: `${frames.length} frames captured` },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>

      {/* ── Dark header ── */}
      <View style={{
        backgroundColor: BG,
        paddingTop: isOnline === false ? 12 : 52, paddingBottom: 16, paddingHorizontal: 20,
        borderBottomWidth: 1, borderBottomColor: DIVIDER,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 4 }}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginHorizontal: 14 }}>
            <Text style={[T.h1, { color: '#fff', fontSize: 24 }]}>Evidence Review</Text>
            <Text style={[T.caption, { color: '#4ade80', marginTop: 3 }]}>{alert.sector}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 4 }}>
            <Ionicons name="close" size={22} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Main image placeholder ── */}
      <View style={{
        height: 200, backgroundColor: CARD_BG,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Ionicons name="camera" size={56} color="#4b5563" />
      </View>

      {/* ── Frame info bar (dark black) ── */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: BG,
        paddingHorizontal: 16, paddingVertical: 10,
      }}>
        <Text style={[T.caption, { color: '#e5e7eb', fontWeight: '600' }]}>
          Frame {selected + 1} of {frames.length} · {frames[selected].time}
        </Text>
        <View style={{
          backgroundColor: '#dc2626', borderRadius: 20,
          paddingHorizontal: 12, paddingVertical: 4,
        }}>
          <Text style={[T.caption, { color: '#fff', fontWeight: '700' }]}>
            {frames[selected].confidence}% confidence
          </Text>
        </View>
      </View>

      {/* ── Thumbnail strip (same bg as details) ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ backgroundColor: CARD_BG, flexGrow: 0, height: 250 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 10 }}
      >
        {frames.map((f, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setSelected(i)}
            style={{
              width: 88, height: 68, borderRadius: 10,
              backgroundColor: THUMB_BG,
              alignItems: 'center', justifyContent: 'center',
              borderWidth: selected === i ? 2 : 0,
              borderColor: '#15803d',
            }}
          >
            <Ionicons name="camera" size={20} color="#6b7280" />
            <Text style={[T.caption, { color: '#6b7280', fontSize: 10, marginTop: 4 }]}>
              {f.time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Scrollable details (same bg as thumbnails) ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: CARD_BG }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Info card */}
        <View style={{
          backgroundColor: THUMB_BG, borderRadius: 16, overflow: 'hidden',
          marginHorizontal: 16, marginTop: 16, marginBottom: 16,
        }}>
          {infoRows.map((row, i) => (
            <InfoRow
              key={row.label}
              {...row}
              isLast={i === infoRows.length - 1}
            />
          ))}
        </View>

        {/* Description */}
        <Text style={[T.bodyDef, { color: '#9ca3af', lineHeight: 24, marginBottom: 24, paddingHorizontal: 16 }]}>
          {alert.description}
        </Text>

        {/* YOUR DECISION */}
        <Text style={[T.caption, { color: '#6b7280', letterSpacing: 0.8, marginBottom: 14, paddingHorizontal: 16 }]}>
          YOUR DECISION
        </Text>

        {/* Confirm Violation */}
        <TouchableOpacity
          onPress={() => setDecision('confirmed')}
          activeOpacity={0.85}
          style={{
            backgroundColor: decision === 'confirmed' ? '#b91c1c' : '#dc2626',
            borderRadius: 14, paddingVertical: 18,
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 12, marginHorizontal: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Ionicons name="warning" size={18} color="#fff" />
            <Text style={[T.h4, { color: '#fff' }]}>Confirm Violation</Text>
          </View>
          <Text style={[T.caption, { color: 'rgba(255,255,255,0.75)', fontWeight: '400' }]}>
            Flag as genuine — notify authorities
          </Text>
        </TouchableOpacity>

        {/* Mark as False Detection */}
        <TouchableOpacity
          onPress={() => setDecision('false')}
          activeOpacity={0.85}
          style={{
            backgroundColor: decision === 'false' ? '#374151' : '#1f2937',
            borderRadius: 14, paddingVertical: 18,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 1, borderColor: '#374151',
            marginHorizontal: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Ionicons name="checkmark" size={18} color="#d1d5db" />
            <Text style={[T.h4, { color: '#9ca3af' }]}>Mark as False Detection</Text>
          </View>
          <Text style={[T.caption, { color: '#6b7280', fontWeight: '400' }]}>
            Improve model accuracy
          </Text>
        </TouchableOpacity>
      </ScrollView>

    </View>
  );
}
