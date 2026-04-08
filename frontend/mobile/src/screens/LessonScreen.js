// src/screens/LessonScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  ActivityIndicator, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { fetchLessons, updateProgress } from '../services/apiService';
import { FONTS } from '../theme/fonts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const InfographicSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 10 }}>
        📸 Visual Resources
      </Text>
      <Image
        source={{ uri: images[current] }}
        style={{ width: '100%', height: 200, borderRadius: 14 }}
        resizeMode="cover"
      />
      {images.length > 1 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 8 }}>
          {images.map((_, i) => (
            <TouchableOpacity
              key={i} onPress={() => setCurrent(i)}
              style={{
                width: i === current ? 20 : 8, height: 8,
                borderRadius: 4,
                backgroundColor: i === current ? '#15803d' : '#d1d5db',
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default function LessonScreen({ route, navigation }) {
  const { course } = route.params;
  const { user } = useAuth();
  const videoRef = useRef(null);

  const [lessons, setLessons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videoStatus, setVideoStatus] = useState({});
  const [videoLoading, setVideoLoading] = useState(false);

  const currentLesson = lessons[currentIndex];

  useEffect(() => {
    loadLessons();
  }, []);

  // Update navigation title when lesson changes
  useEffect(() => {
    if (currentLesson) {
      navigation.setOptions({ title: `Lesson ${currentIndex + 1}` });
    }
  }, [currentIndex, currentLesson]);

  const loadLessons = async () => {
    setLoading(true);
    const data = await fetchLessons(course.id);
    setLessons(data);
    setLoading(false);
  };

  const goNext = async () => {
    // Mark current lesson as in-progress
    if (user && currentLesson) {
      await updateProgress(user.id, course.id, currentLesson.id, 100);
    }
    if (currentIndex < lessons.length - 1) {
      setCurrentIndex((i) => i + 1);
      videoRef.current?.stopAsync();
    } else {
      // All lessons done — go to quiz
      navigation.navigate('Quiz', { course, lessons });
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      videoRef.current?.stopAsync();
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#15803d" />
        <Text style={{ marginTop: 12, color: '#6b7280' }}>Loading lesson...</Text>
      </View>
    );
  }

  if (!currentLesson) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Ionicons name="book-outline" size={64} color="#d1d5db" />
        <Text style={{ fontSize: 18, color: '#6b7280', marginTop: 16 }}>No lessons available</Text>
        <Text style={{ fontSize: 13, color: '#9ca3af', marginTop: 6, textAlign: 'center' }}>
          Check back later for content on this course.
        </Text>
      </View>
    );
  }

  const progressPct = ((currentIndex + 1) / lessons.length) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: '#111827' }}>
      {/* Video player */}
      {currentLesson.videoUrl ? (
        <View style={{
          width: SCREEN_WIDTH, height: 220, backgroundColor: '#1f2937',
          alignItems: 'center', justifyContent: 'center',
          }}>
          <View style={{
            width: 64, height: 64, borderRadius: 32,
            backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 12,
          }}>
            <Ionicons name="play" size={32} color="#4ade80" />
          </View>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
            Video Lesson
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 }}>
            {currentLesson.duration}
          </Text>
        </View>
      ) : (
        <View style={{ width: SCREEN_WIDTH, height: 200, backgroundColor: '#1f2937' }}>
          <Image
            source={{ uri: currentLesson.thumbnail }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <View style={{
            position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="document-text" size={48} color="#4ade80" />
            <Text style={{ color: '#fff', marginTop: 8, fontWeight: '600' }}>Reading Lesson</Text>
          </View>
        </View>
      )}

      {/* Content card */}
      <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ padding: 20 }}>
          {/* Lesson progress indicator */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '700' }}>
              LESSON {currentIndex + 1} OF {lessons.length}
            </Text>
            <View style={{ flex: 1, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, marginLeft: 12 }}>
              <View style={{
                width: `${progressPct}%`, height: 4,
                backgroundColor: '#16a34a', borderRadius: 2,
              }} />
            </View>
          </View>

          {/* Lesson tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {lessons.map((l, i) => (
              <TouchableOpacity
                key={l.id}
                onPress={() => setCurrentIndex(i)}
                style={{
                  marginRight: 8, paddingHorizontal: 12, paddingVertical: 6,
                  borderRadius: 20, borderWidth: 1.5,
                  borderColor: i === currentIndex ? '#15803d' : '#e5e7eb',
                  backgroundColor: i === currentIndex ? '#15803d' : '#fff',
                }}
              >
                <Text style={{
                  fontSize: 11, fontWeight: '700',
                  color: i === currentIndex ? '#fff' : '#6b7280',
                }}>
                  {i + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Title + type badge */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', lineHeight: 26 }}>
                {currentLesson.title}
              </Text>
            </View>
            <View style={{
              paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
              backgroundColor: currentLesson.type === 'video' ? '#dbeafe' : '#fef3c7',
            }}>
              <Text style={{
                fontSize: 11, fontWeight: '700',
                color: currentLesson.type === 'video' ? '#1d4ed8' : '#92400e',
              }}>
                {currentLesson.type === 'video' ? '🎥 Video' : '📖 Reading'}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="time-outline" size={14} color="#9ca3af" />
              <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>{currentLesson.duration}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={{
            padding: 14, backgroundColor: '#f0fdf4',
            borderRadius: 12, borderLeftWidth: 3, borderLeftColor: '#16a34a',
            marginBottom: 16,
          }}>
            <Text style={{ fontSize: 13, color: '#374151', lineHeight: 20 }}>
              {currentLesson.description}
            </Text>
          </View>

          {/* Content */}
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 10 }}>
            📋 Lesson Content
          </Text>
          <Text style={{ fontSize: 14, color: '#374151', lineHeight: 23 }}>
            {currentLesson.content}
          </Text>

          {/* Infographics */}
          <InfographicSlider images={currentLesson.infographics} />
        </View>

        {/* Navigation buttons */}
        <View style={{
          flexDirection: 'row', padding: 20, paddingTop: 8, gap: 12,
        }}>
          <TouchableOpacity
            onPress={goPrev}
            disabled={currentIndex === 0}
            style={{
              flex: 1, padding: 15, borderRadius: 14, borderWidth: 2,
              borderColor: currentIndex === 0 ? '#e5e7eb' : '#15803d',
              alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6,
              opacity: currentIndex === 0 ? 0.4 : 1,
            }}
          >
            <Ionicons name="chevron-back" size={18} color={currentIndex === 0 ? '#9ca3af' : '#15803d'} />
            <Text style={{
              fontSize: 14, fontWeight: '700',
              color: currentIndex === 0 ? '#9ca3af' : '#15803d',
            }}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goNext}
            style={{
              flex: 1.5, padding: 15, borderRadius: 14,
              backgroundColor: '#15803d', alignItems: 'center',
              flexDirection: 'row', justifyContent: 'center', gap: 6,
              shadowColor: '#15803d', shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>
              {currentIndex < lessons.length - 1 ? 'Next Lesson' : 'Take Quiz'}
            </Text>
            <Ionicons
              name={currentIndex < lessons.length - 1 ? 'chevron-forward' : 'help-circle'}
              size={18} color="#fff"
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}
