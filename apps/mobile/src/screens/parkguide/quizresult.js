import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

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

const PASS_MARK = 70;

export default function QuizResultScreen() {
  const navigation = useNavigation();
  const route      = useRoute();

  const {
    course    = { title: 'Rainforest Biodiversity Fundamentals' },
    score     = 85,
    correct   = 3,
    total     = 4,
    passed    = true,
    quizTitle = 'Rainforest Ecosystems Quiz',
  } = route.params ?? {};

  const BREAKDOWN = [
    { label: 'Correct Answers', value: `${correct}/${total}`, green: true,  bold: false },
    { label: 'Your Score',      value: `${score}%`,           green: true,  bold: false },
    { label: 'Pass Score',      value: `${PASS_MARK}%`,       green: false, bold: false },
    { label: 'Result',          value: passed ? 'PASSED' : 'FAILED', green: passed, bold: true },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f0fdf4' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: 72, paddingHorizontal: 24, paddingBottom: 48,
        }}
      >

        {/* ── Trophy / ribbon icon ── */}
        <View style={{
          width: 96, height: 96, borderRadius: 48,
          backgroundColor: '#dcfce7',
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 28,
        }}>
          <Ionicons
            name={passed ? 'trophy-outline' : 'ribbon-outline'}
            size={48}
            color="#15803d"
          />
        </View>

        {/* ── Big score ── */}
        <Text style={{
          fontFamily: sans, fontSize: 72, fontWeight: '700',
          color: '#14532d', lineHeight: 78, marginBottom: 10,
        }}>
          {score}%
        </Text>

        {/* ── Pass / Fail label ── */}
        <Text style={[T.h2, { color: '#111827', marginBottom: 8, textAlign: 'center' }]}>
          {passed ? '🎉 You Passed!' : '📚 Keep Studying'}
        </Text>

        {/* ── Quiz name ── */}
        <Text style={[T.label, { color: '#374151', marginBottom: 4, textAlign: 'center' }]}>
          {quizTitle}
        </Text>

        {/* ── Course name ── */}
        <Text style={[T.caption, { color: '#9ca3af', marginBottom: 32, textAlign: 'center' }]}>
          {course.title}
        </Text>

        {/* ── Score breakdown card ── */}
        <View style={{
          width: '100%', backgroundColor: '#fff', borderRadius: 18, padding: 20,
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
          marginBottom: 16,
        }}>
          <Text style={[T.h4, { color: '#111827', marginBottom: 16 }]}>Score Breakdown</Text>

          {BREAKDOWN.map((row, i) => (
            <View
              key={row.label}
              style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                paddingVertical: 13,
                borderBottomWidth: i < BREAKDOWN.length - 1 ? 1 : 0,
                borderBottomColor: '#f3f4f6',
              }}
            >
              <Text style={[T.label, { color: '#6b7280' }]}>{row.label}</Text>
              <Text style={[T.label, {
                color:      row.green ? '#15803d' : '#374151',
                fontWeight: row.bold  ? '700'     : '600',
              }]}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Trainer review notice ── */}
        <View style={{
          width: '100%',
          backgroundColor: '#f0fdf4', borderRadius: 14, padding: 16,
          borderWidth: 1, borderColor: '#bbf7d0',
          flexDirection: 'row', alignItems: 'flex-start', gap: 12,
          marginBottom: 28,
        }}>
          <Ionicons name="ribbon-outline" size={20} color="#15803d" style={{ marginTop: 1 }} />
          <Text style={[T.bodySm, { flex: 1, color: '#15803d', lineHeight: 21 }]}>
            Your trainer will review and issue your certification shortly.
          </Text>
        </View>

        {/* ── Back to Courses (outline button) ── */}
        <TouchableOpacity
          onPress={() => navigation.navigate('CourseList')}
          style={{
            width: '100%', paddingVertical: 16, borderRadius: 16,
            borderWidth: 1.5, borderColor: '#15803d',
            alignItems: 'center', marginBottom: 18,
          }}
        >
          <Text style={[T.label, { color: '#15803d', fontWeight: '700', fontSize: 15 }]}>
            Back to Courses
          </Text>
        </TouchableOpacity>

        {/* ── View Certifications (text link) ── */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Certification')}
        >
          <Text style={[T.label, { color: '#15803d', fontWeight: '700', fontSize: 15 }]}>
            View Certifications
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
