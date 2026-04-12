// src/components/CourseCard.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from './ProgressBar';
import Badge from './Badge';
import { FONTS } from '../theme/fonts';

const DIFFICULTY_COLORS = {
  Beginner:     '#16a34a',
  Intermediate: '#d97706',
  Advanced:     '#dc2626',
};

/**
 * Reusable course card — used in CourseListScreen and UserDashboard.
 * Props:
 *   course      – course object from API/seed
 *   progress    – 0–100 completion percentage
 *   onPress     – tap handler
 *   compact     – render a smaller horizontal card (for dashboard)
 */
export default function CourseCard({ course, progress = 0, onPress, compact = false }) {
  const diffColor = DIFFICULTY_COLORS[course.difficulty] || '#6b7280';

  if (compact) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: '#fff', borderRadius: 16, marginBottom: 12,
          flexDirection: 'row', overflow: 'hidden',
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
        }}
      >
        <Image source={{ uri: course.thumbnail }} style={{ width: 88, height: 88 }} resizeMode="cover" />
        <View style={{ flex: 1, padding: 12 }}>
          <Badge label={course.category.toUpperCase()} preset={course.category.toLowerCase()} />
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827', marginTop: 6, marginBottom: 8 }}
            numberOfLines={2}>
            {course.title}
          </Text>
          <ProgressBar progress={progress} height={4} showLabel label={`${progress}% complete`} />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#fff', borderRadius: 20, marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
        overflow: 'hidden',
      }}
    >
      {/* Thumbnail */}
      <View>
        <Image source={{ uri: course.thumbnail }} style={{ width: '100%', height: 160 }} resizeMode="cover" />
        <View style={{ position: 'absolute', top: 12, left: 12 }}>
          <Badge label={course.category.toUpperCase()} bg="#15803d" color="#fff" size="md" />
        </View>
        <View style={{
          position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20,
        }}>
          <Ionicons name="star" size={11} color="#fbbf24" />
          <Text style={{ fontSize: 11, color: '#fff', marginLeft: 3, fontWeight: '700' }}>
            {course.rating}
          </Text>
        </View>
        {progress === 100 && (
          <View style={{
            position: 'absolute', bottom: 12, right: 12, flexDirection: 'row', alignItems: 'center',
            backgroundColor: '#16a34a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
          }}>
            <Ionicons name="checkmark-circle" size={12} color="#fff" />
            <Text style={{ fontSize: 11, color: '#fff', marginLeft: 3, fontWeight: '700' }}>Completed</Text>
          </View>
        )}
      </View>

      {/* Body */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 6 }} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={{ fontSize: 12, color: '#6b7280', lineHeight: 18, marginBottom: 12 }} numberOfLines={2}>
          {course.description}
        </Text>

        {/* Meta row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 14, flexWrap: 'wrap' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time-outline" size={13} color="#9ca3af" />
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>{course.duration}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="layers-outline" size={13} color="#9ca3af" />
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>
              {course.lessons || course.lessons_count} lessons
            </Text>
          </View>
          <Badge label={course.difficulty} preset={course.difficulty?.toLowerCase()} />
        </View>

        {/* Progress bar */}
        <ProgressBar progress={progress} height={6} showLabel label="Progress" />

        {/* Footer */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="person-circle-outline" size={15} color="#9ca3af" />
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>{course.instructor}</Text>
          </View>
          <TouchableOpacity
            onPress={onPress}
            style={{
              backgroundColor: progress > 0 ? '#15803d' : '#f0fdf4',
              paddingHorizontal: 18, paddingVertical: 8, borderRadius: 10,
              borderWidth: progress > 0 ? 0 : 1.5, borderColor: '#15803d',
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '700', color: progress > 0 ? '#fff' : '#15803d' }}>
              {progress === 100 ? 'Review' : progress > 0 ? 'Continue' : 'Start'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
