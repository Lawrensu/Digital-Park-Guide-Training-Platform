// src/components/EmptyState.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';

/**
 * Generic empty state with icon, title, description, and optional action button.
 * Props:
 *   icon        – Ionicons name
 *   title       – heading text
 *   description – subtext
 *   actionLabel – button label (optional)
 *   onAction    – button press handler (optional)
 */
export default function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 56, paddingHorizontal: 32 }}>
      <View style={{
        width: 88, height: 88, borderRadius: 44,
        backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        <Ionicons name={icon || 'leaf-outline'} size={44} color="#86efac" />
      </View>
      <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 8, textAlign: 'center' }}>
        {title}
      </Text>
      {description && (
        <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 21 }}>
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={{
            marginTop: 20, backgroundColor: '#15803d', paddingHorizontal: 24,
            paddingVertical: 12, borderRadius: 12,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
