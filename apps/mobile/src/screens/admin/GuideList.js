import React, { useState, useEffect, useCallback } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, TextInput,
	ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usersApi } from '../../api/users';
import useNetworkStatus from '../../services/connectivityService';

const STATUS_CFG = {
	ACTIVE:    { color: '#16a34a', bg: '#dcfce7' },
	INACTIVE:  { color: '#9ca3af', bg: '#f3f4f6' },
	SUSPENDED: { color: '#dc2626', bg: '#fee2e2' },
};

function GuideCard({ user, onPress }) {
	const initial   = user.username.charAt(0).toUpperCase();
	const statusCfg = STATUS_CFG[user.status] ?? STATUS_CFG.INACTIVE;

	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.8}
			style={{
				backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 14,
				shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
			}}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
				<View style={{
					width: 48, height: 48, borderRadius: 24,
					backgroundColor: '#15803d', alignItems: 'center', justifyContent: 'center',
					marginRight: 12,
				}}>
					<Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>{initial}</Text>
				</View>
				<View style={{ flex: 1 }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
							{user.username}
						</Text>
						<View style={{
							paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8,
							backgroundColor: statusCfg.bg,
						}}>
							<Text style={{ fontSize: 11, fontWeight: '700', color: statusCfg.color }}>
								{user.status}
							</Text>
						</View>
					</View>
					<Text style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
						{user.email}
					</Text>
					{user.station && (
						<Text style={{ fontSize: 12, color: '#15803d', marginTop: 2 }}>
							{user.station.name}
						</Text>
					)}
				</View>
				<Ionicons name="arrow-forward" size={18} color="#9ca3af" style={{ marginLeft: 8 }} />
			</View>
		</TouchableOpacity>
	);
}

export default function GuideList({ standalone = false }) {
	const navigation             = useNavigation();
	const { isOnline }           = useNetworkStatus();
	const [guides,   setGuides]  = useState([]);
	const [loading,  setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [search,   setSearch]  = useState('');

	const load = useCallback(async () => {
		try {
			const data = await usersApi.getAll({ role: 'GUIDE', limit: 100 });
			setGuides(Array.isArray(data) ? data : []);
		} catch {
			setGuides([]);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => { load(); }, [load]);

	const onRefresh = () => { setRefreshing(true); load(); };

	const filtered = guides.filter((g) =>
		!search.trim() ||
		g.username.toLowerCase().includes(search.toLowerCase()) ||
		g.email.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			{standalone && (
				<View style={{
					backgroundColor: '#15803d',
					paddingTop: isOnline === false ? 12 : 52, paddingBottom: 18, paddingHorizontal: 20,
				}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 }}>
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Ionicons name="arrow-back" size={22} color="#fff" />
						</TouchableOpacity>
						<View>
							<Text style={{ fontSize: 24, fontWeight: '600', color: '#fff' }}>Guides List</Text>
							<Text style={{ fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
								{guides.length} park guides
							</Text>
						</View>
					</View>

					<View style={{
						flexDirection: 'row', alignItems: 'center', gap: 10,
						backgroundColor: '#fff', borderRadius: 12,
						paddingHorizontal: 14, paddingVertical: 12,
					}}>
						<Ionicons name="search" size={18} color="#15803d" />
						<TextInput
							style={{ flex: 1, fontSize: 14, color: '#374151', padding: 0 }}
							placeholder="Search guides..."
							placeholderTextColor="#9ca3af"
							value={search}
							onChangeText={setSearch}
						/>
					</View>
				</View>
			)}

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
						<View style={{ alignItems: 'center', marginTop: 40 }}>
							<Ionicons name="people-outline" size={44} color="#d1d5db" />
							<Text style={{ fontSize: 14, fontWeight: '500', color: '#9ca3af', marginTop: 12 }}>
								No guides found
							</Text>
						</View>
					) : (
						filtered.map((g) => (
							<GuideCard
								key={g.id}
								user={g}
								onPress={() => navigation.navigate('GuideDetails', { guideId: g.id })}
							/>
						))
					)}
				</ScrollView>
			)}
		</View>
	);
}
