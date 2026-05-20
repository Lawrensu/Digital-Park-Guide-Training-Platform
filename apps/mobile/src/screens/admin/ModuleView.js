import React, { useState, useEffect } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { modulesApi } from '../../api/modules';
import { contentItemsApi } from '../../api/contentItems';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';

const T = {
	h2:      { fontFamily: FONTS.label, fontSize: 24, fontWeight: '600' },
	h4:      { fontFamily: FONTS.label, fontSize: 16, fontWeight: '600' },
	label:   { fontFamily: FONTS.label, fontSize: 14, fontWeight: '500' },
	caption: { fontFamily: FONTS.label, fontSize: 12, fontWeight: '500' },
};

const TYPE_ICON = {
	TEXT:        { icon: 'document-text-outline', iconBg: '#f3f4f6',  iconColor: '#6b7280' },
	VIDEO:       { icon: 'play-circle-outline',   iconBg: '#eff6ff',  iconColor: '#3b82f6' },
	IMAGE:       { icon: 'image-outline',         iconBg: '#fef3c7',  iconColor: '#d97706' },
	INFOGRAPHIC: { icon: 'layers-outline',        iconBg: '#f5f3ff',  iconColor: '#7c3aed' },
	QUIZ:        { icon: 'clipboard-outline',     iconBg: '#dcfce7',  iconColor: '#16a34a' },
};

const STATUS_CFG = {
	PUBLISHED: { label: 'Published', color: '#16a34a', bg: '#dcfce7' },
	DRAFT:     { label: 'Draft',     color: '#d97706', bg: '#fef3c7' },
	ARCHIVED:  { label: 'Archived',  color: '#6b7280', bg: '#f3f4f6' },
};

function ContentCard({ item, isLast }) {
	const cfg = TYPE_ICON[item.type] ?? TYPE_ICON.TEXT;

	let preview = '';
	if (item.type === 'TEXT')  preview = item.textContent ? item.textContent.slice(0, 100) + '…' : '';
	if (item.type === 'VIDEO') preview = item.videoUrl ?? '';
	if (item.type === 'QUIZ')  preview = 'Quiz content';

	return (
		<View>
			<View style={{
				flexDirection: 'row', alignItems: 'center',
				paddingHorizontal: 16, paddingVertical: 14, gap: 12,
			}}>
				<View style={{
					width: 40, height: 40, borderRadius: 10,
					backgroundColor: cfg.iconBg,
					alignItems: 'center', justifyContent: 'center', flexShrink: 0,
				}}>
					<Ionicons name={cfg.icon} size={20} color={cfg.iconColor} />
				</View>
				<View style={{ flex: 1 }}>
					<Text style={[T.label, { color: '#111827', marginBottom: 2 }]}>
						{item.title ?? item.type}
					</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
						<View style={{
							paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4,
							backgroundColor: cfg.iconBg,
						}}>
							<Text style={[T.caption, { color: cfg.iconColor, fontWeight: '700' }]}>
								{item.type}
							</Text>
						</View>
						{preview ? (
							<Text
								style={[T.caption, { color: '#9ca3af', flex: 1 }]}
								numberOfLines={1}
							>
								{preview}
							</Text>
						) : null}
					</View>
				</View>
			</View>
			{!isLast && (
				<View style={{ height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 16 }} />
			)}
		</View>
	);
}

