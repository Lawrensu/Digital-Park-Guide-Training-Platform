import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  display: { fontFamily: sans,  fontSize: 36, fontWeight: '600' },
  h1:      { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h2:      { fontFamily: sans,  fontSize: 24, fontWeight: '600' },
  h3:      { fontFamily: sans,  fontSize: 20, fontWeight: '500' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodyLg:  { fontFamily: serif, fontSize: 18, fontWeight: '400' },
  bodyDef: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const CONTENT_ITEMS = [
  {
    id: 1,
    type: 'TEXT',
    title: 'Introduction',
    description: 'Rainforests are among the most biodiverse ecosystems on Earth. They cover approximately 6% of the Earth\'s surface but contain more than half of the world\'s plant and animal species.',
    iconName: 'document-text-outline',
    iconBg: '#f3f4f6',
    iconColor: '#6b7280',
  },
  {
    id: 2,
    type: 'VIDEO',
    title: 'Rainforest Layers',
    description: 'Video: Understanding the four main layers of the rainforest',
    duration: '12:30',
    iconName: 'play',
    iconBg: '#3b82f6',
    iconColor: '#fff',
  },
  {
    id: 3,
    type: 'KEY_POINTS',
    title: 'Key Learning Points',
    points: [
      'Emergent layer: Tallest trees reaching 60+ meters',
      'Canopy layer: Dense vegetation forming a roof',
      'Understory: Smaller plants with limited sunlight',
      'Forest floor: Decomposition and nutrient cycling',
    ],
    iconName: 'document-text-outline',
    iconBg: '#f3f4f6',
    iconColor: '#6b7280',
  },
  {
    id: 4,
    type: 'IMAGE',
    title: 'Biodiversity Diagram',
    description: 'Interactive diagram showing species distribution',
    iconName: 'image-outline',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
  },
];

function ContentCard({ item, isLast }) {
  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 16, padding: 16,
      marginBottom: isLast ? 0 : 10,
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
        {/* Icon */}
        <View style={{
          width: 44, height: 44, borderRadius: 10,
          backgroundColor: item.iconBg,
          alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Ionicons name={item.iconName} size={22} color={item.iconColor} />
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text style={[T.h4, { color: '#111827', marginBottom: 6 }]}>
            {item.title}
          </Text>

          {/* Description (TEXT / VIDEO / IMAGE) */}
          {item.description && (
            <Text style={[T.bodySm, { color: '#6b7280', lineHeight: 20 }]}>
              {item.description}
            </Text>
          )}

          {/* Duration (VIDEO) */}
          {item.duration && (
            <Text style={[T.caption, { color: '#15803d', marginTop: 4 }]}>
              Duration: {item.duration}
            </Text>
          )}

          {/* Bullet points (KEY_POINTS) */}
          {item.points && item.points.map((pt, i) => (
            <Text
              key={i}
              style={[T.bodySm, { color: '#6b7280', lineHeight: 22 }]}
            >
              • {pt}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function ModuleView() {
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();
  const route      = useRoute();

  const module = route.params?.module ?? {
    id: 1,
    title: 'Rainforest Biodiversity Fundamentals',
    description: 'Comprehensive guide to rainforest ecosystems, biodiversity conservation principles, and the critical role these environments play in our global ecosystem.',
    status: 'Published',
    lessons: 8,
    duration: '4h 30m',
  };

  const isPublished = module.status === 'Published';

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: isOnline === false ? 12 : 52, paddingBottom: 18, paddingHorizontal: 20,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={[T.h2, { color: '#fff' }]}>View Module</Text>
            <Text style={[T.caption, { color: 'rgba(255,255,255,0.75)', marginTop: 2 }]}>
              Read-only view
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ModuleEdit', { module })}>
          <Text style={[T.label, { color: '#fff', fontWeight: '700' }]}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >

        {/* ── Module info card ── */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 20,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        }}>
          {/* Title */}
          <Text style={[T.h2, { color: '#111827', lineHeight: 32, marginBottom: 10 }]}>
            {module.title}
          </Text>

          {/* Meta row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Ionicons name="albums" size={14} color="#7c3aed" />
              <Text style={[T.caption, { color: '#374151' }]}>{module.lessons} lessons</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Ionicons name="time-outline" size={14} color="#6b7280" />
              <Text style={[T.caption, { color: '#374151' }]}>{module.duration}</Text>
            </View>
            <View style={{
              backgroundColor: isPublished ? '#dcfce7' : '#fef3c7',
              borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3,
            }}>
              <Text style={[T.caption, {
                color: isPublished ? '#15803d' : '#d97706', fontWeight: '700',
              }]}>
                {module.status}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={[T.bodyDef, { color: '#6b7280', lineHeight: 24 }]}>
            {module.description}
          </Text>
        </View>

        {/* ── Module Content section ── */}
        <Text style={[T.h3, { color: '#111827', marginBottom: 14 }]}>Module Content</Text>

        {CONTENT_ITEMS.map((item, i) => (
          <ContentCard
            key={item.id}
            item={item}
            isLast={i === CONTENT_ITEMS.length - 1}
          />
        ))}

        {/* ── Bottom buttons ── */}
        <View style={{ marginTop: 20, gap: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ModuleEdit', { module })}
            style={{
              backgroundColor: '#15803d', borderRadius: 14,
              paddingVertical: 16, alignItems: 'center',
            }}
          >
            <Text style={[T.label, { color: '#fff', fontWeight: '700', fontSize: 15 }]}>
              Edit This Module
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 14,
              paddingVertical: 16, alignItems: 'center',
              backgroundColor: '#fff',
            }}
          >
            <Text style={[T.label, { color: '#374151', fontWeight: '600', fontSize: 15 }]}>
              Back to Module List
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}
