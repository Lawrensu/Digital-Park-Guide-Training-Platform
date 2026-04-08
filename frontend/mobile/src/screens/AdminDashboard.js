// src/screens/AdminDashboard.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  Alert, TextInput, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { MOCK_USERS, MOCK_COURSES, ADMIN_STATS } from '../data/seedData';
import { FONTS } from '../theme/fonts';

const StatCard = ({ icon, label, value, color, subtitle }) => (
  <View style={{
    flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, margin: 5,
  }}>
    <View style={{
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: `${color}15`, alignItems: 'center', justifyContent: 'center', marginBottom: 10,
    }}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={{ fontSize: 26, fontWeight: '900', color: '#111827' }}>{value}</Text>
    <Text style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{label}</Text>
    {subtitle && <Text style={{ fontSize: 10, color: color, fontWeight: '700', marginTop: 4 }}>{subtitle}</Text>}
  </View>
);

const SectionHeader = ({ title, actionLabel, onAction }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
    <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827' }}>{title}</Text>
    {actionLabel && (
      <TouchableOpacity onPress={onAction} style={{
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#f0fdf4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
      }}>
        <Ionicons name="add" size={14} color="#16a34a" />
        <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '700' }}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const UserRow = ({ user }) => {
  const progressColors = { 1: 78, 2: 45, 3: 92 };
  const prog = progressColors[user.id] || Math.floor(Math.random() * 80 + 10);
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', padding: 14,
      borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
    }}>
      <Image
        source={{ uri: user.avatar }}
        style={{ width: 42, height: 42, borderRadius: 21, marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{user.name}</Text>
        <Text style={{ fontSize: 12, color: '#6b7280' }}>{user.department || 'Park Guide'}</Text>
        <View style={{ height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, marginTop: 6, width: '80%' }}>
          <View style={{ width: `${prog}%`, height: 4, backgroundColor: '#16a34a', borderRadius: 2 }} />
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 13, fontWeight: '800', color: '#16a34a' }}>{prog}%</Text>
        <Text style={{ fontSize: 10, color: '#9ca3af' }}>progress</Text>
      </View>
    </View>
  );
};

