import React, { useState } from 'react';
import {
	View, Text, TextInput, TouchableOpacity,
	ScrollView, ActivityIndicator, KeyboardAvoidingView,
	Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../services/AuthContext';
import { FONTS } from '../theme/fonts';

export default function LoginScreen() {
	const { login }    = useAuth();
	const navigation   = useNavigation();

	const [email,        setEmail]        = useState('');
	const [password,     setPassword]     = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [fieldErrors,  setFieldErrors]  = useState({});
	const [submitting,   setSubmitting]   = useState(false);

	const validateLogin = () => {
		const errors = {};
		if (!email.trim()) errors.email = 'Email is required';
		else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Enter a valid email';
		if (!password.trim()) errors.password = 'Password is required';
		else if (password.length < 6) errors.password = 'Password must be 6+ characters';
		setFieldErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleLogin = async () => {
		if (!validateLogin()) return;
		setSubmitting(true);
		try {
			await login(email.trim(), password);
		} catch (err) {
			const msg = err.code === 'ACCOUNT_INACTIVE'
				? 'Your account is not yet activated. Check your email for an activation link.'
				: err.message || 'Invalid email or password';
			Alert.alert('Login Failed', msg);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#15803d' }}>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
				<ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>

					<View style={{ alignItems: 'center', paddingTop: 40, paddingBottom: 32, backgroundColor: '#15803d' }}>
						<View style={{
							width: 88, height: 88, borderRadius: 44,
							backgroundColor: 'rgba(255,255,255,0.15)',
							alignItems: 'center', justifyContent: 'center', marginBottom: 16,
						}}>
							<Ionicons name="leaf" size={44} color="#fff" />
						</View>
						<Text style={{ fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: 0.5, marginBottom: 4, fontFamily: FONTS.title }}>
							Park Guide Training
						</Text>
						<Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center', fontFamily: FONTS.body }}>
							Protecting nature through knowledge
						</Text>
					</View>

					<View style={{ flex: 1, backgroundColor: '#f9fafb', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingTop: 32 }}>
						<Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 6, fontFamily: FONTS.title }}>
							Welcome back
						</Text>
						<Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 28, fontFamily: FONTS.body }}>
							Sign in to continue your training
						</Text>

						{/* Email */}
						<Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8, fontFamily: FONTS.label }}>
							EMAIL
						</Text>
						<View style={{
							flexDirection: 'row', alignItems: 'center',
							borderWidth: 1.5, borderColor: fieldErrors.email ? '#ef4444' : '#e5e7eb',
							borderRadius: 12, backgroundColor: '#fff', marginBottom: 4,
						}}>
							<Ionicons name="mail-outline" size={18} color="#9ca3af" style={{ marginLeft: 14 }} />
							<TextInput
								value={email}
								onChangeText={(t) => { setEmail(t); setFieldErrors((p) => ({ ...p, email: null })); }}
								placeholder="your@email.gov"
								placeholderTextColor="#d1d5db"
								keyboardType="email-address"
								autoCapitalize="none"
								style={{ flex: 1, padding: 14, fontSize: 15, color: '#111827', fontFamily: FONTS.body }}
							/>
						</View>
						{fieldErrors.email && (
							<Text style={{ fontSize: 12, color: '#ef4444', marginBottom: 8, fontFamily: FONTS.body }}>
								{fieldErrors.email}
							</Text>
						)}

						{/* Password */}
						<Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', marginTop: 12, marginBottom: 8, fontFamily: FONTS.label }}>
							PASSWORD
						</Text>
						<View style={{
							flexDirection: 'row', alignItems: 'center',
							borderWidth: 1.5, borderColor: fieldErrors.password ? '#ef4444' : '#e5e7eb',
							borderRadius: 12, backgroundColor: '#fff', marginBottom: 4,
						}}>
							<Ionicons name="lock-closed-outline" size={18} color="#9ca3af" style={{ marginLeft: 14 }} />
							<TextInput
								value={password}
								onChangeText={(t) => { setPassword(t); setFieldErrors((p) => ({ ...p, password: null })); }}
								placeholder="••••••••"
								placeholderTextColor="#d1d5db"
								secureTextEntry={!showPassword}
								style={{ flex: 1, padding: 14, fontSize: 15, color: '#111827', fontFamily: FONTS.body }}
							/>
							<TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={{ padding: 14 }}>
								<Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#9ca3af" />
							</TouchableOpacity>
						</View>
						{fieldErrors.password && (
							<Text style={{ fontSize: 12, color: '#ef4444', marginBottom: 4, fontFamily: FONTS.body }}>
								{fieldErrors.password}
							</Text>
						)}

						<TouchableOpacity
							onPress={handleLogin}
							disabled={submitting}
							style={{
								marginTop: 28, backgroundColor: '#15803d', borderRadius: 14,
								padding: 17, alignItems: 'center', opacity: submitting ? 0.7 : 1,
								shadowColor: '#15803d', shadowOffset: { width: 0, height: 4 },
								shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
							}}
						>
							{submitting ? (
								<ActivityIndicator color="#fff" />
							) : (
								<Text style={{ color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3, fontFamily: FONTS.button }}>
									Sign In
								</Text>
							)}
						</TouchableOpacity>

						<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 16 }}>
							<View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
							<Text style={{ marginHorizontal: 12, fontSize: 12, color: '#9ca3af', fontFamily: FONTS.body }}>or</Text>
							<View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
						</View>

						<TouchableOpacity
							onPress={() => navigation.navigate('Register')}
							style={{
								borderRadius: 14, padding: 17, alignItems: 'center',
								borderWidth: 2, borderColor: '#15803d', backgroundColor: '#fff',
								flexDirection: 'row', justifyContent: 'center', gap: 8,
							}}
						>
							<Ionicons name="person-add-outline" size={18} color="#15803d" />
							<Text style={{ color: '#15803d', fontSize: 16, fontWeight: '700', fontFamily: FONTS.button }}>
								Join Us as a Park Guide
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
