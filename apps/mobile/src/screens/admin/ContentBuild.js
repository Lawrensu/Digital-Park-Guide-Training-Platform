import React, { useState, useEffect, useCallback } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, TextInput,
	ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { contentItemsApi } from '../../api/contentItems';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';

const T = {
	h1:      { fontFamily: FONTS.label, fontSize: 26, fontWeight: '600' },
	h4:      { fontFamily: FONTS.label, fontSize: 16, fontWeight: '600' },
	label:   { fontFamily: FONTS.label, fontSize: 14, fontWeight: '500' },
	caption: { fontFamily: FONTS.label, fontSize: 12, fontWeight: '500' },
};

const TYPE_CFG = {
	TEXT:        { icon: 'document-text-outline', iconBg: '#f3f4f6', iconColor: '#6b7280', label: 'Text'        },
	VIDEO:       { icon: 'play-circle-outline',   iconBg: '#eff6ff', iconColor: '#3b82f6', label: 'Video'       },
	IMAGE:       { icon: 'image-outline',         iconBg: '#fef3c7', iconColor: '#d97706', label: 'Image'       },
	INFOGRAPHIC: { icon: 'layers-outline',        iconBg: '#f5f3ff', iconColor: '#7c3aed', label: 'Infographic' },
	QUIZ:        { icon: 'clipboard-outline',     iconBg: '#dcfce7', iconColor: '#16a34a', label: 'Quiz'        },
};

const CREATABLE_TYPES = ['TEXT', 'VIDEO'];


