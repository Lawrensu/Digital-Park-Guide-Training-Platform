import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';
import { notificationsApi } from '../../api/notifications';

const NOTIF_ICON = {
	book:      { icon: 'book-outline',          color: '#15803d', bg: '#dcfce7' },
	ribbon:    { icon: 'ribbon-outline',         color: '#15803d', bg: '#dcfce7' },
	alarm:     { icon: 'alarm-outline',          color: '#d97706', bg: '#fef3c7' },
	megaphone: { icon: 'megaphone-outline',      color: '#7c3aed', bg: '#ede9fe' },
	default:   { icon: 'notifications-outline',  color: '#15803d', bg: '#dcfce7' },
};

const FILTERS = ['All', 'Unread'];

function timeAgo(dateStr) {
	if (!dateStr) return '';
	const diff = Date.now() - new Date(dateStr).getTime();
	const mins = Math.floor(diff / 60000);
	if (mins < 60)   return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24)    return `${hrs}h ago`;
	const days = Math.floor(hrs / 24);
	if (days < 7)    return `${days}d ago`;
	return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function groupLabel(dateStr) {
	if (!dateStr) return 'EARLIER';
	const d    = new Date(dateStr);
	const now  = new Date();
	const diff = Math.floor((now - d) / 86400000);
	if (diff === 0) return 'TODAY';
	if (diff === 1) return 'YESTERDAY';
	return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
}


function NotifCard({ notif, onPress }) {
	const type = notif.type?.toLowerCase() ?? 'default';
	const cfg  = NOTIF_ICON[type] ?? NOTIF_ICON.default;

	return (
		<TouchableOpacity
			activeOpacity={0.85}
			onPress={() => onPress(notif)}
			style={{
				backgroundColor: notif.readAt ? '#fff' : '#f0fdf4',
				borderRadius: 16, padding: 16, marginBottom: 10,
				shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
			}}
		>
			<View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
				<View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: cfg.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
					<Ionicons name={cfg.icon} size={20} color={cfg.color} />
				</View>
				<View style={{ flex: 1 }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<Text style={{ fontFamily: FONTS.label, fontSize: 14, fontWeight: '600', color: '#111827', flex: 1, marginRight: 8 }} numberOfLines={1}>
							{notif.title ?? 'Notification'}
						</Text>
						<View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
							<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af' }}>{timeAgo(notif.createdAt)}</Text>
							{!notif.readAt && (
								<View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#15803d' }} />
							)}
						</View>
					</View>
				</View>
			</View>

			{notif.body ? (
				<Text style={{ fontFamily: FONTS.body, fontSize: 14, color: '#374151', lineHeight: 20 }}>
					{notif.body}
				</Text>
			) : null}
		</TouchableOpacity>
	);
}


export default function GuideNotification() {
	const navigation   = useNavigation();
	const { isOnline } = useNetworkStatus();

	const [notifications, setNotifications] = useState([]);
	const [loading,       setLoading]       = useState(true);
	const [filter,        setFilter]        = useState('All');

	const load = useCallback(async () => {
		try {
			const data = await notificationsApi.getMine({ limit: 50 });
			setNotifications(Array.isArray(data) ? data : []);
		} catch {
			// keep empty
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => { load(); }, [load]);

	async function handlePress(notif) {
		if (!notif.readAt) {
			notificationsApi.markRead(notif.id).catch(() => {});
			setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, readAt: new Date().toISOString() } : n));
		}
	}

	async function handleMarkAllRead() {
		try {
			await notificationsApi.markAllRead();
			setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
		} catch {
			// ignore
		}
	}

	const filtered     = filter === 'Unread' ? notifications.filter((n) => !n.readAt) : notifications;
	const unreadCount  = notifications.filter((n) => !n.readAt).length;

	const grouped = filtered.reduce((acc, n) => {
		const key = groupLabel(n.createdAt);
		if (!acc[key]) acc[key] = [];
		acc[key].push(n);
		return acc;
	}, {});
	const groupKeys = Object.keys(grouped);

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 16, paddingHorizontal: 20,
			}}>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
					<Text style={{ fontFamily: FONTS.title, fontSize: 28, fontWeight: '600', color: '#fff' }}>Notifications</Text>
					{unreadCount > 0 && (
						<TouchableOpacity
							onPress={handleMarkAllRead}
							style={{ borderWidth: 1.5, borderColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 }}
						>
							<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#fff', fontWeight: '700' }}>Mark all read</Text>
						</TouchableOpacity>
					)}
				</View>

				<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 14 }}>
					{unreadCount} unread
				</Text>

				<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 4 }}>
					{FILTERS.map((f) => {
						const active = filter === f;
						return (
							<TouchableOpacity
								key={f}
								onPress={() => setFilter(f)}
								style={{ paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: active ? '#fff' : 'rgba(0,0,0,0.2)' }}
							>
								<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: active ? '#15803d' : '#fff', fontWeight: '700' }}>
									{f}
								</Text>
							</TouchableOpacity>
						);
					})}
				</ScrollView>
			</View>

			{loading ? (
				<ActivityIndicator color="#15803d" style={{ marginTop: 40 }} />
			) : (
				<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
					{groupKeys.length === 0 ? (
						<View style={{ alignItems: 'center', marginTop: 56 }}>
							<Ionicons name="notifications-off-outline" size={44} color="#d1d5db" />
							<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#9ca3af', marginTop: 12 }}>No notifications</Text>
						</View>
					) : (
						groupKeys.map((group) => (
							<View key={group} style={{ marginBottom: 8 }}>
								<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af', letterSpacing: 0.8, marginBottom: 10, marginLeft: 2 }}>
									{group}
								</Text>
								{grouped[group].map((notif) => (
									<NotifCard key={notif.id} notif={notif} onPress={handlePress} />
								))}
							</View>
						))
					)}
				</ScrollView>
			)}

		</View>
	);
}
