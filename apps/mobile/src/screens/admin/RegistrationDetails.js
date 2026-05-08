import React, { useState, useEffect } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, TextInput, Modal,
	ActivityIndicator, Linking, Alert, Platform, KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { registrationsApi } from '../../api/registrations';
import { stationsApi } from '../../api/stations';
import useNetworkStatus from '../../services/connectivityService';

const STATUS_STYLE = {
	PENDING:  { label: 'PENDING REVIEW', color: '#fff', bg: '#16a34a' },
	APPROVED: { label: 'APPROVED',       color: '#fff', bg: '#16a34a' },
	REJECTED: { label: 'REJECTED',       color: '#fff', bg: '#dc2626' },
};

function formatDate(iso) {
	if (!iso) return '';
	return new Date(iso).toLocaleDateString('en-GB', {
		day: 'numeric', month: 'short', year: 'numeric',
	});
}

function DetailRow({ icon, iconColor, iconBg, label, value, isLast }) {
	return (
		<View>
			<View style={{
				flexDirection: 'row', alignItems: 'center',
				paddingVertical: 14, paddingHorizontal: 16,
			}}>
				<View style={{
					width: 38, height: 38, borderRadius: 10,
					backgroundColor: iconBg,
					alignItems: 'center', justifyContent: 'center',
					marginRight: 14,
				}}>
					<Ionicons name={icon} size={18} color={iconColor} />
				</View>
				<View style={{ flex: 1 }}>
					<Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 3, letterSpacing: 0.4 }}>
						{label}
					</Text>
					<Text style={{ fontSize: 16, color: '#111827' }}>{value || '—'}</Text>
				</View>
			</View>
			{!isLast && <View style={{ height: 1, backgroundColor: '#f3f4f6', marginLeft: 68 }} />}
		</View>
	);
}

