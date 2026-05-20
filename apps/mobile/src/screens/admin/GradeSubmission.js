import React, { useState, useEffect } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, TextInput,
	ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { quizAttemptsApi } from '../../api/quizAttempts';
import useNetworkStatus from '../../services/connectivityService';
import CertIssueModal from './CertIssue';

const TYPE_STYLE = {
	MCQ:          { color: '#0891b2', bg: '#e0f2fe' },
	TRUE_FALSE:   { color: '#16a34a', bg: '#dcfce7' },
	SHORT_ANSWER: { color: '#d97706', bg: '#fef3c7' },
	LONG_ANSWER:  { color: '#7c3aed', bg: '#f5f3ff' },
};

function TypeBadge({ type }) {
	const style = TYPE_STYLE[type] ?? { color: '#6b7280', bg: '#f3f4f6' };
	const label = type.replace('_', '/');
	return (
		<View style={{
			alignSelf: 'flex-start', backgroundColor: style.bg, borderRadius: 20,
			paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10,
		}}>
			<Text style={{ fontSize: 12, fontWeight: '700', color: style.color, letterSpacing: 0.3 }}>
				{label}
			</Text>
		</View>
	);
}

function AutoGradedRow({ qa, isLast }) {
	const correct = Number(qa.scoreAwarded) > 0;
	return (
		<View>
			<View style={{
				flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
				paddingHorizontal: 16, paddingVertical: 14,
			}}>
				<Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', flex: 1, marginRight: 8 }}>
					{qa.question?.title ?? qa.question?.questionText ?? 'Question'}
				</Text>
				<View style={{
					paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
					backgroundColor: correct ? '#dcfce7' : '#fee2e2',
				}}>
					<Text style={{
						fontSize: 12, fontWeight: '700',
						color: correct ? '#16a34a' : '#dc2626',
					}}>
						{correct ? '✓ CORRECT' : '✗ WRONG'}
					</Text>
				</View>
			</View>
			{!isLast && <View style={{ height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 16 }} />}
		</View>
	);
}

function NeedsGradingCard({ qa, score, onScoreChange }) {
	const maxScore = Number(qa.question?.maxScore ?? 10);
	return (
		<View style={{
			backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
			shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
		}}>
			<TypeBadge type={qa.question?.type ?? 'SHORT_ANSWER'} />

			<Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 10, lineHeight: 22 }}>
				{qa.question?.questionText ?? 'Question'}
			</Text>

			<View style={{
				backgroundColor: '#f9fafb', borderRadius: 10,
				borderWidth: 1, borderColor: '#e5e7eb',
				padding: 14, marginBottom: 16,
			}}>
				<Text style={{ fontSize: 14, color: '#6b7280', fontStyle: 'italic', lineHeight: 20 }}>
					{qa.textResponse || '(no response)'}
				</Text>
			</View>

			<Text style={{ fontSize: 12, color: '#9ca3af', letterSpacing: 0.4, marginBottom: 6 }}>
				MARKS
			</Text>
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
				<TextInput
					value={score}
					onChangeText={onScoreChange}
					keyboardType="numeric"
					style={{
						fontSize: 16, fontWeight: '600',
						borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8,
						paddingHorizontal: 14, paddingVertical: 10,
						minWidth: 64, textAlign: 'center', color: '#111827',
						backgroundColor: '#fff',
					}}
				/>
				<Text style={{ fontSize: 14, fontWeight: '500', color: '#6b7280' }}>
					/ {maxScore}
				</Text>
			</View>
		</View>
	);
}

