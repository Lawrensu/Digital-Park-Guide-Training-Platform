import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h1:      { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h2:      { fontFamily: sans,  fontSize: 24, fontWeight: '600' },
  h3:      { fontFamily: sans,  fontSize: 20, fontWeight: '500' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodyDef: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const TYPE_STYLE = {
  'MCQ':          { color: '#0891b2', bg: '#e0f2fe' },
  'TRUE/FALSE':   { color: '#16a34a', bg: '#dcfce7' },
  'SHORT ANSWER': { color: '#d97706', bg: '#fef3c7' },
  'LONG ANSWER':  { color: '#7c3aed', bg: '#f5f3ff' },
};

const DEFAULT_AUTO_GRADED = [
  { q: 'Q1', type: 'MCQ',        correct: true  },
  { q: 'Q2', type: 'TRUE/FALSE', correct: true  },
  { q: 'Q3', type: 'MCQ',        correct: false },
];

const DEFAULT_NEEDS_GRADING = [
  {
    id: 1,
    type: 'SHORT ANSWER',
    question: 'Name three adaptations that help animals survive in rainforests.',
    answer: 'Camouflage to blend with surroundings, specialized limbs for climbing, and water-resistant features.',
    maxMarks: 10,
  },
  {
    id: 2,
    type: 'LONG ANSWER',
    question: 'Explain the role of decomposers in the rainforest ecosystem.',
    answer: 'Decomposers break down dead organic matter, releasing nutrients back into the soil. This process is essential for nutrient cycling and supports plant growth, which in turn sustains the entire ecosystem.',
    maxMarks: 20,
  },
];

const AUTO_BASE_SCORE   = 45;
const AUTO_BASE_TOTAL   = 60;
const PASS_THRESHOLD    = 70;

function TypeBadge({ type }) {
  const style = TYPE_STYLE[type] ?? { color: '#6b7280', bg: '#f3f4f6' };
  return (
    <View style={{
      alignSelf: 'flex-start',
      backgroundColor: style.bg, borderRadius: 20,
      paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10,
    }}>
      <Text style={[T.caption, { color: style.color, fontWeight: '700', letterSpacing: 0.3 }]}>
        {type}
      </Text>
    </View>
  );
}

function AutoGradedRow({ item, isLast }) {
  return (
    <View>
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 14,
      }}>
        <Text style={[T.label, { color: '#374151' }]}>
          {item.q} {item.type}
        </Text>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 5,
          paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
          backgroundColor: item.correct ? '#dcfce7' : '#fee2e2',
        }}>
          <Text style={[T.caption, {
            color: item.correct ? '#16a34a' : '#dc2626',
            fontWeight: '700',
          }]}>
            {item.correct ? '✓ CORRECT' : '✗ WRONG'}
          </Text>
        </View>
      </View>
      {!isLast && <View style={{ height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 16 }} />}
    </View>
  );
}

function NeedsGradingCard({ item, marks, onMarksChange, feedback, onFeedbackChange }) {
  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    }}>
      <TypeBadge type={item.type} />

      {/* Question */}
      <Text style={[T.h4, { color: '#111827', marginBottom: 10, lineHeight: 22 }]}>
        {item.question}
      </Text>

      {/* Guide's answer */}
      <View style={{
        backgroundColor: '#f9fafb', borderRadius: 10,
        borderWidth: 1, borderColor: '#e5e7eb',
        padding: 14, marginBottom: 16,
      }}>
        <Text style={[T.bodySm, { color: '#6b7280', fontStyle: 'italic', lineHeight: 20 }]}>
          {item.answer}
        </Text>
      </View>

      {/* Marks row */}
      <Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.4, marginBottom: 6 }]}>
        MARKS
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <TextInput
          value={marks}
          onChangeText={onMarksChange}
          keyboardType="numeric"
          style={[T.h4, {
            borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8,
            paddingHorizontal: 14, paddingVertical: 10,
            minWidth: 64, textAlign: 'center', color: '#111827',
            backgroundColor: '#fff',
          }]}
        />
        <Text style={[T.label, { color: '#6b7280' }]}>/ {item.maxMarks}</Text>
      </View>

      {/* Feedback */}
      <Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.4, marginBottom: 6 }]}>
        FEEDBACK
      </Text>
      <TextInput
        value={feedback}
        onChangeText={onFeedbackChange}
        placeholder="Provide feedback to the guide..."
        placeholderTextColor="#9ca3af"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        style={[T.bodySm, {
          borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
          paddingHorizontal: 14, paddingVertical: 12,
          color: '#374151', minHeight: 72, lineHeight: 20,
        }]}
      />
    </View>
  );
}

