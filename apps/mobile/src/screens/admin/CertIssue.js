import React, { useState } from 'react';
import {
	View, Text, Modal, ScrollView, TouchableOpacity,
	TextInput, Platform, KeyboardAvoidingView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { certificationsApi } from '../../api/certifications';
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
			color: '#9ca3af', letterSpacing: 0.5, marginBottom: 6, marginTop: 16,
		}]}>
			{text}
		</Text>
	);
}

function InputBox({ value, onChangeText, placeholder, editable = true, keyboardType }) {
	return (
		<TextInput
			value={value}
			onChangeText={onChangeText}
			placeholder={placeholder}
			placeholderTextColor="#9ca3af"
			editable={editable}
			keyboardType={keyboardType}
			style={{
				borderWidth: 1,
				borderColor: '#e5e7eb',
				borderRadius: 10,
				paddingHorizontal: 14,
				paddingVertical: 12,
				fontSize: 15,
				color: editable ? '#111827' : '#6b7280',
				backgroundColor: editable ? '#fff' : '#f9fafb',
			}}
		/>
	);
}

export default function CertIssueModal({
	visible, onClose, onIssued,
	attemptId, guideId, moduleId, guideName, moduleTitle,
}) {
	const [companyName, setCompanyName] = useState('Sarawak Forestry Corporation');
	const [issuerName,  setIssuerName]  = useState('');
	const [issuerTitle, setIssuerTitle] = useState('');
	const [issueDate,   setIssueDate]   = useState(() => new Date().toISOString().slice(0, 10));
	const [expiryDate,  setExpiryDate]  = useState('');
	const [loading,     setLoading]     = useState(false);

	// Guard: modal can't render usefully without these IDs
	if (!attemptId || !guideId || !moduleId) return null;

	const initial = (guideName ?? 'G').charAt(0).toUpperCase();
	const datePattern = /^\d{4}-\d{2}-\d{2}$/;

	async function handleIssue() {
		if (!companyName.trim()) {
			Alert.alert('Required', 'Please enter the company name.');
			return;
		}
		if (!issuerName.trim()) {
			Alert.alert('Required', 'Please enter the issuer name.');
			return;
		}
		if (!issuerTitle.trim()) {
			Alert.alert('Required', 'Please enter the issuer title/position.');
			return;
		}
		if (!datePattern.test(issueDate)) {
			Alert.alert('Invalid Date', 'Issue date must be in YYYY-MM-DD format (e.g. 2025-05-01).');
			return;
		}
		if (expiryDate && !datePattern.test(expiryDate)) {
			Alert.alert('Invalid Date', 'Expiry date must be in YYYY-MM-DD format (e.g. 2027-05-01).');
			return;
		}

		setLoading(true);
		try {
			await certificationsApi.issue({
				guideId,
				quizAttemptId: attemptId,
				moduleId,
				companyName:  companyName.trim(),
				issuerName:   issuerName.trim(),
				issuerTitle:  issuerTitle.trim(),
				issueDate,
				expiryDate:   expiryDate.trim() || null,
			});
			Alert.alert(
				'Certificate Issued',
				`Certificate issued to ${guideName ?? 'guide'} successfully.`,
			);
			onIssued?.();
			onClose();
		} catch (e) {
			Alert.alert('Error', e?.message ?? 'Could not issue certificate.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
			<View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' }}>
				<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
					<View style={{
						backgroundColor: '#fff',
						borderTopLeftRadius: 24, borderTopRightRadius: 24,
						overflow: 'hidden', maxHeight: '92%',
					}}>

						{/* Green header */}
						<View style={{
							backgroundColor: '#15803d',
							paddingTop: 24, paddingBottom: 20, paddingHorizontal: 20,
						}}>
							<View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
								<View style={{ flex: 1 }}>
									<Text style={[T.h2, { color: '#fff' }]}>Issue Certificate</Text>
									<Text style={[T.caption, { color: 'rgba(255,255,255,0.75)', marginTop: 4 }]}>
										Confirm and send to guide
									</Text>
								</View>
								<TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
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

							{/* Guide row */}
							<View style={{
								flexDirection: 'row', alignItems: 'center',
								paddingBottom: 16, marginBottom: 4,
								borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
							}}>
								<View style={{
									width: 44, height: 44, borderRadius: 22,
									backgroundColor: '#15803d',
									alignItems: 'center', justifyContent: 'center', marginRight: 12,
								}}>
									<Text style={[T.h4, { color: '#fff' }]}>{initial}</Text>
								</View>
								<View style={{ flex: 1 }}>
									<Text style={[T.h4, { color: '#111827' }]}>{guideName ?? '—'}</Text>
									<Text style={[T.caption, { color: '#6b7280', marginTop: 2 }]}>
										{moduleTitle ?? 'Module'}
									</Text>
								</View>
								<Text style={[T.caption, { color: '#0d9488', fontWeight: '700', letterSpacing: 0.3 }]}>
									PASSED
								</Text>
							</View>

							{/* Company Name */}
							<FieldLabel text="COMPANY NAME" />
							<InputBox
								value={companyName}
								onChangeText={setCompanyName}
								placeholder="Sarawak Forestry Corporation"
							/>

							{/* Issuer Name */}
							<FieldLabel text="ISSUER NAME" />
							<InputBox
								value={issuerName}
								onChangeText={setIssuerName}
								placeholder="e.g. Dr. Ahmad bin Yusof"
							/>

							{/* Issuer Title */}
							<FieldLabel text="ISSUER TITLE / POSITION" />
							<InputBox
								value={issuerTitle}
								onChangeText={setIssuerTitle}
								placeholder="e.g. Chief Executive Officer"
							/>

							{/* Issue Date */}
							<FieldLabel text="ISSUE DATE (YYYY-MM-DD)" />
							<InputBox
								value={issueDate}
								onChangeText={setIssueDate}
								placeholder="2025-05-01"
							/>

							{/* Expiry Date */}
							<FieldLabel text="EXPIRY DATE (YYYY-MM-DD) — OPTIONAL" />
							<InputBox
								value={expiryDate}
								onChangeText={setExpiryDate}
								placeholder="2027-05-01"
							/>

							{/* Issue button */}
							<TouchableOpacity
								onPress={handleIssue}
								disabled={loading}
								activeOpacity={0.85}
								style={{
									backgroundColor: '#15803d', borderRadius: 14,
									paddingVertical: 16, alignItems: 'center',
									marginTop: 28, marginBottom: 12,
								}}
							>
								{loading
									? <ActivityIndicator color="#fff" />
									: <Text style={[T.h4, { color: '#fff' }]}>Issue Certificate Now</Text>
								}
							</TouchableOpacity>

							<TouchableOpacity onPress={onClose} style={{ alignItems: 'center', paddingVertical: 8 }}>
								<Text style={[T.label, { color: '#6b7280' }]}>Cancel</Text>
							</TouchableOpacity>

						</ScrollView>
					</View>
				</KeyboardAvoidingView>
			</View>
		</Modal>
	);
}
