// src/components/OfflineBanner.js
// Animated offline banner — slides in from top when network drops
import React, { useEffect, useRef } from 'react';
import { Animated, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';

export default function OfflineBanner({ visible = false, message }) {
  const slideAnim = useRef(new Animated.Value(-52)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -52,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View style={{
      transform: [{ translateY: slideAnim }],
      backgroundColor: '#92400e',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      gap: 8,
      zIndex: 999,
    }}>
      <Ionicons name="cloud-offline-outline" size={16} color="#fef3c7" />
      <Text style={{ fontSize: 12, color: '#fef3c7', fontWeight: '600', flex: 1, fontFamily: FONTS.body }}>
        {message || "You're offline — progress is saved locally and will sync on reconnect."}
      </Text>
    </Animated.View>
  );
}
