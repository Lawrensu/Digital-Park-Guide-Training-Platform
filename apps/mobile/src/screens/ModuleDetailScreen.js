// src/screens/ModuleDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';
import { fetchLessons } from '../services/apiService';

const CONTENT_TYPE_ICONS = {
  video:        { icon: 'play-circle',    color: '#0891b2', bg: '#dbeafe', label: 'Video' },
  lesson:       { icon: 'document-text', color: '#7c3aed', bg: '#ede9fe', label: 'Reading' },
  quiz:         { icon: 'help-circle',   color: '#d97706', bg: '#fef3c7', label: 'Quiz' },
  infographic:  { icon: 'image',         color: '#16a34a', bg: '#dcfce7', label: 'Infographic' },
  default:      { icon: 'document',      color: '#6b7280', bg: '#f3f4f6', label: 'Content' },
};

export default function ModuleDetailScreen({ route, navigation }) {
  const { course } = route.params;
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Mock enrolment progress (in production from API/SQLite)
  const completedCount = 1;

  useEffect(() => {
    navigation.setOptions({ title: course.title });
    loadLessons();
  }, []);

  const loadLessons = async () => {
    setLoading(true);
    const data = await fetchLessons(course.id);
    setLessons(data);
    setLoading(false);
  };

  const handleEnrol = async () => {
    setEnrolling(true);
    // POST /api/enrolments in production
    await new Promise((r) => setTimeout(r, 800)); // simulate API call
    setEnrolled(true);
    setEnrolling(false);
    Alert.alert('Enrolled!', `You have enrolled in "${course.title}". Good luck!`);
  };

  const handleStart = () => {
    if (lessons.length === 0) return;
    navigation.navigate('Lesson', { course });
  };

  const progressPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={{ backgroundColor: '#15803d', padding: 20, paddingBottom: 28 }}>
          {/* Category + difficulty */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ fontSize: 11, color: '#fff', fontWeight: '700', fontFamily: FONTS.label }}>
                {course.category?.toUpperCase()}
              </Text>
            </View>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ fontSize: 11, color: '#fff', fontWeight: '700', fontFamily: FONTS.label }}>
                {course.difficulty?.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 8, fontFamily: FONTS.title, lineHeight: 28 }}>
            {course.title}
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20, fontFamily: FONTS.body, marginBottom: 16 }}>
            {course.description}
          </Text>

          {/* Meta row */}
          <View style={{ flexDirection: 'row', gap: 20 }}>
            {[
              { icon: 'time-outline',    value: course.duration },
              { icon: 'layers-outline',  value: `${course.lessons || lessons.length} lessons` },
              { icon: 'star',            value: `${course.rating}` },
              { icon: 'people-outline',  value: `${course.enrolled} enrolled` },
            ].map((item) => (
              <View key={item.icon} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name={item.icon} size={13} color="rgba(255,255,255,0.75)" />
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontFamily: FONTS.body }}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Instructor */}
        <View style={{
          marginHorizontal: 16, marginTop: 16, padding: 14,
          backgroundColor: '#fff', borderRadius: 14,
          flexDirection: 'row', alignItems: 'center', gap: 12,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
        }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="person-circle-outline" size={24} color="#16a34a" />
          </View>
          <View>
            <Text style={{ fontSize: 11, color: '#9ca3af', fontWeight: '700', fontFamily: FONTS.label }}>INSTRUCTOR</Text>
            <Text style={{ fontSize: 14, color: '#111827', fontWeight: '700', fontFamily: FONTS.title }}>{course.instructor}</Text>
          </View>
        </View>

        {/* Progress (if enrolled) */}
        {enrolled && (
          <View style={{
            marginHorizontal: 16, marginTop: 12, padding: 14,
            backgroundColor: '#f0fdf4', borderRadius: 14,
            borderWidth: 1, borderColor: '#bbf7d0',
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#15803d', fontFamily: FONTS.title }}>Your Progress</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#15803d', fontFamily: FONTS.title }}>{progressPct}%</Text>
            </View>
            <View style={{ height: 6, backgroundColor: '#dcfce7', borderRadius: 3 }}>
              <View style={{ width: `${progressPct}%`, height: 6, backgroundColor: '#16a34a', borderRadius: 3 }} />
            </View>
            <Text style={{ fontSize: 11, color: '#6b7280', marginTop: 6, fontFamily: FONTS.body }}>
              {completedCount} of {lessons.length} lessons completed
            </Text>
          </View>
        )}

        {/* Content items list */}
        <View style={{ marginHorizontal: 16, marginTop: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 12, fontFamily: FONTS.title }}>
            Course Content
          </Text>

          {loading ? (
            <View style={{ alignItems: 'center', padding: 32 }}>
              <ActivityIndicator color="#15803d" />
            </View>
          ) : lessons.length === 0 ? (
            <View style={{
              padding: 24, backgroundColor: '#fff', borderRadius: 14,
              alignItems: 'center',
            }}>
              <Ionicons name="document-outline" size={40} color="#d1d5db" />
              <Text style={{ fontSize: 14, color: '#9ca3af', marginTop: 10, fontFamily: FONTS.body }}>
                Content coming soon
              </Text>
            </View>
          ) : (
            <View style={{
              backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
            }}>
              {lessons.map((lesson, index) => {
                const config = CONTENT_TYPE_ICONS[lesson.type] || CONTENT_TYPE_ICONS.default;
                const isCompleted = index < completedCount;
                const isLocked = !enrolled && index > 0;

                return (
                  <TouchableOpacity
                    key={lesson.id}
                    onPress={() => !isLocked && navigation.navigate('Lesson', { course, lessonIndex: index })}
                    style={{
                      flexDirection: 'row', alignItems: 'center', padding: 14,
                      borderBottomWidth: index < lessons.length - 1 ? 1 : 0,
                      borderBottomColor: '#f3f4f6',
                      opacity: isLocked ? 0.5 : 1,
                    }}
                  >
                    {/* Type icon */}
                    <View style={{
                      width: 38, height: 38, borderRadius: 10,
                      backgroundColor: config.bg, alignItems: 'center', justifyContent: 'center',
                      marginRight: 12, flexShrink: 0,
                    }}>
                      <Ionicons name={config.icon} size={18} color={config.color} />
                    </View>

                    {/* Content info */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827', fontFamily: FONTS.title }} numberOfLines={1}>
                        {lesson.title}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 1, fontFamily: FONTS.body }}>
                        {config.label} · {lesson.duration}
                      </Text>
                    </View>

                    {/* Status icon */}
                    {isCompleted ? (
                      <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                    ) : isLocked ? (
                      <Ionicons name="lock-closed" size={16} color="#d1d5db" />
                    ) : (
                      <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <View style={{ marginHorizontal: 16, marginTop: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8, fontFamily: FONTS.title }}>Tags</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {course.tags.map((tag) => (
                <View key={tag} style={{ backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 }}>
                  <Text style={{ fontSize: 12, color: '#374151', fontFamily: FONTS.body }}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom action button */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#fff', padding: 16, paddingBottom: 24,
        borderTopWidth: 1, borderTopColor: '#f3f4f6',
        shadowColor: '#000', shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06, shadowRadius: 8, elevation: 8,
      }}>
        {enrolled ? (
          <TouchableOpacity
            onPress={handleStart}
            style={{
              backgroundColor: '#15803d', borderRadius: 14, padding: 16,
              alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
              shadowColor: '#15803d', shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
            }}
          >
            <Ionicons name={progressPct > 0 ? 'play-circle' : 'rocket'} size={20} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800', fontFamily: FONTS.button }}>
              {progressPct > 0 ? 'Continue Learning' : 'Start Course'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleEnrol}
            disabled={enrolling}
            style={{
              backgroundColor: enrolling ? '#86efac' : '#15803d', borderRadius: 14, padding: 16,
              alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
            }}
          >
            {enrolling ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="add-circle" size={20} color="#fff" />
            )}
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800', fontFamily: FONTS.button }}>
              {enrolling ? 'Enrolling...' : 'Enrol in This Course'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
