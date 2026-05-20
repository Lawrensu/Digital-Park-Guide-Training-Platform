import React, { useState } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity, TextInput,
	ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usersApi } from '../../api/users';
import useNetworkStatus from '../../services/connectivityService';

function FieldRow({ label, children, isLast }) {
	return (
		<View style={{
			paddingHorizontal: 18, paddingTop: 16,
			paddingBottom: isLast ? 18 : 14,
			borderBottomWidth: isLast ? 0 : 1,
			borderBottomColor: '#f3f4f6',
		}}>
			<Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, letterSpacing: 0.3 }}>
				{label}
			</Text>
			{children}
		</View>
	);
}

export default function CreateAdminScreen() {
	const navigation   = useNavigation();
	const { isOnline } = useNetworkStatus();

	const [firstName, setFirstName] = useState('');
	const [lastName,  setLastName]  = useState('');
	const [email,     setEmail]     = useState('');
	const [loading,   setLoading]   = useState(false);

	async function handleCreate() {
		if (!firstName.trim() || !lastName.trim()) {
			Alert.alert('Required', 'Please enter first and last name.');
			return;
		}
		if (!email.trim() || !email.includes('@')) {
			Alert.alert('Required', 'Please enter a valid email address.');
			return;
		}
		setLoading(true);
		try {
			await usersApi.createAdmin({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim().toLowerCase(),
			});
			Alert.alert(
				'Admin Created',
				'Activation email sent. The new admin must set their password via the link in the email.',
				[{ text: 'OK', onPress: () => navigation.goBack() }]
			);
		} catch (e) {
			Alert.alert('Error', e?.message ?? 'Could not create admin account.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			{/* Green header */}
			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20,
				flexDirection: 'row', alignItems: 'center', gap: 14,
			}}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Ionicons name="arrow-back" size={22} color="#fff" />
				</TouchableOpacity>
				<View>
					<Text style={{ fontSize: 24, fontWeight: '600', color: '#fff' }}>Create Admin</Text>
					<Text style={{ fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
						Add a new administrator
					</Text>
				</View>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
			>
				{/* Admin Details */}
				<Text style={{ fontSize: 20, fontWeight: '500', color: '#111827', marginBottom: 12 }}>
					Admin Details
				</Text>
				<View style={{
					backgroundColor: '#fff', borderRadius: 16,
					shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
					overflow: 'hidden', marginBottom: 20,
				}}>
					<FieldRow label="FIRST NAME">
						<TextInput
							value={firstName}
							onChangeText={setFirstName}
							placeholder="Enter first name"
							placeholderTextColor="#9ca3af"
							style={{
								borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
								paddingHorizontal: 14, paddingVertical: 11,
								fontSize: 16, color: '#111827',
							}}
						/>
					</FieldRow>
					<FieldRow label="LAST NAME">
						<TextInput
							value={lastName}
							onChangeText={setLastName}
							placeholder="Enter last name"
							placeholderTextColor="#9ca3af"
							style={{
								borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
								paddingHorizontal: 14, paddingVertical: 11,
								fontSize: 16, color: '#111827',
							}}
						/>
					</FieldRow>
					<FieldRow label="EMAIL ADDRESS" isLast>
						<TextInput
							value={email}
							onChangeText={setEmail}
							placeholder="admin@parkguide.org"
							placeholderTextColor="#9ca3af"
							keyboardType="email-address"
							autoCapitalize="none"
							style={{
								borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
								paddingHorizontal: 14, paddingVertical: 11,
								fontSize: 16, color: '#111827',
							}}
						/>
					</FieldRow>
				</View>

				{/* Authentication method note */}
				<View style={{
					backgroundColor: '#f0fdf4', borderRadius: 14, padding: 16, marginBottom: 24,
					borderWidth: 1, borderColor: '#bbf7d0', flexDirection: 'row', gap: 12,
				}}>
					<Ionicons name="mail" size={20} color="#16a34a" style={{ marginTop: 2 }} />
					<View style={{ flex: 1 }}>
						<Text style={{ fontSize: 14, fontWeight: '600', color: '#15803d', marginBottom: 4 }}>
							Activation via Email
						</Text>
						<Text style={{ fontSize: 12, color: '#374151', lineHeight: 18 }}>
							An activation email will be sent. The admin sets their own password via the link.
						</Text>
					</View>
				</View>

				{/* Create button */}
				<TouchableOpacity
					onPress={handleCreate}
					disabled={loading}
					style={{
						backgroundColor: '#15803d', borderRadius: 14,
						paddingVertical: 17, alignItems: 'center', marginBottom: 12,
					}}
				>
					{loading
						? <ActivityIndicator color="#fff" />
						: <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>
							Create Admin Account
						</Text>
					}
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={{
						borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 14,
						paddingVertical: 17, alignItems: 'center', backgroundColor: '#fff',
					}}
				>
					<Text style={{ fontSize: 15, fontWeight: '600', color: '#374151' }}>Cancel</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
}
