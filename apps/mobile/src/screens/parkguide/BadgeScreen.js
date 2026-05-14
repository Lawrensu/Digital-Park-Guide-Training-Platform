import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../services/AuthContext';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';
import { badgesApi } from '../../api/badges';

function formatDate(dateStr) {
	if (!dateStr) return '';
	return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}


function EarnedBadge({ badge }) {
	return (
		<View style={{ alignItems: 'center', flex: 1 }}>
			<View style={{ position: 'relative', marginBottom: 10 }}>
				<View style={{
					width: 80, height: 80, borderRadius: 40,
					borderWidth: 3, borderColor: '#15803d',
					backgroundColor: '#dcfce7',
					alignItems: 'center', justifyContent: 'center',
				}}>
					<Ionicons name={badge.icon ?? 'ribbon'} size={32} color="#15803d" />
				</View>
				<View style={{
					position: 'absolute', top: 2, right: 2,
					width: 16, height: 16, borderRadius: 8, backgroundColor: '#15803d',
					borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
				}}>
					<Ionicons name="checkmark" size={9} color="#fff" />
				</View>
			</View>
			<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#111827', textAlign: 'center', marginBottom: 3 }}>
				{badge.name}
			</Text>
			{badge.earnedAt && (
				<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af' }}>
					{formatDate(badge.earnedAt)}
				</Text>
			)}
		</View>
	);
}

function LockedBadge({ badge }) {
	return (
		<View style={{ alignItems: 'center', flex: 1, paddingHorizontal: 4 }}>
			<View style={{
				width: 80, height: 80, borderRadius: 40,
				backgroundColor: '#f3f4f6', borderWidth: 2, borderColor: '#e5e7eb',
				alignItems: 'center', justifyContent: 'center', marginBottom: 10,
			}}>
				<Ionicons name="lock-closed" size={28} color="#d1d5db" />
			</View>
			<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#374151', textAlign: 'center', marginBottom: 4 }}>
				{badge.name}
			</Text>
			{badge.description && (
				<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af', textAlign: 'center', lineHeight: 16 }}>
					{badge.description}
				</Text>
			)}
		</View>
	);
}


export default function BadgeScreen() {
	const navigation   = useNavigation();
	const { isOnline } = useNetworkStatus();
	const { user }     = useAuth();

	const [allBadges,    setAllBadges]    = useState([]);
	const [earnedBadges, setEarnedBadges] = useState([]);
	const [loading,      setLoading]      = useState(true);

	const load = useCallback(async () => {
		if (!user?.id) return;
		try {
			const [allData, earnedData] = await Promise.allSettled([
				badgesApi.getAll(),
				badgesApi.getEarned(user.id),
			]);
			if (allData.status    === 'fulfilled') setAllBadges(Array.isArray(allData.value) ? allData.value : []);
			if (earnedData.status === 'fulfilled') setEarnedBadges(Array.isArray(earnedData.value) ? earnedData.value : []);
		} catch {
			// keep empty
		} finally {
			setLoading(false);
		}
	}, [user?.id]);

	useEffect(() => { load(); }, [load]);

	const earnedIds = new Set(earnedBadges.map((e) => e.badgeId ?? e.id));

	const earned = earnedBadges.map((e) => ({
		...(e.badge ?? {}),
		id: e.badgeId ?? e.id,
		name: e.badge?.name ?? e.name ?? 'Badge',
		icon: e.badge?.icon ?? e.icon ?? 'ribbon',
		earnedAt: e.earnedAt ?? e.createdAt,
	}));

	const locked = allBadges.filter((b) => !earnedIds.has(b.id));

	const total    = (allBadges.length > 0 ? allBadges.length : earned.length + locked.length) || 1;
	const progress = earned.length / total;

	const rows = (arr, cols) => {
		const result = [];
		for (let i = 0; i < arr.length; i += cols) {
			result.push(arr.slice(i, i + cols));
		}
		return result;
	};

	return (
		<View style={{ flex: 1, backgroundColor: '#f9fafb' }}>

			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20,
			}}>
				<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
					<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
						<Ionicons name="arrow-back" size={22} color="#fff" />
					</TouchableOpacity>
					<Text style={{ fontFamily: FONTS.title, fontSize: 28, fontWeight: '600', color: '#fff' }}>My Badges</Text>
				</View>

				<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 10 }}>
					{earned.length} of {total} badges earned
				</Text>

				<View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, overflow: 'hidden' }}>
					<View style={{ height: '100%', borderRadius: 3, backgroundColor: '#fff', width: `${Math.round(progress * 100)}%` }} />
				</View>
			</View>

			{loading ? (
				<ActivityIndicator color="#15803d" style={{ marginTop: 40 }} />
			) : (
				<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
					{earned.length > 0 && (
						<>
							<Text style={{ fontFamily: FONTS.title, fontSize: 20, fontWeight: '500', color: '#111827', marginBottom: 20 }}>
								Earned ({earned.length})
							</Text>
							{rows(earned, 3).map((row, ri) => (
								<View key={ri} style={{ flexDirection: 'row', marginBottom: 28 }}>
									{row.map((b) => <EarnedBadge key={b.id} badge={b} />)}
									{row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => (
										<View key={`pad-${i}`} style={{ flex: 1 }} />
									))}
								</View>
							))}
						</>
					)}

					{locked.length > 0 && (
						<>
							<Text style={{ fontFamily: FONTS.title, fontSize: 20, fontWeight: '500', color: '#111827', marginBottom: 20 }}>
								Keep Going ({locked.length} remaining)
							</Text>
							{rows(locked, 3).map((row, ri) => (
								<View key={ri} style={{ flexDirection: 'row', marginBottom: 28 }}>
									{row.map((b) => <LockedBadge key={b.id} badge={b} />)}
									{row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => (
										<View key={`pad-${i}`} style={{ flex: 1 }} />
									))}
								</View>
							))}
						</>
					)}

					{earned.length === 0 && locked.length === 0 && (
						<View style={{ alignItems: 'center', marginTop: 48 }}>
							<Ionicons name="ribbon-outline" size={48} color="#d1d5db" />
							<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#9ca3af', marginTop: 12, textAlign: 'center' }}>
								No badges yet — complete modules to earn badges
							</Text>
						</View>
					)}
				</ScrollView>
			)}

		</View>
	);
}
