import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function GuideDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { guide } = route.params;

  const initial = guide.name.charAt(0).toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d', paddingTop: 52, paddingBottom: 16,
        paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center',
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>Guide Detail</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>

        {/* ── Profile card ── */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 20,
          alignItems: 'center', marginBottom: 12,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        }}>
          <View style={{
            width: 72, height: 72, borderRadius: 36,
            backgroundColor: '#15803d', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14,
          }}>
            <Text style={{ fontSize: 30, fontWeight: '700', color: '#fff' }}>{initial}</Text>
          </View>

          <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 4 }}>
            {guide.name}
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>{guide.role}</Text>
          <Text style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4 }}>{guide.email}</Text>
          <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>Joined {guide.joined}</Text>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {guide.statuses.map((s) => (
              <View key={s} style={{
                paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20,
                borderWidth: 1.5,
                borderColor: s === 'ACTIVE' ? '#16a34a' : '#0891b2',
              }}>
                <Text style={{
                  fontSize: 11, fontWeight: '700', letterSpacing: 0.5,
                  color: s === 'ACTIVE' ? '#16a34a' : '#0891b2',
                }}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Stats row ── */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
          {[
            { label: 'Enrolled',  value: guide.enrolled },
            { label: 'Completed', value: guide.completed },
            { label: 'Certs',     value: guide.certs },
          ].map((s) => (
            <View key={s.label} style={{
              flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 16,
              alignItems: 'center',
              shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
            }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>{s.value}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Course Progress ── */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 }}>
            Course Progress
          </Text>
          {guide.courseProgress.map((c) => (
            <View key={c.name} style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 13, color: '#374151' }}>{c.name}</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#16a34a' }}>{c.pct}%</Text>
              </View>
              <View style={{ height: 7, backgroundColor: '#f3f4f6', borderRadius: 4 }}>
                <View style={{
                  width: `${c.pct}%`, height: 7,
                  backgroundColor: '#16a34a', borderRadius: 4,
                }} />
              </View>
            </View>
          ))}
        </View>

        {/* ── Quiz Results ── */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 }}>
            Quiz Results
          </Text>
          {guide.quizResults.map((q, i) => (
            <View key={i} style={{
              flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
              borderTopWidth: i === 0 ? 0 : 1, borderTopColor: '#f3f4f6',
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#111827' }}>{q.name}</Text>
                <Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{q.date}</Text>
              </View>
              <View style={{
                paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginRight: 10,
                backgroundColor: q.status === 'PASSED' ? '#dcfce7' : '#fee2e2',
              }}>
                <Text style={{
                  fontSize: 11, fontWeight: '700',
                  color: q.status === 'PASSED' ? '#16a34a' : '#dc2626',
                }}>{q.status}</Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827', width: 36, textAlign: 'right' }}>
                {q.score}%
              </Text>
            </View>
          ))}
        </View>

        {/* ── Certifications ── */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 20,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 }}>
            Certifications
          </Text>
          {guide.certifications.map((cert, i) => (
            <View key={i} style={{
              flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
              borderTopWidth: i === 0 ? 0 : 1, borderTopColor: '#f3f4f6',
            }}>
              <Ionicons name="ribbon" size={22} color="#f59e0b" style={{ marginRight: 12 }} />
              <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: '#15803d' }}>{cert}</Text>
              <TouchableOpacity style={{
                borderWidth: 1.5, borderColor: '#15803d', borderRadius: 8,
                paddingHorizontal: 14, paddingVertical: 6,
              }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#15803d' }}>VIEW</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ── Action buttons ── */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <TouchableOpacity style={{
            flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            backgroundColor: '#15803d', borderRadius: 14, paddingVertical: 14, gap: 8,
          }}>
            <Ionicons name="notifications" size={18} color="#fff" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Send Notification</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{
            flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: '#dc2626', borderRadius: 14, paddingVertical: 14, gap: 8,
          }}>
            <Ionicons name="warning-outline" size={18} color="#dc2626" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#dc2626' }}>Suspend Account</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}