export default function ModuleView() {
	const navigation   = useNavigation();
	const { isOnline } = useNetworkStatus();
	const route        = useRoute();
	const { moduleId } = route.params;

	const [module,       setModule]       = useState(null);
	const [items,        setItems]        = useState([]);
	const [loading,      setLoading]      = useState(true);

	useEffect(() => {
		async function load() {
			try {
				const [mod, contentItems] = await Promise.all([
					modulesApi.getOne(moduleId),
					contentItemsApi.getAll(moduleId),
				]);
				setModule(mod);
				setItems(Array.isArray(contentItems) ? contentItems : []);
			} catch {
				// fail silently; handled by null check below
			} finally {
				setLoading(false);
			}
		}
		load();
	}, [moduleId]);

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator size="large" color="#15803d" />
			</View>
		);
	}

	if (!module) {
		return (
			<View style={{ flex: 1, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
				<Ionicons name="alert-circle-outline" size={44} color="#dc2626" />
				<Text style={[T.label, { color: '#6b7280', marginTop: 12 }]}>Could not load module.</Text>
				<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
					<Text style={[T.label, { color: '#15803d', fontWeight: '700' }]}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	const statusCfg = STATUS_CFG[module.status] ?? STATUS_CFG.DRAFT;

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			{/* Green header */}
			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 18, paddingHorizontal: 20,
				flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
			}}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons name="arrow-back" size={22} color="#fff" />
					</TouchableOpacity>
					<View>
						<Text style={[T.h2, { color: '#fff' }]}>View Module</Text>
						<Text style={[T.caption, { color: 'rgba(255,255,255,0.75)', marginTop: 2 }]}>
							Read-only view
						</Text>
					</View>
				</View>
				<TouchableOpacity onPress={() => navigation.navigate('ModuleEdit', { moduleId })}>
					<Text style={[T.label, { color: '#fff', fontWeight: '700' }]}>Edit</Text>
				</TouchableOpacity>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
			>

				{/* Module info card */}
				<View style={{
					backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 20,
					shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
				}}>
					<View style={{
						flexDirection: 'row', alignItems: 'center',
						justifyContent: 'space-between', marginBottom: 10,
					}}>
						<Text style={[T.h2, { color: '#111827', flex: 1, marginRight: 10, lineHeight: 30 }]}>
							{module.title}
						</Text>
						<View style={{
							paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
							backgroundColor: statusCfg.bg,
						}}>
							<Text style={[T.caption, { color: statusCfg.color, fontWeight: '700' }]}>
								{statusCfg.label}
							</Text>
						</View>
					</View>

					<View style={{ flexDirection: 'row', gap: 16, marginBottom: 12 }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
							<Ionicons name="albums" size={14} color="#7c3aed" />
							<Text style={[T.caption, { color: '#374151' }]}>{items.length} items</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
							<Ionicons name="person-outline" size={14} color="#6b7280" />
							<Text style={[T.caption, { color: '#374151' }]}>
								{module._count?.enrolments ?? 0} enrolled
							</Text>
						</View>
					</View>

					{module.description ? (
						<Text style={{ fontSize: 14, color: '#6b7280', lineHeight: 22 }}>
							{module.description}
						</Text>
					) : null}
				</View>

				{/* Content items */}
				<Text style={[T.h4, { color: '#111827', marginBottom: 12 }]}>
					Content ({items.length})
				</Text>

				{items.length === 0 ? (
					<View style={{ alignItems: 'center', paddingVertical: 32 }}>
						<Ionicons name="document-outline" size={36} color="#d1d5db" />
						<Text style={[T.caption, { color: '#9ca3af', marginTop: 8 }]}>No content items yet</Text>
					</View>
				) : (
					<View style={{
						backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
						shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, marginBottom: 16,
					}}>
						{items.map((item, i) => (
							<ContentCard key={item.id} item={item} isLast={i === items.length - 1} />
						))}
					</View>
				)}

				{/* Action buttons */}
				<TouchableOpacity
					onPress={() => navigation.navigate('ModuleEdit', { moduleId })}
					style={{
						backgroundColor: '#15803d', borderRadius: 14,
						paddingVertical: 16, alignItems: 'center', marginBottom: 10,
					}}
				>
					<Text style={[T.label, { color: '#fff', fontWeight: '700', fontSize: 15 }]}>
						Edit This Module
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={{
						borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 14,
						paddingVertical: 16, alignItems: 'center', backgroundColor: '#fff',
					}}
				>
					<Text style={[T.label, { color: '#374151', fontWeight: '600', fontSize: 15 }]}>
						Back to Module List
					</Text>
				</TouchableOpacity>

			</ScrollView>
		</View>
	);
}
