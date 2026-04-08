// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  ScrollView, ActivityIndicator, KeyboardAvoidingView,
  Platform, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { FONTS } from '../theme/fonts';

const ROLES = [
  { key: 'user', label: 'Park Guide', icon: 'leaf', desc: 'Access training & certifications' },
  { key: 'admin', label: 'Administrator', icon: 'settings', desc: 'Manage users & courses' },
];

export default function LoginScreen() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Enter a valid email';
    if (!password.trim()) errors.password = 'Password is required';
    if (password.length < 6) errors.password = 'Password must be 6+ characters';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    const result = await login(email.trim(), password, selectedRole);
    if (!result.success && error) {
      Alert.alert('Login Failed', error);
    }
  };

  // Quick fill for demo
  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@parkguide.gov');
      setPassword('admin123');
      setSelectedRole('admin');
    } else {
      setEmail('guide@parkguide.gov');
      setPassword('guide123');
      setSelectedRole('user');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#15803d' }}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
          {/* Hero Header */}
          <View style={{
            alignItems: 'center', paddingTop: 40, paddingBottom: 32,
            backgroundColor: '#15803d',
          }}>
            {/* Logo circle */}
            <View style={{
              width: 88, height: 88, borderRadius: 44,
              backgroundColor: 'rgba(255,255,255,0.15)',
              alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <Ionicons name="leaf" size={44} color="#fff" />
            </View>
            <Text style={{
              fontSize: 26, fontWeight: '800', color: '#fff',
              letterSpacing: 0.5, marginBottom: 4,
            }}>
              Park Guide Training
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>
              Protecting nature through knowledge
            </Text>
          </View>

          {/* Card */}
          <View style={{
            flex: 1, backgroundColor: '#f9fafb', borderTopLeftRadius: 28,
            borderTopRightRadius: 28, padding: 28, paddingTop: 32,
          }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 6 }}>
              Welcome back
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>
              Sign in to continue your training
            </Text>

            {/* Role Selector */}
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 10 }}>
              I AM A
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
              {ROLES.map((role) => (
                <TouchableOpacity
                  key={role.key}
                  onPress={() => setSelectedRole(role.key)}
                  style={{
                    flex: 1, borderRadius: 14, padding: 14,
                    borderWidth: 2,
                    borderColor: selectedRole === role.key ? '#15803d' : '#e5e7eb',
                    backgroundColor: selectedRole === role.key ? '#f0fdf4' : '#fff',
                    alignItems: 'center',
                  }}
                >
                  <View style={{
                    width: 40, height: 40, borderRadius: 20,
                    backgroundColor: selectedRole === role.key ? '#dcfce7' : '#f3f4f6',
                    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
                  }}>
                    <Ionicons
                      name={role.icon}
                      size={20}
                      color={selectedRole === role.key ? '#15803d' : '#9ca3af'}
                    />
                  </View>
                  <Text style={{
                    fontSize: 13, fontWeight: '700',
                    color: selectedRole === role.key ? '#15803d' : '#374151',
                  }}>
                    {role.label}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center', marginTop: 2 }}>
                    {role.desc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Email Field */}
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8 }}>
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
                style={{ flex: 1, padding: 14, fontSize: 15, color: '#111827' }}
              />
            </View>
            {fieldErrors.email && (
              <Text style={{ fontSize: 12, color: '#ef4444', marginBottom: 8 }}>{fieldErrors.email}</Text>
            )}

            {/* Password Field */}
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', marginTop: 12, marginBottom: 8 }}>
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
                style={{ flex: 1, padding: 14, fontSize: 15, color: '#111827' }}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={{ padding: 14 }}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            {fieldErrors.password && (
              <Text style={{ fontSize: 12, color: '#ef4444', marginBottom: 4 }}>{fieldErrors.password}</Text>
            )}

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={{
                marginTop: 28, backgroundColor: '#15803d', borderRadius: 14,
                padding: 17, alignItems: 'center',
                opacity: loading ? 0.7 : 1,
                shadowColor: '#15803d', shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 }}>
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Demo Credentials */}
            <View style={{
              marginTop: 28, padding: 16, backgroundColor: '#f0fdf4',
              borderRadius: 12, borderWidth: 1, borderColor: '#bbf7d0',
            }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#15803d', marginBottom: 10 }}>
                🔑 DEMO CREDENTIALS
              </Text>
              <TouchableOpacity onPress={() => fillDemo('user')} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 12, color: '#374151' }}>
                  <Text style={{ fontWeight: '700' }}>Park Guide: </Text>
                  guide@parkguide.gov / guide123
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => fillDemo('admin')}>
                <Text style={{ fontSize: 12, color: '#374151' }}>
                  <Text style={{ fontWeight: '700' }}>Admin: </Text>
                  admin@parkguide.gov / admin123
                </Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 6 }}>
                Tap to auto-fill credentials
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
