import React, { useState, useEffect, useCallback } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, TextInput,
	ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { quizzesApi } from '../../api/quizzes';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';

const T = {
	h1:      { fontFamily: FONTS.label, fontSize: 30, fontWeight: '600' },
	h4:      { fontFamily: FONTS.label, fontSize: 16, fontWeight: '600' },
	label:   { fontFamily: FONTS.label, fontSize: 14, fontWeight: '500' },
	caption: { fontFamily: FONTS.label, fontSize: 12, fontWeight: '500' },
};

const STATUS_CFG = {
	PUBLISHED: { bg: '#dcfce7', color: '#15803d', label: 'Published' },
	DRAFT:     { bg: '#fef3c7', color: '#d97706', label: 'Draft'     },
};

function QuizCard({ quiz, onDelete }) {
	const navigation = useNavigation();
	const statusCfg  = STATUS_CFG[quiz.status] ?? STATUS_CFG.DRAFT;

	return (
		<View style={{
			backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
			shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
		}}>
			{/* Title + status */}
			<View style={{
				flexDirection: 'row', alignItems: 'flex-start',
				justifyContent: 'space-between', marginBottom: 6,
			}}>
				<Text style={[T.h4, { color: '#111827', flex: 1, lineHeight: 24, marginRight: 10 }]}>
					{quiz.title}
				</Text>
				<View style={{
					backgroundColor: statusCfg.bg, borderRadius: 6,
					paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start',
				}}>
					<Text style={[T.caption, { color: statusCfg.color, fontWeight: '700' }]}>
						{statusCfg.label}
					</Text>
				</View>
			</View>

			{/* Module name */}
			{quiz.module?.title ? (
				<Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 10 }}>
					{quiz.module.title}
				</Text>
			) : null}

			{/* Meta row */}
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
					<Ionicons name="document-text-outline" size={13} color="#9ca3af" />
					<Text style={[T.caption, { color: '#6b7280' }]}>
						{quiz._count?.questions ?? quiz.questions?.length ?? 0} questions
					</Text>
				</View>
				{quiz.passScorePct != null && (
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
						<Ionicons name="checkmark-circle-outline" size={13} color="#9ca3af" />
						<Text style={[T.caption, { color: '#6b7280' }]}>Pass: {quiz.passScorePct}%</Text>
					</View>
				)}
				{quiz.timeLimitMinutes && (
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
						<Ionicons name="time-outline" size={13} color="#9ca3af" />
						<Text style={[T.caption, { color: '#6b7280' }]}>{quiz.timeLimitMinutes}m</Text>
					</View>
				)}
			</View>

			{/* Buttons */}
			<View style={{ flexDirection: 'row', gap: 10 }}>
				<TouchableOpacity
					onPress={() => navigation.navigate('QuizEdit', { quizId: quiz.id, moduleId: quiz.moduleId })}
					style={{
						flex: 1, backgroundColor: '#15803d', borderRadius: 10,
						paddingVertical: 11, alignItems: 'center',
					}}
				>
					<Text style={[T.label, { color: '#fff', fontWeight: '700' }]}>Edit</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => onDelete(quiz)}
					style={{
						borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 10,
						paddingVertical: 11, paddingHorizontal: 16, alignItems: 'center',
					}}
				>
					<Ionicons name="trash-outline" size={18} color="#dc2626" />
				</TouchableOpacity>
			</View>
		</View>
	);
}

export default function QuizzesScreen() {
	const navigation             = useNavigation();
	const { isOnline }           = useNetworkStatus();
	const [quizzes,    setQuizzes]    = useState([]);
	const [loading,    setLoading]    = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [search,     setSearch]     = useState('');

	const load = useCallback(async () => {
		try {
			const data = await quizzesApi.getAll({ limit: 100 });
			setQuizzes(Array.isArray(data) ? data : []);
		} catch {
			setQuizzes([]);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => { load(); }, [load]);

	const onRefresh = () => { setRefreshing(true); load(); };

	function handleDelete(quiz) {
		Alert.alert(
			'Delete Quiz',
			`Delete "${quiz.title}"? This cannot be undone.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						try {
							await quizzesApi.remove(quiz.id);
							setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
						} catch (e) {
							Alert.alert('Error', e?.message ?? 'Could not delete quiz.');
						}
					},
				},
			]
		);
	}

	const filtered = quizzes.filter((q) => {
		if (!search.trim()) return true;
		const s = search.toLowerCase();
		return q.title.toLowerCase().includes(s) || (q.module?.title ?? '').toLowerCase().includes(s);
	});

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			{/* Green header */}
			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20,
			}}>
				<View style={{
					flexDirection: 'row', alignItems: 'center',
					justifyContent: 'space-between', marginBottom: 14,
				}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Ionicons name="arrow-back" size={22} color="#fff" />
						</TouchableOpacity>
						<View>
							<Text style={[T.h1, { color: '#fff', lineHeight: 34 }]}>Quizzes</Text>
							<Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
								{quizzes.length} total
							</Text>
						</View>
					</View>
				</View>

				<View style={{
					flexDirection: 'row', alignItems: 'center',
					backgroundColor: '#fff', borderRadius: 12,
					paddingHorizontal: 12, height: 46,
				}}>
					<Ionicons name="search" size={18} color="#15803d" style={{ marginRight: 8 }} />
					<TextInput
						value={search}
						onChangeText={setSearch}
						placeholder="Search quizzes..."
						placeholderTextColor="#9ca3af"
						style={{ flex: 1, fontSize: 14, fontWeight: '500', color: '#111827', padding: 0 }}
					/>
					{search.length > 0 && (
						<TouchableOpacity onPress={() => setSearch('')}>
							<Ionicons name="close-circle" size={18} color="#9ca3af" />
						</TouchableOpacity>
					)}
				</View>
			</View>

			{loading && !refreshing ? (
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<ActivityIndicator size="large" color="#15803d" />
				</View>
			) : (
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#15803d" />
					}
				>
					{filtered.length === 0 ? (
						<View style={{ alignItems: 'center', marginTop: 48 }}>
							<Ionicons name="clipboard-outline" size={44} color="#d1d5db" />
							<Text style={[T.label, { color: '#9ca3af', marginTop: 12 }]}>
								{search ? 'No results found' : 'No quizzes yet'}
							</Text>
						</View>
					) : (
						filtered.map((quiz) => (
							<QuizCard key={quiz.id} quiz={quiz} onDelete={handleDelete} />
						))
					)}
				</ScrollView>
			)}
		</View>
	);
}
