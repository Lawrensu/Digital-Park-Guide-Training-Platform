import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';
import { certificationsApi } from '../../api/certifications';

const WARN_DAYS = 90;

function daysUntil(dateStr) {
	if (!dateStr) return Infinity;
	return Math.floor((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
	if (!dateStr) return '—';
	return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}


function CertCard({ cert, onView }) {
	const days         = daysUntil(cert.expiryDate);
	const expiringSoon = days <= WARN_DAYS && days > 0;
	const expired      = days <= 0;
	const moduleTitle  = cert.module?.title ?? cert.moduleTitle ?? 'Module';

	return (
		<View style={{
			backgroundColor: '#fff', borderRadius: 18, marginBottom: 16, overflow: 'hidden',
			shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
		}}>
			<View style={{ height: 5, backgroundColor: '#15803d' }} />
			<View style={{ padding: 18 }}>
				<View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
					<View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' }}>
						<Ionicons name="ribbon" size={28} color="#15803d" />
					</View>
					<View style={{ alignItems: 'flex-end', gap: 6 }}>
						{expired ? (
							<View style={{ backgroundColor: '#fee2e2', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 }}>
								<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#dc2626', fontWeight: '700', letterSpacing: 0.4 }}>EXPIRED</Text>
							</View>
						) : (
							<View style={{ backgroundColor: '#dcfce7', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 }}>
								<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#15803d', fontWeight: '700', letterSpacing: 0.4 }}>ACTIVE</Text>
							</View>
						)}
					</View>
				</View>

				<Text style={{ fontFamily: FONTS.title, fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
					{cert.certificateTitle ?? moduleTitle}
				</Text>
				<Text style={{ fontFamily: FONTS.body, fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
					{moduleTitle}
				</Text>

				<View style={{ flexDirection: 'row', gap: 32, marginBottom: 14 }}>
					<View>
						<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af', letterSpacing: 0.5, marginBottom: 4 }}>ISSUED</Text>
						<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#111827' }}>{formatDate(cert.issueDate)}</Text>
					</View>
					{cert.expiryDate && (
						<View>
							<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af', letterSpacing: 0.5, marginBottom: 4 }}>EXPIRES</Text>
							<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: expiringSoon ? '#d97706' : '#111827' }}>
								{formatDate(cert.expiryDate)}
							</Text>
						</View>
					)}
				</View>

				{expiringSoon && (
					<View style={{
						flexDirection: 'row', alignItems: 'center', gap: 8,
						backgroundColor: '#fefce8', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
						marginBottom: 14, borderWidth: 1, borderColor: '#fde68a',
					}}>
						<Ionicons name="warning" size={16} color="#d97706" />
						<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#92400e' }}>
							Expires in {days} day{days !== 1 ? 's' : ''} — renew soon
						</Text>
					</View>
				)}

				<TouchableOpacity
					onPress={onView}
					style={{
						flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
						gap: 6, paddingVertical: 11, borderRadius: 10,
						borderWidth: 1.5, borderColor: '#15803d',
					}}
				>
					<Ionicons name="eye-outline" size={16} color="#15803d" />
					<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#15803d' }}>View Certificate</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}


export default function CertificationScreen() {
	const navigation   = useNavigation();
	const { isOnline } = useNetworkStatus();

	const [certs,   setCerts]   = useState([]);
	const [loading, setLoading] = useState(true);

	const load = useCallback(async () => {
		try {
			const data = await certificationsApi.getMine();
			setCerts(Array.isArray(data) ? data : []);
		} catch {
			// keep empty
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => { load(); }, [load]);

	const activeCount   = certs.filter((c) => daysUntil(c.expiryDate) > WARN_DAYS).length;
	const expiringCount = certs.filter((c) => { const d = daysUntil(c.expiryDate); return d > 0 && d <= WARN_DAYS; }).length;
	const expiredCount  = certs.filter((c) => daysUntil(c.expiryDate) <= 0).length;

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 24, paddingHorizontal: 20,
			}}>
				<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
					<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
						<Ionicons name="arrow-back" size={22} color="#fff" />
					</TouchableOpacity>
					<Text style={{ fontFamily: FONTS.title, fontSize: 28, fontWeight: '600', color: '#fff' }}>My Certifications</Text>
				</View>

				{!loading && (
					<>
						<Text style={{ fontFamily: FONTS.title, fontSize: 26, color: '#fff', marginBottom: 14 }}>
							{certs.length} Certificate{certs.length !== 1 ? 's' : ''}
						</Text>
						<View style={{ flexDirection: 'row', gap: 28 }}>
							<View>
								<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 3 }}>Active</Text>
								<Text style={{ fontFamily: FONTS.title, fontSize: 20, color: '#4ade80' }}>{activeCount}</Text>
							</View>
							<View>
								<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 3 }}>Expiring Soon</Text>
								<Text style={{ fontFamily: FONTS.title, fontSize: 20, color: '#fb923c' }}>{expiringCount}</Text>
							</View>
							<View>
								<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 3 }}>Expired</Text>
								<Text style={{ fontFamily: FONTS.title, fontSize: 20, color: 'rgba(255,255,255,0.5)' }}>{expiredCount}</Text>
							</View>
						</View>
					</>
				)}
			</View>

			{loading ? (
				<ActivityIndicator color="#15803d" style={{ marginTop: 40 }} />
			) : (
				<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
					<Text style={{ fontFamily: FONTS.title, fontSize: 20, fontWeight: '500', color: '#111827', marginBottom: 14 }}>
						My Certificates
					</Text>

					{certs.length > 0 ? (
						certs.map((cert) => (
							<CertCard
								key={cert.id}
								cert={cert}
								onView={() => navigation.navigate('GuideViewCert', { certId: cert.id })}
							/>
						))
					) : (
						<View style={{ alignItems: 'center', marginTop: 48, paddingHorizontal: 32 }}>
							<Ionicons name="ribbon-outline" size={48} color="#d1d5db" />
							<Text style={{ fontFamily: FONTS.title, fontSize: 16, color: '#9ca3af', marginTop: 12, textAlign: 'center' }}>
								No certificates yet — complete a module to earn one
							</Text>
						</View>
					)}
				</ScrollView>
			)}

		</View>
	);
}
