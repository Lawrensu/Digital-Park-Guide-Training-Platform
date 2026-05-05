import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h2:      { fontFamily: sans,  fontSize: 24, fontWeight: '600' },
  h3:      { fontFamily: sans,  fontSize: 20, fontWeight: '500' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodyDef: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const PASS_MARK = 70;
const LETTERS   = ['A', 'B', 'C', 'D'];

const TYPE_BADGE = {
  MCQ:          { bg: '#dcfce7', color: '#15803d', label: 'MULTIPLE CHOICE' },
  TRUE_FALSE:   { bg: '#ccfbf1', color: '#0f766e', label: 'TRUE / FALSE'    },
  SHORT_ANSWER: { bg: '#fef3c7', color: '#d97706', label: 'SHORT ANSWER'    },
  LONG_ANSWER:  { bg: '#ede9fe', color: '#6d28d9', label: 'LONG ANSWER'     },
};

const QUESTIONS = [
  {
    id: 1,
    type: 'MCQ',
    text: 'What percentage of Earth\'s surface do rainforests cover?',
    options: ['Less than 6%', 'About 15%', 'Around 25%', 'More than 30%'],
    correct: 0,
  },
  {
    id: 2,
    type: 'TRUE_FALSE',
    text: 'Rainforests cover less than 3% of Earth\'s surface but contain over 50% of all plant and animal species.',
    correct: false,
  },
  {
    id: 3,
    type: 'SHORT_ANSWER',
    text: 'Name two main threats to rainforest biodiversity.',
    placeholder: 'Type your answer...',
  },
  {
    id: 4,
    type: 'LONG_ANSWER',
    text: 'Explain the concept of "keystone species" and provide an example from rainforest ecosystems.',
    placeholder: 'Type your detailed answer...',
  },
  {
    id: 5,
    type: 'MCQ',
    text: 'Approximately what percentage of the world\'s oxygen does the Amazon Basin produce?',
    options: ['5%', '10%', '20%', '35%'],
    correct: 2,
  },
  {
    id: 6,
    type: 'MCQ',
    text: 'What is the primary driver of rainforest deforestation globally?',
    options: ['Urban expansion', 'Agricultural conversion', 'Mining operations', 'Road construction'],
    correct: 1,
  },
  {
    id: 7,
    type: 'MCQ',
    text: 'What is evapotranspiration in the context of rainforests?',
    options: [
      'The process of soil erosion caused by rainfall',
      'Water vapour released by trees that forms distant rainfall',
      'The absorption of carbon dioxide by tree leaves',
      'Flooding that occurs during the wet season',
    ],
    correct: 1,
  },
  {
    id: 8,
    type: 'MCQ',
    text: 'Which term describes the tallest trees that grow above the main rainforest canopy?',
    options: ['Pioneers', 'Epiphytes', 'Emergents', 'Understory trees'],
    correct: 2,
  },
];

function isAnswered(q, answers) {
  if (q.type === 'MCQ' || q.type === 'TRUE_FALSE') return answers[q.id] !== undefined;
  return (answers[q.id] ?? '').trim().length > 0;
}

function isAutoGraded(q) {
  return q.type === 'MCQ' || q.type === 'TRUE_FALSE';
}

export default function QuizScreen() {
  const navigation = useNavigation();
  const route      = useRoute();
  const course     = route.params?.course ?? { title: 'Rainforest Biodiversity Fundamentals' };

  const [answers, setAnswers] = useState({});

  const answeredCount = QUESTIONS.filter((q) => isAnswered(q, answers)).length;
  const allAnswered   = answeredCount === QUESTIONS.length;

  function setAnswer(qId, value) {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }

  function handleSubmit() {
    if (!allAnswered) return;

    const gradedQuestions = QUESTIONS.filter(isAutoGraded);
    const correctCount = gradedQuestions.filter((q) => {
      if (q.type === 'MCQ')        return answers[q.id] === q.correct;
      if (q.type === 'TRUE_FALSE') return answers[q.id] === q.correct;
      return false;
    }).length;

    const score  = Math.round((correctCount / gradedQuestions.length) * 100);
    const passed = score >= PASS_MARK;

    navigation.navigate('QuizResult', {
      course,
      score,
      correct:   correctCount,
      total:     gradedQuestions.length,
      passed,
      quizTitle: 'Rainforest Ecosystems Quiz',
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
          <Text numberOfLines={1} style={[T.label, { color: 'rgba(255,255,255,0.85)', flex: 1 }]}>
            {course.title}
          </Text>
        </TouchableOpacity>

        <Text style={[T.h3, { color: '#fff', marginBottom: 4 }]}>
          Rainforest Ecosystems Quiz
        </Text>
        <Text style={[T.caption, { color: 'rgba(255,255,255,0.75)' }]}>
          {QUESTIONS.length} questions · Pass mark {PASS_MARK}%
        </Text>

        {/* Progress bar */}
        <View style={{ marginTop: 14 }}>
          <View style={{ height: 5, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3, overflow: 'hidden' }}>
            <View style={{
              height: '100%', borderRadius: 3, backgroundColor: '#4ade80',
              width: `${(answeredCount / QUESTIONS.length) * 100}%`,
            }} />
          </View>
          <Text style={[T.caption, { color: 'rgba(255,255,255,0.7)', marginTop: 5 }]}>
            {answeredCount} of {QUESTIONS.length} answered
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {QUESTIONS.map((q, qi) => {
          const badge      = TYPE_BADGE[q.type];
          const chosenMCQ  = answers[q.id] ?? -1;
          const chosenTF   = answers[q.id];
          const textAnswer = answers[q.id] ?? '';

          return (
            <View
              key={q.id}
              style={{
                backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
                shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
              }}
            >
              {/* ── Question header: number + type badge ── */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <View style={{
                  width: 32, height: 32, borderRadius: 16,
                  backgroundColor: '#15803d',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontFamily: sans, fontSize: 13, fontWeight: '700', color: '#fff' }}>
                    {qi + 1}
                  </Text>
                </View>
                <View style={{
                  backgroundColor: badge.bg, borderRadius: 6,
                  paddingHorizontal: 10, paddingVertical: 4,
                }}>
                  <Text style={[T.caption, { color: badge.color, fontWeight: '700', letterSpacing: 0.3 }]}>
                    {badge.label}
                  </Text>
                </View>
              </View>

              {/* ── Question text ── */}
              <Text style={[T.label, { color: '#111827', fontWeight: '600', lineHeight: 22, marginBottom: 14 }]}>
                {q.text}
              </Text>

              {/* ── MCQ options ── */}
              {q.type === 'MCQ' && q.options.map((opt, oi) => {
                const isSelected = chosenMCQ === oi;
                return (
                  <TouchableOpacity
                    key={oi}
                    onPress={() => setAnswer(q.id, oi)}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 12,
                      borderWidth: 1.5,
                      borderColor: isSelected ? '#15803d' : '#e5e7eb',
                      borderRadius: 12,
                      paddingHorizontal: 12, paddingVertical: 12,
                      marginBottom: oi < q.options.length - 1 ? 8 : 0,
                      backgroundColor: isSelected ? '#f0fdf4' : '#fff',
                    }}
                  >
                    <View style={{
                      width: 28, height: 28, borderRadius: 14,
                      backgroundColor: isSelected ? '#15803d' : '#f3f4f6',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Text style={{ fontFamily: sans, fontSize: 12, fontWeight: '700', color: isSelected ? '#fff' : '#374151' }}>
                        {LETTERS[oi]}
                      </Text>
                    </View>
                    <Text style={[T.bodySm, { flex: 1, color: isSelected ? '#14532d' : '#374151', lineHeight: 20 }]}>
                      {opt}
                    </Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={18} color="#15803d" />}
                  </TouchableOpacity>
                );
              })}

              {/* ── TRUE / FALSE ── */}
              {q.type === 'TRUE_FALSE' && (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {[
                    { value: true,  icon: 'checkmark', label: 'TRUE'  },
                    { value: false, icon: 'close',     label: 'FALSE' },
                  ].map((btn) => {
                    const isSelected = chosenTF === btn.value;
                    return (
                      <TouchableOpacity
                        key={String(btn.value)}
                        onPress={() => setAnswer(q.id, btn.value)}
                        style={{
                          flex: 1, flexDirection: 'row', alignItems: 'center',
                          justifyContent: 'center', gap: 7,
                          paddingVertical: 14, borderRadius: 14,
                          borderWidth: 1.5,
                          borderColor: isSelected ? '#15803d' : '#e5e7eb',
                          backgroundColor: isSelected ? '#f0fdf4' : '#fff',
                        }}
                      >
                        <Ionicons name={btn.icon} size={15} color={isSelected ? '#15803d' : '#374151'} />
                        <Text style={[T.label, { color: isSelected ? '#15803d' : '#374151', fontWeight: '600' }]}>
                          {btn.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* ── SHORT ANSWER ── */}
              {q.type === 'SHORT_ANSWER' && (
                <TextInput
                  value={textAnswer}
                  onChangeText={(val) => setAnswer(q.id, val)}
                  placeholder={q.placeholder}
                  placeholderTextColor="#9ca3af"
                  style={[T.bodySm, {
                    borderWidth: 1.5,
                    borderColor: textAnswer.length > 0 ? '#15803d' : '#e5e7eb',
                    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13,
                    color: '#374151', backgroundColor: '#fff',
                  }]}
                />
              )}

              {/* ── LONG ANSWER ── */}
              {q.type === 'LONG_ANSWER' && (
                <TextInput
                  value={textAnswer}
                  onChangeText={(val) => setAnswer(q.id, val)}
                  placeholder={q.placeholder}
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  style={[T.bodySm, {
                    borderWidth: 1.5,
                    borderColor: textAnswer.length > 0 ? '#15803d' : '#e5e7eb',
                    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13,
                    color: '#374151', minHeight: 120, backgroundColor: '#fff',
                  }]}
                />
              )}
            </View>
          );
        })}

        {/* ── Submit button ── */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!allAnswered}
          style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            paddingVertical: 16, borderRadius: 16, marginTop: 8,
            backgroundColor: allAnswered ? '#15803d' : '#d1d5db',
          }}
        >
          <Ionicons name="checkmark-done" size={20} color={allAnswered ? '#fff' : '#9ca3af'} />
          <Text style={[T.label, { color: allAnswered ? '#fff' : '#9ca3af', fontWeight: '700', fontSize: 15 }]}>
            Submit Quiz ({answeredCount}/{QUESTIONS.length})
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
