// src/components/LoadingScreen.js
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';

/**
 * Full-screen loading state with optional icon and message.
 * Props:
 *   message – string shown below spinner (default "Loading…")
 *   icon    – Ionicons name shown above spinner (optional)
 */
export default function LoadingScreen({ message = 'Loading…', icon }) {
  return (
    <View style={{
      flex: 1, backgroundColor: '#f9fafb',
      alignItems: 'center', justifyContent: 'center', padding: 32,
    }}>
      {icon && (
        <View style={{
          width: 72, height: 72, borderRadius: 36,
          backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <Ionicons name={icon} size={36} color="#16a34a" />
        </View>
      )}
      <ActivityIndicator size="large" color="#15803d" />
      <Text style={{ marginTop: 14, fontSize: 15, color: '#6b7280', textAlign: 'center' }}>
        {message}
      </Text>
    </View>
  );
}