export default function RegistrationDetails() {
	const navigation        = useNavigation();
	const { isOnline }      = useNetworkStatus();
	const route             = useRoute();
	const { regId }         = route.params;

	const [reg,        setReg]        = useState(null);
	const [loading,    setLoading]    = useState(true);
	const [actionLoading, setActionLoading] = useState(false);

	const [rejectReason, setRejectReason] = useState('');

	// approval modal state
	const [showApproveModal, setShowApproveModal] = useState(false);
	const [stations,  setStations]   = useState([]);
	const [selectedStation, setSelectedStation] = useState(null);
	const [startDate, setStartDate]  = useState('');
	const [stationsLoading, setStationsLoading] = useState(false);

	useEffect(() => {
		registrationsApi.getOne(regId)
			.then((data) => { setReg(data); setLoading(false); })
			.catch(() => { setLoading(false); });
	}, [regId]);

	async function openApproveModal() {
		setShowApproveModal(true);
		setStationsLoading(true);
		try {
			const data = await stationsApi.getAll({ limit: 100 });
			setStations(Array.isArray(data) ? data : []);
		} catch {
			setStations([]);
		} finally {
			setStationsLoading(false);
		}
	}

	async function handleApprove() {
		if (!selectedStation) {
			Alert.alert('Required', 'Please select a station.');
			return;
		}
		if (!startDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
			Alert.alert('Required', 'Enter start date in YYYY-MM-DD format.');
			return;
		}
		setActionLoading(true);
		try {
			await registrationsApi.approve(regId, selectedStation.id, startDate);
			setReg((prev) => ({ ...prev, status: 'APPROVED' }));
			setShowApproveModal(false);
			Alert.alert('Approved', 'Registration approved. Activation email sent.');
		} catch (e) {
			Alert.alert('Error', e?.message ?? 'Could not approve registration.');
		} finally {
			setActionLoading(false);
		}
	}

	async function handleReject() {
		if (!rejectReason.trim()) {
			Alert.alert('Required', 'Please enter a rejection reason.');
			return;
		}
		setActionLoading(true);
		try {
			await registrationsApi.reject(regId, rejectReason.trim());
			setReg((prev) => ({ ...prev, status: 'REJECTED', rejectionReason: rejectReason.trim() }));
			Alert.alert('Rejected', 'Registration has been rejected.');
		} catch (e) {
			Alert.alert('Error', e?.message ?? 'Could not reject registration.');
		} finally {
			setActionLoading(false);
		}
	}

	async function handleDownloadCV() {
		try {
			const result = await registrationsApi.getCvUrl(regId);
			const url = result?.url ?? result;
			if (url) await Linking.openURL(url);
		} catch {
			Alert.alert('Error', 'Could not get CV download link.');
		}
	}

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator size="large" color="#15803d" />
			</View>
		);
	}

	if (!reg) {
		return (
			<View style={{ flex: 1, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
				<Ionicons name="alert-circle-outline" size={44} color="#dc2626" />
				<Text style={{ fontSize: 14, color: '#6b7280', marginTop: 12 }}>Could not load registration.</Text>
				<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
					<Text style={{ fontSize: 14, color: '#15803d', fontWeight: '600' }}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	const fullName     = `${reg.firstName} ${reg.lastName}`;
	const initial      = reg.firstName.charAt(0).toUpperCase();
	const statusStyle  = STATUS_STYLE[reg.status] ?? STATUS_STYLE.PENDING;
	const isPending    = reg.status === 'PENDING';

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			{/* Approve modal */}
			<Modal
				visible={showApproveModal}
				transparent
				animationType="slide"
				onRequestClose={() => setShowApproveModal(false)}
			>
				<KeyboardAvoidingView
					style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' }}
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				>
					<View style={{
						backgroundColor: '#fff',
						borderTopLeftRadius: 24, borderTopRightRadius: 24,
						padding: 24, paddingBottom: 36,
					}}>
						<Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 20 }}>
							Approve Registration
						</Text>

						<Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
							ASSIGN STATION
						</Text>
						{stationsLoading ? (
							<ActivityIndicator color="#15803d" style={{ marginBottom: 16 }} />
						) : stations.length === 0 ? (
							<Text style={{ fontSize: 14, color: '#9ca3af', marginBottom: 16 }}>
								No stations found
							</Text>
						) : (
							<ScrollView
								style={{ maxHeight: 150, marginBottom: 16 }}
								showsVerticalScrollIndicator={false}
							>
								{stations.map((s) => (
									<TouchableOpacity
										key={s.id}
										onPress={() => setSelectedStation(s)}
										style={{
											flexDirection: 'row', alignItems: 'center',
											paddingVertical: 10, paddingHorizontal: 14,
											borderRadius: 10, marginBottom: 6,
											backgroundColor: selectedStation?.id === s.id ? '#f0fdf4' : '#f9fafb',
											borderWidth: 1.5,
											borderColor: selectedStation?.id === s.id ? '#15803d' : '#e5e7eb',
										}}
									>
										<Text style={{
											fontSize: 14, fontWeight: '500',
											color: selectedStation?.id === s.id ? '#15803d' : '#374151',
										}}>
											{s.name}
										</Text>
									</TouchableOpacity>
								))}
							</ScrollView>
						)}

						<Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
							START DATE (YYYY-MM-DD)
						</Text>
						<TextInput
							value={startDate}
							onChangeText={setStartDate}
							placeholder="2026-01-15"
							placeholderTextColor="#9ca3af"
							style={{
								borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
								paddingHorizontal: 14, paddingVertical: 12,
								fontSize: 16, color: '#111827', marginBottom: 24,
							}}
						/>

						<View style={{ flexDirection: 'row', gap: 12 }}>
							<TouchableOpacity
								onPress={() => setShowApproveModal(false)}
								style={{
									flex: 1, paddingVertical: 14, borderRadius: 12,
									borderWidth: 1.5, borderColor: '#e5e7eb', alignItems: 'center',
								}}
							>
								<Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={handleApprove}
								disabled={actionLoading}
								style={{
									flex: 1, paddingVertical: 14, borderRadius: 12,
									backgroundColor: '#15803d', alignItems: 'center',
								}}
							>
								{actionLoading
									? <ActivityIndicator color="#fff" />
									: <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Confirm</Text>
								}
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
			</Modal>

			{/* Green header */}
			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52,
				paddingBottom: 20, paddingHorizontal: 20,
			}}>
				<View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
					<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 4, marginRight: 14 }}>
						<Ionicons name="arrow-back" size={22} color="#fff" />
					</TouchableOpacity>
					<View style={{ flex: 1 }}>
						<Text style={{ fontSize: 26, fontWeight: '600', color: '#fff' }}>
							Registration{'\n'}Detail
						</Text>
					</View>
					<View style={{
						backgroundColor: statusStyle.bg,
						borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginTop: 4,
					}}>
						<Text style={{ fontSize: 12, fontWeight: '700', color: statusStyle.color, letterSpacing: 0.4 }}>
							{statusStyle.label}
						</Text>
					</View>
				</View>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
			>
				{/* Profile card */}
				<View style={{
					backgroundColor: '#fff', borderRadius: 16, padding: 24,
					alignItems: 'center', marginBottom: 24,
					shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
				}}>
					<View style={{
						width: 80, height: 80, borderRadius: 40,
						backgroundColor: '#15803d',
						alignItems: 'center', justifyContent: 'center', marginBottom: 14,
					}}>
						<Text style={{ fontSize: 30, fontWeight: '700', color: '#fff' }}>{initial}</Text>
					</View>
					<Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 6 }}>
						{fullName}
					</Text>
					<Text style={{ fontSize: 12, color: '#9ca3af' }}>
						Applied {formatDate(reg.submittedAt)}
					</Text>
				</View>

				{/* Applicant Details */}
				<Text style={{ fontSize: 20, fontWeight: '500', color: '#111827', marginBottom: 12, marginLeft: 2 }}>
					Applicant Details
				</Text>
				<View style={{
					backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginBottom: 24,
					shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
				}}>
					<DetailRow
						icon="person" iconColor="#6b7280" iconBg="#f3f4f6"
						label="FULL NAME" value={fullName}
					/>
					<DetailRow
						icon="card" iconColor="#6366f1" iconBg="#eef2ff"
						label="NRIC / PASSPORT" value={reg.icPassportNumber}
					/>
					<DetailRow
						icon="mail" iconColor="#8b5cf6" iconBg="#f5f3ff"
						label="EMAIL" value={reg.email}
					/>
					<DetailRow
						icon="location" iconColor="#0891b2" iconBg="#e0f2fe"
						label="ADDRESS" value={reg.address} isLast
					/>
				</View>

				{/* Application Reason */}
				<Text style={{ fontSize: 20, fontWeight: '500', color: '#111827', marginBottom: 12, marginLeft: 2 }}>
					Application Reason
				</Text>
				<View style={{
					backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24,
					shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
				}}>
					<Text style={{ fontSize: 14, color: '#374151', lineHeight: 22 }}>{reg.reason}</Text>
				</View>

				{/* CV / Resume */}
				<Text style={{ fontSize: 20, fontWeight: '500', color: '#111827', marginBottom: 12, marginLeft: 2 }}>
					CV / Resume
				</Text>
				{reg.cvS3Key ? (
					<TouchableOpacity
						onPress={handleDownloadCV}
						activeOpacity={0.8}
						style={{
							backgroundColor: '#f0fdf4', borderRadius: 14, padding: 16,
							flexDirection: 'row', alignItems: 'center', marginBottom: 24,
							borderWidth: 1, borderColor: '#bbf7d0',
						}}
					>
						<View style={{
							width: 42, height: 42, borderRadius: 10,
							backgroundColor: '#e9d5ff',
							alignItems: 'center', justifyContent: 'center', marginRight: 14,
						}}>
							<Ionicons name="document-text" size={20} color="#7c3aed" />
						</View>
						<View style={{ flex: 1 }}>
							<Text style={{ fontSize: 14, fontWeight: '500', color: '#15803d' }}>
								CV_Resume.pdf
							</Text>
							<Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>
								Tap to download
							</Text>
						</View>
						<View style={{
							width: 36, height: 36, borderRadius: 10,
							backgroundColor: '#3b82f6',
							alignItems: 'center', justifyContent: 'center',
						}}>
							<Ionicons name="download" size={18} color="#fff" />
						</View>
					</TouchableOpacity>
				) : (
					<View style={{
						backgroundColor: '#fff', borderRadius: 14, padding: 20,
						alignItems: 'center', marginBottom: 24,
						borderWidth: 1, borderColor: '#f3f4f6',
					}}>
						<Ionicons name="document-outline" size={32} color="#d1d5db" />
						<Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>No CV attached</Text>
					</View>
				)}

				{/* Rejection reason (only for pending) */}
				{isPending && (
					<>
						<Text style={{ fontSize: 20, fontWeight: '500', color: '#111827', marginBottom: 12, marginLeft: 2 }}>
							Reject reason
						</Text>
						<TextInput
							value={rejectReason}
							onChangeText={setRejectReason}
							placeholder="Add reject reason..."
							placeholderTextColor="#9ca3af"
							multiline
							numberOfLines={4}
							textAlignVertical="top"
							style={{
								backgroundColor: '#fff',
								borderRadius: 14, borderWidth: 1, borderColor: '#e5e7eb',
								padding: 16, minHeight: 110,
								fontSize: 16, color: '#111827', lineHeight: 22,
								marginBottom: 28,
							}}
						/>
					</>
				)}

				{/* Existing rejection reason display */}
				{reg.status === 'REJECTED' && reg.rejectionReason && (
					<>
						<Text style={{ fontSize: 20, fontWeight: '500', color: '#111827', marginBottom: 12, marginLeft: 2 }}>
							Rejection Reason
						</Text>
						<View style={{
							backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 24,
							borderWidth: 1, borderColor: '#fee2e2',
						}}>
							<Text style={{ fontSize: 14, color: '#dc2626', lineHeight: 22 }}>
								{reg.rejectionReason}
							</Text>
						</View>
					</>
				)}

				{/* Action buttons (only for pending) */}
				{isPending && (
					<>
						<TouchableOpacity
							onPress={openApproveModal}
							disabled={actionLoading}
							activeOpacity={0.85}
							style={{
								backgroundColor: '#15803d', borderRadius: 14, paddingVertical: 16,
								flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
								gap: 8, marginBottom: 12,
							}}
						>
							{actionLoading
								? <ActivityIndicator color="#fff" />
								: (
									<>
										<Ionicons name="checkmark" size={18} color="#fff" />
										<Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
											Approve &amp; Send Credentials
										</Text>
									</>
								)
							}
						</TouchableOpacity>

						<TouchableOpacity
							onPress={handleReject}
							disabled={actionLoading}
							activeOpacity={0.85}
							style={{
								backgroundColor: '#fff', borderRadius: 14, paddingVertical: 16,
								flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
								gap: 8, borderWidth: 1.5, borderColor: '#dc2626',
							}}
						>
							<Ionicons name="close" size={18} color="#dc2626" />
							<Text style={{ fontSize: 16, fontWeight: '600', color: '#dc2626' }}>
								Reject Application
							</Text>
						</TouchableOpacity>
					</>
				)}
			</ScrollView>
		</View>
	);
}
