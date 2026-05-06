import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h1:      { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodyDef: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const CATEGORIES = ['All', 'Biodiversity', 'Conservation', 'Eco-Tourism', 'Safety'];

const COURSES = [
  {
    id: 1,
    title: 'Rainforest Biodiversity Fundamentals',
    description: 'Explore the incredible variety of life in rainforest ecosystems and learn conservation strategies.',
    category: 'Biodiversity',
    categoryLabel: 'BIODIVERSITY',
    rating: 4.8,
    duration: '4h 30m',
    lessons: 8,
    level: 'BEGINNER',
    levelColor: '#15803d',
    levelBg: '#dcfce7',
    progress: 68,
    instructor: 'Dr. Maria Santos',
    instructorInitials: 'MS',
    instructorBg: '#f97316',
    status: 'IN_PROGRESS',
    imageBg: '#78350f',
  },
  {
    id: 2,
    title: 'Wildlife Tracking & Monitoring',
    description: 'Learn modern techniques for tracking and monitoring wildlife populations in protected areas.',
    category: 'Conservation',
    categoryLabel: 'CONSERVATION',
    rating: 4.9,
    duration: '6h 15m',
    lessons: 12,
    level: 'INTERMEDIATE',
    levelColor: '#d97706',
    levelBg: '#fef3c7',
    progress: 100,
    instructor: 'James Chen',
    instructorInitials: 'JC',
    instructorBg: '#0891b2',
    status: 'COMPLETED',
    imageBg: '#14532d',
  },
  {
    id: 3,
    title: 'Sustainable Tourism Practices',
    description: 'Balance visitor experience with environmental protection through sustainable tourism management.',
    category: 'Eco-Tourism',
    categoryLabel: 'ECO-TOURISM',
    rating: 4.7,
    duration: '3h 45m',
    lessons: 10,
    level: 'BEGINNER',
    levelColor: '#15803d',
    levelBg: '#dcfce7',
    progress: 35,
    instructor: 'Sarah Williams',
    instructorInitials: 'SW',
    instructorBg: '#7c3aed',
    status: 'IN_PROGRESS',
    imageBg: '#92400e',
  },
  {
    id: 4,
    title: 'Park Safety & Emergency Response',
    description: 'Essential safety protocols and emergency procedures for park guides and visitors.',
    category: 'Safety',
    categoryLabel: 'SAFETY',
    rating: 4.9,
    duration: '5h 00m',
    lessons: 15,
    level: 'BEGINNER',
    levelColor: '#15803d',
    levelBg: '#dcfce7',
    progress: 0,
    instructor: 'Michael Torres',
    instructorInitials: 'MT',
    instructorBg: '#0369a1',
    status: 'NOT_STARTED',
    imageBg: '#0c4a6e',
  },
];

function CourseCard({ course, onPress }) {
  const isCompleted  = course.status === 'COMPLETED';
  const isInProgress = course.status === 'IN_PROGRESS';
  const hasProgress  = course.status !== 'NOT_STARTED';

  const actionLabel  = isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start';
  const actionFilled = isInProgress;

  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 18, marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
    }}>
      {/* ── Hero image placeholder ── */}
      <View style={{ height: 180, backgroundColor: course.imageBg }}>
        {/* Category badge */}
        <View style={{
          position: 'absolute', top: 14, left: 14,
          backgroundColor: '#15803d', borderRadius: 6,
          paddingHorizontal: 10, paddingVertical: 5,
        }}>
          <Text style={[T.caption, { color: '#fff', fontWeight: '700', letterSpacing: 0.5 }]}>
            {course.categoryLabel}
          </Text>
        </View>

        {/* Rating badge */}
        <View style={{
          position: 'absolute', top: 14, right: 14,
          backgroundColor: 'rgba(17,24,39,0.72)', borderRadius: 8,
          paddingHorizontal: 10, paddingVertical: 5,
          flexDirection: 'row', alignItems: 'center', gap: 4,
        }}>
          <Ionicons name="star" size={12} color="#fbbf24" />
          <Text style={[T.caption, { color: '#fff', fontWeight: '700' }]}>{course.rating}</Text>
        </View>
      </View>

      {/* ── Card content ── */}
      <View style={{ padding: 16 }}>

        {/* COMPLETED badge */}
        {isCompleted && (
          <View style={{ alignItems: 'flex-end', marginBottom: 10 }}>
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 5,
              backgroundColor: '#15803d', borderRadius: 20,
              paddingHorizontal: 12, paddingVertical: 6,
            }}>
              <Ionicons name="checkmark-circle" size={14} color="#fff" />
              <Text style={[T.caption, { color: '#fff', fontWeight: '700', letterSpacing: 0.5 }]}>
                COMPLETED
              </Text>
            </View>
          </View>
        )}

        {/* Title */}
        <Text style={[T.h4, { color: '#111827', fontSize: 17, lineHeight: 24, marginBottom: 6 }]}>
          {course.title}
        </Text>

        {/* Description */}
        <Text style={[T.bodySm, { color: '#6b7280', lineHeight: 20, marginBottom: 12 }]}>
          {course.description}
        </Text>

        {/* Meta: duration · lessons · level */}
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 12, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="time-outline" size={14} color="#9ca3af" />
            <Text style={[T.caption, { color: '#6b7280' }]}>{course.duration}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="layers-outline" size={14} color="#9ca3af" />
            <Text style={[T.caption, { color: '#6b7280' }]}>{course.lessons} lessons</Text>
          </View>
          <View style={{
            backgroundColor: course.levelBg, borderRadius: 6,
            paddingHorizontal: 8, paddingVertical: 3,
          }}>
            <Text style={[T.caption, { color: course.levelColor, fontWeight: '700' }]}>
              {course.level}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        {hasProgress && (
          <View style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={[T.caption, { color: '#6b7280' }]}>Progress</Text>
              <Text style={[T.caption, { color: '#15803d', fontWeight: '700' }]}>{course.progress}%</Text>
            </View>
            <View style={{ height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
              <View style={{
                height: '100%', borderRadius: 3, backgroundColor: '#15803d',
                width: `${course.progress}%`,
              }} />
            </View>
          </View>
        )}

        {/* Instructor + action */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{
              width: 34, height: 34, borderRadius: 17,
              backgroundColor: course.instructorBg,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={[T.caption, { color: '#fff', fontWeight: '700' }]}>
                {course.instructorInitials}
              </Text>
            </View>
            <Text style={[T.caption, { color: '#374151' }]}>{course.instructor}</Text>
          </View>

          <TouchableOpacity
            onPress={onPress}
            style={{
              paddingVertical: 10, paddingHorizontal: 24, borderRadius: 22,
              backgroundColor: actionFilled ? '#15803d' : 'transparent',
              borderWidth: 1.5, borderColor: '#15803d',
            }}
          >
            <Text style={[T.label, { color: actionFilled ? '#fff' : '#15803d', fontWeight: '600' }]}>
              {actionLabel}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

export default function CourseListScreen() {
  const navigation              = useNavigation();
  const { isOnline }            = useNetworkStatus();
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');

  const filtered = COURSES.filter((c) => {
    const matchCat    = category === 'All' || c.category === category;
    const q           = search.toLowerCase();
    const matchSearch = !q
      || c.title.toLowerCase().includes(q)
      || c.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20,
      }}>
        <Text style={[T.h1, { color: '#fff' }]}>Training Modules</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {/* Search bar */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 10,
          backgroundColor: '#fff', borderRadius: 12,
          paddingHorizontal: 14, paddingVertical: 12,
          marginBottom: 14,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
        }}>
          <Ionicons name="search-outline" size={18} color="#9ca3af" />
          <TextInput
            style={[T.bodySm, { flex: 1, color: '#374151', padding: 0 }]}
            placeholder="Search courses..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 4 }}
          style={{ marginBottom: 14 }}
        >
          {CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={{
                  paddingHorizontal: 18, paddingVertical: 9, borderRadius: 22,
                  marginRight: 8,
                  backgroundColor: active ? '#15803d' : '#fff',
                  borderWidth: active ? 0 : 1.5,
                  borderColor: '#e5e7eb',
                }}
              >
                <Text style={[T.label, { color: active ? '#fff' : '#374151', fontWeight: '600' }]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Count */}
        <Text style={[T.caption, { color: '#6b7280', marginBottom: 14 }]}>
          {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
        </Text>

        {/* Course cards */}
        {filtered.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onPress={() => navigation.navigate('Lesson', { course })}
          />
        ))}

        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <Ionicons name="search-outline" size={44} color="#d1d5db" />
            <Text style={[T.label, { color: '#9ca3af', marginTop: 12 }]}>No courses found</Text>
          </View>
        )}
      </ScrollView>

    </View>
  );
}
