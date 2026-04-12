// src/components/ProgressBar.js
import React from 'react';
import { View, Text } from 'react-native';
import { FONTS } from '../theme/fonts';

/**
 * Reusable animated progress bar.
 * Props:
 *   progress   – 0–100 number
 *   height     – bar height in px (default 6)
 *   color      – fill color (default forest green)
 *   trackColor – background color (default light gray)
 *   showLabel  – show percentage label (default false)
 *   label      – override label text
 */
export default function ProgressBar({
  progress = 0,
  height = 6,
  color = '#16a34a',
  trackColor = '#e5e7eb',
  showLabel = false,
  label,
}) {
  const pct = Math.max(0, Math.min(100, progress));

  return (
    <View>
      {showLabel && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          {label ? (
            <Text style={{ fontSize: 12, color: '#6b7280' }}>{label}</Text>
          ) : null}
          <Text style={{ fontSize: 12, fontWeight: '700', color }}>
            {Math.round(pct)}%
          </Text>
        </View>
      )}
      <View style={{ height, backgroundColor: trackColor, borderRadius: height / 2 }}>
        <View
          style={{
            width: `${pct}%`,
            height,
            backgroundColor: pct === 100 ? '#16a34a' : color,
            borderRadius: height / 2,
          }}
        />
      </View>
    </View>
  );
}
