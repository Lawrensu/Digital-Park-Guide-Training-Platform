// src/components/OfflineBanner.js
import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';

/**
 * Slim banner shown when the app detects it's offline.
 * Slides in from the top and stays until connectivity is restored.
 *
 * Props:
 *   visible – boolean: show/hide the banner
 *   message – override the default message string
 */
export default function OfflineBanner({ visible = false, message }) {
  const [slideAnim] = useState(new Animated.Value(-60));

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -60,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        backgroundColor: '#92400e',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 10,
      }}
    >
      <Ionicons name="cloud-offline-outline" size={16} color="#fef3c7" />
      <Text style={{ fontSize: 13, color: '#fef3c7', fontWeight: '600', flex: 1 }}>
        {message || 'You\'re offline — showing cached content. Progress will sync when reconnected.'}
      </Text>
    </Animated.View>
  );
}
