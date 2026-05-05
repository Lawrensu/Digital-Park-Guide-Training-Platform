// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert, Linking, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
//import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '../services/AuthContext';
import { FONTS } from '../theme/fonts';

// ─── JoinField must be OUTSIDE LoginScreen to prevent keyboard dismiss ───
const JoinField = ({ label, value, onChangeText, error, placeholder, keyboardType = 'default', multiline = false }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={{ fontSize: 11, fontWeight: '700', color: '#374151', marginBottom: 6, fontFamily: FONTS.label }}>
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
        borderRadius: 12, padding: 12,
        fontSize: 14, color: '#111827',
        fontFamily: FONTS.body, backgroundColor: '#fff',
        textAlignVertical: multiline ? 'top' : 'center',
        minHeight: multiline ? 90 : 46,
      }}
    />
    {error && (
      <Text style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontFamily: FONTS.body }}>
        {error}
      </Text>
    )}
  </View>
);

const ROLES = [
  { key: 'user',  label: 'Park Guide',    icon: 'leaf',     desc: 'Access training & certifications' },
  { key: 'admin', label: 'Administrator', icon: 'settings', desc: 'Manage users & courses' },
];

export default function LoginScreen() {
  const { login, loading, error } = useAuth();

  // Login form
  const [username, setUsername] = useState('');
  const [password, setPassword]  = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Resend activation
  const [resendModal, setResendModal]   = useState(false);
  const [resendEmail, setResendEmail]   = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  // Join Us modal
  const [joinModal, setJoinModal] = useState(false);
  const [joinForm, setJoinForm]   = useState({ fullName: '', nric: '', phone: '', email: '', cv: '' });
  const [joinErrors, setJoinErrors] = useState({});

  // ── Login ───────────────────────────────────────────────────
  const validateLogin = () => {
    const errors = {};
    if (!username.trim()) errors.username = 'Username is required';
    if (!password.trim()) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be 6+ characters';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    // Pass username as email for backward compat with mock auth
    const emailOrUsername = username.includes('@') ? username : `${username}@parkguide.gov`;
    const result = await login(emailOrUsername, password, selectedRole);
    if (!result.success && error) Alert.alert('Login Failed', error);
  };

  const fillDemo = (role) => {
    if (role === 'admin') { setUsername('admin@parkguide.gov'); setPassword('admin123'); setSelectedRole('admin'); }
    else                  { setUsername('guide@parkguide.gov'); setPassword('guide123'); setSelectedRole('user'); }
  };

  // ── Resend activation ───────────────────────────────────────
  const handleResend = async () => {
    if (!resendEmail.trim() || !/\S+@\S+\.\S+/.test(resendEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setResendLoading(true);
    // POST /api/auth/resend-activation in production
    await new Promise((r) => setTimeout(r, 1000));
    setResendLoading(false);
    setResendModal(false);
    setResendEmail('');
    Alert.alert('Activation Sent', `An activation link has been sent to ${resendEmail}.`);
  };

  // ── Join Us ─────────────────────────────────────────────────
  const updateJoinForm = (field, value) => {
    setJoinForm((p) => ({ ...p, [field]: value }));
    setJoinErrors((p) => ({ ...p, [field]: null }));
  };

  const validateJoin = () => {
    const errors = {};
    if (!joinForm.fullName.trim()) errors.fullName = 'Full name is required';
    if (!joinForm.nric.trim()) errors.nric = 'NRIC is required';
    else if (joinForm.nric.trim().length < 12) errors.nric = 'Enter a valid NRIC number';
    if (!joinForm.phone.trim()) errors.phone = 'Phone number is required';
    if (!joinForm.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(joinForm.email)) errors.email = 'Enter a valid email';
    setJoinErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePickCV = async () => {
    Alert.alert('CV Upload', 'PDF upload requires a native build. For now, type your CV link or description below.');
    updateJoinForm('cv', 'CV will be attached separately');
  };  
  
  const handleJoinSubmit = () => {
    if (!validateJoin()) return;
    const recipient = '';
    const subject = encodeURIComponent('Park Guide Application — ' + joinForm.fullName);
    const body = encodeURIComponent(
      `Dear Park Guide Training Team,\n\nI would like to apply to join as a Park Guide.\n\n` +
      `Full Name: ${joinForm.fullName}\nNRIC: ${joinForm.nric}\nPhone: ${joinForm.phone}\n` +
      `Email: ${joinForm.email}\nCV: ${joinForm.cv || 'Will be sent separately.'}\n\n` +
      `Best regards,\n${joinForm.fullName}`
    );
    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;
    Linking.canOpenURL(mailtoUrl).then((ok) => {
      if (ok) {
        Linking.openURL(mailtoUrl);
        setJoinModal(false);
        setJoinForm({ fullName: '', nric: '', phone: '', email: '', cv: '' });
        setJoinErrors({});
      } else Alert.alert('Error', 'No email app found on this device.');
    });
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#15803d' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>

          {/* Hero Header */}
          <View style={{ alignItems: 'center', paddingTop: 40, paddingBottom: 32, backgroundColor: '#15803d' }}>
            <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Ionicons name="leaf" size={44} color="#fff" />
            </View>
            <Text style={{ fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: 0.5, marginBottom: 4, fontFamily: FONTS.title }}>
              Park Guide Training
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center', fontFamily: FONTS.body }}>
              Protecting nature through knowledge
            </Text>
          </View>

          {/* Card */}
          <View style={{ flex: 1, backgroundColor: '#f9fafb', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingTop: 32 }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 6, fontFamily: FONTS.title }}>Welcome back</Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 28, fontFamily: FONTS.body }}>Sign in to continue your training</Text>

            {/* Role Selector — only shown for development/demo */}
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 10, fontFamily: FONTS.label }}>I AM A</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
              {ROLES.map((role) => (
                <TouchableOpacity key={role.key} onPress={() => setSelectedRole(role.key)} style={{
                  flex: 1, borderRadius: 14, padding: 14, borderWidth: 2,
                  borderColor: selectedRole === role.key ? '#15803d' : '#e5e7eb',
                  backgroundColor: selectedRole === role.key ? '#f0fdf4' : '#fff', alignItems: 'center',
                }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: selectedRole === role.key ? '#dcfce7' : '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <Ionicons name={role.icon} size={20} color={selectedRole === role.key ? '#15803d' : '#9ca3af'} />
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: '700', fontFamily: FONTS.label, color: selectedRole === role.key ? '#15803d' : '#374151' }}>{role.label}</Text>
                  <Text style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center', marginTop: 2, fontFamily: FONTS.body }}>{role.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Username */}
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8, fontFamily: FONTS.label }}>USERNAME</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: fieldErrors.username ? '#ef4444' : '#e5e7eb', borderRadius: 12, backgroundColor: '#fff', marginBottom: 4 }}>
              <Ionicons name="person-outline" size={18} color="#9ca3af" style={{ marginLeft: 14 }} />
              <TextInput
                value={username}
                onChangeText={(t) => { setUsername(t); setFieldErrors((p) => ({ ...p, username: null })); }}
                placeholder="your.username"
                placeholderTextColor="#d1d5db"
                autoCapitalize="none"
                autoCorrect={false}
                style={{ flex: 1, padding: 14, fontSize: 15, color: '#111827', fontFamily: FONTS.body }}
              />
            </View>
            {fieldErrors.username && <Text style={{ fontSize: 12, color: '#ef4444', marginBottom: 8, fontFamily: FONTS.body }}>{fieldErrors.username}</Text>}

            {/* Password */}
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', marginTop: 12, marginBottom: 8, fontFamily: FONTS.label }}>PASSWORD</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: fieldErrors.password ? '#ef4444' : '#e5e7eb', borderRadius: 12, backgroundColor: '#fff', marginBottom: 4 }}>
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
            {fieldErrors.password && <Text style={{ fontSize: 12, color: '#ef4444', marginBottom: 4, fontFamily: FONTS.body }}>{fieldErrors.password}</Text>}

            {/* Resend activation link */}
            <TouchableOpacity onPress={() => setResendModal(true)} style={{ alignSelf: 'flex-end', marginTop: 6, marginBottom: 4 }}>
              <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '700', fontFamily: FONTS.label }}>
                Resend activation link
              </Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity onPress={handleLogin} disabled={loading} style={{
              marginTop: 16, backgroundColor: '#15803d', borderRadius: 14, padding: 17,
              alignItems: 'center', opacity: loading ? 0.7 : 1,
              shadowColor: '#15803d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
            }}>
              {loading ? <ActivityIndicator color="#fff" /> : (
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3, fontFamily: FONTS.button }}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 16 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
              <Text style={{ marginHorizontal: 12, fontSize: 12, color: '#9ca3af', fontFamily: FONTS.body }}>or</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
            </View>

            {/* Join Us Button */}
            <TouchableOpacity onPress={() => setJoinModal(true)} style={{
              borderRadius: 14, padding: 17, alignItems: 'center',
              borderWidth: 2, borderColor: '#15803d', backgroundColor: '#fff',
              flexDirection: 'row', justifyContent: 'center', gap: 8,
            }}>
              <Ionicons name="person-add-outline" size={18} color="#15803d" />
              <Text style={{ color: '#15803d', fontSize: 16, fontWeight: '700', fontFamily: FONTS.button }}>Join Us as a Park Guide</Text>
            </TouchableOpacity>

            {/* Demo Credentials */}
            <View style={{ marginTop: 24, padding: 16, backgroundColor: '#f0fdf4', borderRadius: 12, borderWidth: 1, borderColor: '#bbf7d0' }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#15803d', marginBottom: 10, fontFamily: FONTS.label }}>🔑 DEMO CREDENTIALS</Text>
              <TouchableOpacity onPress={() => fillDemo('user')} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 12, color: '#374151', fontFamily: FONTS.body }}><Text style={{ fontWeight: '700' }}>Park Guide: </Text>guide@parkguide.gov / guide123</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => fillDemo('admin')}>
                <Text style={{ fontSize: 12, color: '#374151', fontFamily: FONTS.body }}><Text style={{ fontWeight: '700' }}>Admin: </Text>admin@parkguide.gov / admin123</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 6, fontFamily: FONTS.body }}>Tap to auto-fill</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Resend Activation Modal ────────────────────────── */}
      <Modal visible={resendModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 6, fontFamily: FONTS.title }}>Resend Activation</Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 20, fontFamily: FONTS.body }}>
              Enter your email address and we'll send you a new activation link.
            </Text>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#374151', marginBottom: 8, fontFamily: FONTS.label }}>EMAIL ADDRESS</Text>
            <TextInput
              value={resendEmail}
              onChangeText={setResendEmail}
              placeholder="your@email.com"
              placeholderTextColor="#d1d5db"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, padding: 13, fontSize: 14, color: '#111827', fontFamily: FONTS.body, marginBottom: 16 }}
            />
            <TouchableOpacity onPress={handleResend} disabled={resendLoading} style={{
              backgroundColor: '#15803d', borderRadius: 14, padding: 16, alignItems: 'center',
              flexDirection: 'row', justifyContent: 'center', gap: 8,
            }}>
              {resendLoading ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="mail-outline" size={18} color="#fff" />}
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', fontFamily: FONTS.button }}>
                {resendLoading ? 'Sending...' : 'Send Activation Link'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setResendModal(false); setResendEmail(''); }} style={{ padding: 14, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#9ca3af', fontFamily: FONTS.body }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Join Us Modal ──────────────────────────────────── */}
      <Modal visible={joinModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' }}>
            <View style={{ backgroundColor: '#15803d', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#fff', fontFamily: FONTS.title }}>Join Us</Text>
                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontFamily: FONTS.body }}>Apply to become a Park Guide</Text>
              </View>
              <TouchableOpacity onPress={() => { setJoinModal(false); setJoinErrors({}); }} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 24 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={{ padding: 14, backgroundColor: '#f0fdf4', borderRadius: 12, borderWidth: 1, borderColor: '#bbf7d0', marginBottom: 20, flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <Ionicons name="information-circle-outline" size={18} color="#16a34a" style={{ marginTop: 1 }} />
                <Text style={{ fontSize: 12, color: '#374151', flex: 1, lineHeight: 18, fontFamily: FONTS.body }}>
                  Fill in your details below. Submitting will open your email app with a pre-filled application.
                </Text>
              </View>

              <JoinField label="Full Name"    value={joinForm.fullName} onChangeText={(t) => updateJoinForm('fullName', t)} error={joinErrors.fullName} placeholder="e.g. Ahmad bin Abdullah" />
              <JoinField label="NRIC Number"  value={joinForm.nric}     onChangeText={(t) => updateJoinForm('nric', t)}     error={joinErrors.nric}     placeholder="e.g. 990101-14-5678" keyboardType="numbers-and-punctuation" />
              <JoinField label="Phone Number" value={joinForm.phone}    onChangeText={(t) => updateJoinForm('phone', t)}    error={joinErrors.phone}    placeholder="e.g. 012-3456789"   keyboardType="phone-pad" />
              <JoinField label="Email Address" value={joinForm.email}   onChangeText={(t) => updateJoinForm('email', t)}    error={joinErrors.email}    placeholder="your@email.com"     keyboardType="email-address" />

              {/* CV Upload */}
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#374151', marginBottom: 6, fontFamily: FONTS.label }}>CV / RESUME (PDF)</Text>
                <TouchableOpacity onPress={handlePickCV} style={{ borderWidth: 1.5, borderColor: joinForm.cv ? '#15803d' : '#e5e7eb', borderRadius: 12, padding: 14, backgroundColor: joinForm.cv ? '#f0fdf4' : '#fff', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons name={joinForm.cv ? 'document-text' : 'cloud-upload-outline'} size={22} color={joinForm.cv ? '#15803d' : '#9ca3af'} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontFamily: FONTS.body, color: joinForm.cv ? '#15803d' : '#9ca3af' }}>
                      {joinForm.cv ? joinForm.cv : 'Tap to attach your CV (PDF only)'}
                    </Text>
                    {joinForm.cv && <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 2, fontFamily: FONTS.body }}>PDF selected</Text>}
                  </View>
                  {joinForm.cv && (
                    <TouchableOpacity onPress={() => updateJoinForm('cv', '')}>
                      <Ionicons name="close-circle" size={18} color="#9ca3af" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleJoinSubmit} style={{ backgroundColor: '#15803d', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8, flexDirection: 'row', justifyContent: 'center', gap: 8, shadowColor: '#15803d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}>
                <Ionicons name="mail-outline" size={18} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800', fontFamily: FONTS.button }}>Send Application</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setJoinModal(false); setJoinErrors({}); }} style={{ padding: 14, alignItems: 'center', marginTop: 8 }}>
                <Text style={{ fontSize: 14, color: '#9ca3af', fontFamily: FONTS.body }}>Cancel</Text>
              </TouchableOpacity>
              <View style={{ height: 32 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
