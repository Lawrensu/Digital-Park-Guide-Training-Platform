// src/components/OfflineBanner.js
// Animated offline banner — slides in from top when network drops
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';

export default function OfflineBanner({ visible = false, message }) {
  if (!visible) return null;

  return (
    <View style={{
      backgroundColor: '#92400e',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      gap: 8,
    }}>
      <Ionicons name="cloud-offline-outline" size={16} color="#fef3c7" />
      <Text style={{ fontSize: 12, color: '#fef3c7', fontWeight: '600', flex: 1, fontFamily: FONTS.body }}>
        {message || "You're offline — progress is saved locally and will sync on reconnect."}
      </Text>
    </View>
  );
}
