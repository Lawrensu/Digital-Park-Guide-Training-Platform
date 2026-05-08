import React, { useState, useEffect } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, TextInput,
	ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { quizzesApi } from '../../api/quizzes';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';

const T = {
	h1:      { fontFamily: FONTS.label, fontSize: 26, fontWeight: '600' },
	h4:      { fontFamily: FONTS.label, fontSize: 16, fontWeight: '600' },
	label:   { fontFamily: FONTS.label, fontSize: 14, fontWeight: '500' },
	caption: { fontFamily: FONTS.label, fontSize: 12, fontWeight: '500' },
};

const Q_TYPES = [
	{ value: 'MCQ',          label: 'MCQ',        color: '#0891b2', bg: '#e0f2fe' },
	{ value: 'TRUE_FALSE',   label: 'True/False', color: '#16a34a', bg: '#dcfce7' },
	{ value: 'SHORT_ANSWER', label: 'Short',      color: '#d97706', bg: '#fef3c7' },
	{ value: 'LONG_ANSWER',  label: 'Long',       color: '#7c3aed', bg: '#ede9fe' },
];


function FieldLabel({ text }) {
	return (
		<Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 6, marginTop: 16 }]}>
			{text}
		</Text>
	);
}


function TypeBadge({ type }) {
	const cfg = Q_TYPES.find((t) => t.value === type) ?? Q_TYPES[0];
	return (
		<View style={{
			paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
			backgroundColor: cfg.bg, alignSelf: 'flex-start',
		}}>
			<Text style={[T.caption, { color: cfg.color, fontWeight: '700' }]}>{cfg.label}</Text>
		</View>
	);
}


function QuestionCard({ question, index, onDelete }) {
	const [deleting, setDeleting] = useState(false);

	async function handleDelete() {
		setDeleting(true);
		try {
			await onDelete(question);
		} catch (e) {
			Alert.alert('Error', e?.message ?? 'Could not delete question.');
		} finally {
			setDeleting(false);
		}
	}

	return (
		<View style={{
			backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
			shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
		}}>
			<View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
				<View style={{
					width: 26, height: 26, borderRadius: 13, backgroundColor: '#f3f4f6',
					alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0,
				}}>
					<Text style={[T.caption, { color: '#6b7280', fontWeight: '700' }]}>{index + 1}</Text>
				</View>
				<View style={{ flex: 1, marginRight: 10 }}>
					<TypeBadge type={question.type} />
					<Text style={{ fontSize: 14, color: '#374151', marginTop: 8, lineHeight: 20 }}>
						{question.text}
					</Text>
					<Text style={[T.caption, { color: '#9ca3af', marginTop: 4 }]}>
						{question.maxScore} pt{question.maxScore !== 1 ? 's' : ''}
						{question._local ? ' · unsaved' : ''}
					</Text>
				</View>
				<TouchableOpacity onPress={handleDelete} disabled={deleting}>
					{deleting
						? <ActivityIndicator size="small" color="#dc2626" />
						: <Ionicons name="trash-outline" size={18} color="#dc2626" />
					}
				</TouchableOpacity>
			</View>
		</View>
	);
}


