import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';
import { quizAttemptsApi } from '../../api/quizAttempts';

export default function QuizResultScreen() {
	const navigation   = useNavigation();
	const { isOnline } = useNetworkStatus();
	const route        = useRoute();
	const { attemptId, moduleTitle, offline, clientId } = route.params ?? {};

	const [attempt, setAttempt] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (offline || !attemptId) { setLoading(false); return; }
		quizAttemptsApi.getOne(attemptId)
			.then(setAttempt)
			.catch(() => {})
			.finally(() => setLoading(false));
	}, [attemptId, offline]);

	// Offline submission: show "Quiz Saved" screen — no score available until server processes it
	if (offline) {
		return (
			<View style={{ flex: 1, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
				<View style={{
					width: 96, height: 96, borderRadius: 48,
					backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center', marginBottom: 28,
				}}>
					<Ionicons name="cloud-upload-outline" size={48} color="#15803d" />
				</View>
				<Text style={{ fontFamily: FONTS.title, fontSize: 24, fontWeight: '600', color: '#111827', textAlign: 'center', marginBottom: 12 }}>
					Quiz Saved
				</Text>
				<Text style={{ fontFamily: FONTS.body, fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 23, marginBottom: 32 }}>
					You're offline. Your answers have been saved and will be submitted automatically when you reconnect.
				</Text>
				<TouchableOpacity
					onPress={() => navigation.navigate('CourseList')}
					style={{ width: '100%', paddingVertical: 16, borderRadius: 16, backgroundColor: '#15803d', alignItems: 'center' }}
				>
					<Text style={{ fontFamily: FONTS.button, fontSize: 15, color: '#fff', fontWeight: '700' }}>Back to Modules</Text>
				</TouchableOpacity>
			</View>
		);
	}

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator size="large" color="#15803d" />
			</View>
		);
	}

	if (!attempt) {
		return (
			<View style={{ flex: 1, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
				<Ionicons name="alert-circle-outline" size={48} color="#d1d5db" />
				<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#9ca3af', marginTop: 12, textAlign: 'center' }}>
					Could not load result
				</Text>
				<TouchableOpacity
					onPress={() => navigation.navigate('CourseList')}
					style={{ marginTop: 20, backgroundColor: '#15803d', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}
				>
					<Text style={{ fontFamily: FONTS.button, color: '#fff', fontWeight: '700' }}>Back to Courses</Text>
				</TouchableOpacity>
			</View>
		);
	}

	const passScorePct = attempt.quiz?.passScorePct ?? 70;
	const quizTitle    = attempt.quiz?.title ?? 'Quiz';
	const title        = moduleTitle ?? '';
	const isPending    = attempt.status === 'PENDING_REVIEW';

	const questionAttempts = attempt.questionAttempts ?? [];

	const maxScore = questionAttempts.reduce((sum, qa) => sum + (Number(qa.question?.maxScore) || 0), 0);
	const rawScore = attempt.totalScore != null ? Number(attempt.totalScore) : null;
	const score    = maxScore > 0 && rawScore != null ? Math.round((rawScore / maxScore) * 100) : (rawScore ?? 0);
	const passed   = !isPending && score >= passScorePct;

	const autoAttempts = questionAttempts.filter(
		(qa) => qa.question?.type === 'MCQ' || qa.question?.type === 'TRUE_FALSE'
	);
	const correct = autoAttempts.filter((qa) => (Number(qa.scoreAwarded) || 0) > 0).length;
	const total   = autoAttempts.length;

	const BREAKDOWN = [
		total > 0
			? { label: 'Correct Answers', value: `${correct}/${total}`, green: true }
			: null,
		{ label: 'Your Score', value: `${score}%`, green: passed },
		{ label: 'Pass Score', value: `${passScorePct}%`, green: false },
		{ label: 'Result', value: isPending ? 'PENDING' : passed ? 'PASSED' : 'FAILED', green: passed, bold: true },
	].filter(Boolean);

	return (
		<View style={{ flex: 1, backgroundColor: '#f0fdf4' }}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					alignItems: 'center',
					paddingTop: isOnline === false ? 32 : 72, paddingHorizontal: 24, paddingBottom: 48,
				}}
			>
				<View style={{
					width: 96, height: 96, borderRadius: 48,
					backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center', marginBottom: 28,
				}}>
					<Ionicons
						name={isPending ? 'time-outline' : passed ? 'trophy-outline' : 'close-circle-outline'}
						size={48}
						color={isPending ? '#d97706' : passed ? '#15803d' : '#ef4444'}
					/>
				</View>

				<Text style={{ fontFamily: FONTS.title, fontSize: 72, fontWeight: '700', color: '#14532d', lineHeight: 78, marginBottom: 10 }}>
					{score}%
				</Text>

				<Text style={{ fontFamily: FONTS.title, fontSize: 24, fontWeight: '600', color: '#111827', marginBottom: 8, textAlign: 'center' }}>
					{isPending ? 'Awaiting Review' : passed ? 'You Passed!' : 'Keep Studying'}
				</Text>

				<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#374151', marginBottom: 4, textAlign: 'center' }}>
					{quizTitle}
				</Text>
				{title ? (
					<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af', marginBottom: 32, textAlign: 'center' }}>
						{title}
					</Text>
				) : (
					<View style={{ marginBottom: 32 }} />
				)}

				<View style={{
					width: '100%', backgroundColor: '#fff', borderRadius: 18, padding: 20,
					shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
					marginBottom: 16,
				}}>
					<Text style={{ fontFamily: FONTS.title, fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 16 }}>
						Score Breakdown
					</Text>
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
							<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#6b7280' }}>{row.label}</Text>
							<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: row.green ? '#15803d' : '#374151', fontWeight: row.bold ? '700' : '600' }}>
								{row.value}
							</Text>
						</View>
					))}
				</View>

				<View style={{
					width: '100%', backgroundColor: '#f0fdf4', borderRadius: 14, padding: 16,
					borderWidth: 1, borderColor: '#bbf7d0', flexDirection: 'row', alignItems: 'flex-start', gap: 12,
					marginBottom: 28,
				}}>
					<Ionicons name="ribbon-outline" size={20} color="#15803d" style={{ marginTop: 1 }} />
					<Text style={{ fontFamily: FONTS.body, fontSize: 14, flex: 1, color: '#15803d', lineHeight: 21 }}>
						{isPending
							? 'Your written answers will be reviewed by a trainer before a certificate can be issued.'
							: passed
							? 'Your trainer will review and issue your certification shortly.'
							: 'Review the module content and try again when ready.'}
					</Text>
				</View>

				<TouchableOpacity
					onPress={() => navigation.navigate('CourseList')}
					style={{
						width: '100%', paddingVertical: 16, borderRadius: 16,
						borderWidth: 1.5, borderColor: '#15803d',
						alignItems: 'center', marginBottom: 18,
					}}
				>
					<Text style={{ fontFamily: FONTS.label, fontSize: 15, color: '#15803d', fontWeight: '700' }}>
						Back to Courses
					</Text>
				</TouchableOpacity>

				{passed && (
					<TouchableOpacity onPress={() => navigation.navigate('Certification')}>
						<Text style={{ fontFamily: FONTS.label, fontSize: 15, color: '#15803d', fontWeight: '700' }}>
							View Certifications
						</Text>
					</TouchableOpacity>
				)}
			</ScrollView>
		</View>
	);
}
