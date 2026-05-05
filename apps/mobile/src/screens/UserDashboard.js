// src/screens/UserDashboard.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { fetchCourses, syncOfflineData } from '../services/apiService';
import { MOCK_NOTIFICATIONS } from '../data/seedData';
import { FONTS } from '../theme/fonts';

// Mock upcoming deadlines (in production from GET /api/enrolments/me?dueSoon=true)
const MOCK_DEADLINES = [
  { id: 1, title: 'Wilderness First Aid & Emergency Response', dueDate: '2026-04-14', daysLeft: 1,  category: 'Safety' },
  { id: 2, title: 'Wildlife Protection Laws & Regulations',   dueDate: '2026-04-20', daysLeft: 7,  category: 'Legislation' },
  { id: 3, title: 'Bird Identification: Tropical Species',    dueDate: '2026-04-25', daysLeft: 12, category: 'Biodiversity' },
];

const StatCard = ({ icon, label, value, color }) => (
  <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', marginHorizontal: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: `${color}20`, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', fontFamily: FONTS.title }}>{value}</Text>
    <Text style={{ fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 2, fontFamily: FONTS.body }}>{label}</Text>
  </View>
);

const NotifItem = ({ notif }) => {
  const icons = { course: 'book', quiz: 'help-circle', cert: 'ribbon', reminder: 'alarm', result_pass: 'trophy', result_fail: 'refresh-circle', announcement: 'megaphone' };
  const colors = { course: '#16a34a', quiz: '#d97706', cert: '#0891b2', reminder: '#d97706', result_pass: '#16a34a', result_fail: '#dc2626', announcement: '#7c3aed' };
  const icon  = icons[notif.type]  || 'notifications';
  const color = colors[notif.type] || '#6b7280';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', padding: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: `${color}15`, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827', fontFamily: FONTS.title }}>{notif.title}</Text>
          <Text style={{ fontSize: 11, color: '#9ca3af', fontFamily: FONTS.body }}>{notif.time}</Text>
        </View>
        <Text style={{ fontSize: 12, color: '#6b7280', lineHeight: 17, fontFamily: FONTS.body }}>{notif.message}</Text>
      </View>
      {!notif.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#16a34a', marginLeft: 8, marginTop: 4 }} />}
    </View>
  );
};

