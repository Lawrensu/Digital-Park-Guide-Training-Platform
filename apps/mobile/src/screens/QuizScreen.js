// src/screens/QuizScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { FONTS } from '../theme/fonts';
import { fetchQuiz, submitQuizResult } from '../services/apiService';
//import { sendQuizResultNotification } from '../services/notificationService';

const PASS_THRESHOLD = 70;

// ── Question renderers ────────────────────────────────────────────────

const MCQQuestion = ({ question, selected, submitted, onSelect }) => (
  <View>
    {question.options.map((option, optIndex) => {
      const isSelected   = selected === optIndex;
      const isCorrect    = submitted && optIndex === question.correctIndex;
      const isWrong      = submitted && isSelected && optIndex !== question.correctIndex;
      let bg = '#f9fafb', border = '#e5e7eb', tc = '#374151';
      if (!submitted && isSelected) { bg = '#f0fdf4'; border = '#15803d'; tc = '#15803d'; }
      else if (submitted && isCorrect) { bg = '#f0fdf4'; border = '#16a34a'; tc = '#15803d'; }
      else if (isWrong) { bg = '#fff5f5'; border = '#ef4444'; tc = '#dc2626'; }
      return (
        <TouchableOpacity key={optIndex} onPress={() => !submitted && onSelect(optIndex)}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 8, backgroundColor: bg, borderWidth: 1.5, borderColor: border }}>
          <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: border, backgroundColor: isSelected && !submitted ? border : 'transparent', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
            {submitted && isCorrect && <Ionicons name="checkmark" size={13} color="#16a34a" />}
            {submitted && isWrong   && <Ionicons name="close"     size={13} color="#dc2626" />}
          </View>
          <Text style={{ fontSize: 14, color: tc, flex: 1, lineHeight: 20, fontFamily: FONTS.body }}>{option}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const TrueFalseQuestion = ({ question, selected, submitted, onSelect }) => (
  <View style={{ flexDirection: 'row', gap: 12 }}>
    {[true, false].map((val, i) => {
      const label    = val ? 'True' : 'False';
      const optIndex = val ? 0 : 1;
      const isSelected  = selected === optIndex;
      const isCorrect   = submitted && optIndex === question.correctIndex;
      const isWrong     = submitted && isSelected && optIndex !== question.correctIndex;
      let bg = '#f9fafb', border = '#e5e7eb', tc = '#374151';
      if (!submitted && isSelected) { bg = '#f0fdf4'; border = '#15803d'; tc = '#15803d'; }
      else if (submitted && isCorrect) { bg = '#f0fdf4'; border = '#16a34a'; tc = '#15803d'; }
      else if (isWrong) { bg = '#fff5f5'; border = '#ef4444'; tc = '#dc2626'; }
      return (
        <TouchableOpacity key={label} onPress={() => !submitted && onSelect(optIndex)}
          style={{ flex: 1, padding: 20, borderRadius: 14, backgroundColor: bg, borderWidth: 2, borderColor: border, alignItems: 'center' }}>
          <Ionicons name={val ? 'checkmark-circle' : 'close-circle'} size={32} color={isSelected || (submitted && isCorrect) ? border : '#d1d5db'} style={{ marginBottom: 6 }} />
          <Text style={{ fontSize: 16, fontWeight: '800', color: tc, fontFamily: FONTS.title }}>{label}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const ShortAnswerQuestion = ({ question, value, submitted, onChange }) => (
  <TextInput
    value={value || ''}
    onChangeText={onChange}
    placeholder="Type your answer here..."
    placeholderTextColor="#d1d5db"
    editable={!submitted}
    style={{
      borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12,
      padding: 14, fontSize: 14, color: '#111827',
      fontFamily: FONTS.body, backgroundColor: submitted ? '#f9fafb' : '#fff',
    }}
  />
);

const LongAnswerQuestion = ({ question, value, submitted, onChange }) => (
  <TextInput
    value={value || ''}
    onChangeText={onChange}
    placeholder="Type your detailed answer here..."
    placeholderTextColor="#d1d5db"
    editable={!submitted}
    multiline
    numberOfLines={5}
    style={{
      borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12,
      padding: 14, fontSize: 14, color: '#111827',
      fontFamily: FONTS.body, backgroundColor: submitted ? '#f9fafb' : '#fff',
      textAlignVertical: 'top', minHeight: 120,
    }}
  />
);

// ── Main QuizScreen ───────────────────────────────────────────────────

export default function QuizScreen({ route, navigation }) {
  const { course } = route.params;
  const { user } = useAuth();

  const [quiz, setQuiz]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [answers, setAnswers]           = useState({});      // { questionId: value }
  const [submitted, setSubmitted]       = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [timeLeft, setTimeLeft]         = useState(null);    // seconds
  const timerRef = useRef(null);

  useEffect(() => { loadQuiz(); return () => clearInterval(timerRef.current); }, []);

  // Start countdown timer if quiz has time limit
  useEffect(() => {
    if (quiz?.timeLimit && !submitted) {
      setTimeLeft(quiz.timeLimit * 60);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { clearInterval(timerRef.current); handleAutoSubmit(); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [quiz]);

  const loadQuiz = async () => {
    setLoading(true);
    const data = await fetchQuiz(course.id, null);
    // Augment mock quiz with question types for demo
    if (data && data.questions) {
      data.questions = data.questions.map((q, i) => ({
        ...q,
        type: i === 0 ? 'MCQ' : i === 1 ? 'TRUE_FALSE' : i === 2 ? 'SHORT_ANSWER' : 'MCQ',
        correctIndex: q.correctIndex,
      }));
    }
    setQuiz(data);
    setLoading(false);
  };

  const setAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleAutoSubmit = () => {
    Alert.alert('Time Up!', 'Your quiz has been auto-submitted.', [{ text: 'OK', onPress: () => doSubmit() }]);
  };

  const handleSubmit = () => {
    const unanswered = quiz.questions.filter((q) => answers[q.id] === undefined || answers[q.id] === '');
    if (unanswered.length > 0) {
      Alert.alert(
        'Unanswered Questions',
        `You have ${unanswered.length} unanswered question(s). Submit anyway?`,
        [{ text: 'Cancel', style: 'cancel' }, { text: 'Submit', onPress: doSubmit }]
      );
    } else {
      doSubmit();
    }
  };

  const doSubmit = async () => {
    if (!quiz) return;
    clearInterval(timerRef.current);
    setSubmitting(true);

    // Calculate score for auto-graded questions (MCQ, TRUE_FALSE)
    let correct = 0;
    let autoGraded = 0;
    let hasManualGrading = false;

    quiz.questions.forEach((q) => {
      if (q.type === 'MCQ' || q.type === 'TRUE_FALSE') {
        autoGraded++;
        if (answers[q.id] === q.correctIndex) correct++;
      } else {
        hasManualGrading = true; // SHORT/LONG needs trainer review
      }
    });

    const total = autoGraded;
    const result = total > 0 ? await submitQuizResult(user.id, course.id, quiz.id, correct, total, answers) : { score: 0, total: 0, percentage: 0 };

    setSubmitted(true);
    setSubmitting(false);

    const passed = result.percentage >= PASS_THRESHOLD;

    // Fire push notification
    if (!hasManualGrading) {
      sendQuizResultNotification(course.title, correct, total, passed).catch(() => {});
    }

    // Navigate to QuizResultScreen
    navigation.replace('QuizResult', {
      score:         correct,
      total:         total,
      percentage:    result.percentage,
      passed:        passed,
      courseName:    course.title,
      quizName:      quiz.title,
      pendingReview: hasManualGrading,
      offline:       false,
    });
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
      <ActivityIndicator size="large" color="#15803d" />
      <Text style={{ marginTop: 12, color: '#6b7280', fontFamily: FONTS.body }}>Loading quiz...</Text>
    </View>
  );

  if (!quiz) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Ionicons name="book-outline" size={64} color="#d1d5db" />
      <Text style={{ fontSize: 18, color: '#6b7280', marginTop: 16, fontFamily: FONTS.body }}>No quiz available</Text>
    </View>
  );

  const answeredCount = Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== '').length;
  const isTimerWarning = timeLeft !== null && timeLeft <= 60;

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#15803d', padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.label }}>{course.title.toUpperCase()}</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff', marginTop: 2, fontFamily: FONTS.title }}>{quiz.title}</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4, fontFamily: FONTS.body }}>
              {quiz.questions.length} questions · Pass: {PASS_THRESHOLD}%
            </Text>
          </View>
          {/* Timer */}
          {timeLeft !== null && (
            <View style={{ backgroundColor: isTimerWarning ? '#dc2626' : 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Ionicons name="time-outline" size={14} color="#fff" />
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff', fontFamily: FONTS.title }}>{formatTime(timeLeft)}</Text>
            </View>
          )}
        </View>
        {/* Progress */}
        <View style={{ marginTop: 12 }}>
          <View style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
            <View style={{ width: `${(answeredCount / quiz.questions.length) * 100}%`, height: 4, backgroundColor: '#4ade80', borderRadius: 2 }} />
          </View>
          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontFamily: FONTS.body }}>
            {answeredCount} of {quiz.questions.length} answered
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {quiz.questions.map((question, qIndex) => (
          <View key={question.id} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>

            {/* Question header */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 2 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#16a34a', fontFamily: FONTS.title }}>{qIndex + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827', lineHeight: 22, fontFamily: FONTS.heading }}>{question.question}</Text>
                {/* Question type badge */}
                <View style={{ marginTop: 6, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor:
                  question.type === 'MCQ' ? '#dbeafe' : question.type === 'TRUE_FALSE' ? '#dcfce7' :
                  question.type === 'SHORT_ANSWER' ? '#fef3c7' : '#ede9fe' }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', fontFamily: FONTS.label, color:
                    question.type === 'MCQ' ? '#1d4ed8' : question.type === 'TRUE_FALSE' ? '#15803d' :
                    question.type === 'SHORT_ANSWER' ? '#92400e' : '#7c3aed' }}>
                    {question.type === 'MCQ' ? 'Multiple Choice' : question.type === 'TRUE_FALSE' ? 'True / False' :
                     question.type === 'SHORT_ANSWER' ? 'Short Answer' : 'Long Answer'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Answer area — varies by type */}
            {question.type === 'MCQ' && (
              <MCQQuestion question={question} selected={answers[question.id]} submitted={submitted} onSelect={(v) => setAnswer(question.id, v)} />
            )}
            {question.type === 'TRUE_FALSE' && (
              <TrueFalseQuestion question={question} selected={answers[question.id]} submitted={submitted} onSelect={(v) => setAnswer(question.id, v)} />
            )}
            {question.type === 'SHORT_ANSWER' && (
              <ShortAnswerQuestion question={question} value={answers[question.id]} submitted={submitted} onChange={(v) => setAnswer(question.id, v)} />
            )}
            {question.type === 'LONG_ANSWER' && (
              <LongAnswerQuestion question={question} value={answers[question.id]} submitted={submitted} onChange={(v) => setAnswer(question.id, v)} />
            )}

            {/* Explanation (shown after submit for auto-graded) */}
            {submitted && question.explanation && (question.type === 'MCQ' || question.type === 'TRUE_FALSE') && (
              <View style={{ marginTop: 10, padding: 12, backgroundColor: '#fffbeb', borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#f59e0b' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#92400e', marginBottom: 3, fontFamily: FONTS.label }}>💡 Explanation</Text>
                <Text style={{ fontSize: 12, color: '#78350f', lineHeight: 18, fontFamily: FONTS.body }}>{question.explanation}</Text>
              </View>
            )}

            {/* Manual grading notice */}
            {submitted && (question.type === 'SHORT_ANSWER' || question.type === 'LONG_ANSWER') && (
              <View style={{ marginTop: 10, padding: 12, backgroundColor: '#dbeafe', borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#0891b2' }}>
                <Text style={{ fontSize: 12, color: '#1d4ed8', lineHeight: 18, fontFamily: FONTS.body }}>
                  ✏️ This answer will be reviewed and graded by your trainer.
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Submit button */}
        {!submitted && (
          <TouchableOpacity onPress={handleSubmit} disabled={submitting || answeredCount === 0}
            style={{ padding: 16, borderRadius: 14, backgroundColor: '#15803d', alignItems: 'center', marginTop: 8, opacity: answeredCount === 0 ? 0.5 : 1, shadowColor: '#15803d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}>
            {submitting ? <ActivityIndicator color="#fff" /> : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff', fontFamily: FONTS.button }}>
                  Submit Quiz ({answeredCount}/{quiz.questions.length})
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
