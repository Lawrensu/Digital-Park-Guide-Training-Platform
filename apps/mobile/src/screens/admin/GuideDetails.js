import React, { useState, useEffect } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usersApi } from '../../api/users';
import { enrolmentsApi } from '../../api/enrolments';
import { quizAttemptsApi } from '../../api/quizAttempts';
import { certificationsApi } from '../../api/certifications';
import useNetworkStatus from '../../services/connectivityService';

const STATUS_CFG = {
	ACTIVE:    { color: '#16a34a', border: '#16a34a' },
	INACTIVE:  { color: '#9ca3af', border: '#9ca3af' },
	SUSPENDED: { color: '#dc2626', border: '#dc2626' },
};

function formatDate(iso) {
	if (!iso) return '';
	return new Date(iso).toLocaleDateString('en-GB', {
		day: 'numeric', month: 'short', year: 'numeric',
	});
}

export default function GuideDetails() {
	const navigation   = useNavigation();
	const { isOnline } = useNetworkStatus();
	const route        = useRoute();
	const { guideId }  = route.params;

	const [user,        setUser]        = useState(null);
	const [enrolments,  setEnrolments]  = useState([]);
	const [attempts,    setAttempts]    = useState([]);
	const [certs,       setCerts]       = useState([]);
	const [loading,     setLoading]     = useState(true);
	const [statusLoading, setStatusLoading] = useState(false);

	useEffect(() => {
		async function load() {
			try {
				const [userData, enrData, attData, certData] = await Promise.allSettled([
					usersApi.getOne(guideId),
					enrolmentsApi.getAll({ guideId, limit: 50 }),
					quizAttemptsApi.getAll({ guideId, limit: 50 }),
					certificationsApi.getAll({ guideId, limit: 50 }),
				]);

				if (userData.status === 'fulfilled') setUser(userData.value);
				if (enrData.status === 'fulfilled') {
					setEnrolments(Array.isArray(enrData.value) ? enrData.value : []);
				}
				if (attData.status === 'fulfilled') {
					setAttempts(Array.isArray(attData.value) ? attData.value : []);
				}
				if (certData.status === 'fulfilled') {
					setCerts(Array.isArray(certData.value) ? certData.value : []);
				}
			} finally {
				setLoading(false);
			}
		}
		load();
	}, [guideId]);

	async function handleToggleStatus() {
		if (!user) return;
		const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
		const actionLabel = nextStatus === 'SUSPENDED' ? 'Suspend' : 'Reactivate';
		Alert.alert(
			`${actionLabel} Account`,
			`Are you sure you want to ${actionLabel.toLowerCase()} this account?`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: actionLabel,
					style: nextStatus === 'SUSPENDED' ? 'destructive' : 'default',
					onPress: async () => {
						setStatusLoading(true);
						try {
							const updated = await usersApi.updateStatus(guideId, nextStatus);
							setUser(updated);
						} catch {
							Alert.alert('Error', 'Could not update account status.');
						} finally {
							setStatusLoading(false);
						}
					},
				},
			]
		);
	}

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator size="large" color="#15803d" />
			</View>
		);
	}

	if (!user) {
		return (
			<View style={{ flex: 1, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
				<Ionicons name="alert-circle-outline" size={44} color="#dc2626" />
				<Text style={{ fontSize: 14, color: '#6b7280', marginTop: 12 }}>Could not load guide.</Text>
				<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
					<Text style={{ fontSize: 14, color: '#15803d', fontWeight: '600' }}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	const initial      = user.username.charAt(0).toUpperCase();
	const statusCfg    = STATUS_CFG[user.status] ?? STATUS_CFG.INACTIVE;
	const completedEnr = enrolments.filter((e) => e.progressPct === 100).length;
	const gradedAttempts = attempts.filter((a) => a.status === 'GRADED');

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			{/* Green header */}
			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 16,
				paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center',
			}}>
				<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
					<Ionicons name="arrow-back" size={22} color="#fff" />
				</TouchableOpacity>
				<Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>Guide Detail</Text>
			</View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>

				{/* Profile card */}
				<View style={{
					backgroundColor: '#fff', borderRadius: 16, padding: 20,
					alignItems: 'center', marginBottom: 12,
					shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
				}}>
					<View style={{
						width: 72, height: 72, borderRadius: 36,
						backgroundColor: '#15803d', alignItems: 'center', justifyContent: 'center',
						marginBottom: 14,
					}}>
						<Text style={{ fontSize: 30, fontWeight: '700', color: '#fff' }}>{initial}</Text>
					</View>
					<Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 4 }}>
						{user.username}
					</Text>
					<Text style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4 }}>{user.email}</Text>
					{user.station && (
						<Text style={{ fontSize: 13, color: '#15803d', marginBottom: 4 }}>
							{user.station.name}
						</Text>
					)}
					{user.startDate && (
						<Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>
							Started {formatDate(user.startDate)}
						</Text>
					)}
					<View style={{ flexDirection: 'row', gap: 10 }}>
						<View style={{
							paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20,
							borderWidth: 1.5, borderColor: statusCfg.border,
						}}>
							<Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 0.5, color: statusCfg.color }}>
								{user.status}
							</Text>
						</View>
					</View>
				</View>

				{/* Stats */}
				<View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
					{[
						{ label: 'Enrolled',   value: enrolments.length },
						{ label: 'Completed',  value: completedEnr },
						{ label: 'Certs',      value: certs.length },
					].map((s) => (
						<View key={s.label} style={{
							flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 16,
							alignItems: 'center',
							shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
							shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
						}}>
							<Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>{s.value}</Text>
							<Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{s.label}</Text>
						</View>
					))}
				</View>

				{/* Course Progress */}
				{enrolments.length > 0 && (
					<View style={{
						backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
						shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
					}}>
						<Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 }}>
							Course Progress
						</Text>
						{enrolments.slice(0, 5).map((e) => (
							<View key={e.id} style={{ marginBottom: 14 }}>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
									<Text style={{ fontSize: 13, color: '#374151', flex: 1, marginRight: 8 }}>
										{e.module?.title ?? 'Module'}
									</Text>
									<Text style={{ fontSize: 13, fontWeight: '700', color: '#16a34a' }}>
										{e.progressPct ?? 0}%
									</Text>
								</View>
								<View style={{ height: 7, backgroundColor: '#f3f4f6', borderRadius: 4 }}>
									<View style={{
										width: `${e.progressPct ?? 0}%`, height: 7,
										backgroundColor: '#16a34a', borderRadius: 4,
									}} />
								</View>
							</View>
						))}
					</View>
				)}

				{/* Quiz Results */}
				{gradedAttempts.length > 0 && (
					<View style={{
						backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
						shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
					}}>
						<Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 }}>
							Quiz Results
						</Text>
						{gradedAttempts.slice(0, 5).map((a, i) => (
							<View key={a.id} style={{
								flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
								borderTopWidth: i === 0 ? 0 : 1, borderTopColor: '#f3f4f6',
							}}>
								<View style={{ flex: 1 }}>
									<Text style={{ fontSize: 13, fontWeight: '600', color: '#111827' }}>
										{a.quiz?.title ?? 'Quiz'}
									</Text>
									<Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
										{formatDate(a.submittedAt)}
									</Text>
								</View>
								<Text style={{ fontSize: 13, fontWeight: '700', color: '#111827', minWidth: 36, textAlign: 'right' }}>
									{a.totalScore != null ? `${a.totalScore} pts` : '—'}
								</Text>
							</View>
						))}
					</View>
				)}

				{/* Certifications */}
				{certs.length > 0 && (
					<View style={{
						backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 20,
						shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
					}}>
						<Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 }}>
							Certifications
						</Text>
						{certs.map((cert, i) => (
							<View key={cert.id} style={{
								flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
								borderTopWidth: i === 0 ? 0 : 1, borderTopColor: '#f3f4f6',
							}}>
								<Ionicons name="ribbon" size={22} color="#f59e0b" style={{ marginRight: 12 }} />
								<View style={{ flex: 1 }}>
									<Text style={{ fontSize: 13, fontWeight: '600', color: '#15803d' }}>
										{cert.module?.title ?? 'Certification'}
									</Text>
									<Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
										Issued {formatDate(cert.issueDate)}
									</Text>
								</View>
							</View>
						))}
					</View>
				)}

				{/* Action buttons */}
				<View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
					{user.status !== 'INACTIVE' && (
						<TouchableOpacity
							onPress={handleToggleStatus}
							disabled={statusLoading}
							style={{
								flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
								borderWidth: 2,
								borderColor: user.status === 'ACTIVE' ? '#dc2626' : '#16a34a',
								borderRadius: 14, paddingVertical: 14, gap: 8,
							}}
						>
							{statusLoading ? (
								<ActivityIndicator color={user.status === 'ACTIVE' ? '#dc2626' : '#16a34a'} />
							) : (
								<>
									<Ionicons
										name={user.status === 'ACTIVE' ? 'warning-outline' : 'checkmark-circle-outline'}
										size={18}
										color={user.status === 'ACTIVE' ? '#dc2626' : '#16a34a'}
									/>
									<Text style={{
										fontSize: 14, fontWeight: '700',
										color: user.status === 'ACTIVE' ? '#dc2626' : '#16a34a',
									}}>
										{user.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate Account'}
									</Text>
								</>
							)}
						</TouchableOpacity>
					)}
				</View>

			</ScrollView>
		</View>
	);
}
