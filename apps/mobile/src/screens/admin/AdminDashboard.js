import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../services/AuthContext';
import GuideList from './guidelist';
import useNetworkStatus from '../../services/connectivityService';

const STATS = [
  {
    icon: 'people',
    label: 'Total Users',
    value: '247',
    subtitle: '+12 this month',
    subtitleColor: '#16a34a',
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
  },
  {
    icon: 'layers',
    label: 'Active Courses',
    value: '11',
    subtitle: '3 pending review',
    subtitleColor: '#6b7280',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
  },
  {
    icon: 'trending-up',
    label: 'Completion Rate',
    value: '73%',
    subtitle: '+5% vs last month',
    subtitleColor: '#16a34a',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
  },
  {
    icon: 'ribbon',
    label: 'Pending Certs',
    value: '18',
    subtitle: 'Awaiting approval',
    subtitleColor: '#6b7280',
    iconBg: '#fef3c7',
    iconColor: '#f59e0b',
  },
];

const ENROLLMENT_CATEGORIES = [
  { label: 'Biodiversity',  count: 89, color: '#16a34a' },
  { label: 'Conservation',  count: 67, color: '#0891b2' },
  { label: 'Eco-tourism',   count: 54, color: '#d97706' },
  { label: 'Legislation',   count: 32, color: '#7c3aed' },
  { label: 'Safety',        count: 45, color: '#dc2626' },
];

const MAX_ENROLLMENT = Math.max(...ENROLLMENT_CATEGORIES.map((c) => c.count));

const RECENT_ACTIVITY = [
  { icon: 'checkmark-circle', iconColor: '#16a34a', iconBg: '#dcfce7', text: 'Amira Hassan completed Wildlife Conservation', time: '2m ago' },
  { icon: 'document-text',    iconColor: '#0891b2', iconBg: '#e0f2fe', text: 'Ahmad bin Abdullah submitted quiz',             time: '15m ago' },
  { icon: 'school',           iconColor: '#d97706', iconBg: '#fef3c7', text: 'Certificate issued to James Okafor',            time: '1h ago' },
  { icon: 'person',           iconColor: '#7c3aed', iconBg: '#ede9fe', text: 'New registration: Sarah Chen',                  time: '2h ago' },
];

function StatCard({ icon, label, value, subtitle, subtitleColor, iconBg, iconColor, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
      style={{
        flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, margin: 5,
      }}
    >
      <View style={{
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center', marginBottom: 8,
      }}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827' }}>{value}</Text>
      <Text style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{label}</Text>
      <Text style={{ fontSize: 10, color: subtitleColor, fontWeight: '600', marginTop: 3 }}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();
  const [activeTab, setActiveTab] = useState('overview');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Logout confirmation modal ── */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
          alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32,
        }}>
          <View style={{
            backgroundColor: '#fff', borderRadius: 20, padding: 28, width: '100%',
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
          }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 10 }}>
              Log Out
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', lineHeight: 22, marginBottom: 24 }}>
              Are you sure you want to log out?
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowLogoutModal(false)}
                style={{
                  flex: 1, paddingVertical: 13, borderRadius: 12,
                  borderWidth: 1.5, borderColor: '#e5e7eb', alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setShowLogoutModal(false); logout(); }}
                style={{
                  flex: 1, paddingVertical: 13, borderRadius: 12,
                  backgroundColor: '#dc2626', alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Green header ── */}
      <View style={{ backgroundColor: '#15803d', paddingTop: isOnline === false ? 12 : 52, paddingHorizontal: 20, paddingBottom: 0 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff' }}>Admin Console</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
              {user?.name || 'Admin User'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowLogoutModal(true)}
            style={{
              width: 36, height: 36, borderRadius: 8,
              backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name="log-out-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Header tabs */}
        <View style={{ flexDirection: 'row' }}>
          {['overview', 'guides'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 4,
                marginRight: 24,
                borderBottomWidth: 2,
                borderBottomColor: activeTab === tab ? '#fff' : 'transparent',
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.55)',
                textTransform: 'capitalize',
              }}>
                {tab === 'overview' ? 'Overview' : 'Guides'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Overview tab ── */}
      {activeTab === 'overview' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>

          {/* Stats grid */}
          <View style={{ flexDirection: 'row', marginHorizontal: -5, marginBottom: 12 }}>
            <View style={{ width: '50%' }}>
              <StatCard
                {...STATS[0]}
                onPress={() => navigation.navigate('Settings', { screen: 'GuideList' })}
              />
            </View>
            <View style={{ width: '50%' }}>
              <StatCard
                {...STATS[1]}
                onPress={() => navigation.navigate('Courses', { screen: 'CourseModules' })}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginHorizontal: -5, marginBottom: 16 }}>
            <View style={{ width: '50%' }}>
              <StatCard {...STATS[2]} />
            </View>
            <View style={{ width: '50%' }}>
              <StatCard
                {...STATS[3]}
                onPress={() => navigation.navigate('Courses', { screen: 'Certifications' })}
              />
            </View>
          </View>

          {/* Enrollment by Category */}
          <View style={{
            backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 16,
            shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
          }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 }}>
              Enrollment by Category
            </Text>
            {ENROLLMENT_CATEGORIES.map((item) => (
              <View key={item.label} style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontSize: 13, color: '#374151', fontWeight: '500' }}>{item.label}</Text>
                  <Text style={{ fontSize: 13, color: item.color, fontWeight: '700' }}>{item.count}</Text>
                </View>
                <View style={{ height: 7, backgroundColor: '#f3f4f6', borderRadius: 4 }}>
                  <View style={{
                    width: `${(item.count / MAX_ENROLLMENT) * 100}%`,
                    height: 7,
                    backgroundColor: item.color,
                    borderRadius: 4,
                  }} />
                </View>
              </View>
            ))}
          </View>

          {/* Recent Activity */}
          <View style={{
            backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
            shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
            marginBottom: 16,
          }}>
            <View style={{ padding: 18, paddingBottom: 14 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827' }}>Recent Activity</Text>
            </View>
            {RECENT_ACTIVITY.map((item, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  paddingHorizontal: 18, paddingVertical: 12,
                  borderTopWidth: 1, borderTopColor: '#f3f4f6',
                }}
              >
                <View style={{
                  width: 38, height: 38, borderRadius: 19,
                  backgroundColor: item.iconBg,
                  alignItems: 'center', justifyContent: 'center', marginRight: 12,
                }}>
                  <Ionicons name={item.icon} size={18} color={item.iconColor} />
                </View>
                <Text style={{ flex: 1, fontSize: 13, color: '#374151', lineHeight: 19 }}>
                  {item.text}
                </Text>
                <Text style={{ fontSize: 11, color: '#9ca3af', marginLeft: 8 }}>{item.time}</Text>
              </View>
            ))}
          </View>

        </ScrollView>
      )}

      {/* ── Guides tab ── */}
      {activeTab === 'guides' && <GuideList />}

    </View>
  );
}
