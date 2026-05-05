import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../services/AuthContext';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h1:      { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
  body:    { fontFamily: serif, fontSize: 16, fontWeight: '400' },
};

const SECTIONS = [
  {
    title: 'APP SETTINGS',
    items: [
      {
        icon: 'notifications',
        iconColor: '#f59e0b',
        iconBg: '#fef3c7',
        label: 'Notifications',
        badge: null,
        route: 'Notifications',
      },
      {
        icon: 'color-palette',
        iconColor: '#ec4899',
        iconBg: '#fdf2f8',
        label: 'Appearance',
        badge: null,
        route: null,
      },
    ],
  },
  {
    title: 'USER MANAGEMENT',
    items: [
      {
        icon: 'people',
        iconColor: '#6366f1',
        iconBg: '#eef2ff',
        label: 'Manage Guides',
        badge: null,
        route: 'GuideList',
      },
      {
        icon: 'shield',
        iconColor: '#3b82f6',
        iconBg: '#eff6ff',
        label: 'Admin Accounts',
        badge: null,
        route: 'AdminList',
      },
    ],
  },
  {
    title: 'IOT & MONITORING',
    items: [
      {
        icon: 'warning',
        iconColor: '#f59e0b',
        iconBg: '#fef3c7',
        label: 'Live Alerts',
        badge: { label: '3 pending', color: '#dc2626', bg: '#fee2e2' },
        route: 'IoTAlert',
      },
    ],
  },
  {
    title: 'ABOUT',
    items: [
      {
        icon: 'information-circle',
        iconColor: '#3b82f6',
        iconBg: '#eff6ff',
        label: 'App Version',
        badge: { label: 'v1.0.0', color: '#6b7280', bg: 'transparent' },
        route: null,
      },
      {
        icon: 'document-text',
        iconColor: '#6b7280',
        iconBg: '#f3f4f6',
        label: 'Privacy Policy',
        badge: null,
        route: null,
      },
      {
        icon: 'document-text',
        iconColor: '#6b7280',
        iconBg: '#f3f4f6',
        label: 'Terms of Service',
        badge: null,
        route: null,
      },
    ],
  },
];

function SettingRow({ item, isLast, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 14,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: '#f3f4f6',
      }}
    >
      <View style={{
        width: 38, height: 38, borderRadius: 10,
        backgroundColor: item.iconBg,
        alignItems: 'center', justifyContent: 'center',
        marginRight: 14,
      }}>
        <Ionicons name={item.icon} size={20} color={item.iconColor} />
      </View>

      <Text style={[T.label, { flex: 1, color: '#111827', fontSize: 15 }]}>
        {item.label}
      </Text>

      {item.badge && (
        <View style={{
          paddingHorizontal: item.badge.bg === 'transparent' ? 0 : 10,
          paddingVertical: 4, borderRadius: 20,
          backgroundColor: item.badge.bg, marginRight: 8,
        }}>
          <Text style={[T.caption, { color: item.badge.color, fontWeight: '700' }]}>
            {item.badge.label}
          </Text>
        </View>
      )}

      {item.route !== null && (
        <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
      )}
      {item.route === null && !item.badge && (
        <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const navigation            = useNavigation();
  const { logout }            = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  const handleSignOut = () => {
    setShowLogout(false);
    logout();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20,
      }}>
        <Text style={[T.h1, { color: '#fff' }]}>Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {SECTIONS.map((section) => (
          <View key={section.title} style={{ marginBottom: 24 }}>
            <Text style={[T.caption, {
              color: '#9ca3af', letterSpacing: 0.8,
              marginBottom: 8, marginLeft: 4,
            }]}>
              {section.title}
            </Text>

            <View style={{
              backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
              shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
            }}>
              {section.items.map((item, i) => (
                <SettingRow
                  key={item.label}
                  item={item}
                  isLast={i === section.items.length - 1}
                  onPress={item.route
                    ? () => navigation.navigate(item.route)
                    : undefined}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out button */}
        <TouchableOpacity
          onPress={() => setShowLogout(true)}
          style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            gap: 10, borderWidth: 2, borderColor: '#dc2626', borderRadius: 14,
            paddingVertical: 16, marginTop: 4, marginBottom: 8,
            backgroundColor: '#fff',
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text style={[T.h4, { color: '#dc2626' }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Logout confirmation modal ── */}
      <Modal
        visible={showLogout}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogout(false)}
      >
        <View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
          alignItems: 'center', justifyContent: 'center', padding: 32,
        }}>
          <View style={{
            backgroundColor: '#fff', borderRadius: 20, padding: 28, width: '100%',
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
          }}>
            <Text style={[T.h4, { color: '#111827', marginBottom: 10, fontSize: 18 }]}>
              Sign Out
            </Text>
            <Text style={[T.body, { color: '#6b7280', marginBottom: 24, lineHeight: 22 }]}>
              Are you sure you want to log out?
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowLogout(false)}
                style={{
                  flex: 1, paddingVertical: 13, borderRadius: 10,
                  borderWidth: 1.5, borderColor: '#e5e7eb',
                  alignItems: 'center',
                }}
              >
                <Text style={[T.label, { color: '#374151' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSignOut}
                style={{
                  flex: 1, paddingVertical: 13, borderRadius: 10,
                  backgroundColor: '#dc2626', alignItems: 'center',
                }}
              >
                <Text style={[T.label, { color: '#fff' }]}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
