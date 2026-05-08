import React, { useState, useEffect, useCallback } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, Modal, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../services/AuthContext';
import { usersApi } from '../../api/users';
import { modulesApi } from '../../api/modules';
import { quizAttemptsApi } from '../../api/quizAttempts';
import { registrationsApi } from '../../api/registrations';
import GuideList from './GuideList';
import useNetworkStatus from '../../services/connectivityService';

// Static enrollment breakdown — no aggregation endpoint exists in the API
const ENROLLMENT_CATEGORIES = [
	{ label: 'Biodiversity',  count: 89, color: '#16a34a' },
	{ label: 'Conservation',  count: 67, color: '#0891b2' },
	{ label: 'Eco-tourism',   count: 54, color: '#d97706' },
	{ label: 'Legislation',   count: 32, color: '#7c3aed' },
	{ label: 'Safety',        count: 45, color: '#dc2626' },
];

const MAX_ENROLLMENT = Math.max(...ENROLLMENT_CATEGORIES.map((c) => c.count));

function StatCard({ icon, label, value, subtitle, subtitleColor, iconBg, iconColor, loading, onPress }) {
	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={onPress ? 0.75 : 1}
			style={{
				flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14,
				shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, margin: 5,
			}}
		>
			<View style={{
				width: 38, height: 38, borderRadius: 19,
				backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center', marginBottom: 8,
			}}>
				<Ionicons name={icon} size={18} color={iconColor} />
			</View>
			{loading ? (
				<ActivityIndicator size="small" color="#15803d" style={{ height: 32, alignSelf: 'flex-start' }} />
			) : (
				<Text style={{ fontSize: 24, fontWeight: '800', color: '#111827' }}>{value}</Text>
			)}
			<Text style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{label}</Text>
			<Text style={{ fontSize: 10, color: subtitleColor, fontWeight: '600', marginTop: 3 }}>{subtitle}</Text>
		</TouchableOpacity>
	);
}

