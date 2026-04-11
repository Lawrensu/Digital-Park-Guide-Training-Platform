// src/screens/QuizScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { FONTS } from '../theme/fonts';
import { fetchQuiz, submitQuizResult } from '../services/apiService';

const PASS_THRESHOLD = 70; // %

export default function QuizScreen({ route, navigation }) {
  const { course } = route.params;
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    setLoading(true);
    const data = await fetchQuiz(course.id, null);
    setQuiz(data);
    setLoading(false);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };

  const selectAnswer = (questionId, optionIndex) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const unanswered = quiz.questions.filter((q) => selectedAnswers[q.id] === undefined);
    if (unanswered.length > 0) {
      // Partial submit is OK — just warn
    }

    setSubmitting(true);
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) correct++;
    });

    const result = await submitQuizResult(
      user.id, course.id, quiz.id, correct, quiz.questions.length, selectedAnswers
    );

    setScore({ correct, total: quiz.questions.length, percentage: result.percentage });
    setSubmitted(true);
    setSubmitting(false);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(null);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#15803d" />
        <Text style={{ marginTop: 12, color: '#6b7280' }}>Loading quiz...</Text>
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#6b7280' }}>No quiz available for this course.</Text>
      </View>
    );
  }

  const passed = score && score.percentage >= PASS_THRESHOLD;

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#15803d', padding: 20 }}>
        <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '700' }}>
          {course.title.toUpperCase()}
        </Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#fff', marginTop: 2 }}>
          {quiz.title}
        </Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
          {quiz.questions.length} questions • Pass score: {PASS_THRESHOLD}%
        </Text>

        {/* Progress bar (answered / total) */}
        {!submitted && (
          <View style={{ marginTop: 12 }}>
            <View style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
              <View style={{
                width: `${(Object.keys(selectedAnswers).length / quiz.questions.length) * 100}%`,
                height: 4, backgroundColor: '#4ade80', borderRadius: 2,
              }} />
            </View>
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              {Object.keys(selectedAnswers).length} of {quiz.questions.length} answered
            </Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Score card after submission */}
        {submitted && score && (
          <Animated.View style={{
            opacity: fadeAnim,
            backgroundColor: passed ? '#f0fdf4' : '#fff7ed',
            borderRadius: 20, padding: 24, marginBottom: 24,
            borderWidth: 2, borderColor: passed ? '#86efac' : '#fed7aa',
            alignItems: 'center',
          }}>
            <View style={{
              width: 72, height: 72, borderRadius: 36,
              backgroundColor: passed ? '#dcfce7' : '#ffedd5',
              alignItems: 'center', justifyContent: 'center', marginBottom: 12,
            }}>
              <Ionicons
                name={passed ? 'trophy' : 'refresh-circle'}
                size={36} color={passed ? '#16a34a' : '#ea580c'}
              />
            </View>
            <Text style={{
              fontSize: 32, fontWeight: '900',
              color: passed ? '#15803d' : '#ea580c',
            }}>
              {score.percentage}%
            </Text>
            <Text style={{
              fontSize: 18, fontWeight: '700',
              color: passed ? '#15803d' : '#ea580c', marginBottom: 6,
            }}>
              {passed ? '🎉 Congratulations!' : '📚 Keep Studying'}
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 4 }}>
              You scored {score.correct} out of {score.total} questions correctly.
            </Text>
            <Text style={{ fontSize: 13, color: passed ? '#16a34a' : '#ea580c', fontWeight: '600' }}>
              {passed ? 'You passed this module!' : `You need ${PASS_THRESHOLD}% to pass.`}
            </Text>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 18 }}>
              <TouchableOpacity
                onPress={resetQuiz}
                style={{
                  paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10,
                  borderWidth: 2, borderColor: '#15803d',
                }}
              >
                <Text style={{ color: '#15803d', fontWeight: '700', fontSize: 13 }}>Retry Quiz</Text>
              </TouchableOpacity>
              {passed && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Courses')}
                  style={{
                    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10,
                    backgroundColor: '#15803d',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>View Courses</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        )}

        {/* Questions */}
        {quiz.questions.map((question, qIndex) => {
          const selected = selectedAnswers[question.id];
          const isCorrect = submitted && selected === question.correctIndex;
          const isWrong = submitted && selected !== undefined && selected !== question.correctIndex;
          const isUnanswered = submitted && selected === undefined;

          return (
            <View key={question.id} style={{
              backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 16,
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
              borderWidth: submitted ? 1.5 : 0,
              borderColor: isCorrect ? '#86efac' : isWrong ? '#fca5a5' : 'transparent',
            }}>
              {/* Question header */}
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 }}>
                <View style={{
                  width: 28, height: 28, borderRadius: 14,
                  backgroundColor: submitted
                    ? (isCorrect ? '#dcfce7' : isWrong ? '#fee2e2' : '#f3f4f6')
                    : '#f0fdf4',
                  alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 2,
                }}>
                  {submitted && (isCorrect || isWrong) ? (
                    <Ionicons
                      name={isCorrect ? 'checkmark' : 'close'}
                      size={16} color={isCorrect ? '#16a34a' : '#dc2626'}
                    />
                  ) : (
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#16a34a' }}>
                      {qIndex + 1}
                    </Text>
                  )}
                </View>
                <Text style={{ flex: 1, fontSize: 15, fontWeight: '700', color: '#111827', lineHeight: 22 }}>
                  {question.question}
                </Text>
              </View>

              {/* Options */}
              {question.options.map((option, optIndex) => {
                const isSelected = selected === optIndex;
                const isCorrectOption = optIndex === question.correctIndex;

                let bgColor = '#f9fafb';
                let borderColor = '#e5e7eb';
                let textColor = '#374151';

                if (!submitted && isSelected) {
                  bgColor = '#f0fdf4'; borderColor = '#16a34a'; textColor = '#15803d';
                } else if (submitted) {
                  if (isCorrectOption) {
                    bgColor = '#f0fdf4'; borderColor = '#16a34a'; textColor = '#15803d';
                  } else if (isSelected && !isCorrectOption) {
                    bgColor = '#fff5f5'; borderColor = '#ef4444'; textColor = '#dc2626';
                  }
                }

                return (
                  <TouchableOpacity
                    key={optIndex}
                    onPress={() => selectAnswer(question.id, optIndex)}
                    style={{
                      flexDirection: 'row', alignItems: 'center',
                      padding: 12, borderRadius: 10, marginBottom: 8,
                      backgroundColor: bgColor, borderWidth: 1.5, borderColor,
                    }}
                  >
                    <View style={{
                      width: 22, height: 22, borderRadius: 11,
                      borderWidth: 2, borderColor,
                      backgroundColor: isSelected ? borderColor : 'transparent',
                      alignItems: 'center', justifyContent: 'center', marginRight: 10,
                    }}>
                      {isSelected && !submitted && (
                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#15803d' }} />
                      )}
                      {submitted && isCorrectOption && (
                        <Ionicons name="checkmark" size={13} color="#16a34a" />
                      )}
                      {submitted && isSelected && !isCorrectOption && (
                        <Ionicons name="close" size={13} color="#dc2626" />
                      )}
                    </View>
                    <Text style={{ fontSize: 14, color: textColor, flex: 1, lineHeight: 20 }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Explanation (shown after submit) */}
              {submitted && question.explanation && (
                <View style={{
                  marginTop: 8, padding: 12, backgroundColor: '#fffbeb',
                  borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#f59e0b',
                }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#92400e', marginBottom: 3 }}>
                    💡 Explanation
                  </Text>
                  <Text style={{ fontSize: 12, color: '#78350f', lineHeight: 18 }}>
                    {question.explanation}
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Submit button */}
        {!submitted && (
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting || Object.keys(selectedAnswers).length === 0}
            style={{
              padding: 16, borderRadius: 14, backgroundColor: '#15803d',
              alignItems: 'center', marginTop: 8,
              opacity: Object.keys(selectedAnswers).length === 0 ? 0.5 : 1,
              shadowColor: '#15803d', shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
            }}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>
                  Submit Quiz ({Object.keys(selectedAnswers).length}/{quiz.questions.length})
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
