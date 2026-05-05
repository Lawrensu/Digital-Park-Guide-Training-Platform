// src/screens/CourseListScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  FlatList, ActivityIndicator, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchCourses } from '../services/apiService';
import { FONTS } from '../theme/fonts';
import { CATEGORIES } from '../data/seedData';

const DIFFICULTY_COLORS = {
  Beginner: '#16a34a',
  Intermediate: '#d97706',
  Advanced: '#dc2626',
};

const CourseCard = ({ course, onPress }) => {
  const diffColor = DIFFICULTY_COLORS[course.difficulty] || '#6b7280';
  // Simulate per-course progress (in real app, from DB)
  const progress = { 1: 68, 2: 34, 3: 100, 4: 0, 5: 15, 6: 0 }[course.id] || 0;

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
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: course.thumbnail }} style={{ width: '100%', height: 160 }} resizeMode="cover" />
        {/* Overlay gradient */}
        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
          backgroundColor: 'rgba(0,0,0,0.3)',
        }} />
        {/* Category badge */}
        <View style={{
          position: 'absolute', top: 12, left: 12,
          backgroundColor: '#15803d', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
        }}>
          <Text style={{ fontSize: 11, color: '#fff', fontWeight: '700' }}>
            {course.category.toUpperCase()}
          </Text>
        </View>
        {/* Rating badge */}
        <View style={{
          position: 'absolute', top: 12, right: 12,
          backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 8, paddingVertical: 4,
          borderRadius: 20, flexDirection: 'row', alignItems: 'center',
        }}>
          <Ionicons name="star" size={11} color="#fbbf24" />
          <Text style={{ fontSize: 11, color: '#fff', marginLeft: 3, fontWeight: '700' }}>
            {course.rating}
          </Text>
        </View>
        {/* Completed badge */}
        {progress === 100 && (
          <View style={{
            position: 'absolute', bottom: 12, right: 12,
            backgroundColor: '#16a34a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
            flexDirection: 'row', alignItems: 'center',
          }}>
            <Ionicons name="checkmark-circle" size={12} color="#fff" />
            <Text style={{ fontSize: 11, color: '#fff', marginLeft: 3, fontWeight: '700' }}>Completed</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 6 }} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={{ fontSize: 12, color: '#6b7280', lineHeight: 18, marginBottom: 12 }} numberOfLines={2}>
          {course.description}
        </Text>

        {/* Meta row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time-outline" size={13} color="#9ca3af" />
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>{course.duration}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="layers-outline" size={13} color="#9ca3af" />
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>{course.lessons} lessons</Text>
          </View>
          <View style={{
            paddingHorizontal: 8, paddingVertical: 2,
            backgroundColor: `${diffColor}15`, borderRadius: 6,
          }}>
            <Text style={{ fontSize: 11, color: diffColor, fontWeight: '700' }}>{course.difficulty}</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text style={{ fontSize: 11, color: '#6b7280' }}>Progress</Text>
            <Text style={{ fontSize: 11, color: '#16a34a', fontWeight: '700' }}>{progress}%</Text>
          </View>
          <View style={{ height: 6, backgroundColor: '#f3f4f6', borderRadius: 3 }}>
            <View style={{
              width: `${progress}%`, height: 6,
              backgroundColor: progress === 100 ? '#16a34a' : '#4ade80',
              borderRadius: 3,
            }} />
          </View>
        </View>

        {/* Instructor + CTA */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="person-circle-outline" size={16} color="#9ca3af" />
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
            <Text style={{
              fontSize: 13, fontWeight: '700',
              color: progress > 0 ? '#fff' : '#15803d',
            }}>
              {progress === 100 ? 'Review' : progress > 0 ? 'Continue' : 'Start'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function CourseListScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [courses, selectedCategory, searchQuery]);

  const loadCourses = async () => {
    setLoading(true);
    const data = await fetchCourses();
    setCourses(data);
    setLoading(false);
  };

  const applyFilter = () => {
    let result = courses;
    if (selectedCategory !== 'All') {
      result = result.filter((c) => c.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) => c.title.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Search bar */}
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14,
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        }}>
          <Ionicons name="search-outline" size={18} color="#9ca3af" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search courses..."
            placeholderTextColor="#d1d5db"
            style={{ flex: 1, padding: 12, fontSize: 14, color: '#111827' }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 8 }}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={{
              paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20,
              backgroundColor: selectedCategory === cat ? '#15803d' : '#fff',
              borderWidth: 1.5,
              borderColor: selectedCategory === cat ? '#15803d' : '#e5e7eb',
              shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
            }}
          >
            <Text style={{
              fontSize: 13, fontWeight: '700',
              color: selectedCategory === cat ? '#fff' : '#374151',
            }}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results count */}
      <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
        <Text style={{ fontSize: 12, color: '#9ca3af' }}>
          {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Course list */}
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#15803d" />
          <Text style={{ marginTop: 12, color: '#6b7280', fontSize: 14 }}>Loading courses...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16, paddingTop: 8 }}
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              onPress={() => navigation.navigate('Lesson', { course: item })}
            />
          )}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Ionicons name="search" size={48} color="#d1d5db" />
              <Text style={{ fontSize: 16, color: '#6b7280', marginTop: 12 }}>No courses found</Text>
              <Text style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Try a different category or search term</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
