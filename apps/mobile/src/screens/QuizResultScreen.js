// src/screens/QuizResultScreen.js
// Separate screen shown after quiz submission (per doc spec)
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';

export default function QuizResultScreen({ route, navigation }) {
  const { score, total, percentage, passed, courseName, quizName, pendingReview, offline } = route.params || {};

  // Offline state — quiz saved locally, not submitted yet
  if (offline) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Ionicons name="cloud-offline-outline" size={44} color="#d97706" />
        </View>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 10, fontFamily: FONTS.title }}>
          Quiz Saved Locally
        </Text>
        <Text style={{ fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 23, fontFamily: FONTS.body }}>
          Your quiz has been saved. It will be submitted automatically when you reconnect to the internet.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CourseList')}
          style={{ marginTop: 32, backgroundColor: '#15803d', borderRadius: 14, padding: 16, paddingHorizontal: 32 }}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', fontFamily: FONTS.button }}>Back to Courses</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pending review — has short/long answer questions
  if (pendingReview) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Ionicons name="time-outline" size={44} color="#0891b2" />
        </View>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 10, fontFamily: FONTS.title }}>
          Under Review
        </Text>
        <Text style={{ fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 23, fontFamily: FONTS.body }}>
          Your answers have been submitted and are under review. You will be notified when graded.
        </Text>
        <View style={{ marginTop: 20, padding: 16, backgroundColor: '#f0fdf4', borderRadius: 12, borderWidth: 1, borderColor: '#bbf7d0', width: '100%' }}>
          <Text style={{ fontSize: 13, color: '#15803d', textAlign: 'center', fontFamily: FONTS.body }}>
            📬 A notification will be sent to your device once your trainer has reviewed your submission.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('CourseList')}
          style={{ marginTop: 28, backgroundColor: '#15803d', borderRadius: 14, padding: 16, paddingHorizontal: 32 }}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', fontFamily: FONTS.button }}>Back to Courses</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>

        {/* Result icon */}
        <View style={{
          width: 96, height: 96, borderRadius: 48,
          backgroundColor: passed ? '#dcfce7' : '#fee2e2',
          alignItems: 'center', justifyContent: 'center', marginTop: 32, marginBottom: 20,
        }}>
          <Ionicons name={passed ? 'trophy' : 'refresh-circle'} size={48} color={passed ? '#16a34a' : '#dc2626'} />
        </View>

        {/* Score */}
        <Text style={{
          fontSize: 56, fontWeight: '900', marginBottom: 4,
          color: passed ? '#15803d' : '#dc2626', fontFamily: FONTS.title,
        }}>
          {percentage}%
        </Text>

        <Text style={{
          fontSize: 22, fontWeight: '800', marginBottom: 8,
          color: passed ? '#15803d' : '#dc2626', fontFamily: FONTS.title,
        }}>
          {passed ? '🎉 You Passed!' : '📚 Keep Studying'}
        </Text>

        {quizName && (
          <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 4, fontFamily: FONTS.body }}>
            {quizName}
          </Text>
        )}
        {courseName && (
          <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginBottom: 24, fontFamily: FONTS.body }}>
            {courseName}
          </Text>
        )}

        {/* Score breakdown */}
        <View style={{
          width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 20,
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, marginBottom: 20,
        }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#111827', marginBottom: 14, fontFamily: FONTS.title }}>
            Score Breakdown
          </Text>
          {[
            { label: 'Correct Answers', value: `${score} / ${total}`, color: '#16a34a' },
            { label: 'Your Score',      value: `${percentage}%`,       color: passed ? '#16a34a' : '#dc2626' },
            { label: 'Pass Score',      value: '70%',                  color: '#6b7280' },
            { label: 'Result',          value: passed ? 'PASSED' : 'FAILED', color: passed ? '#16a34a' : '#dc2626' },
          ].map((row) => (
            <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
              <Text style={{ fontSize: 13, color: '#6b7280', fontFamily: FONTS.body }}>{row.label}</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: row.color, fontFamily: FONTS.title }}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Pass message */}
        {passed && (
          <View style={{
            width: '100%', padding: 16, backgroundColor: '#f0fdf4', borderRadius: 14,
            borderWidth: 1, borderColor: '#bbf7d0', marginBottom: 20,
            flexDirection: 'row', alignItems: 'flex-start', gap: 10,
          }}>
            <Ionicons name="ribbon" size={20} color="#16a34a" style={{ marginTop: 2 }} />
            <Text style={{ flex: 1, fontSize: 13, color: '#15803d', lineHeight: 20, fontFamily: FONTS.body }}>
              Congratulations! Your trainer will review and issue your certification shortly. You'll receive a notification when it's ready.
            </Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={{ width: '100%', gap: 10 }}>
          {!passed && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                backgroundColor: '#15803d', borderRadius: 14, padding: 16,
                alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
                shadowColor: '#15803d', shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
              }}
            >
              <Ionicons name="refresh" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', fontFamily: FONTS.button }}>
                Retake Quiz
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('CourseList')}
            style={{
              borderRadius: 14, padding: 16, alignItems: 'center',
              borderWidth: 2, borderColor: '#15803d', backgroundColor: '#fff',
            }}
          >
            <Text style={{ color: '#15803d', fontSize: 15, fontWeight: '700', fontFamily: FONTS.button }}>
              Back to Courses
            </Text>
          </TouchableOpacity>
          {passed && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Certifications')}
              style={{
                borderRadius: 14, padding: 16, alignItems: 'center',
                backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0',
              }}
            >
              <Text style={{ color: '#16a34a', fontSize: 15, fontWeight: '700', fontFamily: FONTS.button }}>
                View Certifications
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}
