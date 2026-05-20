import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { getQuizOutbox } from '../../database/db';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../services/AuthContext';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';
import { usersApi } from '../../api/users';
import { enrolmentsApi } from '../../api/enrolments';
import { certificationsApi } from '../../api/certifications';
import { badgesApi } from '../../api/badges';


function StatCard({ icon, iconColor, iconBg, value, label }) {
	return (
		<View style={{
			flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16,
			alignItems: 'center', marginHorizontal: 5,
			shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
		}}>
			<View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
				<Ionicons name={icon} size={20} color={iconColor} />
			</View>
			<Text style={{ fontFamily: FONTS.title, fontSize: 20, fontWeight: '600', color: '#111827' }}>{value}</Text>
			<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af', marginTop: 3, textAlign: 'center' }}>{label}</Text>
		</View>
	);
}

function InfoRow({ icon, label, value, isLast }) {
	return (
		<View>
			<View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 }}>
				<View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
					<Ionicons name={icon} size={18} color="#15803d" />
				</View>
				<View style={{ flex: 1 }}>
					<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af', letterSpacing: 0.4, marginBottom: 3 }}>{label}</Text>
					<Text style={{ fontFamily: FONTS.body, fontSize: 16, color: '#111827' }}>{value ?? '—'}</Text>
				</View>
			</View>
			{!isLast && <View style={{ height: 1, backgroundColor: '#f3f4f6', marginLeft: 66 }} />}
		</View>
	);
}

function PrefRow({ icon, label, isLast, onPress }) {
	return (
		<View>
			<TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 15 }}>
				<Ionicons name={icon} size={20} color="#6b7280" style={{ marginRight: 14 }} />
				<Text style={{ fontFamily: FONTS.label, fontSize: 15, flex: 1, color: '#111827' }}>{label}</Text>
				<Ionicons name="chevron-forward" size={16} color="#d1d5db" />
			</TouchableOpacity>
			{!isLast && <View style={{ height: 1, backgroundColor: '#f3f4f6', marginLeft: 50 }} />}
		</View>
	);
}


