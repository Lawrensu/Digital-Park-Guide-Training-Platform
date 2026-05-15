import React, { useState, useEffect } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { iotAlertsApi } from '../../api/iotAlerts';
import useNetworkStatus from '../../services/connectivityService';

const BG      = '#0d1117';
const CARD_BG = '#1c2333';
const DIVIDER = '#263040';

function InfoRow({ icon, iconColor, label, value, isLast }) {
	return (
		<View>
			<View style={{
				flexDirection: 'row', alignItems: 'center',
				paddingVertical: 14, paddingHorizontal: 16,
			}}>
				<View style={{
					width: 36, height: 36, borderRadius: 18,
					backgroundColor: '#263040',
					alignItems: 'center', justifyContent: 'center', marginRight: 14,
				}}>
					<Ionicons name={icon} size={18} color={iconColor} />
				</View>
				<View style={{ flex: 1 }}>
					<Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 3 }}>{label}</Text>
					<Text style={{ fontSize: 16, fontWeight: '600', color: '#d1d5db' }}>{value}</Text>
				</View>
			</View>
			{!isLast && <View style={{ height: 1, backgroundColor: DIVIDER, marginLeft: 66 }} />}
		</View>
	);
}

export default function IoTDetails() {
	const navigation   = useNavigation();
	const { isOnline } = useNetworkStatus();
	const route        = useRoute();
	const { alertId }  = route.params;

	const [alert,          setAlert]          = useState(null);
	const [evidenceUrl,    setEvidenceUrl]    = useState(null);
	const [evidenceError,  setEvidenceError]  = useState(false);
	const [loading,        setLoading]        = useState(true);
	const [flagLoading,    setFlagLoading]    = useState(false);
	const [decision,       setDecision]       = useState(null);

	useEffect(() => {
		async function load() {
			try {
				const data = await iotAlertsApi.getOne(alertId);
				setAlert(data);

				if (data.evidenceS3Key) {
					try {
						const result = await iotAlertsApi.getEvidenceUrl(alertId);
						setEvidenceUrl(result?.url ?? null);
					} catch {
						setEvidenceError(true);
					}
				}
			} catch {
				// failed to load
			} finally {
				setLoading(false);
			}
		}
		load();
	}, [alertId]);

	async function handleFlag(status) {
		const label = status === 'CONFIRMED' ? 'Confirm Violation' : 'Mark as False Detection';
		Alert.alert(
			label,
			`Are you sure you want to ${label.toLowerCase()}?`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Confirm',
					style: status === 'CONFIRMED' ? 'destructive' : 'default',
					onPress: async () => {
						setFlagLoading(true);
						try {
							const updated = await iotAlertsApi.flag(alertId, status);
							setAlert(updated);
							setDecision(status);
						} catch (e) {
							Alert.alert('Error', e?.message ?? 'Could not update alert status.');
						} finally {
							setFlagLoading(false);
						}
					},
				},
			]
		);
	}

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator size="large" color="#15803d" />
			</View>
		);
	}

	if (!alert) {
		return (
			<View style={{ flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
				<Ionicons name="alert-circle-outline" size={44} color="#dc2626" />
				<Text style={{ fontSize: 14, color: '#6b7280', marginTop: 12 }}>Could not load alert.</Text>
				<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
					<Text style={{ fontSize: 14, color: '#15803d', fontWeight: '600' }}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	const isReviewed = alert.status !== 'PENDING';
	const confidence = alert.confidence != null
		? `${Math.round(Number(alert.confidence) * 100)}%`
		: 'N/A';

	const infoRows = [
		{
			icon: 'warning', iconColor: '#d97706',
			label: 'Detection Type', value: alert.detectionType ?? 'Unknown',
		},
		{
			icon: 'time', iconColor: '#9ca3af',
			label: 'Detected At',
			value: new Date(alert.detectedAt).toLocaleString('en-GB', {
				day: 'numeric', month: 'short', year: 'numeric',
				hour: '2-digit', minute: '2-digit',
			}),
		},
		{
			icon: 'radio', iconColor: '#60a5fa',
			label: 'Device', value: alert.device?.deviceIdentifier ?? 'Unknown',
		},
		{
			icon: 'person', iconColor: '#34d399',
			label: 'Assigned Guide', value: alert.guide?.username ?? '—',
		},
		{
			icon: 'analytics', iconColor: '#a78bfa',
			label: 'AI Confidence', value: confidence,
		},
	];

	return (
		<View style={{ flex: 1, backgroundColor: BG }}>

			{/* Dark header */}
			<View style={{
				backgroundColor: BG,
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 16, paddingHorizontal: 20,
				borderBottomWidth: 1, borderBottomColor: DIVIDER,
			}}>
				<View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
					<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 4 }}>
						<Ionicons name="arrow-back" size={22} color="#fff" />
					</TouchableOpacity>
					<View style={{ flex: 1, marginHorizontal: 14 }}>
						<Text style={{ fontSize: 24, fontWeight: '600', color: '#fff' }}>Evidence Review</Text>
						<Text style={{ fontSize: 12, fontWeight: '500', color: '#4ade80', marginTop: 3 }}>
							{alert.detectionType ?? 'Unknown Detection'}
						</Text>
					</View>
					<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 4 }}>
						<Ionicons name="close" size={22} color="#9ca3af" />
					</TouchableOpacity>
				</View>
			</View>

			{/* Evidence image or placeholder */}
			<View style={{
				height: 200, backgroundColor: CARD_BG,
				alignItems: 'center', justifyContent: 'center',
			}}>
				{evidenceUrl ? (
					<Image
						source={{ uri: evidenceUrl }}
						style={{ width: '100%', height: 200 }}
						resizeMode="contain"
					/>
				) : (
					<>
						<Ionicons name="camera" size={56} color="#4b5563" />
						<Text style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
							{alert.evidenceS3Key && !evidenceError ? 'Loading evidence...' : evidenceError ? 'Evidence unavailable' : 'No evidence image'}
						</Text>
					</>
				)}
			</View>

			{/* Status bar */}
			<View style={{
				flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
				backgroundColor: BG, paddingHorizontal: 16, paddingVertical: 10,
			}}>
				<Text style={{ fontSize: 12, fontWeight: '600', color: '#e5e7eb' }}>
					{alert.detectionType ?? 'Detection'}
				</Text>
				<View style={{
					backgroundColor:
						alert.status === 'CONFIRMED'       ? '#16a34a' :
						alert.status === 'FALSE_DETECTION' ? '#0891b2' :
						'#dc2626',
					borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4,
				}}>
					<Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>
						{alert.status === 'PENDING' ? `${confidence} confidence` :
						 alert.status === 'CONFIRMED' ? 'CONFIRMED' : 'FALSE DETECTION'}
					</Text>
				</View>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: CARD_BG }}
				contentContainerStyle={{ paddingBottom: 40 }}
			>
				{/* Info card */}
				<View style={{
					backgroundColor: '#263040', borderRadius: 16, overflow: 'hidden',
					marginHorizontal: 16, marginTop: 16, marginBottom: 16,
				}}>
					{infoRows.map((row, i) => (
						<InfoRow
							key={row.label}
							{...row}
							isLast={i === infoRows.length - 1}
						/>
					))}
				</View>

				{/* YOUR DECISION */}
				{!isReviewed && (
					<>
						<Text style={{
							fontSize: 12, fontWeight: '500', color: '#6b7280',
							letterSpacing: 0.8, marginBottom: 14, paddingHorizontal: 16,
						}}>
							YOUR DECISION
						</Text>

						<TouchableOpacity
							onPress={() => handleFlag('CONFIRMED')}
							disabled={flagLoading}
							activeOpacity={0.85}
							style={{
								backgroundColor: decision === 'CONFIRMED' ? '#b91c1c' : '#dc2626',
								borderRadius: 14, paddingVertical: 18,
								alignItems: 'center', justifyContent: 'center',
								marginBottom: 12, marginHorizontal: 16,
							}}
						>
							{flagLoading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<>
									<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
										<Ionicons name="warning" size={18} color="#fff" />
										<Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
											Confirm Violation
										</Text>
									</View>
									<Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
										Flag as genuine — notify authorities
									</Text>
								</>
							)}
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => handleFlag('FALSE_DETECTION')}
							disabled={flagLoading}
							activeOpacity={0.85}
							style={{
								backgroundColor: decision === 'FALSE_DETECTION' ? '#374151' : '#1f2937',
								borderRadius: 14, paddingVertical: 18,
								alignItems: 'center', justifyContent: 'center',
								borderWidth: 1, borderColor: '#374151',
								marginHorizontal: 16,
							}}
						>
							{flagLoading ? (
								<ActivityIndicator color="#d1d5db" />
							) : (
								<>
									<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
										<Ionicons name="checkmark" size={18} color="#d1d5db" />
										<Text style={{ fontSize: 16, fontWeight: '600', color: '#9ca3af' }}>
											Mark as False Detection
										</Text>
									</View>
									<Text style={{ fontSize: 12, color: '#6b7280' }}>
										Improve model accuracy
									</Text>
								</>
							)}
						</TouchableOpacity>
					</>
				)}

				{/* Already reviewed message */}
				{isReviewed && (
					<View style={{
						marginHorizontal: 16, marginTop: 8, padding: 16,
						backgroundColor: '#263040', borderRadius: 14, alignItems: 'center',
					}}>
						<Ionicons
							name={alert.status === 'CONFIRMED' ? 'warning' : 'checkmark-circle'}
							size={32}
							color={alert.status === 'CONFIRMED' ? '#dc2626' : '#0891b2'}
						/>
						<Text style={{ fontSize: 14, fontWeight: '600', color: '#d1d5db', marginTop: 8 }}>
							{alert.status === 'CONFIRMED'
								? 'Confirmed as violation'
								: 'Marked as false detection'}
						</Text>
						{alert.flagger && (
							<Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
								Reviewed by {alert.flagger.username}
							</Text>
						)}
					</View>
				)}
			</ScrollView>
		</View>
	);
}
