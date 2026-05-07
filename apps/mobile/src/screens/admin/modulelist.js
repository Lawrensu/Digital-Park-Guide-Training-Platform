import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h1:          { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h4:          { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodySmall:   { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:       { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption:     { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const MODULES = [
  {
    id: 1,
    title: 'Rainforest Biodiversity Fundamentals',
    description: 'Comprehensive guide to rainforest ecosystems and biodiversity',
    status: 'Published',
    lessons: 8,
    duration: '4h 30m',
    enrolled: 142,
  },
  {
    id: 2,
    title: 'Wildlife Conservation Ethics',
    description: 'Understanding ethical practices in wildlife conservation',
    status: 'Published',
    lessons: 6,
    duration: '3h 15m',
    enrolled: 98,
  },
  {
    id: 3,
    title: 'Advanced Eco-tourism Management',
    description: 'Advanced strategies for sustainable eco-tourism',
    status: 'Draft',
    lessons: 10,
    duration: '6h 0m',
    enrolled: null,
  },
  {
    id: 4,
    title: 'Park Safety Protocols',
    description: 'Essential safety guidelines for park guides',
    status: 'Published',
    lessons: 5,
    duration: '2h 45m',
    enrolled: 187,
  },
];

function StatusBadge({ status }) {
  const published = status === 'Published';
  return (
    <View style={{
      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
      backgroundColor: published ? '#dcfce7' : '#fef3c7',
    }}>
      <Text style={[T.caption, { color: published ? '#16a34a' : '#d97706' }]}>
        {status}
      </Text>
    </View>
  );
}

function ModuleCard({ module, onEdit, onView }) {
  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    }}>
      {/* Title + badge */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <Text style={[T.h4, { color: '#111827', flex: 1, marginRight: 10, lineHeight: 22 }]}>
          {module.title}
        </Text>
        <StatusBadge status={module.status} />
      </View>

      {/* Description */}
      <Text style={[T.bodySmall, { color: '#6b7280', lineHeight: 20, marginBottom: 12 }]}>
        {module.description}
      </Text>

      {/* Stats */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="albums" size={14} color="#7c3aed" />
          <Text style={[T.caption, { color: '#374151' }]}>{module.lessons} lessons</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="time-outline" size={14} color="#6b7280" />
          <Text style={[T.caption, { color: '#374151' }]}>{module.duration}</Text>
        </View>
        {module.enrolled !== null && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="person-outline" size={14} color="#6b7280" />
            <Text style={[T.caption, { color: '#374151' }]}>{module.enrolled} enrolled</Text>
          </View>
        )}
      </View>

      {/* Buttons */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          onPress={onView}
          style={{
            flex: 1, paddingVertical: 10, borderRadius: 10,
            borderWidth: 1.5, borderColor: '#e5e7eb', alignItems: 'center',
          }}
        >
          <Text style={[T.label, { color: '#374151' }]}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onEdit}
          style={{
            flex: 1, paddingVertical: 10, borderRadius: 10,
            backgroundColor: '#15803d', alignItems: 'center',
          }}
        >
          <Text style={[T.label, { color: '#fff' }]}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ModuleList() {
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();
  const [search, setSearch] = useState('');

  const filtered = MODULES.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{ backgroundColor: '#15803d', paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={[T.h1, { color: '#fff', lineHeight: 34 }]}>Modules</Text>
              <Text style={[T.caption, { color: 'rgba(255,255,255,0.8)', marginTop: 2 }]}>
                {MODULES.length} modules total
              </Text>
            </View>
          </View>
          <TouchableOpacity style={{
            width: 38, height: 38, borderRadius: 19,
            backgroundColor: 'rgba(255,255,255,0.25)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: '#fff', borderRadius: 12,
          paddingHorizontal: 12, marginTop: 16, height: 46,
        }}>
          <Ionicons name="search" size={18} color="#15803d" style={{ marginRight: 8 }} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search modules..."
            placeholderTextColor="#9ca3af"
            style={[T.label, { flex: 1, color: '#111827' }]}
          />
        </View>
      </View>

      {/* ── Module list ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {filtered.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onView={() => navigation.navigate('ModuleView', { module })}
            onEdit={() => navigation.navigate('ModuleEdit', { module })}
          />
        ))}

        {/* Add New Module */}
        <TouchableOpacity style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
          borderWidth: 1.5, borderColor: '#15803d', borderStyle: 'dashed',
          borderRadius: 14, paddingVertical: 16, gap: 8, marginTop: 4,
        }}>
          <Ionicons name="add" size={20} color="#15803d" />
          <Text style={[T.label, { color: '#15803d', fontSize: 15 }]}>Add New Module</Text>
        </TouchableOpacity>
      </ScrollView>

    </View>
  );
}