function ItemCard({ item, isLast, onDelete }) {
	const cfg = TYPE_CFG[item.type] ?? TYPE_CFG.TEXT;

	let preview = '';
	if (item.type === 'TEXT' && item.textContent) {
		preview = item.textContent.length > 80
			? item.textContent.slice(0, 80) + '…'
			: item.textContent;
	}
	if (item.type === 'VIDEO') preview = item.videoUrl ?? '';

	function handleDelete() {
		Alert.alert(
			'Delete Item',
			`Delete "${item.title ?? cfg.label}"? This cannot be undone.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) },
			]
		);
	}

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
						{item.title ?? cfg.label}
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
							<Text style={[T.caption, { color: '#9ca3af', flex: 1 }]} numberOfLines={1}>
								{preview}
							</Text>
						) : null}
					</View>
				</View>
				<TouchableOpacity onPress={handleDelete}>
					<Ionicons name="trash-outline" size={18} color="#dc2626" />
				</TouchableOpacity>
			</View>
			{!isLast && (
				<View style={{ height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 16 }} />
			)}
		</View>
	);
}


function AddItemForm({ moduleId, itemCount, onAdded, onCancel }) {
	const [addType,     setAddType]     = useState('TEXT');
	const [addTitle,    setAddTitle]    = useState('');
	const [textContent, setTextContent] = useState('');
	const [videoUrl,    setVideoUrl]    = useState('');
	const [videoSource, setVideoSource] = useState('YOUTUBE');
	const [saving,      setSaving]      = useState(false);

	const isText  = addType === 'TEXT';
	const isVideo = addType === 'VIDEO';

	async function handleSave() {
		if (isText && !textContent.trim()) {
			Alert.alert('Required', 'Please enter text content.');
			return;
		}
		if (isVideo && !videoUrl.trim()) {
			Alert.alert('Required', 'Please enter a video URL.');
			return;
		}

		const payload = {
			type: addType,
			title: addTitle.trim() || null,
			order: itemCount,
			...(isText  ? { textContent: textContent.trim() } : {}),
			...(isVideo ? { videoUrl: videoUrl.trim(), videoSource } : {}),
		};

		setSaving(true);
		try {
			const created = await contentItemsApi.create(moduleId, payload);
			onAdded(created);
		} catch (e) {
			Alert.alert('Error', e?.message ?? 'Could not add content item.');
		} finally {
			setSaving(false);
		}
	}

	return (
		<View style={{
			backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 8,
			borderWidth: 1.5, borderColor: '#15803d',
		}}>
			<Text style={[T.h4, { color: '#111827', marginBottom: 12 }]}>New Content Item</Text>

			<Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 8 }]}>TYPE</Text>
			<View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
				{CREATABLE_TYPES.map((type) => {
					const cfg = TYPE_CFG[type];
					const active = addType === type;
					return (
						<TouchableOpacity
							key={type}
							onPress={() => setAddType(type)}
							style={{
								flex: 1, paddingVertical: 12, borderRadius: 10,
								alignItems: 'center', gap: 6,
								backgroundColor: active ? cfg.iconBg : '#f9fafb',
								borderWidth: 1.5,
								borderColor: active ? cfg.iconColor : '#e5e7eb',
							}}
						>
							<Ionicons name={cfg.icon} size={20} color={active ? cfg.iconColor : '#9ca3af'} />
							<Text style={[T.caption, {
								color: active ? cfg.iconColor : '#6b7280',
								fontWeight: active ? '700' : '500',
							}]}>
								{cfg.label}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>

			<Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 6 }]}>TITLE (optional)</Text>
			<TextInput
				value={addTitle}
				onChangeText={setAddTitle}
				placeholder="Content item title..."
				placeholderTextColor="#9ca3af"
				style={{
					borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
					paddingHorizontal: 12, paddingVertical: 11,
					fontSize: 14, color: '#111827', marginBottom: 14,
				}}
			/>

			{isText && (
				<>
					<Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 6 }]}>TEXT CONTENT</Text>
					<TextInput
						value={textContent}
						onChangeText={setTextContent}
						placeholder="Enter text content..."
						placeholderTextColor="#9ca3af"
						multiline
						textAlignVertical="top"
						style={{
							borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
							paddingHorizontal: 12, paddingVertical: 10,
							fontSize: 14, color: '#111827', minHeight: 120, lineHeight: 20,
							marginBottom: 14,
						}}
					/>
				</>
			)}

			{isVideo && (
				<>
					<Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 8 }]}>VIDEO SOURCE</Text>
					<View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
						{[['YOUTUBE', 'YouTube'], ['S3', 'S3 (AWS)']].map(([val, lbl]) => (
							<TouchableOpacity
								key={val}
								onPress={() => setVideoSource(val)}
								style={{
									flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
									backgroundColor: videoSource === val ? '#eff6ff' : '#fff',
									borderWidth: 1.5,
									borderColor: videoSource === val ? '#3b82f6' : '#e5e7eb',
								}}
							>
								<Text style={[T.label, {
									color: videoSource === val ? '#3b82f6' : '#6b7280',
									fontWeight: videoSource === val ? '700' : '500',
								}]}>
									{lbl}
								</Text>
							</TouchableOpacity>
						))}
					</View>

					<Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 6 }]}>VIDEO URL</Text>
					<TextInput
						value={videoUrl}
						onChangeText={setVideoUrl}
						placeholder={videoSource === 'YOUTUBE' ? 'https://youtube.com/watch?v=...' : 'S3 video URL'}
						placeholderTextColor="#9ca3af"
						autoCapitalize="none"
						autoCorrect={false}
						style={{
							borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
							paddingHorizontal: 12, paddingVertical: 11,
							fontSize: 14, color: '#111827', marginBottom: 14,
						}}
					/>
				</>
			)}

			<View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
				<TouchableOpacity
					onPress={onCancel}
					disabled={saving}
					style={{
						flex: 1, paddingVertical: 12, borderRadius: 10,
						borderWidth: 1.5, borderColor: '#e5e7eb', alignItems: 'center',
					}}
				>
					<Text style={[T.label, { color: '#374151' }]}>Cancel</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleSave}
					disabled={saving}
					style={{
						flex: 2, paddingVertical: 12, borderRadius: 10,
						backgroundColor: '#15803d', alignItems: 'center',
					}}
				>
					{saving
						? <ActivityIndicator color="#fff" size="small" />
						: <Text style={[T.label, { color: '#fff', fontWeight: '700' }]}>Add Item</Text>
					}
				</TouchableOpacity>
			</View>
		</View>
	);
}


export default function ContentBuild() {
	const navigation   = useNavigation();
	const { isOnline } = useNetworkStatus();
	const route        = useRoute();
	const { moduleId } = route.params ?? {};

	const [items,       setItems]       = useState([]);
	const [loading,     setLoading]     = useState(true);
	const [refreshing,  setRefreshing]  = useState(false);
	const [showAddForm, setShowAddForm] = useState(false);

	const load = useCallback(async () => {
		try {
			const data = await contentItemsApi.getAll(moduleId);
			setItems(Array.isArray(data) ? data : []);
		} catch {
			setItems([]);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [moduleId]);

	useEffect(() => { load(); }, [load]);

	const onRefresh = () => { setRefreshing(true); load(); };

	async function handleDelete(itemId) {
		try {
			await contentItemsApi.remove(moduleId, itemId);
			setItems((prev) => prev.filter((item) => item.id !== itemId));
		} catch (e) {
			Alert.alert('Error', e?.message ?? 'Could not delete item.');
		}
	}

	function handleItemAdded(item) {
		setItems((prev) => [...prev, item]);
		setShowAddForm(false);
	}

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			{/* Green header */}
			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 18, paddingHorizontal: 20,
			}}>
				<View style={{
					flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
				}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Ionicons name="arrow-back" size={22} color="#fff" />
						</TouchableOpacity>
						<View>
							<Text style={[T.h1, { color: '#fff' }]}>Content Build</Text>
							<Text style={[T.caption, { color: 'rgba(255,255,255,0.75)', marginTop: 2 }]}>
								{items.length} item{items.length !== 1 ? 's' : ''}
							</Text>
						</View>
					</View>
					{!showAddForm && (
						<TouchableOpacity
							onPress={() => setShowAddForm(true)}
							style={{
								flexDirection: 'row', alignItems: 'center', gap: 6,
								backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
								paddingHorizontal: 14, paddingVertical: 8,
							}}
						>
							<Ionicons name="add" size={18} color="#fff" />
							<Text style={[T.label, { color: '#fff' }]}>Add</Text>
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
					contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#15803d" />
					}
					keyboardShouldPersistTaps="handled"
				>

					{items.length === 0 && !showAddForm ? (
						<View style={{ alignItems: 'center', marginTop: 48 }}>
							<Ionicons name="document-outline" size={44} color="#d1d5db" />
							<Text style={[T.label, { color: '#9ca3af', marginTop: 12 }]}>No content items yet</Text>
							<TouchableOpacity
								onPress={() => setShowAddForm(true)}
								style={{
									marginTop: 16, backgroundColor: '#15803d', borderRadius: 10,
									paddingHorizontal: 20, paddingVertical: 12,
								}}
							>
								<Text style={[T.label, { color: '#fff' }]}>Add First Item</Text>
							</TouchableOpacity>
						</View>
					) : (
						<>
							{items.length > 0 && (
								<View style={{
									backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
									shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
									shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
									marginBottom: 16,
								}}>
									{items.map((item, i) => (
										<ItemCard
											key={item.id}
											item={item}
											isLast={i === items.length - 1}
											onDelete={handleDelete}
										/>
									))}
								</View>
							)}

							{!showAddForm && (
								<TouchableOpacity
									onPress={() => setShowAddForm(true)}
									style={{
										borderWidth: 1.5, borderColor: '#d1d5db', borderStyle: 'dashed',
										borderRadius: 14, paddingVertical: 14,
										alignItems: 'center', justifyContent: 'center',
									}}
								>
									<Text style={[T.label, { color: '#9ca3af' }]}>+ Add Content Item</Text>
								</TouchableOpacity>
							)}
						</>
					)}

					{showAddForm && (
						<AddItemForm
							moduleId={moduleId}
							itemCount={items.length}
							onAdded={handleItemAdded}
							onCancel={() => setShowAddForm(false)}
						/>
					)}

				</ScrollView>
			)}
		</View>
	);
}
