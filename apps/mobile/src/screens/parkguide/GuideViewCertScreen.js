import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';
import { certificationsApi } from '../../api/certifications';

function formatDate(dateStr) {
	if (!dateStr) return '—';
	return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Divider() {
	return <View style={{ height: 1, backgroundColor: '#f3f4f6', marginVertical: 20 }} />;
}

function DetailPair({ left, right }) {
	return (
		<View style={{ flexDirection: 'row', marginBottom: 16 }}>
			<View style={{ flex: 1 }}>
				<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af', letterSpacing: 0.5, marginBottom: 4 }}>{left.label}</Text>
				<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#111827' }}>{left.value}</Text>
			</View>
			{right && (
				<View style={{ flex: 1 }}>
					<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af', letterSpacing: 0.5, marginBottom: 4 }}>{right.label}</Text>
					<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#111827' }}>{right.value}</Text>
				</View>
			)}
		</View>
	);
}


export default function GuideViewCert() {
	const navigation   = useNavigation();
	const { isOnline } = useNetworkStatus();
	const route        = useRoute();
	const { certId }   = route.params ?? {};

	const [cert,        setCert]        = useState(null);
	const [loading,     setLoading]     = useState(true);
	const [downloading, setDownloading] = useState(false);

	useEffect(() => {
		if (!certId) { setLoading(false); return; }
		certificationsApi.getOne(certId)
			.then(setCert)
			.catch(() => {})
			.finally(() => setLoading(false));
	}, [certId]);

	async function handleDownload() {
		setDownloading(true);
		try {
			const { url } = await certificationsApi.getDownloadUrl(certId);
			if (url) await Linking.openURL(url);
		} catch (err) {
			Alert.alert('Download Failed', err.message || 'Unable to generate download link.');
		} finally {
			setDownloading(false);
		}
	}

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator size="large" color="#15803d" />
			</View>
		);
	}

	if (!cert) {
		return (
			<View style={{ flex: 1, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
				<Ionicons name="alert-circle-outline" size={48} color="#d1d5db" />
				<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#9ca3af', marginTop: 12 }}>Certificate not found</Text>
				<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
					<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#15803d' }}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	const moduleTitle = cert.module?.title ?? '';
	const guideName   = cert.guide?.username ?? '';
	const certTitle   = moduleTitle;

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20,
				flexDirection: 'row', alignItems: 'center',
			}}>
				<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
					<Ionicons name="arrow-back" size={22} color="#fff" />
				</TouchableOpacity>
				<Text style={{ fontFamily: FONTS.title, fontSize: 28, fontWeight: '600', color: '#fff' }}>My Certificate</Text>
			</View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
				<View style={{
					backgroundColor: '#fff', borderRadius: 20, paddingVertical: 28, paddingHorizontal: 24,
					shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 4,
				}}>
					<View style={{ alignItems: 'center', marginBottom: 16 }}>
						<View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' }}>
							<Ionicons name="ribbon" size={34} color="#15803d" />
						</View>
					</View>

					<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af', textAlign: 'center', letterSpacing: 1, marginBottom: 6 }}>
						CERTIFICATE OF COMPLETION
					</Text>
					<Text style={{ fontFamily: FONTS.body, fontSize: 14, color: '#374151', textAlign: 'center' }}>
						Sarawak Forestry Corporation
					</Text>

					<Divider />

					<Text style={{ fontFamily: FONTS.body, fontSize: 14, color: '#9ca3af', textAlign: 'center', fontStyle: 'italic', marginBottom: 10 }}>
						This certifies that
					</Text>
					{guideName ? (
						<Text style={{ fontFamily: FONTS.title, fontSize: 24, fontWeight: '700', color: '#111827', textAlign: 'center', letterSpacing: 1, marginBottom: 10 }}>
							{guideName.toUpperCase()}
						</Text>
					) : null}
					<Text style={{ fontFamily: FONTS.body, fontSize: 14, color: '#15803d', textAlign: 'center', fontStyle: 'italic', marginBottom: 10 }}>
						has successfully completed
					</Text>
					<Text style={{ fontFamily: FONTS.title, fontSize: 20, fontWeight: '600', color: '#15803d', textAlign: 'center', marginBottom: 6 }}>
						{certTitle || 'Certificate of Completion'}
					</Text>

					<Divider />

					<DetailPair
						left={{ label: 'ISSUED',   value: formatDate(cert.issueDate) }}
						right={cert.expiryDate ? { label: 'EXPIRES', value: formatDate(cert.expiryDate) } : null}
					/>
					{cert.issuerName && (
						<DetailPair
							left={{ label: 'ISSUED BY',    value: cert.issuerName }}
							right={{ label: 'TITLE',       value: cert.issuerTitle ?? '—' }}
						/>
					)}
					{cert.companyName && (
						<DetailPair
							left={{ label: 'ORGANISATION', value: cert.companyName }}
							right={null}
						/>
					)}

					<Divider />

					<View style={{ alignItems: 'center' }}>
						<View style={{ width: 160, height: 1, backgroundColor: '#374151', marginBottom: 10 }} />
						<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#111827', textAlign: 'center' }}>
							{cert.issuerName ?? 'Trainer'}
						</Text>
						{cert.issuerTitle && (
							<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 3 }}>
								{cert.issuerTitle}
							</Text>
						)}
					</View>
				</View>
			</ScrollView>

			<View style={{
				position: 'absolute', bottom: 0, left: 0, right: 0,
				backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb',
				paddingHorizontal: 16, paddingVertical: 14, paddingBottom: 28,
				flexDirection: 'row', gap: 12,
			}}>
				<TouchableOpacity
					onPress={handleDownload}
					disabled={downloading}
					style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12, backgroundColor: '#15803d' }}
				>
					{downloading ? (
						<ActivityIndicator color="#fff" size="small" />
					) : (
						<>
							<Ionicons name="download-outline" size={18} color="#fff" />
							<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#fff' }}>Download PDF</Text>
						</>
					)}
				</TouchableOpacity>
			</View>

		</View>
	);
}
