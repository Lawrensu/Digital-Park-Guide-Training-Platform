import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';

// Outfit → sans-serif  |  Source Serif 4 → serif  (swap fontFamily when fonts installed)
const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h1:          { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h3:          { fontFamily: sans,  fontSize: 20, fontWeight: '500' },
  bodyDefault: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySmall:   { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:       { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption:     { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const CONTENT_TYPES = [
  { key: 'document', label: 'Document', icon: 'arrow-up-circle-outline' },
  { key: 'image',    label: 'Image',    icon: 'image-outline' },
  { key: 'video',    label: 'Video',    icon: 'videocam-outline' },
];

const MAX_DESC = 500;

export default function ContentBuild() {
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();
  const route      = useRoute();
  const linkedModule = route.params?.module ?? null;

  const [title, setTitle]           = useState('');
  const [contentType, setType]      = useState('document');
  const [description, setDesc]      = useState('');
  const [selectedFile, setFile]     = useState(null);

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20,
        flexDirection: 'row', alignItems: 'flex-start',
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14, marginTop: 4 }}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={[T.h1, { color: '#fff', lineHeight: 34 }]}>Content Build</Text>
          <Text style={[T.bodySmall, { color: 'rgba(255,255,255,0.8)', marginTop: 2 }]}>
            Create new course content
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >

        {/* ── Content Title ── */}
        <Text style={[T.label, { color: '#6b7280', letterSpacing: 0.8, marginBottom: 8 }]}>
          CONTENT TITLE
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Introduction to Rainforest Ecosystem"
          placeholderTextColor="#9ca3af"
          style={{
            backgroundColor: '#fff', borderRadius: 12,
            borderWidth: 1, borderColor: '#e5e7eb',
            padding: 14, marginBottom: 20,
            ...T.bodyDefault, color: '#111827',
          }}
        />

        {/* ── Content Type ── */}
        <Text style={[T.label, { color: '#6b7280', letterSpacing: 0.8, marginBottom: 8 }]}>
          CONTENT TYPE
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {CONTENT_TYPES.map((type) => {
            const active = contentType === type.key;
            return (
              <TouchableOpacity
                key={type.key}
                onPress={() => setType(type.key)}
                style={{
                  flex: 1, backgroundColor: '#fff', borderRadius: 12,
                  paddingVertical: 14, alignItems: 'center', justifyContent: 'center',
                  borderWidth: active ? 2 : 1,
                  borderColor: active ? '#15803d' : '#e5e7eb',
                  gap: 6,
                }}
              >
                <Ionicons
                  name={type.icon}
                  size={24}
                  color={active ? '#15803d' : '#6b7280'}
                />
                <Text style={[T.label, { color: active ? '#15803d' : '#6b7280' }]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Description ── */}
        <Text style={[T.label, { color: '#6b7280', letterSpacing: 0.8, marginBottom: 8 }]}>
          DESCRIPTION
        </Text>
        <View style={{
          backgroundColor: '#fff', borderRadius: 12,
          borderWidth: 1, borderColor: '#e5e7eb',
          marginBottom: 20, overflow: 'hidden',
        }}>
          <TextInput
            value={description}
            onChangeText={(t) => setDesc(t.slice(0, MAX_DESC))}
            placeholder="Describe the content and learning objectives..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={{
              padding: 14, minHeight: 120,
              ...T.bodyDefault, color: '#111827', lineHeight: 24,
            }}
          />
          <Text style={[T.caption, {
            color: '#9ca3af', textAlign: 'right',
            paddingHorizontal: 14, paddingBottom: 10,
          }]}>
            {description.length} / {MAX_DESC}
          </Text>
        </View>

        {/* ── Upload Material ── */}
        <Text style={[T.label, { color: '#6b7280', letterSpacing: 0.8, marginBottom: 8 }]}>
          UPLOAD MATERIAL
        </Text>
        <TouchableOpacity
          onPress={() => {}}
          style={{
            backgroundColor: '#fff', borderRadius: 12,
            borderWidth: 1.5, borderColor: '#d1d5db', borderStyle: 'dashed',
            paddingVertical: 36, alignItems: 'center', justifyContent: 'center',
            marginBottom: 24, gap: 8,
          }}
        >
          <View style={{
            width: 48, height: 48, borderRadius: 24,
            backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="arrow-up-circle-outline" size={28} color="#6b7280" />
          </View>
          <Text style={[T.bodySmall, { color: '#374151', textAlign: 'center' }]}>
            Click to upload or drag and drop
          </Text>
          <Text style={[T.caption, { color: '#9ca3af' }]}>
            PDF, DOCX, PPT (max 50MB)
          </Text>
          {selectedFile && (
            <Text style={[T.caption, { color: '#15803d', marginTop: 4 }]}>
              {selectedFile}
            </Text>
          )}
        </TouchableOpacity>

        {/* ── Additional Settings ── */}
        <Text style={[T.h3, { color: '#111827', marginBottom: 16 }]}>
          Additional Settings
        </Text>

        {[
          {
            label: 'MODULE',
            placeholder: linkedModule ? linkedModule.title : 'Select module...',
            locked: !!linkedModule,
          },
          { label: 'DIFFICULTY', placeholder: 'Select difficulty...' },
          { label: 'VISIBILITY', placeholder: 'Published' },
        ].map((field) => (
          <View key={field.label} style={{ marginBottom: 14 }}>
            <Text style={[T.label, { color: '#6b7280', letterSpacing: 0.8, marginBottom: 8 }]}>
              {field.label}
            </Text>
            <TouchableOpacity
              disabled={field.locked}
              style={{
                backgroundColor: field.locked ? '#f0fdf4' : '#fff', borderRadius: 12,
                borderWidth: 1, borderColor: field.locked ? '#bbf7d0' : '#e5e7eb',
                padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
              }}
            >
              <Text style={[T.bodyDefault, { color: field.locked ? '#15803d' : '#9ca3af', flex: 1 }]}>
                {field.placeholder}
              </Text>
              {field.locked
                ? <Ionicons name="lock-closed" size={16} color="#15803d" />
                : <Ionicons name="chevron-down" size={18} color="#9ca3af" />}
            </TouchableOpacity>
          </View>
        ))}

        {/* ── Submit ── */}
        <TouchableOpacity style={{
          backgroundColor: '#15803d', borderRadius: 14,
          paddingVertical: 16, alignItems: 'center', marginTop: 8,
        }}>
          <Text style={[T.label, { color: '#fff', fontSize: 16 }]}>Save Content</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