function AddQuestionForm({ quizId, questionCount, onAdded, onCancel }) {
	const [qType,     setQType]     = useState('MCQ');
	const [qText,     setQText]     = useState('');
	const [maxScore,  setMaxScore]  = useState('1');
	const [options,   setOptions]   = useState([
		{ text: '', isCorrect: false },
		{ text: '', isCorrect: false },
	]);
	const [tfCorrect, setTfCorrect] = useState('TRUE');
	const [saving,    setSaving]    = useState(false);

	const isMCQ = qType === 'MCQ';
	const isTF  = qType === 'TRUE_FALSE';

	function handleTypeChange(type) {
		setQType(type);
	}

	function setOptionText(i, text) {
		setOptions((prev) => prev.map((o, idx) => (idx === i ? { ...o, text } : o)));
	}

	function setCorrect(i) {
		setOptions((prev) => prev.map((o, idx) => ({ ...o, isCorrect: idx === i })));
	}

	function addOption() {
		if (options.length >= 6) return;
		setOptions((prev) => [...prev, { text: '', isCorrect: false }]);
	}

	function removeOption(i) {
		if (options.length <= 2) return;
		setOptions((prev) => prev.filter((_, idx) => idx !== i));
	}

	async function handleSave() {
		if (!qText.trim()) {
			Alert.alert('Required', 'Please enter a question.');
			return;
		}
		const score = parseFloat(maxScore);
		if (isNaN(score) || score < 0) {
			Alert.alert('Invalid', 'Max score must be a non-negative number.');
			return;
		}

		let builtOptions;
		if (isMCQ) {
			const filled = options.filter((o) => o.text.trim());
			if (filled.length < 2) {
				Alert.alert('Required', 'Please enter at least 2 options.');
				return;
			}
			if (!filled.some((o) => o.isCorrect)) {
				Alert.alert('Required', 'Please mark the correct answer.');
				return;
			}
			builtOptions = filled.map((o, i) => ({ text: o.text.trim(), isCorrect: o.isCorrect, order: i }));
		} else if (isTF) {
			builtOptions = [
				{ text: 'True',  isCorrect: tfCorrect === 'TRUE',  order: 0 },
				{ text: 'False', isCorrect: tfCorrect === 'FALSE', order: 1 },
			];
		}

		const payload = {
			type: qType,
			text: qText.trim(),
			maxScore: score,
			order: questionCount,
			...(builtOptions ? { options: builtOptions } : {}),
		};

		setSaving(true);
		try {
			if (quizId) {
				const added = await quizzesApi.addQuestion(quizId, payload);
				onAdded(added);
			} else {
				onAdded({ ...payload, _local: true, id: `local_${Date.now()}` });
			}
		} catch (e) {
			Alert.alert('Error', e?.message ?? 'Could not add question.');
		} finally {
			setSaving(false);
		}
	}

	return (
		<View style={{
			backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 8,
			borderWidth: 1.5, borderColor: '#15803d',
		}}>
			<Text style={[T.h4, { color: '#111827', marginBottom: 12 }]}>New Question</Text>

			<Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 8 }]}>TYPE</Text>
			<View style={{ flexDirection: 'row', gap: 6, marginBottom: 14 }}>
				{Q_TYPES.map((t) => (
					<TouchableOpacity
						key={t.value}
						onPress={() => handleTypeChange(t.value)}
						style={{
							flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center',
							backgroundColor: qType === t.value ? t.bg : '#f9fafb',
							borderWidth: 1.5,
							borderColor: qType === t.value ? t.color : '#e5e7eb',
						}}
					>
						<Text style={[T.caption, {
							color: qType === t.value ? t.color : '#6b7280',
							fontWeight: qType === t.value ? '700' : '500',
						}]}>
							{t.label}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			<Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 6 }]}>QUESTION</Text>
			<TextInput
				value={qText}
				onChangeText={setQText}
				placeholder="Enter question text..."
				placeholderTextColor="#9ca3af"
				multiline
				textAlignVertical="top"
				style={{
					borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
					paddingHorizontal: 12, paddingVertical: 10,
					fontSize: 14, color: '#111827', minHeight: 72, lineHeight: 20,
					marginBottom: 14,
				}}
			/>

			<Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 6 }]}>MAX SCORE</Text>
			<TextInput
				value={maxScore}
				onChangeText={setMaxScore}
				keyboardType="numeric"
				style={{
					borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
					paddingHorizontal: 12, paddingVertical: 10,
					fontSize: 14, color: '#111827', width: 100, marginBottom: 14,
				}}
			/>

			{isMCQ && (
				<View style={{ marginBottom: 14 }}>
					<Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 8 }]}>OPTIONS</Text>
					{options.map((opt, i) => (
						<View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
							<TouchableOpacity
								onPress={() => setCorrect(i)}
								style={{
									width: 20, height: 20, borderRadius: 10,
									borderWidth: 2,
									borderColor: opt.isCorrect ? '#15803d' : '#d1d5db',
									backgroundColor: opt.isCorrect ? '#15803d' : '#fff',
									alignItems: 'center', justifyContent: 'center',
								}}
							>
								{opt.isCorrect && (
									<View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />
								)}
							</TouchableOpacity>
							<TextInput
								value={opt.text}
								onChangeText={(txt) => setOptionText(i, txt)}
								placeholder={`Option ${i + 1}`}
								placeholderTextColor="#9ca3af"
								style={{
									flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8,
									paddingHorizontal: 10, paddingVertical: 8,
									fontSize: 13, color: '#111827',
								}}
							/>
							{options.length > 2 && (
								<TouchableOpacity onPress={() => removeOption(i)}>
									<Ionicons name="close-circle" size={18} color="#9ca3af" />
								</TouchableOpacity>
							)}
						</View>
					))}
					{options.length < 6 && (
						<TouchableOpacity onPress={addOption} style={{ marginTop: 4 }}>
							<Text style={[T.caption, { color: '#15803d', fontWeight: '700' }]}>+ Add Option</Text>
						</TouchableOpacity>
					)}
				</View>
			)}

			{isTF && (
				<View style={{ marginBottom: 14 }}>
					<Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 8 }]}>CORRECT ANSWER</Text>
					<View style={{ flexDirection: 'row', gap: 10 }}>
						{[['TRUE', 'True'], ['FALSE', 'False']].map(([val, lbl]) => (
							<TouchableOpacity
								key={val}
								onPress={() => setTfCorrect(val)}
								style={{
									flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
									backgroundColor: tfCorrect === val ? '#dcfce7' : '#fff',
									borderWidth: 1.5,
									borderColor: tfCorrect === val ? '#16a34a' : '#e5e7eb',
								}}
							>
								<Text style={[T.label, {
									color: tfCorrect === val ? '#16a34a' : '#6b7280',
									fontWeight: '700',
								}]}>
									{lbl}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			)}

			<View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
				<TouchableOpacity
					onPress={onCancel}
					disabled={saving}
					style={{
						flex: 1, paddingVertical: 12, borderRadius: 10,
						borderWidth: 1.5, borderColor: '#e5e7eb', alignItems: 'center',
					}}
				>
					<Text style={[T.label, { color: '#374151' }]}>Cancel</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleSave}
					disabled={saving}
					style={{
						flex: 2, paddingVertical: 12, borderRadius: 10,
						backgroundColor: '#15803d', alignItems: 'center',
					}}
				>
					{saving
						? <ActivityIndicator color="#fff" size="small" />
						: <Text style={[T.label, { color: '#fff', fontWeight: '700' }]}>Add Question</Text>
					}
				</TouchableOpacity>
			</View>
		</View>
	);
}