export default function GradeSubmission() {
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();
  const route      = useRoute();

  const submission    = route.params?.submission ?? {
    name:   'Amira Hassan',
    module: 'Rainforest Biodiversity Fundamentals',
    quiz:   'Rainforest Ecosystems Quiz',
    date:   '13 Apr 2026',
    status: 'Pending',
  };
  const autoGraded    = route.params?.autoGraded    ?? DEFAULT_AUTO_GRADED;
  const needsGrading  = route.params?.needsGrading  ?? DEFAULT_NEEDS_GRADING;

  const initMarks    = Object.fromEntries(needsGrading.map((q) => [q.id, '0']));
  const initFeedback = Object.fromEntries(needsGrading.map((q) => [q.id, '']));

  const [marks,    setMarks]    = useState(initMarks);
  const [feedback, setFeedback] = useState(initFeedback);
  const [verdict,  setVerdict]  = useState('PASS');

  const manualTotal = needsGrading.reduce((sum, q) => sum + (parseInt(marks[q.id], 10) || 0), 0);
  const total       = AUTO_BASE_SCORE + manualTotal;
  const maxTotal    = AUTO_BASE_TOTAL;
  const pct         = Math.round((total / maxTotal) * 100);
  const passOk      = pct >= PASS_THRESHOLD;

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: isOnline === false ? 12 : 52, paddingBottom: 18, paddingHorizontal: 20,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14, marginTop: 4 }}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={[T.h1, { color: '#fff', fontSize: 26 }]}>Grade Submission</Text>
            <Text style={[T.label, { color: 'rgba(255,255,255,0.85)', marginTop: 3 }]}>
              {submission.name}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
      >
        {/* Quiz info card */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 20,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        }}>
          <Text style={[T.h2, { color: '#111827', marginBottom: 6 }]}>{submission.quiz}</Text>
          <Text style={[T.bodySm, { color: '#6b7280', marginBottom: 4 }]}>
            Submitted: {submission.date}
          </Text>
          <Text style={[T.caption, { color: '#15803d', fontWeight: '600' }]}>
            Auto-graded: {autoGraded.filter((q) => q.correct !== undefined).length} of{' '}
            {autoGraded.length + needsGrading.length} questions
          </Text>
        </View>

        {/* AUTO-GRADED section */}
        <Text style={[T.caption, {
          color: '#9ca3af', letterSpacing: 0.8,
          marginBottom: 10, marginLeft: 2,
        }]}>
          AUTO-GRADED
        </Text>
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
          marginBottom: 20,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        }}>
          {autoGraded.map((item, i) => (
            <AutoGradedRow
              key={item.q}
              item={item}
              isLast={i === autoGraded.length - 1}
            />
          ))}
        </View>

        {/* NEEDS GRADING section */}
        <Text style={[T.caption, {
          color: '#d97706', letterSpacing: 0.8, fontWeight: '700',
          marginBottom: 12, marginLeft: 2,
        }]}>
          NEEDS GRADING ({needsGrading.length})
        </Text>
        {needsGrading.map((item) => (
          <NeedsGradingCard
            key={item.id}
            item={item}
            marks={marks[item.id]}
            onMarksChange={(v) => setMarks((prev) => ({ ...prev, [item.id]: v }))}
            feedback={feedback[item.id]}
            onFeedbackChange={(v) => setFeedback((prev) => ({ ...prev, [item.id]: v }))}
          />
        ))}
      </ScrollView>

      {/* ── Sticky footer ── */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20,
        borderTopWidth: 1, borderTopColor: '#e5e7eb',
      }}>
        {/* Score pill */}
        <View style={{
          backgroundColor: '#15803d', borderRadius: 14,
          paddingVertical: 13, paddingHorizontal: 18,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
          marginBottom: 10,
        }}>
          <Text style={[T.label, { color: '#fff' }]}>
            Total: {total} / {maxTotal} · {pct}%
            {'  '}
            {passOk ? '✓ Pass threshold met' : '✗ Below threshold'}
          </Text>
        </View>

        {/* PASS / FAIL */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPress={() => setVerdict('PASS')}
            style={{
              flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              gap: 8, borderRadius: 12, paddingVertical: 13,
              borderWidth: 2,
              borderColor: verdict === 'PASS' ? '#15803d' : '#e5e7eb',
              backgroundColor: verdict === 'PASS' ? '#f0fdf4' : '#fff',
            }}
          >
            <View style={{
              width: 16, height: 16, borderRadius: 8,
              borderWidth: 2,
              borderColor: verdict === 'PASS' ? '#15803d' : '#9ca3af',
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: verdict === 'PASS' ? '#15803d' : 'transparent',
            }}>
              {verdict === 'PASS' && (
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' }} />
              )}
            </View>
            <Text style={[T.h4, { color: verdict === 'PASS' ? '#15803d' : '#9ca3af' }]}>
              PASS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setVerdict('FAIL')}
            style={{
              flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              gap: 8, borderRadius: 12, paddingVertical: 13,
              borderWidth: 2,
              borderColor: verdict === 'FAIL' ? '#dc2626' : '#e5e7eb',
              backgroundColor: verdict === 'FAIL' ? '#fff5f5' : '#fff',
            }}
          >
            <View style={{
              width: 16, height: 16, borderRadius: 8,
              borderWidth: 2,
              borderColor: verdict === 'FAIL' ? '#dc2626' : '#9ca3af',
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: verdict === 'FAIL' ? '#dc2626' : 'transparent',
            }}>
              {verdict === 'FAIL' && (
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' }} />
              )}
            </View>
            <Text style={[T.h4, { color: verdict === 'FAIL' ? '#dc2626' : '#9ca3af' }]}>
              FAIL
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}
