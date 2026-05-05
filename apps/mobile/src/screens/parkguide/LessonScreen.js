import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h3:      { fontFamily: sans,  fontSize: 20, fontWeight: '500' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodyDef: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const COURSE_DETAILS = {
  1: {
    fullDescription: 'Master the fundamentals of rainforest biodiversity. Learn to identify key species, understand ecosystem relationships, and apply conservation principles in protected areas.',
    enrollees: 234,
    tags: ['Flora', 'Fauna', 'Conservation'],
  },
  2: {
    fullDescription: 'Develop essential skills in wildlife tracking and population monitoring. Master modern field techniques used by conservation professionals in protected areas.',
    enrollees: 189,
    tags: ['Wildlife', 'Conservation', 'Fieldwork'],
  },
  3: {
    fullDescription: 'Learn to balance visitor experience with environmental protection. Develop strategies for sustainable tourism that preserve natural ecosystems for future generations.',
    enrollees: 156,
    tags: ['Tourism', 'Sustainability', 'Environment'],
  },
  4: {
    fullDescription: 'Essential safety protocols and emergency response procedures for park guides. Be prepared for any situation in the field and ensure visitor wellbeing at all times.',
    enrollees: 312,
    tags: ['Safety', 'Emergency', 'Protocols'],
  },
};

const LESSONS = [
  { id: 1, title: 'Introduction to Rainforest Ecosystems', type: 'VIDEO',    duration: '18 min' },
  { id: 2, title: 'Why Rainforests Matter',                 type: 'TEXT',     duration: '8 min'  },
  { id: 3, title: 'Canopy Layer Species Gallery',           type: 'IMAGE',    duration: '5 min'  },
  { id: 4, title: 'Interactive Ecosystem Map',              type: 'HOTSPOT',  duration: '12 min' },
  { id: 5, title: 'Biodiversity Threats and Solutions',     type: 'VIDEO',    duration: '22 min' },
  { id: 6, title: 'Conservation Decision Making',           type: 'SCENARIO', duration: '15 min' },
  { id: 7, title: 'Field Survey Protocol',                  type: 'STEPPER',  duration: '20 min' },
  { id: 8, title: 'Rainforest Ecosystems Quiz',             type: 'QUIZ',     duration: '30 min' },
];

const TYPE_CFG = {
  VIDEO:    { icon: 'play',            pendingColor: '#15803d', pendingBg: '#dcfce7' },
  TEXT:     { icon: 'document-text',   pendingColor: '#15803d', pendingBg: '#dcfce7' },
  IMAGE:    { icon: 'image',           pendingColor: '#15803d', pendingBg: '#dcfce7' },
  HOTSPOT:  { icon: 'search',          pendingColor: '#15803d', pendingBg: '#dcfce7' },
  SCENARIO: { icon: 'help-circle',     pendingColor: '#d97706', pendingBg: '#fef3c7' },
  STEPPER:  { icon: 'ellipse-outline', pendingColor: '#0891b2', pendingBg: '#e0f2fe' },
  QUIZ:     { icon: 'help-circle',     pendingColor: '#d97706', pendingBg: '#fef3c7' },
};

function LessonRow({ lesson, lessonIndex, completed, isLast, onPress }) {
  const cfg       = TYPE_CFG[lesson.type] ?? TYPE_CFG.VIDEO;
  const iconBg    = completed ? '#15803d' : cfg.pendingBg;
  const iconColor = completed ? '#fff'    : cfg.pendingColor;

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 }}
      >
        {/* Icon circle with dot indicator */}
        <View style={{ position: 'relative', marginRight: 14 }}>
          <View style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: iconBg,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name={cfg.icon} size={20} color={iconColor} />
          </View>
          <View style={{
            position: 'absolute', bottom: 1, right: 1,
            width: 11, height: 11, borderRadius: 6,
            backgroundColor: '#fff',
            borderWidth: 1.5,
            borderColor: completed ? '#15803d' : cfg.pendingColor,
          }} />
        </View>

        {/* Title + type · duration */}
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={[T.label, { color: '#111827', fontWeight: '600', marginBottom: 4 }]}
          >
            {lesson.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.3 }]}>{lesson.type}</Text>
            <Text style={[T.caption, { color: '#9ca3af' }]}>{lesson.duration}</Text>
          </View>
        </View>

        {/* Completion state */}
        {completed ? (
          <Ionicons name="checkmark-circle-outline" size={22} color="#15803d" />
        ) : (
          <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
        )}
      </TouchableOpacity>

      {!isLast && (
        <View style={{ height: 1, backgroundColor: '#f3f4f6', marginLeft: 74 }} />
      )}
    </View>
  );
}