export default function QuizEdit() {
	const navigation   = useNavigation();
	const { isOnline } = useNetworkStatus();
	const route        = useRoute();
	const { quizId, moduleId } = route.params ?? {};

	const isEditMode = !!quizId;

	const [loading,      setLoading]      = useState(isEditMode);
	const [saving,       setSaving]       = useState(false);
	const [title,        setTitle]        = useState('');
	const [passScorePct, setPassScorePct] = useState('70');
	const [timeLimit,    setTimeLimit]    = useState('');
	const [questions,    setQuestions]    = useState([]);
	const [showAddForm,  setShowAddForm]  = useState(false);

	useEffect(() => {
		if (!isEditMode) return;
		quizzesApi.getOne(quizId)
			.then((data) => {
				setTitle(data.title ?? '');
				setPassScorePct(String(data.passScorePct ?? 70));
				setTimeLimit(data.timeLimitMinutes ? String(data.timeLimitMinutes) : '');
				setQuestions(Array.isArray(data.questions) ? data.questions : []);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, [quizId, isEditMode]);

	async function handleSave() {
		if (!title.trim()) {
			Alert.alert('Required', 'Please enter a quiz title.');
			return;
		}
		const pct = parseInt(passScorePct, 10);
		if (isNaN(pct) || pct < 0 || pct > 100) {
			Alert.alert('Invalid', 'Pass score must be between 0 and 100.');
			return;
		}
		const timeLimitVal = timeLimit.trim() ? parseInt(timeLimit, 10) : null;
		if (timeLimit.trim() && (isNaN(timeLimitVal) || timeLimitVal < 1)) {
			Alert.alert('Invalid', 'Time limit must be a positive number of minutes.');
			return;
		}

		setSaving(true);
		try {
			if (isEditMode) {
				await quizzesApi.update(quizId, {
					title: title.trim(),
					passScorePct: pct,
					timeLimitMinutes: timeLimitVal,
				});
				Alert.alert('Saved', 'Quiz updated successfully.', [
					{ text: 'OK', onPress: () => navigation.goBack() },
				]);
			} else {
				const newQuiz = await quizzesApi.create({
					moduleId,
					title: title.trim(),
					passScorePct: pct,
					timeLimitMinutes: timeLimitVal,
				});
				for (let i = 0; i < questions.length; i++) {
					const { _local, id: _localId, ...qData } = questions[i];
					await quizzesApi.addQuestion(newQuiz.id, { ...qData, order: i });
				}
				Alert.alert('Created', 'Quiz created successfully.', [
					{ text: 'OK', onPress: () => navigation.goBack() },
				]);
			}
		} catch (e) {
			Alert.alert('Error', e?.message ?? 'Could not save quiz.');
		} finally {
			setSaving(false);
		}
	}

	async function handleDeleteQuestion(question) {
		if (question._local) {
			setQuestions((prev) => prev.filter((q) => q.id !== question.id));
			return;
		}
		await quizzesApi.removeQuestion(quizId, question.id);
		setQuestions((prev) => prev.filter((q) => q.id !== question.id));
	}

	function handleQuestionAdded(question) {
		setQuestions((prev) => [...prev, question]);
		setShowAddForm(false);
	}

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator size="large" color="#15803d" />
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			{/* Green header */}
			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 18, paddingHorizontal: 20,
				flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
			}}>
				<View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 14 }}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons name="arrow-back" size={22} color="#fff" />
					</TouchableOpacity>
					<View>
						<Text style={[T.h1, { color: '#fff' }]}>
							{isEditMode ? 'Edit Quiz' : 'New Quiz'}
						</Text>
						<Text style={[T.caption, { color: 'rgba(255,255,255,0.75)', marginTop: 2 }]}>
							{questions.length} question{questions.length !== 1 ? 's' : ''}
						</Text>
					</View>
				</View>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
				keyboardShouldPersistTaps="handled"
			>

				{/* Quiz settings card */}
				<View style={{
					backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20,
					shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
				}}>
					<Text style={[T.h4, { color: '#111827', marginBottom: 14 }]}>Quiz Settings</Text>

					<FieldLabel text="TITLE" />
					<TextInput
						value={title}
						onChangeText={setTitle}
						placeholder="Quiz title"
						placeholderTextColor="#9ca3af"
						style={{
							borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
							paddingHorizontal: 12, paddingVertical: 11,
							fontSize: 15, color: '#111827',
						}}
					/>

					<View style={{ flexDirection: 'row', gap: 12 }}>
						<View style={{ flex: 1 }}>
							<FieldLabel text="PASS SCORE (%)" />
							<TextInput
								value={passScorePct}
								onChangeText={setPassScorePct}
								keyboardType="numeric"
								placeholder="70"
								placeholderTextColor="#9ca3af"
								style={{
									borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
									paddingHorizontal: 12, paddingVertical: 11,
									fontSize: 15, color: '#111827',
								}}
							/>
						</View>
						<View style={{ flex: 1 }}>
							<FieldLabel text="TIME LIMIT (min)" />
							<TextInput
								value={timeLimit}
								onChangeText={setTimeLimit}
								keyboardType="numeric"
								placeholder="No limit"
								placeholderTextColor="#9ca3af"
								style={{
									borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
									paddingHorizontal: 12, paddingVertical: 11,
									fontSize: 15, color: '#111827',
								}}
							/>
						</View>
					</View>
				</View>

				{/* Questions section */}
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
					<Text style={[T.h4, { color: '#111827' }]}>
						Questions ({questions.length})
					</Text>
					{!showAddForm && (
						<TouchableOpacity
							onPress={() => setShowAddForm(true)}
							style={{
								flexDirection: 'row', alignItems: 'center', gap: 6,
								backgroundColor: '#15803d', borderRadius: 20,
								paddingHorizontal: 14, paddingVertical: 8,
							}}
						>
							<Ionicons name="add" size={16} color="#fff" />
							<Text style={[T.label, { color: '#fff' }]}>Add</Text>
						</TouchableOpacity>
					)}
				</View>

				{questions.length === 0 && !showAddForm && (
					<View style={{ alignItems: 'center', paddingVertical: 28 }}>
						<Ionicons name="help-circle-outline" size={36} color="#d1d5db" />
						<Text style={[T.caption, { color: '#9ca3af', marginTop: 8 }]}>No questions yet</Text>
					</View>
				)}

				{questions.map((q, i) => (
					<QuestionCard
						key={q.id}
						question={q}
						index={i}
						onDelete={handleDeleteQuestion}
					/>
				))}

				{showAddForm && (
					<AddQuestionForm
						quizId={isEditMode ? quizId : null}
						questionCount={questions.length}
						onAdded={handleQuestionAdded}
						onCancel={() => setShowAddForm(false)}
					/>
				)}

				{/* Save button */}
				<TouchableOpacity
					onPress={handleSave}
					disabled={saving}
					style={{
						backgroundColor: '#15803d', borderRadius: 14,
						paddingVertical: 16, alignItems: 'center',
						marginTop: 24,
					}}
				>
					{saving
						? <ActivityIndicator color="#fff" />
						: <Text style={[T.h4, { color: '#fff' }]}>
							{isEditMode ? 'Save Changes' : 'Create Quiz'}
						</Text>
					}
				</TouchableOpacity>

			</ScrollView>
		</View>
	);
}
