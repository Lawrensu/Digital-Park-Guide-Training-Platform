import React, { useState, useEffect, useCallback } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity,
	ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { notificationsApi } from '../../api/notifications';
import CustomNotificationModal from './CustomNotification';
import useNetworkStatus from '../../services/connectivityService';

const TYPE_ICON = {
	REGISTRATION:        { icon: 'person',    iconColor: '#f59e0b', iconBg: '#fef3c7' },
	IOT_ALERT:           { icon: 'warning',   iconColor: '#d97706', iconBg: '#fef3c7' },
	CERTIFICATE_APPROVED:{ icon: 'ribbon',    iconColor: '#f59e0b', iconBg: '#fef3c7' },
	QUIZ_RESULT:         { icon: 'clipboard', iconColor: '#3b82f6', iconBg: '#eff6ff' },
	GENERAL:             { icon: 'megaphone', iconColor: '#6b7280', iconBg: '#f3f4f6' },
};

function timeAgo(iso) {
	if (!iso) return '';
	const diffMs  = Date.now() - new Date(iso).getTime();
	const diffMin = Math.floor(diffMs / 60000);
	if (diffMin < 1)  return 'just now';
	if (diffMin < 60) return `${diffMin}m ago`;
	const diffHr = Math.floor(diffMin / 60);
	if (diffHr < 24) return `${diffHr}h ago`;
	const diffDay = Math.floor(diffHr / 24);
	return `${diffDay}d ago`;
}

function NotifItem({ notif, isLast, onPress }) {
	const cfg  = TYPE_ICON[notif.type] ?? TYPE_ICON.GENERAL;

	return (
		<TouchableOpacity
			onPress={() => onPress(notif)}
			activeOpacity={0.75}
			style={{
				paddingHorizontal: 18, paddingVertical: 16,
				borderBottomWidth: isLast ? 0 : 1,
				borderBottomColor: '#f3f4f6',
				backgroundColor: notif.readAt ? '#fff' : '#fafffe',
			}}
		>
			<View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
				<View style={{
					width: 42, height: 42, borderRadius: 21,
					backgroundColor: cfg.iconBg,
					alignItems: 'center', justifyContent: 'center', marginRight: 12,
				}}>
					<Ionicons name={cfg.icon} size={20} color={cfg.iconColor} />
				</View>

				<View style={{ flex: 1 }}>
					<View style={{
						flexDirection: 'row', alignItems: 'center',
						justifyContent: 'space-between',
					}}>
						<Text style={{
							fontSize: 16, fontWeight: '600', color: '#111827',
							flex: 1, marginRight: 8,
						}}>
							{notif.title}
						</Text>
						<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
							<Text style={{ fontSize: 12, color: '#9ca3af' }}>
								{timeAgo(notif.createdAt)}
							</Text>
							{!notif.readAt && (
								<View style={{
									width: 8, height: 8, borderRadius: 4, backgroundColor: '#3b82f6',
								}} />
							)}
						</View>
					</View>
					{notif.body ? (
						<Text style={{ fontSize: 14, color: '#6b7280', marginTop: 3, lineHeight: 20 }}>
							{notif.body}
						</Text>
					) : null}
				</View>
			</View>
		</TouchableOpacity>
	);
}

export default function NotificationsScreen() {
	const navigation                            = useNavigation();
	const { isOnline }                          = useNetworkStatus();
	const [notifications,   setNotifications]   = useState([]);
	const [loading,         setLoading]         = useState(true);
	const [refreshing,      setRefreshing]      = useState(false);
	const [showSendModal,   setShowSendModal]   = useState(false);

	const load = useCallback(async () => {
		try {
			const data = await notificationsApi.getMine({ limit: 50 });
			setNotifications(Array.isArray(data) ? data : []);
		} catch {
			setNotifications([]);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => { load(); }, [load]);

	const onRefresh = () => { setRefreshing(true); load(); };

	async function handleTap(notif) {
		if (!notif.readAt) {
			setNotifications((prev) =>
				prev.map((n) => n.id === notif.id ? { ...n, readAt: new Date().toISOString() } : n)
			);
			try { await notificationsApi.markRead(notif.id); } catch { /* optimistic */ }
		}
		// navigate based on type + referenceType
		if (notif.referenceType === 'registration_application') {
			navigation.navigate('RegistrationDetails', { regId: notif.referenceId });
		} else if (notif.referenceType === 'iot_alert') {
			navigation.navigate('IoTDetails', { alertId: notif.referenceId });
		}
	}

	async function handleMarkAllRead() {
		const now = new Date().toISOString();
		setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? now })));
		try { await notificationsApi.markAllRead(); } catch { /* optimistic */ }
	}

	const unreadCount = notifications.filter((n) => !n.readAt).length;

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			{/* Green header */}
			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20,
				flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
			}}>
				<View>
					<Text style={{ fontSize: 30, fontWeight: '600', color: '#fff' }}>Notifications</Text>
					<Text style={{ fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
						{unreadCount} unread
					</Text>
				</View>
				<TouchableOpacity
					onPress={() => setShowSendModal(true)}
					style={{
						flexDirection: 'row', alignItems: 'center', gap: 6,
						borderWidth: 1.5, borderColor: '#fff', borderRadius: 20,
						paddingHorizontal: 16, paddingVertical: 8,
					}}
				>
					<Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>Send</Text>
					<Ionicons name="arrow-up-right" size={14} color="#fff" />
				</TouchableOpacity>
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
					{notifications.length === 0 ? (
						<View style={{ alignItems: 'center', marginTop: 48 }}>
							<Ionicons name="notifications-off-outline" size={44} color="#d1d5db" />
							<Text style={{ fontSize: 14, fontWeight: '500', color: '#9ca3af', marginTop: 12 }}>
								No notifications
							</Text>
						</View>
					) : (
						<View style={{
							backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
							shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
							shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
						}}>
							{notifications.map((notif, i) => (
								<NotifItem
									key={notif.id}
									notif={notif}
									isLast={i === notifications.length - 1}
									onPress={handleTap}
								/>
							))}
						</View>
					)}

					{unreadCount > 0 && (
						<TouchableOpacity
							onPress={handleMarkAllRead}
							style={{ alignItems: 'center', marginTop: 16 }}
						>
							<Text style={{ fontSize: 12, fontWeight: '600', color: '#15803d' }}>
								Mark all as read
							</Text>
						</TouchableOpacity>
					)}
				</ScrollView>
			)}

			<CustomNotificationModal
				visible={showSendModal}
				onClose={() => setShowSendModal(false)}
				onSent={load}
			/>
		</View>
	);
}
