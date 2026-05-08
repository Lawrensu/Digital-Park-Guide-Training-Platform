import React, { useState, useEffect, useCallback } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';
import { quizzesApi } from '../../api/quizzes';
import { quizAttemptsApi } from '../../api/quizAttempts';
import { paymentsApi } from '../../api/payments';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

const TYPE_BADGE = {
	MCQ:          { bg: '#dcfce7', color: '#15803d', label: 'MULTIPLE CHOICE' },
	TRUE_FALSE:   { bg: '#ccfbf1', color: '#0f766e', label: 'TRUE / FALSE'    },
	SHORT_ANSWER: { bg: '#fef3c7', color: '#d97706', label: 'SHORT ANSWER'    },
	LONG_ANSWER:  { bg: '#ede9fe', color: '#6d28d9', label: 'LONG ANSWER'     },
};


function isAnswered(q, answers) {
	if (q.type === 'MCQ' || q.type === 'TRUE_FALSE') return answers[q.id] !== undefined;
	return (answers[q.id] ?? '').trim().length > 0;
}


function QuestionCard({ question, index, answer, onAnswer }) {
	const badge = TYPE_BADGE[question.type] ?? TYPE_BADGE.MCQ;

	return (
		<View style={{
			backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
			shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
		}}>
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
				<View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#15803d', alignItems: 'center', justifyContent: 'center' }}>
					<Text style={{ fontFamily: FONTS.label, fontSize: 13, fontWeight: '700', color: '#fff' }}>{index + 1}</Text>
				</View>
				<View style={{ backgroundColor: badge.bg, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 }}>
					<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: badge.color, fontWeight: '700', letterSpacing: 0.3 }}>
						{badge.label}
					</Text>
				</View>
				{question.maxScore != null && (
					<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af', marginLeft: 'auto' }}>
						{question.maxScore} {question.maxScore === 1 ? 'mark' : 'marks'}
					</Text>
				)}
			</View>

			<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#111827', fontWeight: '600', lineHeight: 22, marginBottom: 14 }}>
				{question.text}
			</Text>

			{question.type === 'MCQ' && question.options?.map((opt, oi) => {
				const isSelected = answer === opt.id;
				return (
					<TouchableOpacity
						key={opt.id}
						onPress={() => onAnswer(opt.id)}
						style={{
							flexDirection: 'row', alignItems: 'center', gap: 12,
							borderWidth: 1.5, borderColor: isSelected ? '#15803d' : '#e5e7eb',
							borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12,
							marginBottom: oi < question.options.length - 1 ? 8 : 0,
							backgroundColor: isSelected ? '#f0fdf4' : '#fff',
						}}
					>
						<View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: isSelected ? '#15803d' : '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
							<Text style={{ fontFamily: FONTS.label, fontSize: 12, fontWeight: '700', color: isSelected ? '#fff' : '#374151' }}>
								{LETTERS[oi] ?? String(oi + 1)}
							</Text>
						</View>
						<Text style={{ fontFamily: FONTS.body, fontSize: 14, flex: 1, color: isSelected ? '#14532d' : '#374151', lineHeight: 20 }}>
							{opt.text}
						</Text>
						{isSelected && <Ionicons name="checkmark-circle" size={18} color="#15803d" />}
					</TouchableOpacity>
				);
			})}

			{question.type === 'TRUE_FALSE' && (
				<View style={{ flexDirection: 'row', gap: 10 }}>
					{question.options?.map((opt, oi) => {
						const isSelected = answer === opt.id;
						const icon = oi === 0 ? 'checkmark' : 'close';
						return (
							<TouchableOpacity
								key={opt.id}
								onPress={() => onAnswer(opt.id)}
								style={{
									flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
									paddingVertical: 14, borderRadius: 14,
									borderWidth: 1.5, borderColor: isSelected ? '#15803d' : '#e5e7eb',
									backgroundColor: isSelected ? '#f0fdf4' : '#fff',
								}}
							>
								<Ionicons name={icon} size={15} color={isSelected ? '#15803d' : '#374151'} />
								<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: isSelected ? '#15803d' : '#374151', fontWeight: '600' }}>
									{opt.text}
								</Text>
							</TouchableOpacity>
						);
					})}
				</View>
			)}

			{(question.type === 'SHORT_ANSWER' || question.type === 'LONG_ANSWER') && (
				<TextInput
					value={answer ?? ''}
					onChangeText={onAnswer}
					placeholder="Type your answer..."
					placeholderTextColor="#9ca3af"
					multiline={question.type === 'LONG_ANSWER'}
					numberOfLines={question.type === 'LONG_ANSWER' ? 5 : 1}
					textAlignVertical={question.type === 'LONG_ANSWER' ? 'top' : 'center'}
					style={{
						fontFamily: FONTS.body, fontSize: 14,
						borderWidth: 1.5,
						borderColor: (answer ?? '').trim().length > 0 ? '#15803d' : '#e5e7eb',
						borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13,
						color: '#374151', backgroundColor: '#fff',
						minHeight: question.type === 'LONG_ANSWER' ? 120 : undefined,
					}}
				/>
			)}
		</View>
	);
}


