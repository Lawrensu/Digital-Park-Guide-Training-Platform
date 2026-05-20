// src/components/OfflineBanner.js
import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';

export default function OfflineBanner({ visible = false, message }) {
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <View style={{
      backgroundColor: '#BEBEBE',
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: insets.top + 8,
      paddingBottom: 8,
      paddingHorizontal: 16,
      gap: 8,
    }}>
      <Ionicons name="cloud-offline-outline" size={16} color="#fef3c7" />
      <Text style={{ fontSize: 12, color: '#ffffff', fontWeight: '600', flex: 1, fontFamily: FONTS.body }}>
        {message || "You're offline — progress is saved locally and will sync on reconnect."}
      </Text>
    </View>
  );
}
