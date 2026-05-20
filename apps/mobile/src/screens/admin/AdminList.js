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
	ACTIVE:   { color: '#15803d', bg: '#dcfce7' },
	INACTIVE: { color: '#9ca3af', bg: '#f3f4f6' },
};

function AdminCard({ admin }) {
	const initial   = admin.username.charAt(0).toUpperCase();
	const statusCfg = STATUS_CFG[admin.status] ?? STATUS_CFG.INACTIVE;
	const isActive  = admin.status === 'ACTIVE';

	return (
		<View style={{
			backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
			shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
		}}>
			<View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
				<View style={{
					width: 52, height: 52, borderRadius: 26,
					backgroundColor: '#15803d',
					alignItems: 'center', justifyContent: 'center', flexShrink: 0,
				}}>
					<Text style={{ fontSize: 18, fontWeight: '600', color: '#fff' }}>{initial}</Text>
				</View>

				<View style={{ flex: 1 }}>
					<View style={{
						flexDirection: 'row', alignItems: 'flex-start',
						justifyContent: 'space-between', marginBottom: 3,
					}}>
						<Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 8, lineHeight: 22 }}>
							{admin.username}
						</Text>
						<View style={{
							paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8,
							backgroundColor: statusCfg.bg,
						}}>
							<Text style={{ fontSize: 12, fontWeight: '700', color: statusCfg.color }}>
								{isActive ? 'Active' : admin.status}
							</Text>
						</View>
					</View>

					<Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
						{admin.email}
					</Text>

					{admin.station && (
						<Text style={{ fontSize: 12, color: '#15803d', marginBottom: 4 }}>
							{admin.station.name}
						</Text>
					)}

					<Text style={{ fontSize: 12, color: '#9ca3af' }}>
						Admin · ROLE
					</Text>
				</View>
			</View>
		</View>
	);
}

export default function AdminListScreen() {
	const navigation             = useNavigation();
	const { isOnline }           = useNetworkStatus();
	const [admins,   setAdmins]  = useState([]);
	const [loading,  setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [search,   setSearch]  = useState('');

	const load = useCallback(async () => {
		try {
			const data = await usersApi.getAll({ role: 'ADMIN', limit: 100 });
			setAdmins(Array.isArray(data) ? data : []);
		} catch {
			setAdmins([]);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => { load(); }, [load]);

	const onRefresh = () => { setRefreshing(true); load(); };

	const filtered = admins.filter((a) =>
		!search.trim() ||
		a.username.toLowerCase().includes(search.toLowerCase()) ||
		a.email.toLowerCase().includes(search.toLowerCase())
	);

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
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Ionicons name="arrow-back" size={22} color="#fff" />
						</TouchableOpacity>
						<View>
							<Text style={{ fontSize: 24, fontWeight: '600', color: '#fff' }}>Admin List</Text>
							<Text style={{ fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
								{admins.length} administrators
							</Text>
						</View>
					</View>

					<TouchableOpacity
						onPress={() => navigation.navigate('CreateAdmin')}
						style={{
							width: 40, height: 40, borderRadius: 20,
							backgroundColor: '#fff',
							alignItems: 'center', justifyContent: 'center',
						}}
					>
						<Ionicons name="add" size={24} color="#15803d" />
					</TouchableOpacity>
				</View>

				<View style={{
					flexDirection: 'row', alignItems: 'center', gap: 10,
					backgroundColor: '#fff', borderRadius: 12,
					paddingHorizontal: 14, paddingVertical: 12, marginTop: 14,
				}}>
					<Ionicons name="search" size={18} color="#15803d" />
					<TextInput
						style={{ flex: 1, fontSize: 14, color: '#374151', padding: 0 }}
						placeholder="Search admins..."
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
					{filtered.map((admin) => (
						<AdminCard key={admin.id} admin={admin} />
					))}

					{filtered.length === 0 && (
						<View style={{ alignItems: 'center', marginTop: 40 }}>
							<Ionicons name="search-outline" size={44} color="#d1d5db" />
							<Text style={{ fontSize: 14, fontWeight: '500', color: '#9ca3af', marginTop: 12 }}>
								No admins found
							</Text>
						</View>
					)}

					<TouchableOpacity
						onPress={() => navigation.navigate('CreateAdmin')}
						style={{
							borderWidth: 1.5, borderColor: '#15803d', borderStyle: 'dashed',
							borderRadius: 16, paddingVertical: 18,
							flexDirection: 'row', alignItems: 'center',
							justifyContent: 'center', gap: 8, marginTop: 4,
						}}
					>
						<Ionicons name="add" size={20} color="#15803d" />
						<Text style={{ fontSize: 14, fontWeight: '700', color: '#15803d' }}>Add New Admin</Text>
					</TouchableOpacity>
				</ScrollView>
			)}
		</View>
	);
}
