import React, { useState, useEffect, useCallback } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, TextInput,
	ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { quizAttemptsApi } from '../../api/quizAttempts';
import useNetworkStatus from '../../services/connectivityService';

const FILTERS = ['All', 'Pending', 'Graded'];

function formatDate(iso) {
	if (!iso) return '';
	return new Date(iso).toLocaleDateString('en-GB', {
		day: 'numeric', month: 'short', year: 'numeric',
	});
}

function SubmissionCard({ attempt, onOpen }) {
	const isPending = attempt.status === 'PENDING_REVIEW';
	const initial   = (attempt.guide?.username ?? 'G').charAt(0).toUpperCase();

	return (
		<View style={{
			backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
			shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
		}}>
			<View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
				<View style={{
					width: 46, height: 46, borderRadius: 23,
					backgroundColor: '#15803d', alignItems: 'center', justifyContent: 'center',
					marginRight: 12,
				}}>
					<Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>{initial}</Text>
				</View>

				<View style={{ flex: 1 }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
						<Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 8, lineHeight: 22 }}>
							{attempt.guide?.username ?? 'Guide'}
						</Text>
						<View style={{
							paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
							backgroundColor: isPending ? '#fef3c7' : '#dcfce7',
						}}>
							<Text style={{ fontSize: 12, fontWeight: '500', color: isPending ? '#d97706' : '#16a34a' }}>
								{isPending ? 'Pending' : 'Graded'}
							</Text>
						</View>
					</View>

					<Text style={{ fontSize: 14, color: '#374151', marginTop: 2 }}>
						{attempt.quiz?.title ?? 'Quiz'}
					</Text>

					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
							<Ionicons name="calendar-outline" size={13} color="#6b7280" />
							<Text style={{ fontSize: 12, color: '#6b7280' }}>
								{formatDate(attempt.submittedAt)}
							</Text>
						</View>
						{!isPending && attempt.totalScore != null && (
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
								<Ionicons name="checkmark" size={13} color="#16a34a" />
								<Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '600' }}>
									Score: {attempt.totalScore}
								</Text>
							</View>
						)}
					</View>
				</View>
			</View>

			{isPending ? (
				<TouchableOpacity
					onPress={onOpen}
					style={{
						backgroundColor: '#15803d', borderRadius: 12,
						paddingVertical: 13, alignItems: 'center',
					}}
				>
					<Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>Grade Submission</Text>
				</TouchableOpacity>
			) : (
				<TouchableOpacity
					onPress={onOpen}
					style={{
						borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12,
						paddingVertical: 13, alignItems: 'center',
					}}
				>
					<Text style={{ fontSize: 14, fontWeight: '500', color: '#374151' }}>View Grading</Text>
				</TouchableOpacity>
			)}
		</View>
	);
}

export default function QuizGrading() {
	const navigation = useNavigation();
	const { isOnline } = useNetworkStatus();
	const [attempts,   setAttempts]   = useState([]);
	const [loading,    setLoading]    = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [search,     setSearch]     = useState('');
	const [filter,     setFilter]     = useState('All');

	const load = useCallback(async () => {
		try {
			const data = await quizAttemptsApi.getAll({ limit: 100 });
			setAttempts(Array.isArray(data) ? data : []);
		} catch {
			setAttempts([]);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => { load(); }, [load]);

	const onRefresh = () => { setRefreshing(true); load(); };

	const pendingCount = attempts.filter((a) => a.status === 'PENDING_REVIEW').length;

	const filtered = attempts.filter((a) => {
		const matchSearch = !search.trim() ||
			(a.guide?.username ?? '').toLowerCase().includes(search.toLowerCase()) ||
			(a.quiz?.title ?? '').toLowerCase().includes(search.toLowerCase());
		const matchFilter =
			filter === 'All'     ? true :
			filter === 'Pending' ? a.status === 'PENDING_REVIEW' :
			                       a.status === 'GRADED';
		return matchSearch && matchFilter;
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
					justifyContent: 'space-between', marginBottom: 4,
				}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
						<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
							<Ionicons name="arrow-back" size={22} color="#fff" />
						</TouchableOpacity>
						<View>
							<Text style={{ fontSize: 30, fontWeight: '600', color: '#fff', lineHeight: 34 }}>
								Quiz Grading
							</Text>
							<Text style={{ fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
								{attempts.length} submissions
							</Text>
						</View>
					</View>
					<View style={{
						backgroundColor: '#16a34a', borderRadius: 20,
						paddingHorizontal: 22, paddingVertical: 6,
					}}>
						<Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>
							{pendingCount} pending
						</Text>
					</View>
				</View>

				<View style={{
					flexDirection: 'row', alignItems: 'center',
					backgroundColor: '#fff', borderRadius: 12,
					paddingHorizontal: 12, marginTop: 16, height: 46,
				}}>
					<Ionicons name="search" size={18} color="#15803d" style={{ marginRight: 8 }} />
					<TextInput
						value={search}
						onChangeText={setSearch}
						placeholder="Search by name..."
						placeholderTextColor="#9ca3af"
						style={{ flex: 1, fontSize: 14, fontWeight: '500', color: '#111827' }}
					/>
				</View>

				<View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
					{FILTERS.map((f) => {
						const active = filter === f;
						return (
							<TouchableOpacity
								key={f}
								onPress={() => setFilter(f)}
								style={{
									paddingHorizontal: 18, paddingVertical: 7, borderRadius: 20,
									backgroundColor: active ? '#fff' : 'transparent',
									borderWidth: active ? 0 : 1,
									borderColor: 'rgba(255,255,255,0.4)',
								}}
							>
								<Text style={{
									fontSize: 12, fontWeight: '600',
									color: active ? '#15803d' : 'rgba(255,255,255,0.9)',
								}}>
									{f}
								</Text>
							</TouchableOpacity>
						);
					})}
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
					refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#15803d" />}
				>
					{filtered.length === 0 ? (
						<View style={{ alignItems: 'center', marginTop: 48 }}>
							<Ionicons name="clipboard-outline" size={44} color="#d1d5db" />
							<Text style={{ fontSize: 14, fontWeight: '500', color: '#9ca3af', marginTop: 12 }}>
								No submissions found
							</Text>
						</View>
					) : (
						filtered.map((a) => (
							<SubmissionCard
								key={a.id}
								attempt={a}
								onOpen={() => navigation.navigate('GradeSubmission', { attemptId: a.id })}
							/>
						))
					)}
				</ScrollView>
			)}
		</View>
	);
}