const CourseRow = ({ course }) => {
  const enrolled = course.enrolled;
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', padding: 14,
      borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
    }}>
      <Image
        source={{ uri: course.thumbnail }}
        style={{ width: 48, height: 48, borderRadius: 10, marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827' }} numberOfLines={1}>
          {course.title}
        </Text>
        <Text style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
          {course.category} · {course.difficulty}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 13, fontWeight: '800', color: '#374151' }}>{enrolled}</Text>
        <Text style={{ fontSize: 10, color: '#9ca3af' }}>enrolled</Text>
      </View>
    </View>
  );
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [addCourseModal, setAddCourseModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [searchUser, setSearchUser] = useState('');

  const guides = MOCK_USERS.filter((u) => u.role === 'user');
  const filteredGuides = guides.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const TABS = [
    { key: 'overview', label: 'Overview', icon: 'grid-outline' },
    { key: 'users', label: 'Users', icon: 'people-outline' },
    { key: 'courses', label: 'Courses', icon: 'book-outline' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#15803d', padding: 20, paddingBottom: 0 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <View>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Admin Console</Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#fff' }}>
              {user?.name?.split(' ')[0]} 👋
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => Alert.alert('Sign Out', 'Sign out of admin console?', [
              { text: 'Cancel' }, { text: 'Sign Out', onPress: logout, style: 'destructive' }
            ])}
            style={{
              width: 38, height: 38, borderRadius: 19,
              backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name="log-out-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Tab bar */}
        <View style={{ flexDirection: 'row' }}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                paddingVertical: 12, gap: 5,
                borderBottomWidth: 3,
                borderBottomColor: activeTab === tab.key ? '#fff' : 'transparent',
              }}
            >
              <Ionicons name={tab.icon} size={15} color={activeTab === tab.key ? '#fff' : 'rgba(255,255,255,0.55)'} />
              <Text style={{
                fontSize: 12, fontWeight: '700',
                color: activeTab === tab.key ? '#fff' : 'rgba(255,255,255,0.55)',
              }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === 'overview' && (
          <>
            {/* Stats grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5, marginBottom: 20 }}>
              <View style={{ width: '50%' }}>
                <StatCard icon="people" label="Total Users" value={ADMIN_STATS.totalUsers} color="#16a34a" subtitle="+12 this month" />
              </View>
              <View style={{ width: '50%' }}>
                <StatCard icon="book" label="Active Courses" value={ADMIN_STATS.activeCourses} color="#0891b2" />
              </View>
              <View style={{ width: '50%' }}>
                <StatCard icon="trending-up" label="Completion Rate" value={`${ADMIN_STATS.completionRate}%`} color="#d97706" subtitle="↑ 5% vs last month" />
              </View>
              <View style={{ width: '50%' }}>
                <StatCard icon="ribbon" label="Pending Certs" value={ADMIN_STATS.pendingCerts} color="#7c3aed" />
              </View>
            </View>

            {/* Category breakdown */}
            <View style={{
              backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 20,
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
            }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 14 }}>
                Course Enrollment by Category
              </Text>
              {[
                { label: 'Biodiversity', count: 327, color: '#16a34a' },
                { label: 'Eco-tourism', count: 323, color: '#0891b2' },
                { label: 'Safety', count: 167, color: '#dc2626' },
              ].map((item) => (
                <View key={item.label} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={{ fontSize: 13, color: '#374151', fontWeight: '600' }}>{item.label}</Text>
                    <Text style={{ fontSize: 13, color: item.color, fontWeight: '700' }}>{item.count}</Text>
                  </View>
                  <View style={{ height: 8, backgroundColor: '#f3f4f6', borderRadius: 4 }}>
                    <View style={{
                      width: `${(item.count / 400) * 100}%`, height: 8,
                      backgroundColor: item.color, borderRadius: 4,
                    }} />
                  </View>
                </View>
              ))}
            </View>

            {/* Recent activity */}
            <View style={{
              backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
            }}>
              <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#111827' }}>Recent Activity</Text>
              </View>
              {[
                { icon: 'checkmark-circle', color: '#16a34a', text: 'Amira Hassan passed Biodiversity quiz', time: '2h ago' },
                { icon: 'person-add', color: '#0891b2', text: 'New guide registered: Joseph Mwangi', time: '5h ago' },
                { icon: 'ribbon', color: '#d97706', text: 'James Okafor earned Eco-Tourism cert', time: '1d ago' },
                { icon: 'book', color: '#7c3aed', text: 'New course published: Bird Identification', time: '2d ago' },
              ].map((item, i) => (
                <View key={i} style={{
                  flexDirection: 'row', alignItems: 'center', padding: 14,
                  borderBottomWidth: i < 3 ? 1 : 0, borderBottomColor: '#f3f4f6',
                }}>
                  <View style={{
                    width: 36, height: 36, borderRadius: 18,
                    backgroundColor: `${item.color}15`,
                    alignItems: 'center', justifyContent: 'center', marginRight: 12,
                  }}>
                    <Ionicons name={item.icon} size={16} color={item.color} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 13, color: '#374151', lineHeight: 18 }}>{item.text}</Text>
                  <Text style={{ fontSize: 11, color: '#9ca3af' }}>{item.time}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ─── USERS TAB ─── */}
        {activeTab === 'users' && (
          <>
            <SectionHeader title="Park Guides" actionLabel="Add User" onAction={() => Alert.alert('Add User', 'User management form (UI mock).')} />

            {/* Search */}
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, marginBottom: 16,
              shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
            }}>
              <Ionicons name="search-outline" size={16} color="#9ca3af" />
              <TextInput
                value={searchUser}
                onChangeText={setSearchUser}
                placeholder="Search users..."
                placeholderTextColor="#d1d5db"
                style={{ flex: 1, padding: 11, fontSize: 14, color: '#111827' }}
              />
            </View>

            <View style={{
              backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, marginBottom: 20,
            }}>
              {filteredGuides.map((u, i) => (
                <UserRow key={u.id} user={u} />
              ))}
              {filteredGuides.length === 0 && (
                <View style={{ padding: 32, alignItems: 'center' }}>
                  <Text style={{ color: '#9ca3af' }}>No users found</Text>
                </View>
              )}
            </View>

            {/* User stats */}
            <View style={{
              backgroundColor: '#fff', borderRadius: 16, padding: 18,
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
            }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 14 }}>
                User Statistics
              </Text>
              {[
                { label: 'Active this week', value: '89', color: '#16a34a' },
                { label: 'Completed all courses', value: '34', color: '#0891b2' },
                { label: 'Not started', value: '23', color: '#dc2626' },
              ].map((s) => (
                <View key={s.label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Text style={{ fontSize: 13, color: '#374151' }}>{s.label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: s.color }}>{s.value}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ─── COURSES TAB ─── */}
        {activeTab === 'courses' && (
          <>
            <SectionHeader
              title="All Courses"
              actionLabel="New Course"
              onAction={() => setAddCourseModal(true)}
            />

            <View style={{
              backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, marginBottom: 20,
            }}>
              {MOCK_COURSES.map((course) => (
                <CourseRow key={course.id} course={course} />
              ))}
            </View>

            {/* Course actions */}
            <View style={{ gap: 10 }}>
              {['Publish Draft Course', 'Archive Old Content', 'Export Course Data'].map((action) => (
                <TouchableOpacity
                  key={action}
                  onPress={() => Alert.alert(action, `${action} — functionality available in full implementation.`)}
                  style={{
                    backgroundColor: '#fff', borderRadius: 12, padding: 16,
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
                  }}
                >
                  <Text style={{ fontSize: 14, color: '#374151', fontWeight: '600' }}>{action}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Add Course Modal */}
      <Modal visible={addCourseModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24,
          }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 20 }}>
              Add New Course
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8 }}>COURSE TITLE</Text>
            <TextInput
              value={newCourseTitle}
              onChangeText={setNewCourseTitle}
              placeholder="e.g. Wetlands Ecology Fundamentals"
              placeholderTextColor="#d1d5db"
              style={{
                borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12,
                padding: 14, fontSize: 14, color: '#111827', marginBottom: 16,
              }}
            />
            {['Category', 'Instructor', 'Difficulty'].map((field) => (
              <View key={field} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 }}>
                  {field.toUpperCase()}
                </Text>
                <View style={{
                  borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, padding: 14,
                  flexDirection: 'row', justifyContent: 'space-between',
                }}>
                  <Text style={{ fontSize: 14, color: '#9ca3af' }}>Select {field}...</Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </View>
              </View>
            ))}

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => setAddCourseModal(false)}
                style={{ flex: 1, padding: 15, borderRadius: 12, borderWidth: 2, borderColor: '#e5e7eb', alignItems: 'center' }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setAddCourseModal(false);
                  Alert.alert('Success', `Course "${newCourseTitle || 'New Course'}" created!`);
                  setNewCourseTitle('');
                }}
                style={{ flex: 1, padding: 15, borderRadius: 12, backgroundColor: '#15803d', alignItems: 'center' }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Create Course</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 20 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
