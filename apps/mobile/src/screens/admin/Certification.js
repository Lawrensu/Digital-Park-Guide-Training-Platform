import React, { useState, useEffect, useCallback } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, TextInput,
	ActivityIndicator, RefreshControl, Linking, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { certificationsApi } from '../../api/certifications';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';

const T = {
	h1:      { fontFamily: FONTS.label, fontSize: 30, fontWeight: '600' },
	h4:      { fontFamily: FONTS.label, fontSize: 16, fontWeight: '600' },
	label:   { fontFamily: FONTS.label, fontSize: 14, fontWeight: '500' },
	caption: { fontFamily: FONTS.label, fontSize: 12, fontWeight: '500' },
};

function formatDate(iso) {
	if (!iso) return '—';
	return new Date(iso).toLocaleDateString('en-GB', {
		day: 'numeric', month: 'short', year: 'numeric',
	});
}

function CertCard({ cert, onDownload }) {
	const initial = (cert.guide?.username ?? 'G').charAt(0).toUpperCase();
	const expired = cert.expiryDate && new Date(cert.expiryDate) < new Date();

	return (
		<View style={{
			backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
			shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
		}}>
			{/* Top row */}
			<View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
				<View style={{
					width: 46, height: 46, borderRadius: 23,
					backgroundColor: '#15803d', alignItems: 'center', justifyContent: 'center',
					marginRight: 12,
				}}>
					<Text style={[T.h4, { color: '#fff' }]}>{initial}</Text>
				</View>

				<View style={{ flex: 1 }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
						<Text style={[T.h4, { color: '#111827', flex: 1, marginRight: 8 }]}>
							{cert.guide?.username ?? '—'}
						</Text>
						<View style={{
							paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
							backgroundColor: expired ? '#fee2e2' : '#dcfce7',
						}}>
							<Text style={[T.caption, {
								color: expired ? '#dc2626' : '#16a34a', fontWeight: '700',
							}]}>
								{expired ? 'EXPIRED' : 'ISSUED'}
							</Text>
						</View>
					</View>
					<Text style={[T.label, { color: '#374151', marginTop: 3 }]}>
						{cert.module?.title ?? '—'}
					</Text>
				</View>
			</View>

			{/* Date row */}
			<View style={{
				flexDirection: 'row', gap: 16, marginBottom: 14,
				paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6',
			}}>
				<View style={{ flex: 1 }}>
					<Text style={[T.caption, { color: '#9ca3af', marginBottom: 2 }]}>ISSUED</Text>
					<Text style={[T.caption, { color: '#374151', fontWeight: '600' }]}>
						{formatDate(cert.issueDate)}
					</Text>
				</View>
				<View style={{ flex: 1 }}>
					<Text style={[T.caption, { color: '#9ca3af', marginBottom: 2 }]}>EXPIRES</Text>
					<Text style={[T.caption, { color: expired ? '#dc2626' : '#374151', fontWeight: '600' }]}>
						{cert.expiryDate ? formatDate(cert.expiryDate) : 'No expiry'}
					</Text>
				</View>
			</View>

			{/* Download button */}
			<TouchableOpacity
				onPress={() => onDownload(cert.id)}
				style={{
					borderWidth: 1.5, borderColor: '#15803d', borderRadius: 10,
					paddingVertical: 11, alignItems: 'center', justifyContent: 'center',
					flexDirection: 'row', gap: 6,
				}}
			>
				<Ionicons name="download-outline" size={16} color="#15803d" />
				<Text style={[T.label, { color: '#15803d' }]}>Download Certificate</Text>
			</TouchableOpacity>
		</View>
	);
}

export default function Certifications() {
	const navigation             = useNavigation();
	const { isOnline }           = useNetworkStatus();
	const [certs,      setCerts]      = useState([]);
	const [loading,    setLoading]    = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [search,     setSearch]     = useState('');

	const load = useCallback(async () => {
		try {
			const data = await certificationsApi.getAll({ limit: 100 });
			setCerts(Array.isArray(data) ? data : []);
		} catch {
			setCerts([]);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => { load(); }, [load]);

	const onRefresh = () => { setRefreshing(true); load(); };

	async function handleDownload(id) {
		try {
			const result = await certificationsApi.getDownloadUrl(id);
			if (result?.url) {
				await Linking.openURL(result.url);
			}
		} catch (e) {
			Alert.alert('Error', e?.message ?? 'Could not get download link.');
		}
	}

	const filtered = certs.filter((c) => {
		if (!search.trim()) return true;
		const q = search.toLowerCase();
		return (
			(c.guide?.username ?? '').toLowerCase().includes(q) ||
			(c.module?.title ?? '').toLowerCase().includes(q)
		);
	});

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			{/* Green header */}
			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20,
			}}>

				{/* Title row */}
				<View style={{
					flexDirection: 'row', alignItems: 'center', marginBottom: 14,
				}}>
					<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
						<Ionicons name="arrow-back" size={22} color="#fff" />
					</TouchableOpacity>
					<View>
						<Text style={[T.h1, { color: '#fff', lineHeight: 34 }]}>Certifications</Text>
						<Text style={[T.caption, { color: 'rgba(255,255,255,0.8)', marginTop: 2, fontWeight: '500' }]}>
							{certs.length} issued
						</Text>
					</View>
				</View>

				{/* Search bar */}
				<View style={{
					flexDirection: 'row', alignItems: 'center',
					backgroundColor: '#fff', borderRadius: 12,
					paddingHorizontal: 12, height: 46,
				}}>
					<Ionicons name="search" size={18} color="#15803d" style={{ marginRight: 8 }} />
					<TextInput
						value={search}
						onChangeText={setSearch}
						placeholder="Search by guide or module..."
						placeholderTextColor="#9ca3af"
						style={[T.label, { flex: 1, color: '#111827', padding: 0 }]}
					/>
					{search.length > 0 && (
						<TouchableOpacity onPress={() => setSearch('')}>
							<Ionicons name="close-circle" size={18} color="#9ca3af" />
						</TouchableOpacity>
					)}
				</View>
			</View>

			{loading && !refreshing ? (
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<ActivityIndicator size="large" color="#15803d" />
				</View>
			) : (
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#15803d" />
					}
				>
					{filtered.length === 0 ? (
						<View style={{ alignItems: 'center', marginTop: 48 }}>
							<Ionicons name="ribbon-outline" size={44} color="#d1d5db" />
							<Text style={[T.label, { color: '#9ca3af', marginTop: 12 }]}>
								{search ? 'No results found' : 'No certificates issued yet'}
							</Text>
						</View>
					) : (
						filtered.map((cert) => (
							<CertCard
								key={cert.id}
								cert={cert}
								onDownload={handleDownload}
							/>
						))
					)}
				</ScrollView>
			)}
		</View>
	);
}