export default function GradeSubmission() {
	const navigation   = useNavigation();
	const { isOnline } = useNetworkStatus();
	const route        = useRoute();
	const { attemptId } = route.params;

	const [attempt,       setAttempt]       = useState(null);
	const [loading,       setLoading]       = useState(true);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [scores,        setScores]        = useState({});
	const [showCertModal, setShowCertModal] = useState(false);

	useEffect(() => {
		quizAttemptsApi.getOne(attemptId)
			.then((data) => {
				setAttempt(data);
				// init score state for manual questions
				const init = {};
				(data.questionAttempts ?? []).forEach((qa) => {
					if (!qa.isAutoScored) init[qa.id] = '0';
				});
				setScores(init);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, [attemptId]);

	async function handleSubmit() {
		const qas        = attempt?.questionAttempts ?? [];
		const manualQas  = qas.filter((qa) => !qa.isAutoScored);
		const autoGraded = qas.filter((qa) => qa.isAutoScored);
		const grades     = {};

		for (const qa of manualQas) {
			const val = parseInt(scores[qa.id] ?? '0', 10);
			const max = Number(qa.question?.maxScore ?? 10);
			if (isNaN(val) || val < 0 || val > max) {
				Alert.alert('Invalid Score', `Score for a question must be between 0 and ${max}.`);
				return;
			}
			grades[qa.questionId] = val;
		}

		// Compute final score to determine pass/fail for the post-submit prompt
		const autoTotal   = autoGraded.reduce((sum, qa) => sum + Number(qa.scoreAwarded ?? 0), 0);
		const manualTotal = manualQas.reduce((sum, qa) => sum + (parseInt(scores[qa.id] ?? '0', 10) || 0), 0);
		const maxTotal    = qas.reduce((sum, qa) => sum + Number(qa.question?.maxScore ?? 0), 0);
		const finalPct    = maxTotal > 0 ? Math.round(((autoTotal + manualTotal) / maxTotal) * 100) : 0;
		const passPct     = attempt?.quiz?.passScorePct ?? 70;
		const isPass      = finalPct >= passPct;

		setSubmitLoading(true);
		try {
			await quizAttemptsApi.grade(attemptId, grades);

			if (isPass) {
				// Offer cert issuance immediately after a passing grade
				Alert.alert(
					'Grading Submitted',
					`Score: ${finalPct}% — pass threshold met.\nIssue certificate now?`,
					[
						{
							text: 'Issue Certificate',
							onPress: () => setShowCertModal(true),
						},
						{
							text: 'Done',
							style: 'cancel',
							onPress: () => navigation.goBack(),
						},
					]
				);
			} else {
				Alert.alert('Submitted', `Grading saved. Score: ${finalPct}% — below pass threshold.`, [
					{ text: 'OK', onPress: () => navigation.goBack() },
				]);
			}
		} catch (e) {
			Alert.alert('Error', e?.message ?? 'Could not submit grades.');
		} finally {
			setSubmitLoading(false);
		}
	}

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator size="large" color="#15803d" />
			</View>
		);
	}

	if (!attempt) {
		return (
			<View style={{ flex: 1, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
				<Ionicons name="alert-circle-outline" size={44} color="#dc2626" />
				<Text style={{ fontSize: 14, color: '#6b7280', marginTop: 12 }}>Could not load attempt.</Text>
				<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
					<Text style={{ fontSize: 14, color: '#15803d', fontWeight: '600' }}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	const qas          = attempt.questionAttempts ?? [];
	const autoGraded   = qas.filter((qa) => qa.isAutoScored);
	const needsGrading = qas.filter((qa) => !qa.isAutoScored);
	const isPending    = attempt.status === 'PENDING_REVIEW';

	// total score calculation for display
	const autoScore   = autoGraded.reduce((sum, qa) => sum + Number(qa.scoreAwarded ?? 0), 0);
	const manualScore = needsGrading.reduce((sum, qa) => sum + (parseInt(scores[qa.id] ?? '0', 10) || 0), 0);
	const maxScore    = qas.reduce((sum, qa) => sum + Number(qa.question?.maxScore ?? 0), 0);
	const total       = autoScore + manualScore;
	const pct         = maxScore > 0 ? Math.round((total / maxScore) * 100) : 0;
	const passPct     = attempt.quiz?.passScorePct ?? 70;
	const passOk      = pct >= passPct;

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			{/* Green header */}
			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 18, paddingHorizontal: 20,
			}}>
				<View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
					<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14, marginTop: 4 }}>
						<Ionicons name="arrow-back" size={22} color="#fff" />
					</TouchableOpacity>
					<View>
						<Text style={{ fontSize: 26, fontWeight: '600', color: '#fff' }}>Grade Submission</Text>
						<Text style={{ fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>
							{attempt.guide?.username ?? 'Guide'}
						</Text>
					</View>
				</View>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ padding: 16, paddingBottom: 160 }}
			>
				{/* Quiz info */}
				<View style={{
					backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 20,
					shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
				}}>
					<Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 6 }}>
						{attempt.quiz?.title ?? 'Quiz'}
					</Text>
					<Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
						Submitted: {new Date(attempt.submittedAt).toLocaleDateString('en-GB', {
							day: 'numeric', month: 'short', year: 'numeric',
						})}
					</Text>
					<Text style={{ fontSize: 12, color: '#15803d', fontWeight: '600' }}>
						Auto-graded: {autoGraded.length} · Needs grading: {needsGrading.length}
					</Text>
					{!isPending && (
						<View style={{
							marginTop: 10, paddingHorizontal: 12, paddingVertical: 6,
							borderRadius: 8, backgroundColor: '#dcfce7', alignSelf: 'flex-start',
						}}>
							<Text style={{ fontSize: 12, fontWeight: '700', color: '#16a34a' }}>
								ALREADY GRADED
							</Text>
						</View>
					)}
				</View>

				{/* Auto-graded */}
				{autoGraded.length > 0 && (
					<>
						<Text style={{
							fontSize: 12, fontWeight: '500', color: '#9ca3af',
							letterSpacing: 0.8, marginBottom: 10, marginLeft: 2,
						}}>
							AUTO-GRADED
						</Text>
						<View style={{
							backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginBottom: 20,
							shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
							shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
						}}>
							{autoGraded.map((qa, i) => (
								<AutoGradedRow
									key={qa.id}
									qa={qa}
									isLast={i === autoGraded.length - 1}
								/>
							))}
						</View>
					</>
				)}

				{/* Needs grading */}
				{needsGrading.length > 0 && (
					<>
						<Text style={{
							fontSize: 12, fontWeight: '700', color: '#d97706',
							letterSpacing: 0.8, marginBottom: 12, marginLeft: 2,
						}}>
							NEEDS GRADING ({needsGrading.length})
						</Text>
						{needsGrading.map((qa) => (
							<NeedsGradingCard
								key={qa.id}
								qa={qa}
								score={scores[qa.id] ?? '0'}
								onScoreChange={(v) => setScores((prev) => ({ ...prev, [qa.id]: v }))}
							/>
						))}
					</>
				)}
			</ScrollView>

			{/* Cert issue modal: shown after a passing grade */}
			<CertIssueModal
				visible={showCertModal}
				onClose={() => { setShowCertModal(false); navigation.goBack(); }}
				onIssued={() => navigation.goBack()}
				attemptId={attemptId}
				guideId={attempt?.guide?.id}
				moduleId={attempt?.quiz?.module?.id}
				guideName={attempt?.guide?.username}
				moduleTitle={attempt?.quiz?.module?.title ?? attempt?.quiz?.title}
			/>

			{/* Sticky footer */}
			{isPending && (
				<View style={{
					position: 'absolute', bottom: 0, left: 0, right: 0,
					backgroundColor: '#f3f4f6',
					paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20,
					borderTopWidth: 1, borderTopColor: '#e5e7eb',
				}}>
					<View style={{
						backgroundColor: passOk ? '#15803d' : '#dc2626',
						borderRadius: 14, paddingVertical: 13, paddingHorizontal: 18,
						flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
						marginBottom: 10,
					}}>
						<Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>
							Total: {total} / {maxScore} · {pct}%{'  '}
							{passOk ? '✓ Pass threshold met' : '✗ Below threshold'}
						</Text>
					</View>

					<TouchableOpacity
						onPress={handleSubmit}
						disabled={submitLoading}
						style={{
							backgroundColor: '#15803d', borderRadius: 12,
							paddingVertical: 15, alignItems: 'center',
						}}
					>
						{submitLoading
							? <ActivityIndicator color="#fff" />
							: <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>Submit Grades</Text>
						}
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
}