const DeadlineItem = ({ item, onPress }) => {
  const urgent = item.daysLeft <= 1;
  const soon   = item.daysLeft <= 3;
  const color  = urgent ? '#dc2626' : soon ? '#d97706' : '#374151';
  const bg     = urgent ? '#fee2e2' : soon ? '#fef3c7' : '#f3f4f6';

  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
      <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 }}>
        <Ionicons name="alarm" size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827', fontFamily: FONTS.title }} numberOfLines={1}>{item.title}</Text>
        <Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, fontFamily: FONTS.body }}>{item.category}</Text>
      </View>
      <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: bg, marginLeft: 8 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color, fontFamily: FONTS.label }}>
          {item.daysLeft === 0 ? 'Today' : item.daysLeft === 1 ? '1 day' : `${item.daysLeft} days`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function UserDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  useEffect(() => { loadData(); handleSync(); }, []);

  const loadData = async () => {
    const data = await fetchCourses();
    setCourses(data.slice(0, 3));
  };

  const handleSync = async () => {
    const result = await syncOfflineData();
    if (result.synced > 0) {
      setSyncStatus(`✅ Synced ${result.synced} item(s)`);
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
  const recentNotifs = MOCK_NOTIFICATIONS.filter((n) => !n.read).slice(0, 3);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['bottom']}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#15803d" />} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={{ backgroundColor: '#15803d', padding: 24, paddingTop: 16, paddingBottom: 32 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 2, fontFamily: FONTS.body }}>Good morning 🌿</Text>
              <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff', fontFamily: FONTS.title }}>{user?.name?.split(' ')[0]}!</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ position: 'relative' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="notifications-outline" size={20} color="#fff" />
                </TouchableOpacity>
                {unreadCount > 0 && (
                  <View style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 9, color: '#fff', fontWeight: '800' }}>{unreadCount}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity onPress={() => Alert.alert('Sign Out', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Sign Out', onPress: logout, style: 'destructive' }])}>
                <Image source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=47' }} style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' }} />
              </TouchableOpacity>
            </View>
          </View>

          {syncStatus && (
            <View style={{ marginTop: 12, padding: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10 }}>
              <Text style={{ fontSize: 12, color: '#fff', textAlign: 'center', fontFamily: FONTS.body }}>{syncStatus}</Text>
            </View>
          )}

          {/* Overall progress */}
          <View style={{ marginTop: 20, padding: 16, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16 }}>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 6, fontFamily: FONTS.label }}>OVERALL TRAINING PROGRESS</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff', fontFamily: FONTS.heading }}>3 of 11 courses completed</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#86efac', fontFamily: FONTS.title }}>27%</Text>
            </View>
            <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4 }}>
              <View style={{ width: '27%', height: 8, backgroundColor: '#4ade80', borderRadius: 4 }} />
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', margin: 20, marginTop: -16 }}>
          <StatCard icon="book"             label="Courses"   value="11" color="#16a34a" />
          <StatCard icon="checkmark-circle" label="Completed" value="3"  color="#0891b2" />
          <StatCard icon="ribbon"           label="Certs"     value="2"  color="#d97706" />
        </View>

        {/* Continue Learning */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', fontFamily: FONTS.heading }}>Continue Learning</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Modules')}>
              <Text style={{ fontSize: 13, color: '#16a34a', fontWeight: '700', fontFamily: FONTS.label }}>View All</Text>
            </TouchableOpacity>
          </View>
          {courses.map((course, index) => (
            <TouchableOpacity key={course.id} onPress={() => navigation.navigate('Modules', { screen: 'CourseList' })} style={{ backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, flexDirection: 'row', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
              <Image source={{ uri: course.thumbnail }} style={{ width: 90, height: 90 }} resizeMode="cover" />
              <View style={{ flex: 1, padding: 12 }}>
                <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#dcfce7', borderRadius: 6, marginBottom: 6 }}>
                  <Text style={{ fontSize: 10, color: '#16a34a', fontWeight: '700', fontFamily: FONTS.label }}>{course.category?.toUpperCase()}</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 8, fontFamily: FONTS.title }} numberOfLines={2}>{course.title}</Text>
                <View style={{ height: 4, backgroundColor: '#e5e7eb', borderRadius: 2 }}>
                  <View style={{ width: `${[68, 34, 0][index]}%`, height: 4, backgroundColor: '#16a34a', borderRadius: 2 }} />
                </View>
                <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 4, fontFamily: FONTS.body }}>{[68, 34, 0][index]}% complete</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Deadlines */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', fontFamily: FONTS.heading }}>Upcoming Deadlines</Text>
            <View style={{ backgroundColor: '#fee2e2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
              <Text style={{ fontSize: 11, color: '#dc2626', fontWeight: '700', fontFamily: FONTS.label }}>{MOCK_DEADLINES.length} due soon</Text>
            </View>
          </View>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
            {MOCK_DEADLINES.map((item) => (
              <DeadlineItem key={item.id} item={item} onPress={() => navigation.navigate('Modules', { screen: 'CourseList' })} />
            ))}
          </View>
        </View>

        {/* Recent Notifications */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', fontFamily: FONTS.heading }}>Recent Notifications</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Text style={{ fontSize: 13, color: '#16a34a', fontWeight: '700', fontFamily: FONTS.label }}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
            {recentNotifs.length > 0 ? (
              recentNotifs.map((n) => <NotifItem key={n.id} notif={n} />)
            ) : (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Ionicons name="checkmark-circle-outline" size={32} color="#86efac" />
                <Text style={{ fontSize: 13, color: '#9ca3af', marginTop: 8, fontFamily: FONTS.body }}>All caught up!</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