export default function AdminDashboard() {
	const { user, logout } = useAuth();
	const navigation       = useNavigation();
	const { isOnline }     = useNetworkStatus();

	const [activeTab,       setActiveTab]       = useState('overview');
	const [showLogoutModal, setShowLogoutModal] = useState(false);

	// Real stats
	const [statsLoading,    setStatsLoading]    = useState(true);
	const [guideCount,      setGuideCount]      = useState(null);
	const [moduleCount,     setModuleCount]     = useState(null);
	const [pendingReviews,  setPendingReviews]  = useState(null);
	const [pendingRegs,     setPendingRegs]     = useState(null);

	const displayName = user?.email?.split('@')[0] ?? 'Admin';

	const loadStats = useCallback(async () => {
		setStatsLoading(true);
		try {
			const [guidesRes, modulesRes, reviewsRes, regsRes] = await Promise.allSettled([
				usersApi.getAll({ role: 'GUIDE', limit: 200 }),
				modulesApi.getAll({ limit: 200 }),
				quizAttemptsApi.getAll({ status: 'PENDING_REVIEW', limit: 200 }),
				registrationsApi.getAll({ limit: 200 }),
			]);

			if (guidesRes.status === 'fulfilled') {
				setGuideCount(Array.isArray(guidesRes.value) ? guidesRes.value.length : 0);
			}
			if (modulesRes.status === 'fulfilled') {
				const modules = Array.isArray(modulesRes.value) ? modulesRes.value : [];
				setModuleCount(modules.filter((m) => m.status === 'PUBLISHED').length);
			}
			if (reviewsRes.status === 'fulfilled') {
				setPendingReviews(Array.isArray(reviewsRes.value) ? reviewsRes.value.length : 0);
			}
			if (regsRes.status === 'fulfilled') {
				const regs = Array.isArray(regsRes.value) ? regsRes.value : [];
				setPendingRegs(regs.filter((r) => r.status === 'PENDING').length);
			}
		} finally {
			setStatsLoading(false);
		}
	}, []);

	useEffect(() => { loadStats(); }, [loadStats]);

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			{/* Logout confirmation modal */}
			<Modal visible={showLogoutModal} transparent animationType="fade">
				<View style={{
					flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
					alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32,
				}}>
					<View style={{
						backgroundColor: '#fff', borderRadius: 20, padding: 28, width: '100%',
						shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
					}}>
						<Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 10 }}>
							Log Out
						</Text>
						<Text style={{ fontSize: 14, color: '#6b7280', lineHeight: 22, marginBottom: 24 }}>
							Are you sure you want to log out?
						</Text>
						<View style={{ flexDirection: 'row', gap: 12 }}>
							<TouchableOpacity
								onPress={() => setShowLogoutModal(false)}
								style={{
									flex: 1, paddingVertical: 13, borderRadius: 12,
									borderWidth: 1.5, borderColor: '#e5e7eb', alignItems: 'center',
								}}
							>
								<Text style={{ fontSize: 14, fontWeight: '700', color: '#374151' }}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => { setShowLogoutModal(false); logout(); }}
								style={{
									flex: 1, paddingVertical: 13, borderRadius: 12,
									backgroundColor: '#dc2626', alignItems: 'center',
								}}
							>
								<Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Log Out</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* Green header */}
			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52,
				paddingHorizontal: 20, paddingBottom: 0,
			}}>
				<View style={{
					flexDirection: 'row', justifyContent: 'space-between',
					alignItems: 'center', marginBottom: 16,
				}}>
					<View>
						<Text style={{ fontSize: 22, fontWeight: '800', color: '#fff' }}>Admin Console</Text>
						<Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
							{displayName}
						</Text>
					</View>
					<TouchableOpacity
						onPress={() => setShowLogoutModal(true)}
						style={{
							width: 36, height: 36, borderRadius: 8,
							backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center',
						}}
					>
						<Ionicons name="log-out-outline" size={18} color="#fff" />
					</TouchableOpacity>
				</View>

				{/* Header tabs */}
				<View style={{ flexDirection: 'row' }}>
					{['overview', 'guides'].map((tab) => (
						<TouchableOpacity
							key={tab}
							onPress={() => setActiveTab(tab)}
							style={{
								paddingVertical: 12, paddingHorizontal: 4, marginRight: 24,
								borderBottomWidth: 2,
								borderBottomColor: activeTab === tab ? '#fff' : 'transparent',
							}}
						>
							<Text style={{
								fontSize: 14, fontWeight: '600',
								color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.55)',
								textTransform: 'capitalize',
							}}>
								{tab === 'overview' ? 'Overview' : 'Guides'}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>

			{/* Overview tab */}
			{activeTab === 'overview' && (
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ padding: 16 }}
				>
					{/* Stats grid — top row */}
					<View style={{ flexDirection: 'row', marginHorizontal: -5, marginBottom: 4 }}>
						<View style={{ width: '50%' }}>
							<StatCard
								icon="people"
								label="Total Guides"
								value={guideCount ?? '—'}
								subtitle="Active park guides"
								subtitleColor="#16a34a"
								iconBg="#ede9fe"
								iconColor="#7c3aed"
								loading={statsLoading}
								onPress={() => navigation.navigate('Settings', { screen: 'GuideList' })}
							/>
						</View>
						<View style={{ width: '50%' }}>
							<StatCard
								icon="layers"
								label="Published Modules"
								value={moduleCount ?? '—'}
								subtitle="Available to guides"
								subtitleColor="#6b7280"
								iconBg="#dcfce7"
								iconColor="#16a34a"
								loading={statsLoading}
								onPress={() => navigation.navigate('Courses', { screen: 'CourseModules' })}
							/>
						</View>
					</View>

					{/* Stats grid — bottom row */}
					<View style={{ flexDirection: 'row', marginHorizontal: -5, marginBottom: 16 }}>
						<View style={{ width: '50%' }}>
							<StatCard
								icon="document-text"
								label="Pending Reviews"
								value={pendingReviews ?? '—'}
								subtitle="Quiz submissions"
								subtitleColor={pendingReviews > 0 ? '#d97706' : '#6b7280'}
								iconBg="#fef3c7"
								iconColor="#d97706"
								loading={statsLoading}
								onPress={() => navigation.navigate('Courses', { screen: 'QuizGrading' })}
							/>
						</View>
						<View style={{ width: '50%' }}>
							<StatCard
								icon="person-add"
								label="New Applications"
								value={pendingRegs ?? '—'}
								subtitle="Awaiting approval"
								subtitleColor={pendingRegs > 0 ? '#d97706' : '#6b7280'}
								iconBg="#fef3c7"
								iconColor="#f59e0b"
								loading={statsLoading}
								onPress={() => navigation.navigate('Registrations', { screen: 'RegistrationsList' })}
							/>
						</View>
					</View>

					{/* Enrollment by Category — static overview, no live aggregation endpoint */}
					<View style={{
						backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 16,
						shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
					}}>
						<Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 }}>
							Enrollment by Category
						</Text>
						{ENROLLMENT_CATEGORIES.map((item) => (
							<View key={item.label} style={{ marginBottom: 14 }}>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
									<Text style={{ fontSize: 13, color: '#374151', fontWeight: '500' }}>{item.label}</Text>
									<Text style={{ fontSize: 13, color: item.color, fontWeight: '700' }}>{item.count}</Text>
								</View>
								<View style={{ height: 7, backgroundColor: '#f3f4f6', borderRadius: 4 }}>
									<View style={{
										width: `${(item.count / MAX_ENROLLMENT) * 100}%`,
										height: 7,
										backgroundColor: item.color,
										borderRadius: 4,
									}} />
								</View>
							</View>
						))}
					</View>

				</ScrollView>
			)}

			{/* Guides tab */}
			{activeTab === 'guides' && <GuideList />}

		</View>
	);
}
