import React, { useState } from 'react';
import {
	View, Text, TextInput, TouchableOpacity,
	ScrollView, ActivityIndicator, KeyboardAvoidingView,
	Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../theme/fonts';
import { registrationsApi } from '../api/registrations';
import { uploadsApi } from '../api/uploads';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


function Field({ label, value, onChangeText, error, placeholder, keyboardType = 'default', multiline = false }) {
	return (
		<View style={{ marginBottom: 16 }}>
			<Text style={{ fontFamily: FONTS.label, fontSize: 11, fontWeight: '700', color: '#374151', marginBottom: 6, letterSpacing: 0.5 }}>
				{label.toUpperCase()}
			</Text>
			<TextInput
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor="#d1d5db"
				keyboardType={keyboardType}
				autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
				multiline={multiline}
				numberOfLines={multiline ? 4 : 1}
				style={{
					borderWidth: 1.5,
					borderColor: error ? '#ef4444' : '#e5e7eb',
					borderRadius: 12,
					paddingHorizontal: 14,
					paddingVertical: 12,
					fontSize: 14,
					color: '#111827',
					fontFamily: FONTS.body,
					backgroundColor: '#fff',
					textAlignVertical: multiline ? 'top' : 'center',
					minHeight: multiline ? 96 : 46,
				}}
			/>
			{error ? (
				<Text style={{ fontFamily: FONTS.body, fontSize: 11, color: '#ef4444', marginTop: 4 }}>{error}</Text>
			) : null}
		</View>
	);
}


function validate(form, cvAsset) {
	const errors = {};
	if (!form.firstName.trim())        errors.firstName        = 'First name is required.';
	if (!form.lastName.trim())         errors.lastName         = 'Last name is required.';
	if (!form.email.trim())            errors.email            = 'Email is required.';
	else if (!EMAIL_RE.test(form.email.trim())) errors.email   = 'Enter a valid email address.';
	if (!form.icPassportNumber.trim()) errors.icPassportNumber = 'IC / Passport number is required.';
	if (!form.address.trim())          errors.address          = 'Address is required.';
	if (!form.reason.trim())           errors.reason           = 'Please tell us why you want to become a park guide.';
	if (!cvAsset)                      errors.cv               = 'Please attach your CV (PDF).';
	return errors;
}


export default function RegistrationScreen() {
	const navigation = useNavigation();

	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		email: '',
		icPassportNumber: '',
		address: '',
		reason: '',
	});
	const [cvAsset,      setCvAsset]      = useState(null);
	const [fieldErrors,  setFieldErrors]  = useState({});
	const [submitting,   setSubmitting]   = useState(false);
	const [submitted,    setSubmitted]    = useState(false);

	const update = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		setFieldErrors((prev) => ({ ...prev, [field]: null }));
	};

	const handlePickCV = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: 'application/pdf',
				copyToCacheDirectory: true,
			});
			if (!result.canceled && result.assets?.length > 0) {
				setCvAsset(result.assets[0]);
				setFieldErrors((prev) => ({ ...prev, cv: null }));
			}
		} catch {
			Alert.alert('Error', 'Could not open file picker.');
		}
	};

	const handleSubmit = async () => {
		const errors = validate(form, cvAsset);
		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
			return;
		}

		setSubmitting(true);
		try {
			const { url, key } = await uploadsApi.presign('cv', 'application/pdf', 'pdf');

			const blobResponse = await fetch(cvAsset.uri);
			const blob = await blobResponse.blob();
			await fetch(url, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/pdf' },
				body: blob,
			});

			await registrationsApi.submit({
				firstName:        form.firstName.trim(),
				lastName:         form.lastName.trim(),
				email:            form.email.trim().toLowerCase(),
				icPassportNumber: form.icPassportNumber.trim(),
				address:          form.address.trim(),
				reason:           form.reason.trim(),
				cvS3Key:          key,
			});

			setSubmitted(true);
		} catch (err) {
			const msg = err.message || 'Submission failed. Please try again.';
			Alert.alert('Submission Failed', msg);
		} finally {
			setSubmitting(false);
		}
	};

	if (submitted) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
				<View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
					<Ionicons name="checkmark-circle" size={48} color="#15803d" />
				</View>
				<Text style={{ fontFamily: FONTS.title, fontSize: 24, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 12 }}>
					Application Submitted
				</Text>
				<Text style={{ fontFamily: FONTS.body, fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 24, marginBottom: 36 }}>
					Your application has been submitted. You will receive an email once it has been reviewed.
				</Text>
				<TouchableOpacity
					onPress={() => navigation.navigate('Login')}
					style={{ backgroundColor: '#15803d', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 32 }}
				>
					<Text style={{ fontFamily: FONTS.button, fontSize: 16, fontWeight: '700', color: '#fff' }}>Back to Login</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

				<View style={{
					backgroundColor: '#15803d', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20,
					flexDirection: 'row', alignItems: 'center', gap: 14,
				}}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons name="arrow-back" size={22} color="#fff" />
					</TouchableOpacity>
					<View>
						<Text style={{ fontFamily: FONTS.title, fontSize: 22, fontWeight: '700', color: '#fff' }}>
							Join as a Park Guide
						</Text>
						<Text style={{ fontFamily: FONTS.body, fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
							Fill in your details to apply
						</Text>
					</View>
				</View>

				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
					keyboardShouldPersistTaps="handled"
				>
					<View style={{
						flexDirection: 'row', backgroundColor: '#f0fdf4', borderRadius: 12,
						borderWidth: 1, borderColor: '#bbf7d0', padding: 14,
						alignItems: 'flex-start', gap: 10, marginBottom: 24,
					}}>
						<Ionicons name="information-circle-outline" size={18} color="#16a34a" style={{ marginTop: 1 }} />
						<Text style={{ fontFamily: FONTS.body, fontSize: 13, color: '#374151', flex: 1, lineHeight: 20 }}>
							Admin will review your application and send an activation link to your email once approved.
						</Text>
					</View>

					<View style={{ flexDirection: 'row', gap: 12 }}>
						<View style={{ flex: 1 }}>
							<Field
								label="First Name"
								value={form.firstName}
								onChangeText={(v) => update('firstName', v)}
								error={fieldErrors.firstName}
								placeholder="Ahmad"
							/>
						</View>
						<View style={{ flex: 1 }}>
							<Field
								label="Last Name"
								value={form.lastName}
								onChangeText={(v) => update('lastName', v)}
								error={fieldErrors.lastName}
								placeholder="Abdullah"
							/>
						</View>
					</View>

					<Field
						label="Email Address"
						value={form.email}
						onChangeText={(v) => update('email', v)}
						error={fieldErrors.email}
						placeholder="ahmad@email.com"
						keyboardType="email-address"
					/>

					<Field
						label="IC / Passport Number"
						value={form.icPassportNumber}
						onChangeText={(v) => update('icPassportNumber', v)}
						error={fieldErrors.icPassportNumber}
						placeholder="990101-14-5678"
					/>

					<Field
						label="Address"
						value={form.address}
						onChangeText={(v) => update('address', v)}
						error={fieldErrors.address}
						placeholder="No. 1, Jalan Example, 93000 Kuching, Sarawak"
						multiline
					/>

					<Field
						label="Why do you want to be a Park Guide?"
						value={form.reason}
						onChangeText={(v) => update('reason', v)}
						error={fieldErrors.reason}
						placeholder="Tell us your motivation and relevant experience..."
						multiline
					/>

					<View style={{ marginBottom: 16 }}>
						<Text style={{ fontFamily: FONTS.label, fontSize: 11, fontWeight: '700', color: '#374151', marginBottom: 6, letterSpacing: 0.5 }}>
							CV / RESUME (PDF)
						</Text>
						<TouchableOpacity
							onPress={handlePickCV}
							style={{
								borderWidth: 1.5,
								borderColor: fieldErrors.cv ? '#ef4444' : cvAsset ? '#15803d' : '#e5e7eb',
								borderRadius: 12,
								padding: 14,
								backgroundColor: cvAsset ? '#f0fdf4' : '#fff',
								flexDirection: 'row',
								alignItems: 'center',
								gap: 10,
							}}
						>
							<Ionicons
								name={cvAsset ? 'document-text' : 'cloud-upload-outline'}
								size={22}
								color={cvAsset ? '#15803d' : '#9ca3af'}
							/>
							<Text style={{ fontFamily: FONTS.body, fontSize: 14, color: cvAsset ? '#15803d' : '#9ca3af', flex: 1 }} numberOfLines={1}>
								{cvAsset ? cvAsset.name : 'Tap to attach your CV (PDF only)'}
							</Text>
							{cvAsset ? (
								<TouchableOpacity onPress={() => setCvAsset(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
									<Ionicons name="close-circle" size={18} color="#9ca3af" />
								</TouchableOpacity>
							) : null}
						</TouchableOpacity>
						{fieldErrors.cv ? (
							<Text style={{ fontFamily: FONTS.body, fontSize: 11, color: '#ef4444', marginTop: 4 }}>{fieldErrors.cv}</Text>
						) : null}
					</View>

					<TouchableOpacity
						onPress={handleSubmit}
						disabled={submitting}
						style={{
							backgroundColor: '#15803d',
							borderRadius: 14,
							padding: 17,
							alignItems: 'center',
							marginTop: 8,
							opacity: submitting ? 0.7 : 1,
							shadowColor: '#15803d',
							shadowOffset: { width: 0, height: 4 },
							shadowOpacity: 0.3,
							shadowRadius: 8,
							elevation: 5,
						}}
					>
						{submitting ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={{ fontFamily: FONTS.button, fontSize: 16, fontWeight: '800', color: '#fff' }}>
								Submit Application
							</Text>
						)}
					</TouchableOpacity>

					<TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 14, alignItems: 'center', marginTop: 4 }}>
						<Text style={{ fontFamily: FONTS.body, fontSize: 14, color: '#9ca3af' }}>Already have an account? Sign in</Text>
					</TouchableOpacity>
				</ScrollView>

			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