export default function GuideProfile() {
	const navigation   = useNavigation();
	const { isOnline } = useNetworkStatus();
	const { user, logout } = useAuth();

	const [profile,      setProfile]      = useState(null);
	const [loading,      setLoading]      = useState(true);
	const [enrolCount,   setEnrolCount]   = useState(0);
	const [certCount,    setCertCount]    = useState(0);
	const [badgeCount,   setBadgeCount]   = useState(0);
	const [showSignOut,  setShowSignOut]  = useState(false);

	useEffect(() => {
		if (!user?.id) { setLoading(false); return; }
		Promise.allSettled([
			usersApi.getOne(user.id),
			enrolmentsApi.getMyEnrolments({ limit: 1 }),
			certificationsApi.getMine(),
			badgesApi.getEarned(user.id),
		]).then(([profileRes, enrolRes, certRes, badgeRes]) => {
			if (profileRes.status === 'fulfilled') setProfile(profileRes.value);
			if (enrolRes.status   === 'fulfilled') setEnrolCount(Array.isArray(enrolRes.value) ? enrolRes.value.filter((e) => !!e.completedAt).length : 0);
			if (certRes.status    === 'fulfilled') setCertCount(Array.isArray(certRes.value) ? certRes.value.length : 0);
			if (badgeRes.status   === 'fulfilled') setBadgeCount(Array.isArray(badgeRes.value) ? badgeRes.value.length : 0);
		}).finally(() => setLoading(false));
	}, [user?.id]);

	const displayName = profile?.email?.split('@')[0] ?? user?.email?.split('@')[0] ?? 'Guide';
	const initials    = displayName.slice(0, 2).toUpperCase();
	const email       = profile?.email ?? user?.email ?? '';
	const fullName    = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || displayName;

	const STATS = [
		{ icon: 'checkmark-circle', iconColor: '#0891b2', iconBg: '#dbeafe', value: enrolCount,  label: 'Completed' },
		{ icon: 'ribbon',           iconColor: '#15803d', iconBg: '#dcfce7', value: certCount,   label: 'Certs'     },
		{ icon: 'medal',            iconColor: '#d97706', iconBg: '#fef3c7', value: badgeCount,  label: 'Badges'    },
	];

	// Intercept Sign Out tap: warn the guide if they have unsynced quiz attempts.
	// If the outbox is empty, proceed to the existing confirmation modal.
	const handleSignOutTap = async () => {
		const outbox = await getQuizOutbox();
		if (outbox.length > 0) {
			Alert.alert(
				'Unsynced Quiz Attempts',
				`You have ${outbox.length} quiz attempt${outbox.length !== 1 ? 's' : ''} that haven't been submitted yet. Connect to the internet and wait for sync before logging out, or your answers will be lost.`,
				[
					{ text: 'Stay Logged In', style: 'cancel' },
					{ text: 'Log Out Anyway', style: 'destructive', onPress: () => logout() },
				]
			);
			return;
		}
		setShowSignOut(true);
	};


	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

				<View style={{
					backgroundColor: '#15803d',
					paddingTop: isOnline === false ? 12 : 52, paddingBottom: 48, paddingHorizontal: 20,
					alignItems: 'center',
				}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 20 }}>
						<Text style={{ fontFamily: FONTS.title, fontSize: 28, fontWeight: '600', color: '#fff' }}>My Profile</Text>
					</View>

					<View style={{ position: 'relative', marginBottom: 14 }}>
						<View style={{
							width: 96, height: 96, borderRadius: 48, backgroundColor: '#86efac',
							alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff',
						}}>
							<Text style={{ fontFamily: FONTS.label, fontSize: 32, fontWeight: '700', color: '#15803d' }}>{initials}</Text>
						</View>
						<View style={{ position: 'absolute', bottom: 4, right: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: '#22c55e', borderWidth: 2, borderColor: '#fff' }} />
					</View>

					<Text style={{ fontFamily: FONTS.title, fontSize: 24, fontWeight: '600', color: '#fff', marginBottom: 4 }}>{fullName}</Text>
					<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{email}</Text>
				</View>

				<View style={{ flexDirection: 'row', marginHorizontal: 16, marginTop: -32, marginBottom: 8 }}>
					{STATS.map((s) => <StatCard key={s.label} {...s} />)}
				</View>

				{loading ? (
					<ActivityIndicator color="#15803d" style={{ marginTop: 32 }} />
				) : (
					<>
						<Text style={{ fontFamily: FONTS.title, fontSize: 20, fontWeight: '500', color: '#111827', marginHorizontal: 16, marginBottom: 10, marginTop: 24 }}>
							Account Info
						</Text>
						<View style={{
							backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
							marginHorizontal: 16, marginBottom: 24,
							shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
						}}>
							<InfoRow icon="person-outline" label="DISPLAY NAME" value={fullName}            isLast={false} />
							<InfoRow icon="mail-outline"   label="EMAIL"        value={email}               isLast={false} />
							<InfoRow icon="shield-outline" label="ROLE"         value={user?.role ?? 'GUIDE'} isLast={true} />
						</View>

						<View style={{
							backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
							marginHorizontal: 16, marginBottom: 24,
							shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
						}}>
							<TouchableOpacity
								onPress={() => navigation.navigate('Certification')}
								style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
							>
								<View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
									<Ionicons name="ribbon" size={22} color="#3b82f6" />
								</View>
								<View style={{ flex: 1 }}>
									<Text style={{ fontFamily: FONTS.label, fontSize: 16, fontWeight: '600', color: '#111827' }}>My Certifications</Text>
									<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af', marginTop: 3 }}>
										{certCount} certificate{certCount !== 1 ? 's' : ''} earned
									</Text>
								</View>
								<Ionicons name="chevron-forward" size={18} color="#d1d5db" />
							</TouchableOpacity>
						</View>

						<Text style={{ fontFamily: FONTS.title, fontSize: 20, fontWeight: '500', color: '#111827', marginHorizontal: 16, marginBottom: 10 }}>
							Settings
						</Text>
						<View style={{
							backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
							marginHorizontal: 16, marginBottom: 24,
							shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
						}}>
							<PrefRow icon="notifications-outline" label="Notification Settings" isLast={false} onPress={() => {}} />
							<PrefRow icon="help-circle-outline"   label="Help & Support"        isLast={true}  onPress={() => {}} />
						</View>
					</>
				)}

				<TouchableOpacity
					onPress={handleSignOutTap}
					style={{
						flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
						marginHorizontal: 16, borderWidth: 2, borderColor: '#dc2626', borderRadius: 14,
						paddingVertical: 16, backgroundColor: '#fff',
					}}
				>
					<Ionicons name="log-out-outline" size={20} color="#dc2626" />
					<Text style={{ fontFamily: FONTS.label, fontSize: 16, fontWeight: '600', color: '#dc2626' }}>Sign Out</Text>
				</TouchableOpacity>
			</ScrollView>

			<Modal visible={showSignOut} transparent animationType="fade" onRequestClose={() => setShowSignOut(false)}>
				<View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
					<View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 28, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 }}>
						<Text style={{ fontFamily: FONTS.label, fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 10 }}>Sign Out</Text>
						<Text style={{ fontFamily: FONTS.body, fontSize: 16, color: '#6b7280', marginBottom: 24, lineHeight: 22 }}>
							Are you sure you want to log out?
						</Text>
						<View style={{ flexDirection: 'row', gap: 12 }}>
							<TouchableOpacity
								onPress={() => setShowSignOut(false)}
								style={{ flex: 1, paddingVertical: 13, borderRadius: 10, borderWidth: 1.5, borderColor: '#e5e7eb', alignItems: 'center' }}
							>
								<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#374151' }}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => { setShowSignOut(false); logout(); }}
								style={{ flex: 1, paddingVertical: 13, borderRadius: 10, backgroundColor: '#dc2626', alignItems: 'center' }}
							>
								<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#fff' }}>Log Out</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

		</View>
	);
}
