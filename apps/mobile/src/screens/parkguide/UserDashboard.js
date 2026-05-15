import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../services/AuthContext';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';
import { enrolmentsApi } from '../../api/enrolments';
import { notificationsApi } from '../../api/notifications';
import { certificationsApi } from '../../api/certifications';

const NOTIF_ICON = { book: '#15803d', ribbon: '#15803d', alarm: '#d97706', megaphone: '#7c3aed' };

function StatCard({ icon, iconBg, iconColor, value, label }) {
	return (
		<View style={{
			flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16,
			alignItems: 'center', marginHorizontal: 5,
			shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
		}}>
			<View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
				<Ionicons name={icon} size={20} color={iconColor} />
			</View>
			<Text style={{ fontFamily: FONTS.title, fontSize: 22, fontWeight: '600', color: '#111827' }}>{value}</Text>
			<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#6b7280', marginTop: 3, textAlign: 'center' }}>{label}</Text>
		</View>
	);
}

function CourseCard({ enrolment, onPress }) {
	const title = enrolment.module?.title ?? 'Module';
	const progress = enrolment.progressPct ?? 0;

	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{
			backgroundColor: '#fff', borderRadius: 16, marginBottom: 12,
			flexDirection: 'row', overflow: 'hidden',
			shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
		}}>
			<View style={{ width: 84, backgroundColor: '#14532d' }} />
			<View style={{ flex: 1, padding: 12, justifyContent: 'center' }}>
				<Text numberOfLines={1} style={{ fontFamily: FONTS.title, fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
					{title}
				</Text>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
					<View style={{ flex: 1, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
						<View style={{ width: `${progress}%`, height: '100%', backgroundColor: '#15803d', borderRadius: 2 }} />
					</View>
					<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#15803d', fontWeight: '700' }}>{progress}%</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

function NotifCard({ notif }) {
	const iconColor = NOTIF_ICON[notif.type?.toLowerCase()] ?? '#15803d';
	const title = notif.title ?? 'Notification';
	const body = notif.body ?? '';

	return (
		<View style={{
			backgroundColor: '#f0fdf4', borderRadius: 14, padding: 14, marginBottom: 10,
			shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
		}}>
			<View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
				<View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
					<Ionicons name="notifications-outline" size={18} color={iconColor} />
				</View>
				<View style={{ flex: 1 }}>
					<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#111827', fontWeight: '700', marginBottom: 4 }}>
						{title}
					</Text>
					<Text numberOfLines={2} style={{ fontFamily: FONTS.body, fontSize: 14, color: '#374151', lineHeight: 19 }}>
						{body}
					</Text>
				</View>
				{!notif.readAt && (
					<View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#15803d', marginTop: 4, marginLeft: 8 }} />
				)}
			</View>
		</View>
	);
}

export default function UserDashboard() {
	const navigation = useNavigation();
	const { user } = useAuth();
	const { isOnline } = useNetworkStatus();

	const [enrolments,     setEnrolments]     = useState([]);
	const [notifications,  setNotifications]  = useState([]);
	const [certCount,      setCertCount]      = useState(0);
	const [loading,        setLoading]        = useState(true);

	const displayName = user?.email?.split('@')[0] ?? 'Guide';
	const initials    = displayName.slice(0, 2).toUpperCase();

	const load = useCallback(async () => {
		try {
			const [enrolData, notifData, certData] = await Promise.all([
				enrolmentsApi.getMyEnrolments({ limit: 20 }),
				notificationsApi.getMine({ limit: 10 }),
				certificationsApi.getMine(),
			]);
			setEnrolments(Array.isArray(enrolData) ? enrolData : []);
			setNotifications(Array.isArray(notifData) ? notifData : []);
			setCertCount(Array.isArray(certData) ? certData.length : 0);
		} catch {
			// keep empty state on error
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => { load(); }, [load]);

	const inProgress  = enrolments.filter((e) => e.progressPct > 0 && !e.completedAt);
	const completed   = enrolments.filter((e) => !!e.completedAt);
	const unreadCount = notifications.filter((n) => !n.readAt).length;
	const recentNotifs = notifications.slice(0, 3);

	const totalModules    = enrolments.length;
	const completedCount  = completed.length;
	const overallPct      = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

	const STATS = [
		{ icon: 'book',             iconBg: '#dcfce7', iconColor: '#15803d', value: totalModules,   label: 'Enrolled'  },
		{ icon: 'checkmark-circle', iconBg: '#dbeafe', iconColor: '#0891b2', value: completedCount, label: 'Completed' },
		{ icon: 'ribbon',           iconBg: '#fef3c7', iconColor: '#d97706', value: certCount,      label: 'Certs'     },
	];

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

				<View style={{
					backgroundColor: '#15803d',
					paddingTop: isOnline === false ? 12 : 52, paddingBottom: 36, paddingHorizontal: 20,
				}}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
						<View>
							<Text style={{ fontFamily: FONTS.body, fontSize: 25, color: '#fff', marginBottom: 4 }}>
								Welcome back
							</Text>
							<Text style={{ fontFamily: FONTS.title, fontSize: 30, fontWeight: '600', color: '#fff' }}>
								{displayName}
							</Text>
						</View>

						<View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
							<TouchableOpacity onPress={() => navigation.getParent()?.navigate('Notifications')} activeOpacity={0.8} style={{ position: 'relative' }}>
								<View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
									<Ionicons name="notifications-outline" size={20} color="#fff" />
								</View>
								{unreadCount > 0 && (
									<View style={{
										position: 'absolute', top: -2, right: -2,
										width: 18, height: 18, borderRadius: 9, backgroundColor: '#ef4444',
										alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#15803d',
									}}>
										<Text style={{ fontFamily: FONTS.label, fontSize: 10, color: '#fff', fontWeight: '800' }}>
											{unreadCount > 9 ? '9+' : unreadCount}
										</Text>
									</View>
								)}
							</TouchableOpacity>

							<TouchableOpacity onPress={() => navigation.getParent()?.navigate('Profile')} activeOpacity={0.8} style={{
								width: 40, height: 40, borderRadius: 20, backgroundColor: '#86efac',
								alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
							}}>
								<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#15803d', fontWeight: '700' }}>{initials}</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 16, padding: 16 }}>
						<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.5, marginBottom: 6 }}>
							OVERALL TRAINING PROGRESS
						</Text>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
							<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#fff' }}>
								{completedCount} of {totalModules} modules completed
							</Text>
							<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#4ade80', fontWeight: '700' }}>{overallPct}%</Text>
						</View>
						<View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3, overflow: 'hidden' }}>
							<View style={{ width: `${overallPct}%`, height: '100%', backgroundColor: '#4ade80', borderRadius: 3 }} />
						</View>
					</View>
				</View>

				<View style={{ flexDirection: 'row', marginHorizontal: 16, marginTop: -24, marginBottom: 8 }}>
					{STATS.map((s) => <StatCard key={s.label} {...s} />)}
				</View>

				{loading ? (
					<ActivityIndicator color="#15803d" style={{ marginTop: 40 }} />
				) : (
					<>
						{inProgress.length > 0 && (
							<View style={{ paddingHorizontal: 16, marginTop: 20, marginBottom: 24 }}>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
									<Text style={{ fontFamily: FONTS.title, fontSize: 20, fontWeight: '500', color: '#111827' }}>Continue Learning</Text>
									<TouchableOpacity onPress={() => navigation.getParent()?.navigate('Modules')}>
										<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#15803d' }}>View All</Text>
									</TouchableOpacity>
								</View>
								{inProgress.slice(0, 2).map((e) => (
									<CourseCard
										key={e.id}
										enrolment={e}
										onPress={() => navigation.getParent()?.navigate('Modules')}
									/>
								))}
							</View>
						)}

						{recentNotifs.length > 0 && (
							<View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
								<Text style={{ fontFamily: FONTS.title, fontSize: 20, fontWeight: '500', color: '#111827', marginBottom: 14 }}>
									Recent Notifications
								</Text>
								{recentNotifs.map((n) => <NotifCard key={n.id} notif={n} />)}
							</View>
						)}

						{enrolments.length === 0 && (
							<View style={{ alignItems: 'center', marginTop: 40, paddingHorizontal: 32 }}>
								<Ionicons name="book-outline" size={48} color="#d1d5db" />
								<Text style={{ fontFamily: FONTS.title, fontSize: 16, color: '#9ca3af', marginTop: 12, textAlign: 'center' }}>
									No modules yet — enrol in a module to get started
								</Text>
								<TouchableOpacity
									onPress={() => navigation.getParent()?.navigate('Modules')}
									style={{ marginTop: 16, backgroundColor: '#15803d', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}
								>
									<Text style={{ fontFamily: FONTS.button, color: '#fff', fontWeight: '700' }}>Browse Modules</Text>
								</TouchableOpacity>
							</View>
						)}
					</>
				)}

			</ScrollView>
		</View>
	);
}