export default function LessonScreen() {
  const navigation = useNavigation();
  const route      = useRoute();

  const course = route.params?.course ?? {
    id: 1,
    title: 'Rainforest Biodiversity Fundamentals',
    categoryLabel: 'BIODIVERSITY',
    level: 'BEGINNER',
    rating: 4.8,
    duration: '4h 30m',
    lessons: 8,
    progress: 68,
    instructor: 'Dr. Maria Santos',
    instructorInitials: 'MS',
    instructorBg: '#f97316',
  };

  const details        = COURSE_DETAILS[course.id] ?? COURSE_DETAILS[1];
  const totalLessons   = Math.min(course.lessons ?? LESSONS.length, LESSONS.length);
  const completedCount = Math.round(totalLessons * ((course.progress ?? 0) / 100));
  const lessons        = LESSONS.slice(0, totalLessons);

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: 52, paddingBottom: 24, paddingHorizontal: 20,
      }}>
        {/* Back + title */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
          <Text numberOfLines={1} style={[T.h4, { color: '#fff', flex: 1 }]}>
            {course.title}
          </Text>
        </TouchableOpacity>

        {/* Category + level badges */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 6,
            paddingHorizontal: 10, paddingVertical: 4,
          }}>
            <Text style={[T.caption, { color: '#fff', fontWeight: '700', letterSpacing: 0.5 }]}>
              {course.categoryLabel ?? 'BIODIVERSITY'}
            </Text>
          </View>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 6,
            paddingHorizontal: 10, paddingVertical: 4,
          }}>
            <Text style={[T.caption, { color: '#fff', fontWeight: '700', letterSpacing: 0.5 }]}>
              {course.level ?? 'BEGINNER'}
            </Text>
          </View>
        </View>

        {/* Full description */}
        <Text style={[T.bodySm, { color: 'rgba(255,255,255,0.88)', lineHeight: 21, marginBottom: 14 }]}>
          {details.fullDescription}
        </Text>

        {/* Stats: duration · rating · enrollees */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={[T.caption, { color: 'rgba(255,255,255,0.9)' }]}>{course.duration}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={[T.caption, { color: 'rgba(255,255,255,0.9)' }]}>{course.rating}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Ionicons name="people-outline" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={[T.caption, { color: 'rgba(255,255,255,0.9)' }]}>{details.enrollees}</Text>
          </View>
        </View>
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
      >
        {/* Instructor card */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        }}>
          <Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 10 }]}>
            INSTRUCTOR
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{
              width: 46, height: 46, borderRadius: 23,
              backgroundColor: course.instructorBg ?? '#f97316',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={[T.label, { color: '#fff', fontWeight: '700', fontSize: 16 }]}>
                {course.instructorInitials ?? 'MS'}
              </Text>
            </View>
            <Text style={[T.h4, { color: '#111827', fontSize: 17 }]}>
              {course.instructor ?? 'Dr. Maria Santos'}
            </Text>
          </View>
        </View>

        {/* Progress card */}
        <View style={{
          backgroundColor: '#f0fdf4', borderRadius: 16, padding: 16, marginBottom: 20,
          borderWidth: 1, borderColor: '#bbf7d0',
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={[T.h4, { color: '#15803d' }]}>Your Progress</Text>
            <Text style={[T.h4, { color: '#15803d' }]}>{course.progress ?? 0}%</Text>
          </View>
          <View style={{ height: 8, backgroundColor: '#bbf7d0', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
            <View style={{
              height: '100%', borderRadius: 4, backgroundColor: '#15803d',
              width: `${course.progress ?? 0}%`,
            }} />
          </View>
          <Text style={[T.caption, { color: '#6b7280' }]}>
            {completedCount} of {totalLessons} lessons completed
          </Text>
        </View>

        {/* Course Content heading */}
        <Text style={[T.h3, { color: '#111827', marginBottom: 14 }]}>Course Content</Text>

        {/* Lesson list */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
          marginBottom: 16,
        }}>
          {lessons.map((lesson, i) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              lessonIndex={i}
              completed={i < completedCount}
              isLast={i === lessons.length - 1}
              onPress={() => navigation.navigate('Content', { course, lessonIndex: i })}
            />
          ))}
        </View>

        {/* Tags */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {details.tags.map((tag) => (
            <View
              key={tag}
              style={{
                borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20,
                paddingHorizontal: 16, paddingVertical: 7,
                backgroundColor: '#fff',
              }}
            >
              <Text style={[T.caption, { color: '#374151' }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ── Sticky Continue Learning bar ── */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#15803d',
        paddingVertical: 18, paddingHorizontal: 20,
      }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Content', { course })}
          style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          <Ionicons name="play" size={18} color="#fff" />
          <Text style={[T.label, { color: '#fff', fontWeight: '700', fontSize: 16 }]}>
            Continue Learning
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
