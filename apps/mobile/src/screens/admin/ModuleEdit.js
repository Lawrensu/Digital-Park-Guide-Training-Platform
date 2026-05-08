import React, { useState, useEffect } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, TextInput,
	ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { modulesApi } from '../../api/modules';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';

const T = {
	h1:      { fontFamily: FONTS.label, fontSize: 26, fontWeight: '600' },
	h4:      { fontFamily: FONTS.label, fontSize: 16, fontWeight: '600' },
	label:   { fontFamily: FONTS.label, fontSize: 14, fontWeight: '500' },
	caption: { fontFamily: FONTS.label, fontSize: 12, fontWeight: '500' },
};

const STATUSES = [
	{ value: 'DRAFT',     label: 'Draft',     color: '#d97706', bg: '#fef3c7' },
	{ value: 'PUBLISHED', label: 'Published', color: '#16a34a', bg: '#dcfce7' },
	{ value: 'ARCHIVED',  label: 'Archived',  color: '#6b7280', bg: '#f3f4f6' },
];

function FieldLabel({ text }) {
	return (
		<Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 6, marginTop: 18 }]}>
			{text}
		</Text>
	);
}

export default function ModuleEdit() {
	const navigation   = useNavigation();
	const { isOnline } = useNetworkStatus();
	const route        = useRoute();
	const { moduleId } = route.params;

	const [module,       setModule]       = useState(null);
	const [loading,      setLoading]      = useState(true);
	const [saving,       setSaving]       = useState(false);
	const [deleting,     setDeleting]     = useState(false);

	// Form fields
	const [title,       setTitle]       = useState('');
	const [description, setDescription] = useState('');
	const [status,      setStatus]      = useState('DRAFT');

	useEffect(() => {
		modulesApi.getOne(moduleId)
			.then((data) => {
				setModule(data);
				setTitle(data.title ?? '');
				setDescription(data.description ?? '');
				setStatus(data.status ?? 'DRAFT');
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, [moduleId]);

	async function handleSave(targetStatus) {
		if (!title.trim()) {
			Alert.alert('Required', 'Please enter a module title.');
			return;
		}
		setSaving(true);
		try {
			await modulesApi.update(moduleId, {
				title: title.trim(),
				description: description.trim(),
			});
			const newStatus = targetStatus ?? status;
			if (newStatus !== module?.status) {
				await modulesApi.setStatus(moduleId, newStatus);
				setStatus(newStatus);
			}
			Alert.alert('Saved', 'Module updated successfully.', [
				{ text: 'OK', onPress: () => navigation.goBack() },
			]);
		} catch (e) {
			Alert.alert('Error', e?.message ?? 'Could not save module.');
		} finally {
			setSaving(false);
		}
	}

	function handleDelete() {
		Alert.alert(
			'Delete Module',
			'This will permanently delete the module and all its content. This action cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						setDeleting(true);
						try {
							await modulesApi.remove(moduleId);
							navigation.goBack();
						} catch (e) {
							Alert.alert('Error', e?.message ?? 'Could not delete module.');
						} finally {
							setDeleting(false);
						}
					},
				},
			]
		);
	}

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

	return (
		<View style={{ flex: 1, backgroundColor: '#f9fafb' }}>

			{/* Green header */}
			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 18, paddingHorizontal: 20,
				flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
			}}>
				<View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 14 }}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons name="arrow-back" size={22} color="#fff" />
					</TouchableOpacity>
					<Text style={[T.h1, { color: '#fff' }]}>Edit Module</Text>
				</View>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
				keyboardShouldPersistTaps="handled"
			>

				{/* TITLE */}
				<FieldLabel text="TITLE" />
				<TextInput
					value={title}
					onChangeText={setTitle}
					placeholder="Module title"
					placeholderTextColor="#9ca3af"
					style={{
						borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
						paddingHorizontal: 14, paddingVertical: 12,
						fontSize: 15, color: '#111827', backgroundColor: '#fff',
					}}
				/>

				{/* DESCRIPTION */}
				<FieldLabel text="DESCRIPTION" />
				<TextInput
					value={description}
					onChangeText={setDescription}
					placeholder="Module description..."
					placeholderTextColor="#9ca3af"
					multiline
					numberOfLines={4}
					textAlignVertical="top"
					style={{
						borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
						paddingHorizontal: 14, paddingVertical: 12,
						fontSize: 15, color: '#111827', minHeight: 100, lineHeight: 22,
						backgroundColor: '#fff',
					}}
				/>

				{/* STATUS */}
				<FieldLabel text="STATUS" />
				<View style={{ flexDirection: 'row', gap: 8 }}>
					{STATUSES.map((s) => (
						<TouchableOpacity
							key={s.value}
							onPress={() => setStatus(s.value)}
							style={{
								flex: 1, paddingVertical: 11, borderRadius: 10,
								alignItems: 'center',
								backgroundColor: status === s.value ? s.bg : '#fff',
								borderWidth: 1.5,
								borderColor: status === s.value ? s.color : '#e5e7eb',
							}}
						>
							<Text style={[T.caption, {
								color: status === s.value ? s.color : '#6b7280',
								fontWeight: '700',
							}]}>
								{s.label}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* Content & Quiz shortcuts */}
				<View style={{
					backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden',
					borderWidth: 1, borderColor: '#e5e7eb', marginTop: 20,
				}}>
					<TouchableOpacity
						onPress={() => navigation.navigate('ContentBuild', { moduleId })}
						style={{
							flexDirection: 'row', alignItems: 'center',
							paddingHorizontal: 16, paddingVertical: 16,
							borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
						}}
					>
						<View style={{
							width: 36, height: 36, borderRadius: 10,
							backgroundColor: '#fff7ed',
							alignItems: 'center', justifyContent: 'center', marginRight: 14,
						}}>
							<Ionicons name="document-text" size={18} color="#ea580c" />
						</View>
						<Text style={[T.label, { flex: 1, color: '#111827', fontSize: 15 }]}>
							Manage Content Items ({module._count?.contentItems ?? 0})
						</Text>
						<Ionicons name="arrow-forward" size={18} color="#9ca3af" />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => navigation.navigate('QuizEdit', { moduleId })}
						style={{
							flexDirection: 'row', alignItems: 'center',
							paddingHorizontal: 16, paddingVertical: 16,
						}}
					>
						<View style={{
							width: 36, height: 36, borderRadius: 10,
							backgroundColor: '#fef9c3',
							alignItems: 'center', justifyContent: 'center', marginRight: 14,
						}}>
							<Ionicons name="clipboard" size={18} color="#ca8a04" />
						</View>
						<Text style={[T.label, { flex: 1, color: '#111827', fontSize: 15 }]}>
							Manage Quiz ({module._count?.quizzes ?? 0})
						</Text>
						<Ionicons name="arrow-forward" size={18} color="#9ca3af" />
					</TouchableOpacity>
				</View>

				{/* Save buttons */}
				<TouchableOpacity
					onPress={() => handleSave(status === 'DRAFT' ? 'PUBLISHED' : status)}
					disabled={saving || deleting}
					style={{
						backgroundColor: '#15803d', borderRadius: 14,
						paddingVertical: 16, alignItems: 'center',
						marginTop: 24, marginBottom: 12,
					}}
				>
					{saving
						? <ActivityIndicator color="#fff" />
						: <Text style={[T.h4, { color: '#fff' }]}>
							{status === 'DRAFT' ? 'Save & Publish' : 'Save Changes'}
						</Text>
					}
				</TouchableOpacity>

				{status !== 'DRAFT' && (
					<TouchableOpacity
						onPress={() => handleSave('DRAFT')}
						disabled={saving || deleting}
						style={{
							borderWidth: 1.5, borderColor: '#15803d', borderRadius: 14,
							paddingVertical: 16, alignItems: 'center', marginBottom: 12,
						}}
					>
						<Text style={[T.h4, { color: '#15803d' }]}>Save as Draft</Text>
					</TouchableOpacity>
				)}

				<TouchableOpacity
					onPress={handleDelete}
					disabled={saving || deleting}
					style={{ alignItems: 'center', paddingVertical: 10 }}
				>
					{deleting
						? <ActivityIndicator color="#dc2626" />
						: <Text style={[T.label, { color: '#dc2626' }]}>Delete Module</Text>
					}
				</TouchableOpacity>

			</ScrollView>
		</View>
	);
}
