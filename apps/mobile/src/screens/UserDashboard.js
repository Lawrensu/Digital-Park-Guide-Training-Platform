// src/screens/UserDashboard.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { FONTS } from '../theme/fonts';
import { fetchCourses, syncOfflineData } from '../services/apiService';
import { MOCK_NOTIFICATIONS } from '../data/seedData';

const StatCard = ({ icon, label, value, color }) => (
  <View style={{
    flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16,
    alignItems: 'center', marginHorizontal: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  }}>
    <View style={{
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: `${color}20`, alignItems: 'center', justifyContent: 'center',
      marginBottom: 8,
    }}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827' }}>{value}</Text>
    <Text style={{ fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 2 }}>{label}</Text>
  </View>
);

const NotifItem = ({ notif }) => {
  const icons = { course: 'book', quiz: 'help-circle', cert: 'ribbon' };
  const colors = { course: '#16a34a', quiz: '#d97706', cert: '#0891b2' };
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'flex-start', padding: 14,
      borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
    }}>
      <View style={{
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: `${colors[notif.type]}15`,
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
      }}>
        <Ionicons name={icons[notif.type]} size={16} color={colors[notif.type]} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827' }}>{notif.title}</Text>
          <Text style={{ fontSize: 11, color: '#9ca3af' }}>{notif.time}</Text>
        </View>
        <Text style={{ fontSize: 12, color: '#6b7280', lineHeight: 17 }}>{notif.message}</Text>
      </View>
      {!notif.read && (
        <View style={{
          width: 8, height: 8, borderRadius: 4,
          backgroundColor: '#16a34a', marginLeft: 8, marginTop: 4,
        }} />
      )}
    </View>
  );
};

export default function UserDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  useEffect(() => {
    loadData();
    handleSync();
  }, []);

  const loadData = async () => {
    const data = await fetchCourses();
    setCourses(data.slice(0, 3)); // Show first 3 enrolled
  };

  const handleSync = async () => {
    const result = await syncOfflineData();
    if (result.synced > 0) {
      setSyncStatus(`✅ Synced ${result.synced} item(s) to server`);
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    await handleSync();
    setRefreshing(false);
  };

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['bottom']}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#15803d" />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ backgroundColor: '#15803d', padding: 24, paddingTop: 16, paddingBottom: 32 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>
                Good morning 🌿
              </Text>
              <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff' }}>
                {user?.name?.split(' ')[0]}!
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {/* Notification bell */}
              <View style={{ position: 'relative' }}>
                <TouchableOpacity onPress={() => navigation.navigate("Notifications")} style={{
                  width: 40, height: 40, borderRadius: 20,
                  backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Ionicons name="notifications-outline" size={20} color="#fff" />
                </TouchableOpacity>
                {unreadCount > 0 && (
                  <View style={{
                    position: 'absolute', top: -2, right: -2,
                    width: 16, height: 16, borderRadius: 8,
                    backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 9, color: '#fff', fontWeight: '800' }}>{unreadCount}</Text>
                  </View>
                )}
              </View>
              {/* Avatar */}
              <TouchableOpacity onPress={() => Alert.alert('Sign Out', 'Are you sure?', [
                { text: 'Cancel' }, { text: 'Sign Out', onPress: logout, style: 'destructive' }
              ])}>
                <Image
                  source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=47' }}
                  style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sync banner */}
          {syncStatus && (
            <View style={{
              marginTop: 12, padding: 10, backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 10,
            }}>
              <Text style={{ fontSize: 12, color: '#fff', textAlign: 'center' }}>{syncStatus}</Text>
            </View>
          )}

          {/* Overall progress */}
          <View style={{
            marginTop: 20, padding: 16, backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 16,
          }}>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>
              OVERALL TRAINING PROGRESS
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>3 of 6 courses completed</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#86efac' }}>47%</Text>
            </View>
            {/* Progress bar */}
            <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4 }}>
              <View style={{
                width: '47%', height: 8, backgroundColor: '#4ade80', borderRadius: 4,
              }} />
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={{ flexDirection: 'row', margin: 20, marginTop: -16 }}>
          <StatCard icon="book" label="Courses" value="6" color="#16a34a" />
          <StatCard icon="checkmark-circle" label="Completed" value="3" color="#0891b2" />
          <StatCard icon="ribbon" label="Certs" value="2" color="#d97706" />
        </View>

        {/* Continue Learning */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827' }}>Continue Learning</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Courses')}>
              <Text style={{ fontSize: 13, color: '#16a34a', fontWeight: '700' }}>View All</Text>
            </TouchableOpacity>
          </View>

          {courses.map((course, index) => (
            <TouchableOpacity
              key={course.id}
              onPress={() => navigation.navigate('Courses', {
                screen: 'CourseList',
              })}
              style={{
                backgroundColor: '#fff', borderRadius: 16, marginBottom: 12,
                flexDirection: 'row', overflow: 'hidden',
                shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
              }}
            >
              <Image
                source={{ uri: course.thumbnail }}
                style={{ width: 90, height: 90 }}
                resizeMode="cover"
              />
              <View style={{ flex: 1, padding: 12 }}>
                <View style={{
                  alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
                  backgroundColor: '#dcfce7', borderRadius: 6, marginBottom: 6,
                }}>
                  <Text style={{ fontSize: 10, color: '#16a34a', fontWeight: '700' }}>
                    {course.category.toUpperCase()}
                  </Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 8 }} numberOfLines={2}>
                  {course.title}
                </Text>
                {/* Progress bar */}
                <View style={{ height: 4, backgroundColor: '#e5e7eb', borderRadius: 2 }}>
                  <View style={{
                    width: `${[68, 34, 0][index]}%`, height: 4,
                    backgroundColor: '#16a34a', borderRadius: 2,
                  }} />
                </View>
                <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
                  {[68, 34, 0][index]}% complete
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 12 }}>
            Notifications
          </Text>
          <View style={{
            backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
          }}>
            {MOCK_NOTIFICATIONS.map((n) => (
              <NotifItem key={n.id} notif={n} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
