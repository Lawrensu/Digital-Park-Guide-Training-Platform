import React, { useState, useEffect, useCallback } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, TextInput,
	ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { modulesApi } from '../../api/modules';
import useNetworkStatus from '../../services/connectivityService';

const STATUS_CFG = {
	PUBLISHED: { label: 'Published', color: '#16a34a', bg: '#dcfce7' },
	DRAFT:     { label: 'Draft',     color: '#d97706', bg: '#fef3c7' },
	ARCHIVED:  { label: 'Archived',  color: '#6b7280', bg: '#f3f4f6' },
};

function StatusBadge({ status }) {
	const cfg = STATUS_CFG[status] ?? STATUS_CFG.DRAFT;
	return (
		<View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: cfg.bg }}>
			<Text style={{ fontSize: 12, fontWeight: '500', color: cfg.color }}>{cfg.label}</Text>
		</View>
	);
}

function ModuleCard({ module }) {
	const navigation = useNavigation();
	const count      = module._count ?? {};

	return (
		<View style={{
			backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
			shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
		}}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
				<Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 10, lineHeight: 22 }}>
					{module.title}
				</Text>
				<StatusBadge status={module.status} />
			</View>

			{module.description ? (
				<Text style={{ fontSize: 14, color: '#6b7280', lineHeight: 20, marginBottom: 12 }}>
					{module.description}
				</Text>
			) : null}

			<View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
					<Ionicons name="albums" size={14} color="#7c3aed" />
					<Text style={{ fontSize: 12, color: '#374151' }}>
						{count.contentItems ?? 0} items
					</Text>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
					<Ionicons name="person-outline" size={14} color="#6b7280" />
					<Text style={{ fontSize: 12, color: '#374151' }}>
						{count.enrolments ?? 0} enrolled
					</Text>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
					<Ionicons name="help-circle-outline" size={14} color="#6b7280" />
					<Text style={{ fontSize: 12, color: '#374151' }}>
						{count.quizzes ?? 0} quizzes
					</Text>
				</View>
			</View>

			<View style={{ flexDirection: 'row', gap: 10 }}>
				<TouchableOpacity
					onPress={() => navigation.navigate('ModuleView', { moduleId: module.id })}
					style={{
						flex: 1, paddingVertical: 10, borderRadius: 10,
						borderWidth: 1.5, borderColor: '#e5e7eb', alignItems: 'center',
					}}
				>
					<Text style={{ fontSize: 14, fontWeight: '500', color: '#374151' }}>View</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => navigation.navigate('ModuleEdit', { moduleId: module.id })}
					style={{
						flex: 1, paddingVertical: 10, borderRadius: 10,
						backgroundColor: '#15803d', alignItems: 'center',
					}}
				>
					<Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>Edit</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

export default function ModuleList() {
	const navigation               = useNavigation();
	const { isOnline }             = useNetworkStatus();
	const [modules,   setModules]  = useState([]);
	const [loading,   setLoading]  = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [search,    setSearch]   = useState('');

	const load = useCallback(async () => {
		try {
			const data = await modulesApi.getAll({ limit: 100 });
			setModules(Array.isArray(data) ? data : []);
		} catch {
			setModules([]);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => { load(); }, [load]);

	const onRefresh = () => { setRefreshing(true); load(); };

	const filtered = modules.filter((m) =>
		!search.trim() || m.title.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			{/* Green header */}
			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52,
				paddingBottom: 20, paddingHorizontal: 20,
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
								Modules
							</Text>
							<Text style={{ fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
								{modules.length} modules total
							</Text>
						</View>
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
						placeholder="Search modules..."
						placeholderTextColor="#9ca3af"
						style={{ flex: 1, fontSize: 14, fontWeight: '500', color: '#111827' }}
					/>
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
					{filtered.map((m) => <ModuleCard key={m.id} module={m} />)}

					{filtered.length === 0 && (
						<View style={{ alignItems: 'center', marginTop: 40 }}>
							<Ionicons name="albums-outline" size={44} color="#d1d5db" />
							<Text style={{ fontSize: 14, fontWeight: '500', color: '#9ca3af', marginTop: 12 }}>
								No modules found
							</Text>
						</View>
					)}
				</ScrollView>
			)}
		</View>
	);
}
