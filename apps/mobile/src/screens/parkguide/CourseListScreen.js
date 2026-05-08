import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';
import { modulesApi } from '../../api/modules';
import { enrolmentsApi } from '../../api/enrolments';

function CourseCard({ module, enrolment, onPress }) {
	const progress   = enrolment?.progressPct ?? 0;
	const isComplete = !!enrolment?.completedAt;
	const isStarted  = enrolment && progress > 0;

	const actionLabel  = isComplete ? 'Review' : isStarted ? 'Continue' : enrolment ? 'Start' : 'Enrol';
	const actionFilled = isStarted && !isComplete;

	return (
		<View style={{
			backgroundColor: '#fff', borderRadius: 18, marginBottom: 16, overflow: 'hidden',
			shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
		}}>
			<View style={{ height: 140, backgroundColor: '#14532d' }}>
				{isComplete && (
					<View style={{
						position: 'absolute', top: 14, right: 14,
						flexDirection: 'row', alignItems: 'center', gap: 5,
						backgroundColor: '#15803d', borderRadius: 20,
						paddingHorizontal: 12, paddingVertical: 6,
					}}>
						<Ionicons name="checkmark-circle" size={14} color="#fff" />
						<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#fff', fontWeight: '700', letterSpacing: 0.5 }}>
							COMPLETED
						</Text>
					</View>
				)}
			</View>

			<View style={{ padding: 16 }}>
				<Text style={{ fontFamily: FONTS.title, fontSize: 17, fontWeight: '600', color: '#111827', lineHeight: 24, marginBottom: 6 }}>
					{module.title}
				</Text>
				{module.description ? (
					<Text numberOfLines={2} style={{ fontFamily: FONTS.body, fontSize: 14, color: '#6b7280', lineHeight: 20, marginBottom: 12 }}>
						{module.description}
					</Text>
				) : null}

				{enrolment && (
					<View style={{ marginBottom: 14 }}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
							<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#6b7280' }}>Progress</Text>
							<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#15803d', fontWeight: '700' }}>{progress}%</Text>
						</View>
						<View style={{ height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
							<View style={{ height: '100%', borderRadius: 3, backgroundColor: '#15803d', width: `${progress}%` }} />
						</View>
					</View>
				)}

				<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
					<TouchableOpacity
						onPress={onPress}
						style={{
							paddingVertical: 10, paddingHorizontal: 24, borderRadius: 22,
							backgroundColor: actionFilled ? '#15803d' : 'transparent',
							borderWidth: 1.5, borderColor: '#15803d',
						}}
					>
						<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: actionFilled ? '#fff' : '#15803d', fontWeight: '600' }}>
							{actionLabel}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

export default function CourseListScreen() {
	const navigation      = useNavigation();
	const { isOnline }    = useNetworkStatus();
	const [search,        setSearch]        = useState('');
	const [modules,       setModules]       = useState([]);
	const [enrolments,    setEnrolments]    = useState([]);
	const [loading,       setLoading]       = useState(true);

	const load = useCallback(async () => {
		try {
			const [modData, enrolData] = await Promise.all([
				modulesApi.getAll({ status: 'PUBLISHED', limit: 100 }),
				enrolmentsApi.getMyEnrolments({ limit: 100 }),
			]);
			setModules(Array.isArray(modData) ? modData : []);
			setEnrolments(Array.isArray(enrolData) ? enrolData : []);
		} catch {
			// keep empty
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => { load(); }, [load]);

	const enrolmentByModule = enrolments.reduce((acc, e) => {
		acc[e.moduleId] = e;
		return acc;
	}, {});

	const filtered = modules.filter((m) => {
		const q = search.toLowerCase();
		return !q || m.title.toLowerCase().includes(q) || (m.description ?? '').toLowerCase().includes(q);
	});

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20,
			}}>
				<Text style={{ fontFamily: FONTS.title, fontSize: 30, fontWeight: '600', color: '#fff' }}>
					Training Modules
				</Text>
			</View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
				<View style={{
					flexDirection: 'row', alignItems: 'center', gap: 10,
					backgroundColor: '#fff', borderRadius: 12,
					paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14,
					shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
				}}>
					<Ionicons name="search-outline" size={18} color="#9ca3af" />
					<TextInput
						style={{ flex: 1, fontFamily: FONTS.body, fontSize: 14, color: '#374151', padding: 0 }}
						placeholder="Search modules..."
						placeholderTextColor="#9ca3af"
						value={search}
						onChangeText={setSearch}
					/>
					{search.length > 0 && (
						<TouchableOpacity onPress={() => setSearch('')}>
							<Ionicons name="close-circle" size={18} color="#9ca3af" />
						</TouchableOpacity>
					)}
				</View>

				{loading ? (
					<ActivityIndicator color="#15803d" style={{ marginTop: 40 }} />
				) : (
					<>
						<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#6b7280', marginBottom: 14 }}>
							{filtered.length} module{filtered.length !== 1 ? 's' : ''} found
						</Text>

						{filtered.map((module) => (
							<CourseCard
								key={module.id}
								module={module}
								enrolment={enrolmentByModule[module.id] ?? null}
								onPress={() => navigation.navigate('Lesson', { moduleId: module.id, moduleTitle: module.title })}
							/>
						))}

						{filtered.length === 0 && (
							<View style={{ alignItems: 'center', marginTop: 48 }}>
								<Ionicons name="search-outline" size={44} color="#d1d5db" />
								<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#9ca3af', marginTop: 12 }}>
									No modules found
								</Text>
							</View>
						)}
					</>
				)}
			</ScrollView>
		</View>
	);
}
