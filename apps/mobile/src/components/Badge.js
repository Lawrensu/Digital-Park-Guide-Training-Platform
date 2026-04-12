// src/components/Badge.js
import React from 'react';
import { View, Text } from 'react-native';
import { FONTS } from '../theme/fonts';

const PRESETS = {
  biodiversity: { bg: '#dcfce7', text: '#15803d' },
  'eco-tourism': { bg: '#dbeafe', text: '#1d4ed8' },
  safety:        { bg: '#fee2e2', text: '#dc2626' },
  beginner:      { bg: '#dcfce7', text: '#15803d' },
  intermediate:  { bg: '#fef3c7', text: '#92400e' },
  advanced:      { bg: '#fee2e2', text: '#dc2626' },
  video:         { bg: '#dbeafe', text: '#1d4ed8' },
  lesson:        { bg: '#fef3c7', text: '#92400e' },
  default:       { bg: '#f3f4f6', text: '#374151' },
};

/**
 * Compact status/category badge.
 * Props:
 *   label   – display text
 *   preset  – key from PRESETS for auto-coloring
 *   bg      – custom background color
 *   color   – custom text color
 *   size    – 'sm' | 'md' (default 'sm')
 */
export default function Badge({ label, preset, bg, color, size = 'sm' }) {
  const theme = PRESETS[preset?.toLowerCase()] || PRESETS.default;
  const bgColor = bg || theme.bg;
  const textColor = color || theme.text;
  const fontSize = size === 'md' ? 12 : 10;
  const paddingH = size === 'md' ? 10 : 8;
  const paddingV = size === 'md' ? 4 : 3;

  return (
    <View style={{
      backgroundColor: bgColor,
      paddingHorizontal: paddingH,
      paddingVertical: paddingV,
      borderRadius: 6,
      alignSelf: 'flex-start',
    }}>
      <Text style={{ fontSize, fontWeight: '700', color: textColor, letterSpacing: 0.2 }}>
        {label}
      </Text>
    </View>
  );
}
