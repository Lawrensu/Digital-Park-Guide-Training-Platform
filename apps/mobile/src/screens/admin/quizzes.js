import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  display: { fontFamily: sans,  fontSize: 36, fontWeight: '600' },
  h1:      { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h2:      { fontFamily: sans,  fontSize: 24, fontWeight: '600' },
  h3:      { fontFamily: sans,  fontSize: 20, fontWeight: '500' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodyLg:  { fontFamily: serif, fontSize: 18, fontWeight: '400' },
  bodyDef: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const QUIZZES = [
  {
    id: 1,
    title: 'Rainforest Ecosystems Quiz',
    course: 'Rainforest Biodiversity Fundamentals',
    status: 'PUBLISHED',
    questions: 4,
    submissions: 142,
    updatedAt: '2 days ago',
  },
  {
    id: 2,
    title: 'Wildlife Conservation Ethics Quiz',
    course: 'Wildlife Conservation Ethics',
    status: 'PUBLISHED',
    questions: 5,
    submissions: 98,
    updatedAt: '1 week ago',
  },
  {
    id: 3,
    title: 'Eco-tourism Best Practices Quiz',
    course: 'Advanced Eco-tourism Management',
    status: 'DRAFT',
    questions: 6,
    submissions: 0,
    updatedAt: '3 hours ago',
  },
  {
    id: 4,
    title: 'Park Safety Procedures Quiz',
    course: 'Park Safety Protocols',
    status: 'PUBLISHED',
    questions: 8,
    submissions: 187,
    updatedAt: '5 days ago',
  },
];

const STATUS_CFG = {
  PUBLISHED: { bg: '#dcfce7', color: '#15803d', label: 'Published' },
  DRAFT:     { bg: '#fef3c7', color: '#d97706', label: 'Draft'     },
};

function QuizCard({ quiz }) {
  const navigation = useNavigation();
  const status     = STATUS_CFG[quiz.status] ?? STATUS_CFG.DRAFT;
  const isPublished = quiz.status === 'PUBLISHED';

  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    }}>
      {/* Title + status badge */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={[T.h4, { color: '#111827', flex: 1, lineHeight: 24, marginRight: 10 }]}>
          {quiz.title}
        </Text>
        <View style={{
          backgroundColor: status.bg, borderRadius: 6,
          paddingHorizontal: 10, paddingVertical: 4,
          alignSelf: 'flex-start',
        }}>
          <Text style={[T.caption, { color: status.color, fontWeight: '700' }]}>
            {status.label}
          </Text>
        </View>
      </View>

      {/* Course name */}
      <Text style={[T.bodySm, { color: '#6b7280', marginBottom: 12 }]}>
        {quiz.course}
      </Text>

      {/* Meta row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons name="document-text-outline" size={13} color="#9ca3af" />
          <Text style={[T.caption, { color: '#6b7280' }]}>{quiz.questions} questions</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons name="people-outline" size={13} color="#9ca3af" />
          <Text style={[T.caption, { color: '#6b7280' }]}>{quiz.submissions} submissions</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons name="time-outline" size={13} color="#9ca3af" />
          <Text style={[T.caption, { color: '#6b7280' }]}>{quiz.updatedAt}</Text>
        </View>
      </View>

      {/* Action buttons */}
      {isPublished ? (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('QuizEdit', { quiz })}
            style={{
              flex: 1, backgroundColor: '#15803d', borderRadius: 10,
              paddingVertical: 12, alignItems: 'center',
            }}
          >
            <Text style={[T.label, { color: '#fff', fontWeight: '700' }]}>Edit Quiz</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => navigation.navigate('QuizEdit', { quiz })}
          style={{
            backgroundColor: '#15803d', borderRadius: 10,
            paddingVertical: 12, alignItems: 'center',
          }}
        >
          <Text style={[T.label, { color: '#fff', fontWeight: '700' }]}>Edit Quiz</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function QuizzesScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');

  const filtered = QUIZZES.filter((q) =>
    !search.trim() ||
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    q.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20,
      }}>
        {/* Back + title + add button */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={[T.h2, { color: '#fff' }]}>Quizzes</Text>
              <Text style={[T.caption, { color: 'rgba(255,255,255,0.75)', marginTop: 2 }]}>
                {QUIZZES.length} quizzes total
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('QuizEdit')}
            style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: '#fff',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name="add" size={24} color="#15803d" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >

        {/* ── Search bar ── */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 10,
          backgroundColor: '#fff', borderRadius: 12,
          paddingHorizontal: 14, paddingVertical: 12,
          marginBottom: 16,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
        }}>
          <Ionicons name="search-outline" size={18} color="#9ca3af" />
          <TextInput
            style={[T.bodySm, { flex: 1, color: '#374151', padding: 0 }]}
            placeholder="Search quizzes..."
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

        {/* ── Quiz cards ── */}
        {filtered.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}

        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Ionicons name="search-outline" size={44} color="#d1d5db" />
            <Text style={[T.label, { color: '#9ca3af', marginTop: 12 }]}>No quizzes found</Text>
          </View>
        )}

        {/* ── Create New Quiz (dashed card) ── */}
        <TouchableOpacity
          onPress={() => navigation.navigate('QuizEdit')}
          style={{
            borderWidth: 1.5, borderColor: '#15803d', borderRadius: 16,
            borderStyle: 'dashed',
            paddingVertical: 18,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginTop: 4,
          }}
        >
          <Ionicons name="add" size={20} color="#15803d" />
          <Text style={[T.label, { color: '#15803d', fontWeight: '700' }]}>Create New Quiz</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
