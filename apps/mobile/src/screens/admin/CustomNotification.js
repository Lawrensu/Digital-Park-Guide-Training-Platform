import React, { useState, useEffect, useCallback } from 'react';
import {
	View, Text, Modal, ScrollView, TouchableOpacity,
	TextInput, Platform, KeyboardAvoidingView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usersApi } from '../../api/users';
import { notificationsApi } from '../../api/notifications';
import { FONTS } from '../../theme/fonts';

const T = {
	h2:      { fontFamily: FONTS.label, fontSize: 24, fontWeight: '600' },
	h4:      { fontFamily: FONTS.label, fontSize: 16, fontWeight: '600' },
	label:   { fontFamily: FONTS.label, fontSize: 14, fontWeight: '500' },
	caption: { fontFamily: FONTS.label, fontSize: 12, fontWeight: '500' },
};

function FieldLabel({ text }) {
	return (
		<Text style={[T.caption, {
			color: '#9ca3af', letterSpacing: 0.5, marginBottom: 8, marginTop: 20,
		}]}>
			{text}
		</Text>
	);
}

export default function CustomNotificationModal({ visible, onClose, onSent }) {
	const [guides,     setGuides]     = useState([]);
	const [sendToAll,  setSendToAll]  = useState(true);
	const [selected,   setSelected]   = useState([]);
	const [title,      setTitle]      = useState('');
	const [message,    setMessage]    = useState('');
	const [loading,    setLoading]    = useState(false);

	// Load guides whenever the modal opens
	useEffect(() => {
		if (!visible) return;
		usersApi.getAll({ role: 'GUIDE', limit: 100 })
			.then((data) => setGuides(Array.isArray(data) ? data : []))
			.catch(() => setGuides([]));
	}, [visible]);

	const toggleGuide = useCallback((id) => {
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
		);
	}, []);

	function handleClose() {
		setTitle('');
		setMessage('');
		setSelected([]);
		setSendToAll(true);
		onClose();
	}

	async function handleSend() {
		if (!title.trim()) {
			Alert.alert('Required', 'Please enter a notification title.');
			return;
		}
		if (!message.trim()) {
			Alert.alert('Required', 'Please enter a message.');
			return;
		}
		if (!sendToAll && selected.length === 0) {
			Alert.alert('Required', 'Please select at least one recipient.');
			return;
		}

		const payload = {
			title: title.trim(),
			body:  message.trim(),
		};
		if (sendToAll) {
			payload.role = 'GUIDE';
		} else {
			payload.userIds = selected;
		}

		setLoading(true);
		try {
			const result = await notificationsApi.sendCustom(payload);
			Alert.alert('Sent', `Notification sent to ${result?.count ?? 'all'} guide(s).`);
			handleClose();
			onSent?.();
		} catch (e) {
			Alert.alert('Error', e?.message ?? 'Could not send notification.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
			<View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' }}>
				<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
					<View style={{
						backgroundColor: '#fff',
						borderTopLeftRadius: 24, borderTopRightRadius: 24,
						overflow: 'hidden', maxHeight: '94%',
					}}>

						{/* Green header */}
						<View style={{
							backgroundColor: '#15803d',
							paddingTop: 24, paddingBottom: 20, paddingHorizontal: 20,
						}}>
							<View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
								<View style={{ flex: 1 }}>
									<Text style={[T.h2, { color: '#fff' }]}>Send Notification</Text>
									<Text style={[T.caption, { color: 'rgba(255,255,255,0.75)', marginTop: 4 }]}>
										Customise and send to guides
									</Text>
								</View>
								<TouchableOpacity onPress={handleClose} style={{ padding: 4 }}>
									<Ionicons name="close" size={22} color="#fff" />
								</TouchableOpacity>
							</View>
						</View>

						{/* Scrollable body */}
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ padding: 20, paddingBottom: 36 }}
							keyboardShouldPersistTaps="handled"
						>

							{/* SEND TO */}
							<FieldLabel text="SEND TO" />
							<View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
								<TouchableOpacity
									onPress={() => setSendToAll(true)}
									style={{
										paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20,
										backgroundColor: sendToAll ? '#15803d' : '#fff',
										borderWidth: 1.5, borderColor: sendToAll ? '#15803d' : '#d1d5db',
									}}
								>
									<Text style={[T.label, { color: sendToAll ? '#fff' : '#374151' }]}>
										All Park Guides
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => setSendToAll(false)}
									style={{
										paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20,
										backgroundColor: !sendToAll ? '#15803d' : '#fff',
										borderWidth: 1.5, borderColor: !sendToAll ? '#15803d' : '#d1d5db',
									}}
								>
									<Text style={[T.label, { color: !sendToAll ? '#fff' : '#374151' }]}>
										Specific Guides
									</Text>
								</TouchableOpacity>
							</View>

							{/* Per-guide checkbox list when not sending to all */}
							{!sendToAll && (
								<View style={{
									borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12,
									overflow: 'hidden', marginBottom: 4,
								}}>
									{guides.length === 0 ? (
										<View style={{ padding: 16, alignItems: 'center' }}>
											<Text style={[T.caption, { color: '#9ca3af' }]}>No guides found</Text>
										</View>
									) : (
										guides.map((g, i) => {
											const isSelected = selected.includes(g.id);
											return (
												<TouchableOpacity
													key={g.id}
													onPress={() => toggleGuide(g.id)}
													style={{
														flexDirection: 'row', alignItems: 'center',
														paddingHorizontal: 16, paddingVertical: 13,
														borderBottomWidth: i < guides.length - 1 ? 1 : 0,
														borderBottomColor: '#f3f4f6',
														backgroundColor: isSelected ? '#f0fdf4' : '#fff',
													}}
												>
													<View style={{
														width: 20, height: 20, borderRadius: 4,
														borderWidth: 1.5,
														borderColor: isSelected ? '#15803d' : '#d1d5db',
														backgroundColor: isSelected ? '#15803d' : '#fff',
														alignItems: 'center', justifyContent: 'center',
														marginRight: 12,
													}}>
														{isSelected && (
															<Ionicons name="checkmark" size={13} color="#fff" />
														)}
													</View>
													<View style={{ flex: 1 }}>
														<Text style={[T.label, { color: '#111827' }]}>{g.username}</Text>
														<Text style={[T.caption, { color: '#9ca3af', marginTop: 1 }]}>{g.email}</Text>
													</View>
												</TouchableOpacity>
											);
										})
									)}
								</View>
							)}

							{/* TITLE */}
							<FieldLabel text="TITLE" />
							<TextInput
								value={title}
								onChangeText={setTitle}
								placeholder="Enter notification title"
								placeholderTextColor="#9ca3af"
								style={{
									borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
									paddingHorizontal: 14, paddingVertical: 12,
									fontSize: 15, color: '#111827',
								}}
							/>

							{/* MESSAGE */}
							<FieldLabel text="MESSAGE" />
							<TextInput
								value={message}
								onChangeText={setMessage}
								placeholder="Enter your message..."
								placeholderTextColor="#9ca3af"
								multiline
								numberOfLines={5}
								textAlignVertical="top"
								style={{
									borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
									paddingHorizontal: 14, paddingVertical: 12,
									fontSize: 15, color: '#111827',
									minHeight: 120, lineHeight: 22,
								}}
							/>

							{/* Send button */}
							<TouchableOpacity
								onPress={handleSend}
								disabled={loading}
								activeOpacity={0.85}
								style={{
									backgroundColor: '#15803d', borderRadius: 14,
									paddingVertical: 16, marginTop: 24, marginBottom: 10,
									flexDirection: 'row', alignItems: 'center',
									justifyContent: 'center', gap: 10,
								}}
							>
								{loading ? (
									<ActivityIndicator color="#fff" />
								) : (
									<>
										<Ionicons name="notifications" size={18} color="#fff" />
										<Text style={[T.h4, { color: '#fff' }]}>Send Notification</Text>
									</>
								)}
							</TouchableOpacity>

							<TouchableOpacity onPress={handleClose} style={{ alignItems: 'center', paddingVertical: 8 }}>
								<Text style={[T.label, { color: '#6b7280' }]}>Cancel</Text>
							</TouchableOpacity>

						</ScrollView>
					</View>
				</KeyboardAvoidingView>
			</View>
		</Modal>
	);
}
