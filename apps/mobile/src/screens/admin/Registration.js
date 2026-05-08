import React, { useState, useEffect, useCallback } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, TextInput,
	ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { registrationsApi } from '../../api/registrations';
import useNetworkStatus from '../../services/connectivityService';

const STATUS = {
	PENDING:  { label: 'PENDING REVIEW', color: '#d97706', bg: '#fef3c7' },
	APPROVED: { label: 'APPROVED',       color: '#16a34a', bg: '#dcfce7' },
	REJECTED: { label: 'REJECTED',       color: '#dc2626', bg: '#fee2e2' },
};

const FILTERS = ['All', 'Pending', 'Approved', 'Rejected'];

function formatDate(iso) {
	if (!iso) return '';
	const d = new Date(iso);
	return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatusBadge({ status }) {
	const cfg = STATUS[status] ?? STATUS.PENDING;
	return (
		<View style={{
			paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
			backgroundColor: cfg.bg,
		}}>
			<Text style={{ fontSize: 12, fontWeight: '700', color: cfg.color, letterSpacing: 0.3 }}>
				{cfg.label}
			</Text>
		</View>
	);
}

function RegistrationCard({ reg }) {
	const navigation = useNavigation();
	const fullName   = `${reg.firstName} ${reg.lastName}`;
	const initial    = reg.firstName.charAt(0).toUpperCase();
	const isPending  = reg.status === 'PENDING';

	return (
		<View style={{
			backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
			shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
		}}>
			<View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 }}>
				<View style={{
					width: 46, height: 46, borderRadius: 23,
					backgroundColor: '#15803d', alignItems: 'center', justifyContent: 'center',
					marginRight: 12,
				}}>
					<Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>{initial}</Text>
				</View>

				<View style={{ flex: 1 }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
						<Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 8 }}>
							{fullName}
						</Text>
						<StatusBadge status={reg.status} />
					</View>
					<Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{reg.email}</Text>
					<Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>
						Applied: {formatDate(reg.submittedAt)}
					</Text>
					{reg.cvS3Key && (
						<Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '600', marginTop: 4 }}>
							CV Attached
						</Text>
					)}
				</View>
			</View>

			<TouchableOpacity
				onPress={() => navigation.navigate('RegistrationDetails', { regId: reg.id })}
				style={{
					borderRadius: 10, paddingVertical: 12,
					alignItems: 'center', justifyContent: 'center',
					flexDirection: 'row', gap: 6,
					backgroundColor: isPending ? '#15803d' : 'transparent',
					borderWidth: isPending ? 0 : 1.5,
					borderColor: isPending ? undefined : '#e5e7eb',
				}}
			>
				<Text style={{ fontSize: 14, fontWeight: '500', color: isPending ? '#fff' : '#374151' }}>
					View Details →
				</Text>
			</TouchableOpacity>
		</View>
	);
}

export default function RegistrationsScreen() {
	const { isOnline }          = useNetworkStatus();
	const [search,   setSearch] = useState('');
	const [filter,   setFilter] = useState('All');
	const [regs,     setRegs]   = useState([]);
	const [loading,  setLoading] = useState(true);
	const [error,    setError]   = useState(null);
	const [refreshing, setRefreshing] = useState(false);

	const load = useCallback(async () => {
		try {
			const data = await registrationsApi.getAll({ limit: 100 });
			setRegs(Array.isArray(data) ? data : []);
			setError(null);
		} catch (e) {
			setError('Failed to load registrations');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => { load(); }, [load]);

	const onRefresh = () => { setRefreshing(true); load(); };

	const pendingCount = regs.filter((r) => r.status === 'PENDING').length;

	const filtered = regs.filter((r) => {
		const fullName    = `${r.firstName} ${r.lastName}`.toLowerCase();
		const matchSearch = fullName.includes(search.toLowerCase()) ||
			r.email.toLowerCase().includes(search.toLowerCase());
		const matchFilter =
			filter === 'All'      ? true :
			filter === 'Pending'  ? r.status === 'PENDING'  :
			filter === 'Approved' ? r.status === 'APPROVED' :
			                        r.status === 'REJECTED';
		return matchSearch && matchFilter;
	});

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
					justifyContent: 'space-between', marginBottom: 14,
				}}>
					<Text style={{ fontSize: 30, fontWeight: '600', color: '#fff' }}>Registrations</Text>
					<View style={{
						backgroundColor: '#16a34a', borderRadius: 20,
						paddingHorizontal: 12, paddingVertical: 6,
					}}>
						<Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>
							{pendingCount} pending
						</Text>
					</View>
				</View>

				<View style={{
					flexDirection: 'row', alignItems: 'center',
					backgroundColor: '#fff', borderRadius: 12,
					paddingHorizontal: 12, marginBottom: 14, height: 46,
				}}>
					<Ionicons name="search" size={18} color="#15803d" style={{ marginRight: 8 }} />
					<TextInput
						value={search}
						onChangeText={setSearch}
						placeholder="Search applicants..."
						placeholderTextColor="#9ca3af"
						style={{ flex: 1, fontSize: 14, fontWeight: '500', color: '#111827' }}
					/>
				</View>

				<View style={{ flexDirection: 'row', gap: 8 }}>
					{FILTERS.map((f) => {
						const active = filter === f;
						return (
							<TouchableOpacity
								key={f}
								onPress={() => setFilter(f)}
								style={{
									paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
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
			) : error ? (
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
					<Ionicons name="alert-circle-outline" size={44} color="#dc2626" />
					<Text style={{ fontSize: 14, color: '#6b7280', marginTop: 12, textAlign: 'center' }}>
						{error}
					</Text>
					<TouchableOpacity
						onPress={load}
						style={{
							marginTop: 16, paddingHorizontal: 24, paddingVertical: 10,
							backgroundColor: '#15803d', borderRadius: 10,
						}}
					>
						<Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>Retry</Text>
					</TouchableOpacity>
				</View>
			) : (
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
					refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#15803d" />}
				>
					{filtered.length === 0 ? (
						<View style={{ alignItems: 'center', marginTop: 48 }}>
							<Ionicons name="person-add-outline" size={44} color="#d1d5db" />
							<Text style={{ fontSize: 14, fontWeight: '500', color: '#9ca3af', marginTop: 12 }}>
								No registrations found
							</Text>
						</View>
					) : (
						filtered.map((reg) => <RegistrationCard key={reg.id} reg={reg} />)
					)}
				</ScrollView>
			)}
		</View>
	);
}
