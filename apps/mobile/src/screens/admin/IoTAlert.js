import React, { useState, useEffect, useCallback } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { iotAlertsApi } from '../../api/iotAlerts';
import useNetworkStatus from '../../services/connectivityService';

const FILTERS = ['All', 'Pending', 'Confirmed', 'False'];

const STATUS_LABEL = {
	PENDING:         'PENDING REVIEW',
	CONFIRMED:       'CONFIRMED',
	FALSE_DETECTION: 'FALSE DETECTION',
};

const STATUS_STYLE = {
	PENDING:         { color: '#d97706', bg: '#fef3c7' },
	CONFIRMED:       { color: '#16a34a', bg: '#dcfce7' },
	FALSE_DETECTION: { color: '#0891b2', bg: '#e0f2fe' },
};

function formatTime(iso) {
	if (!iso) return '';
	const d = new Date(iso);
	return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function formatGroupLabel(iso) {
	if (!iso) return 'UNKNOWN';
	const d   = new Date(iso);
	const now = new Date();
	const diffMs   = now - d;
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	if (diffDays === 0) return 'TODAY';
	if (diffDays === 1) return 'YESTERDAY';
	return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase();
}

function AlertCard({ alert, onReview }) {
	const stat = STATUS_STYLE[alert.status] ?? STATUS_STYLE.PENDING;
	const borderColor = alert.status === 'CONFIRMED'
		? '#16a34a'
		: alert.status === 'FALSE_DETECTION'
			? '#0891b2'
			: '#d97706';

	return (
		<View style={{
			backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
			marginBottom: 12,
			shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
			flexDirection: 'row',
		}}>
			<View style={{ width: 4, backgroundColor: borderColor }} />

			<View style={{ flex: 1, padding: 16 }}>
				<View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
					<View style={{
						width: 38, height: 38, borderRadius: 19,
						backgroundColor: '#fef3c7',
						alignItems: 'center', justifyContent: 'center',
						marginRight: 10,
					}}>
						<Ionicons name="warning" size={20} color="#d97706" />
					</View>

					<View style={{ flex: 1 }}>
						<Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 5 }}>
							{alert.detectionType ?? 'Unknown Detection'}
						</Text>
						<View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
							<View style={{
								paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
								backgroundColor: stat.bg,
							}}>
								<Text style={{ fontSize: 12, fontWeight: '700', color: stat.color }}>
									{STATUS_LABEL[alert.status] ?? alert.status}
								</Text>
							</View>
							{alert.confidence != null && (
								<View style={{
									paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
									backgroundColor: '#f3f4f6',
								}}>
									<Text style={{ fontSize: 12, fontWeight: '700', color: '#374151' }}>
										{Math.round(Number(alert.confidence) * 100)}% conf
									</Text>
								</View>
							)}
						</View>
					</View>
				</View>

				<Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>
					{formatTime(alert.detectedAt)}
					{alert.device ? ` · ${alert.device.deviceIdentifier}` : ''}
					{alert.guide ? ` · ${alert.guide.username}` : ''}
				</Text>

				{alert.evidenceS3Key && (
					<View style={{
						flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12,
					}}>
						<Ionicons name="image-outline" size={14} color="#6b7280" />
						<Text style={{ fontSize: 12, color: '#6b7280' }}>Evidence image attached</Text>
					</View>
				)}

				<TouchableOpacity
					onPress={onReview}
					style={{
						borderWidth: 1.5, borderColor: borderColor, borderRadius: 10,
						paddingVertical: 10, alignItems: 'center',
					}}
				>
					<Text style={{ fontSize: 14, fontWeight: '500', color: borderColor }}>
						Review Evidence →
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

export default function IoTAlert() {
	const navigation           = useNavigation();
	const { isOnline }         = useNetworkStatus();
	const [alerts,   setAlerts] = useState([]);
	const [loading,  setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [filter,   setFilter] = useState('All');

	const load = useCallback(async () => {
		try {
			const data = await iotAlertsApi.getAll({ limit: 100 });
			setAlerts(Array.isArray(data) ? data : []);
		} catch {
			setAlerts([]);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => { load(); }, [load]);

	const onRefresh = () => { setRefreshing(true); load(); };

	const filtered = alerts.filter((a) => {
		if (filter === 'All')       return true;
		if (filter === 'Pending')   return a.status === 'PENDING';
		if (filter === 'Confirmed') return a.status === 'CONFIRMED';
		if (filter === 'False')     return a.status === 'FALSE_DETECTION';
		return true;
	});

	// group by date label
	const groups = {};
	filtered.forEach((a) => {
		const label = formatGroupLabel(a.detectedAt);
		if (!groups[label]) groups[label] = [];
		groups[label].push(a);
	});

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			{/* Green header */}
			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52,
				paddingBottom: 16, paddingHorizontal: 20,
			}}>
				<View style={{
					flexDirection: 'row', alignItems: 'center',
					justifyContent: 'space-between', marginBottom: 6,
				}}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
							<Ionicons name="arrow-back" size={22} color="#fff" />
						</TouchableOpacity>
						<Text style={{ fontSize: 30, fontWeight: '600', color: '#fff' }}>Live Alerts</Text>
					</View>
					<View style={{
						width: 28, height: 28, borderRadius: 14,
						backgroundColor: '#dc2626', alignItems: 'center', justifyContent: 'center',
					}}>
						<Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>
							{alerts.filter((a) => a.status === 'PENDING').length}
						</Text>
					</View>
				</View>

				<ScrollView
					horizontal showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ gap: 8, paddingRight: 4, marginTop: 8 }}
				>
					{FILTERS.map((f) => {
						const active = filter === f;
						return (
							<TouchableOpacity
								key={f}
								onPress={() => setFilter(f)}
								style={{
									paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
									backgroundColor: active ? '#fff' : 'rgba(0,0,0,0.25)',
								}}
							>
								<Text style={{
									fontSize: 12, fontWeight: '600',
									color: active ? '#15803d' : '#fff',
								}}>
									{f}
								</Text>
							</TouchableOpacity>
						);
					})}
				</ScrollView>
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
					{Object.keys(groups).length === 0 ? (
						<View style={{ alignItems: 'center', marginTop: 48 }}>
							<Ionicons name="warning-outline" size={44} color="#d1d5db" />
							<Text style={{ fontSize: 14, fontWeight: '500', color: '#9ca3af', marginTop: 12 }}>
								No alerts found
							</Text>
						</View>
					) : (
						Object.entries(groups).map(([label, groupAlerts]) => (
							<View key={label}>
								<Text style={{
									fontSize: 12, fontWeight: '500', color: '#9ca3af',
									letterSpacing: 0.8, marginBottom: 10, marginLeft: 2,
								}}>
									{label}
								</Text>
								{groupAlerts.map((a) => (
									<AlertCard
										key={a.id}
										alert={a}
										onReview={() => navigation.navigate('IoTDetails', { alertId: a.id })}
									/>
								))}
							</View>
						))
					)}
				</ScrollView>
			)}
		</View>
	);
}