export default function QuizScreen() {
	const navigation   = useNavigation();
	const { isOnline } = useNetworkStatus();
	const route        = useRoute();
	const { quizId, moduleTitle } = route.params ?? {};

	const [quiz,        setQuiz]        = useState(null);
	const [loading,     setLoading]     = useState(true);
	const [answers,     setAnswers]     = useState({});
	const [submitting,  setSubmitting]  = useState(false);
	const [payStatus,   setPayStatus]   = useState(null);
	const [payLoading,  setPayLoading]  = useState(false);

	const load = useCallback(async () => {
		if (!quizId) return;
		try {
			const [quizData, payData] = await Promise.allSettled([
				quizzesApi.getOne(quizId),
				paymentsApi.getMyStatus(quizId),
			]);
			if (quizData.status === 'fulfilled') setQuiz(quizData.value);
			if (payData.status === 'fulfilled')  setPayStatus(payData.value?.status ?? null);
		} catch {
			// keep empty
		} finally {
			setLoading(false);
		}
	}, [quizId]);

	useEffect(() => { load(); }, [load]);

	const questions     = quiz?.questions ?? [];
	const answeredCount = questions.filter((q) => isAnswered(q, answers)).length;
	const allAnswered   = answeredCount === questions.length && questions.length > 0;

	const needsPayment = payStatus != null && payStatus !== 'PAID';

	function setAnswer(questionId, value) {
		setAnswers((prev) => ({ ...prev, [questionId]: value }));
	}

	async function handlePay() {
		setPayLoading(true);
		try {
			const bill = await paymentsApi.initiate(quizId);
			if (bill?.url) {
				await Linking.openURL(bill.url);
			}
		} catch (err) {
			Alert.alert('Payment Error', err.message || 'Unable to open payment page.');
		} finally {
			setPayLoading(false);
		}
	}

	async function handleSubmit() {
		if (!allAnswered || submitting) return;

		const responses = questions.map((q) => {
			const answer = answers[q.id];
			if (q.type === 'MCQ') {
				return { questionId: q.id, selectedOptionId: answer };
			}
			if (q.type === 'TRUE_FALSE') {
				return { questionId: q.id, selectedOptionId: answer };
			}
			return { questionId: q.id, textResponse: answer ?? '' };
		});

		setSubmitting(true);
		try {
			const attempt = await quizAttemptsApi.submit(quizId, responses);
			navigation.navigate('QuizResult', { attemptId: attempt.id, moduleTitle });
		} catch (err) {
			Alert.alert('Submission Failed', err.message || 'Unable to submit quiz. Please try again.');
		} finally {
			setSubmitting(false);
		}
	}

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
				<View style={{ backgroundColor: '#15803d', paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20 }}>
					<TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
						<Ionicons name="arrow-back" size={22} color="#fff" />
						<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{moduleTitle}</Text>
					</TouchableOpacity>
				</View>
				<ActivityIndicator color="#15803d" style={{ marginTop: 48 }} />
			</View>
		);
	}

	if (!quiz) {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Text style={{ fontFamily: FONTS.body, color: '#6b7280' }}>Quiz not found</Text>
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20,
			}}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}
				>
					<Ionicons name="arrow-back" size={22} color="#fff" />
					<Text numberOfLines={1} style={{ fontFamily: FONTS.label, fontSize: 14, color: 'rgba(255,255,255,0.85)', flex: 1 }}>
						{moduleTitle}
					</Text>
				</TouchableOpacity>

				<Text style={{ fontFamily: FONTS.title, fontSize: 20, color: '#fff', fontWeight: '500', marginBottom: 4 }}>
					{quiz.title}
				</Text>
				<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
					{questions.length} question{questions.length !== 1 ? 's' : ''} · Pass mark {quiz.passScorePct ?? 70}%
				</Text>

				<View style={{ marginTop: 14 }}>
					<View style={{ height: 5, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3, overflow: 'hidden' }}>
						<View style={{ height: '100%', borderRadius: 3, backgroundColor: '#4ade80', width: `${questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%` }} />
					</View>
					<Text style={{ fontFamily: FONTS.label, fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 5 }}>
						{answeredCount} of {questions.length} answered
					</Text>
				</View>
			</View>

			{needsPayment ? (
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
					<View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
						<Ionicons name="card-outline" size={36} color="#d97706" />
					</View>
					<Text style={{ fontFamily: FONTS.title, fontSize: 20, color: '#111827', fontWeight: '600', textAlign: 'center', marginBottom: 10 }}>
						Payment Required
					</Text>
					<Text style={{ fontFamily: FONTS.body, fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22, marginBottom: 28 }}>
						A retake fee is required to attempt this quiz again.
					</Text>
					<TouchableOpacity
						onPress={handlePay}
						disabled={payLoading}
						style={{ backgroundColor: '#15803d', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, flexDirection: 'row', alignItems: 'center', gap: 8 }}
					>
						{payLoading ? (
							<ActivityIndicator color="#fff" size="small" />
						) : (
							<>
								<Ionicons name="card-outline" size={18} color="#fff" />
								<Text style={{ fontFamily: FONTS.button, fontSize: 16, color: '#fff', fontWeight: '700' }}>Pay & Unlock</Text>
							</>
						)}
					</TouchableOpacity>
				</View>
			) : (
				<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
					{questions.map((q, qi) => (
						<QuestionCard
							key={q.id}
							question={q}
							index={qi}
							answer={answers[q.id]}
							onAnswer={(val) => setAnswer(q.id, val)}
						/>
					))}

					<TouchableOpacity
						onPress={handleSubmit}
						disabled={!allAnswered || submitting}
						style={{
							flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
							paddingVertical: 16, borderRadius: 16, marginTop: 8,
							backgroundColor: allAnswered && !submitting ? '#15803d' : '#d1d5db',
						}}
					>
						{submitting ? (
							<ActivityIndicator color="#fff" size="small" />
						) : (
							<>
								<Ionicons name="checkmark-done" size={20} color={allAnswered ? '#fff' : '#9ca3af'} />
								<Text style={{ fontFamily: FONTS.label, fontSize: 15, color: allAnswered ? '#fff' : '#9ca3af', fontWeight: '700' }}>
									Submit Quiz ({answeredCount}/{questions.length})
								</Text>
							</>
						)}
					</TouchableOpacity>
				</ScrollView>
			)}

		</View>
	);
}
