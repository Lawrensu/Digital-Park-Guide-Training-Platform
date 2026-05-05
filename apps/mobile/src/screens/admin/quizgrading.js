import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h1:        { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h4:        { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodySmall: { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:     { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption:   { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const SUBMISSIONS = [
  {
    id: 1,
    name: 'Amira Hassan',
    module: 'Rainforest Biodiversity Fundamentals',
    quiz: 'Rainforest Ecosystems Quiz',
    date: '13 Apr 2026',
    status: 'Pending',
    score: null,
  },
  {
    id: 2,
    name: 'James Okafor',
    module: 'Wildlife Conservation Ethics',
    quiz: 'Conservation Principles Quiz',
    date: '12 Apr 2026',
    status: 'Graded',
    score: 85,
  },
  {
    id: 3,
    name: 'Sarah Chen',
    module: 'Rainforest Biodiversity Fundamentals',
    quiz: 'Rainforest Ecosystems Quiz',
    date: '11 Apr 2026',
    status: 'Graded',
    score: 92,
  },
  {
    id: 4,
    name: 'Ahmad bin Abdullah',
    module: 'Park Safety Protocols',
    quiz: 'Safety Procedures Quiz',
    date: '10 Apr 2026',
    status: 'Pending',
    score: null,
  },
  {
    id: 5,
    name: 'Maria Santos',
    module: 'Wildlife Conservation Ethics',
    quiz: 'Conservation Principles Quiz',
    date: '9 Apr 2026',
    status: 'Graded',
    score: 78,
  },
];

const FILTERS = ['All', 'Pending', 'Graded'];

const PENDING_COUNT = SUBMISSIONS.filter((s) => s.status === 'Pending').length;

function SubmissionCard({ submission, onOpen }) {
  const isPending = submission.status === 'Pending';
  const initial   = submission.name.charAt(0).toUpperCase();

  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    }}>
      {/* Top row: avatar + info + badge */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
        <View style={{
          width: 46, height: 46, borderRadius: 23,
          backgroundColor: '#15803d', alignItems: 'center', justifyContent: 'center',
          marginRight: 12,
        }}>
          <Text style={[T.h4, { color: '#fff' }]}>{initial}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={[T.h4, { color: '#111827', flex: 1, marginRight: 8, lineHeight: 22 }]}>
              {submission.name}
            </Text>
            <View style={{
              paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
              backgroundColor: isPending ? '#fef3c7' : '#dcfce7',
            }}>
              <Text style={[T.caption, { color: isPending ? '#d97706' : '#16a34a' }]}>
                {submission.status}
              </Text>
            </View>
          </View>

          <Text style={[T.bodySmall, { color: '#374151', marginTop: 2 }]}>
            {submission.module}
          </Text>
          <Text style={[T.caption, { color: '#9ca3af', marginTop: 2 }]}>
            {submission.quiz}
          </Text>

          {/* Date + score */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="calendar-outline" size={13} color="#6b7280" />
              <Text style={[T.caption, { color: '#6b7280' }]}>{submission.date}</Text>
            </View>
            {submission.score !== null && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="checkmark" size={13} color="#16a34a" />
                <Text style={[T.caption, { color: '#16a34a', fontWeight: '600' }]}>
                  Score: {submission.score}%
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Action button */}
      {isPending ? (
        <TouchableOpacity
          onPress={onOpen}
          style={{
            backgroundColor: '#15803d', borderRadius: 12,
            paddingVertical: 13, alignItems: 'center',
          }}
        >
          <Text style={[T.label, { color: '#fff' }]}>Grade Submission</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onOpen}
          style={{
            borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12,
            paddingVertical: 13, alignItems: 'center',
          }}
        >
          <Text style={[T.label, { color: '#374151' }]}>View Grading</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function QuizGrading() {
  const navigation = useNavigation();
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('All');

  const filtered = SUBMISSIONS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || s.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{ backgroundColor: '#15803d', paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20 }}>

        {/* Title row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={[T.h1, { color: '#fff', lineHeight: 34 }]}>Quiz Grading</Text>
              <Text style={[T.caption, { color: 'rgba(255,255,255,0.8)', marginTop: 2 }]}>
                {SUBMISSIONS.length} submissions
              </Text>
            </View>
          </View>
          <View style={{
            backgroundColor: '#16a34a', borderRadius: 20,
            paddingHorizontal: 22, paddingVertical: 6,
          }}>
            <Text style={[T.caption, { color: '#fff', fontWeight: '700' }]}>
              {PENDING_COUNT} pending
            </Text>
          </View>
        </View>

        {/* Search bar */}
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: '#fff', borderRadius: 12,
          paddingHorizontal: 12, marginTop: 16, height: 46,
        }}>
          <Ionicons name="search" size={18} color="#15803d" style={{ marginRight: 8 }} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name..."
            placeholderTextColor="#9ca3af"
            style={[T.label, { flex: 1, color: '#111827' }]}
          />
        </View>

        {/* Filter tabs */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={{
                  paddingHorizontal: 18, paddingVertical: 7, borderRadius: 20,
                  backgroundColor: active ? '#fff' : 'transparent',
                  borderWidth: active ? 0 : 1,
                  borderColor: 'rgba(255,255,255,0.4)',
                }}
              >
                <Text style={[T.caption, {
                  color: active ? '#15803d' : 'rgba(255,255,255,0.9)',
                  fontWeight: '600',
                }]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Submission list ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <Ionicons name="clipboard-outline" size={44} color="#d1d5db" />
            <Text style={[T.label, { color: '#9ca3af', marginTop: 12 }]}>No submissions found</Text>
          </View>
        ) : (
          filtered.map((s) => (
            <SubmissionCard
              key={s.id}
              submission={s}
              onOpen={() => navigation.navigate('GradeSubmission', { submission: s })}
            />
          ))
        )}
      </ScrollView>

    </View>
  );
}
