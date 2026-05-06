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
  h1:          { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h3:          { fontFamily: sans,  fontSize: 20, fontWeight: '500' },
  bodyDefault: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySmall:   { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:       { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption:     { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const QUESTION_TYPES = {
  MCQ:          { label: 'MCQ',          color: '#0891b2', bg: '#e0f2fe' },
  TRUE_FALSE:   { label: 'TRUE/FALSE',   color: '#16a34a', bg: '#dcfce7' },
  SHORT_ANSWER: { label: 'SHORT ANSWER', color: '#d97706', bg: '#fef3c7' },
  LONG_ANSWER:  { label: 'LONG ANSWER',  color: '#7c3aed', bg: '#ede9fe' },
};

const INITIAL_QUESTIONS = [
  { id: 1, type: 'MCQ',          text: 'Which layer of the rainforest receives the most sunlight?' },
  { id: 2, type: 'TRUE_FALSE',   text: 'Rainforests cover more than 50% of Earth\'s land area.' },
  { id: 3, type: 'SHORT_ANSWER', text: 'Name three adaptations that help animals survive in rainforests.' },
  { id: 4, type: 'LONG_ANSWER',  text: 'Explain the role of decomposers in the rainforest ecosystem.' },
];

function TypeBadge({ type }) {
  const { label, color, bg } = QUESTION_TYPES[type];
  return (
    <View style={{
      paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
      backgroundColor: bg, alignSelf: 'flex-start',
    }}>
      <Text style={[T.caption, { color, fontWeight: '700', letterSpacing: 0.3 }]}>
        {label}
      </Text>
    </View>
  );
}

function QuestionRow({ question, onDelete }) {
  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 14,
      padding: 14, marginBottom: 10,
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {/* Drag handle */}
        <Ionicons name="reorder-three" size={20} color="#d1d5db" style={{ marginRight: 10, marginTop: 2 }} />

        {/* Badge + text */}
        <View style={{ flex: 1, marginRight: 10 }}>
          <TypeBadge type={question.type} />
          <Text style={[T.bodySmall, { color: '#374151', marginTop: 8, lineHeight: 20 }]}>
            {question.text}
          </Text>
        </View>

        {/* Actions */}
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 2 }}>
          <TouchableOpacity>
            <Ionicons name="pencil" size={18} color="#d97706" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(question.id)}>
            <Ionicons name="trash-outline" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function QuizCreate() {
  const navigation   = useNavigation();
  const { isOnline } = useNetworkStatus();
  const route        = useRoute();
  const linkedModule = route.params?.module ?? null;

  const [quizTitle,    setQuizTitle]    = useState('Rainforest Ecosystems Quiz');
  const [timeLimit,    setTimeLimit]    = useState('30 minute');
  const [passScore,    setPassScore]    = useState('70%');
  const [maxAttempts,  setMaxAttempts]  = useState('3');
  const [questions,    setQuestions]    = useState(INITIAL_QUESTIONS);

  const deleteQuestion = (id) =>
    setQuestions((prev) => prev.filter((q) => q.id !== id));

  const addQuestion = () => {
    const id = Date.now();
    setQuestions((prev) => [
      ...prev,
      { id, type: 'MCQ', text: 'New question...' },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: isOnline === false ? 12 : 52, paddingBottom: 16, paddingHorizontal: 20,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={[T.h1, { color: '#fff' }]}>Quiz Edit</Text>
            {linkedModule && (
              <Text style={[T.caption, { color: 'rgba(255,255,255,0.75)', marginTop: 2 }]}>
                {linkedModule.title}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity style={{
          width: 36, height: 36, borderRadius: 8,
          backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center',
        }}>
          <Ionicons name="save" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >

        {/* ── Quiz settings card ── */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 20,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        }}>
          {/* Quiz Title */}
          <Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.8, marginBottom: 8 }]}>
            QUIZ TITLE
          </Text>
          <TextInput
            value={quizTitle}
            onChangeText={setQuizTitle}
            style={[T.bodyDefault, {
              color: '#111827', borderWidth: 1, borderColor: '#e5e7eb',
              borderRadius: 10, padding: 12, marginBottom: 16,
            }]}
          />

          {/* Time / Pass Score / Max Attempts row */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.8, marginBottom: 6 }]}>
                TIME LIMIT
              </Text>
              <TextInput
                value={timeLimit}
                onChangeText={setTimeLimit}
                style={[T.bodySmall, {
                  color: '#111827', borderWidth: 1, borderColor: '#e5e7eb',
                  borderRadius: 10, padding: 10,
                }]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.8, marginBottom: 6 }]}>
                PASS SCORE
              </Text>
              <TextInput
                value={passScore}
                onChangeText={setPassScore}
                style={[T.bodySmall, {
                  color: '#111827', borderWidth: 1, borderColor: '#e5e7eb',
                  borderRadius: 10, padding: 10,
                }]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.8, marginBottom: 6 }]}>
                MAX{'\n'}ATTEMPTS
              </Text>
              <TextInput
                value={maxAttempts}
                onChangeText={setMaxAttempts}
                keyboardType="numeric"
                style={[T.bodySmall, {
                  color: '#111827', borderWidth: 1, borderColor: '#e5e7eb',
                  borderRadius: 10, padding: 10,
                }]}
              />
            </View>
          </View>
        </View>

        {/* ── Questions header row ── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <Text style={[T.h3, { color: '#111827' }]}>
            Questions ({questions.length})
          </Text>
          <TouchableOpacity
            onPress={addQuestion}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 6,
              backgroundColor: '#15803d', borderRadius: 20,
              paddingHorizontal: 16, paddingVertical: 8,
            }}
          >
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={[T.label, { color: '#fff' }]}>Add Question</Text>
          </TouchableOpacity>
        </View>

        {/* ── Question list ── */}
        {questions.map((q) => (
          <QuestionRow key={q.id} question={q} onDelete={deleteQuestion} />
        ))}

        {/* Dashed add question button */}
        <TouchableOpacity
          onPress={addQuestion}
          style={{
            borderWidth: 1.5, borderColor: '#d1d5db', borderStyle: 'dashed',
            borderRadius: 14, paddingVertical: 14,
            alignItems: 'center', justifyContent: 'center',
            marginTop: 4, marginBottom: 20,
          }}
        >
          <Text style={[T.label, { color: '#9ca3af' }]}>+ Add Question</Text>
        </TouchableOpacity>

        {/* ── Save & Attach button ── */}
        <TouchableOpacity style={{
          backgroundColor: '#15803d', borderRadius: 14,
          paddingVertical: 16, alignItems: 'center',
        }}>
          <Text style={[T.label, { color: '#fff', fontSize: 16 }]}>Save & Attach to Module</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
