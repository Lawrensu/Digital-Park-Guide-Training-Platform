import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../services/AuthContext';
import useNetworkStatus from '../../services/connectivityService';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h1:      { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h2:      { fontFamily: sans,  fontSize: 24, fontWeight: '600' },
  h3:      { fontFamily: sans,  fontSize: 20, fontWeight: '500' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodyDef: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const STATS = [
  { icon: 'checkmark-circle', iconColor: '#3b82f6', iconBg: '#dbeafe', value: 3,  label: 'Completed'      },
  { icon: 'ribbon',           iconColor: '#0891b2', iconBg: '#e0f2fe', value: 5,  label: 'Certifications' },
  { icon: 'medal',            iconColor: '#d97706', iconBg: '#fef3c7', value: 3,  label: 'Badges'         },
];

const BADGES = [
  { id: 1, label: 'First Steps',      date: '03-15', borderColor: '#15803d', iconColor: '#15803d', iconBg: '#dcfce7' },
  { id: 2, label: 'Quiz Master',      date: '04-22', borderColor: '#d97706', iconColor: '#d97706', iconBg: '#fef3c7' },
  { id: 3, label: 'Conservation Pro', date: '04-28', borderColor: '#0891b2', iconColor: '#0891b2', iconBg: '#e0f2fe' },
];

const PREFERENCES = [
  { icon: 'notifications-outline', label: 'Notification Settings' },
  { icon: 'lock-closed-outline',   label: 'Change Password'       },
  { icon: 'help-circle-outline',   label: 'Help & Support'        },
];

function StatCard({ icon, iconColor, iconBg, value, label }) {
  return (
    <View style={{
      flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16,
      alignItems: 'center', marginHorizontal: 5,
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    }}>
      <View style={{
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center',
        marginBottom: 8,
      }}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={[T.h4, { color: '#111827', fontSize: 20 }]}>{value}</Text>
      <Text style={[T.caption, { color: '#9ca3af', marginTop: 3, textAlign: 'center' }]}>{label}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value, isLast }) {
  return (
    <View>
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 14,
      }}>
        <View style={{
          width: 36, height: 36, borderRadius: 10,
          backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center',
          marginRight: 14,
        }}>
          <Ionicons name={icon} size={18} color="#15803d" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.4, marginBottom: 3 }]}>{label}</Text>
          <Text style={[T.bodyDef, { color: '#111827' }]}>{value}</Text>
        </View>
      </View>
      {!isLast && <View style={{ height: 1, backgroundColor: '#f3f4f6', marginLeft: 66 }} />}
    </View>
  );
}

function BadgeCircle({ badge }) {
  return (
    <View style={{ alignItems: 'center', marginRight: 20 }}>
      <View style={{
        width: 72, height: 72, borderRadius: 36,
        borderWidth: 3, borderColor: badge.borderColor,
        backgroundColor: badge.iconBg,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 8,
      }}>
        <Ionicons name="medal" size={30} color={badge.iconColor} />
        <View style={{
          position: 'absolute', top: 2, right: 2,
          width: 14, height: 14, borderRadius: 7,
          backgroundColor: badge.borderColor,
          borderWidth: 2, borderColor: '#fff',
        }} />
      </View>
      <Text style={[T.caption, { color: '#111827', fontWeight: '600', textAlign: 'center', maxWidth: 70 }]}>
        {badge.label}
      </Text>
      <Text style={[T.caption, { color: '#9ca3af', marginTop: 2 }]}>{badge.date}</Text>
    </View>
  );
}

function PrefRow({ icon, label, isLast, onPress }) {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 16, paddingVertical: 15,
        }}
      >
        <Ionicons name={icon} size={20} color="#6b7280" style={{ marginRight: 14 }} />
        <Text style={[T.label, { flex: 1, color: '#111827', fontSize: 15 }]}>{label}</Text>
        <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
      </TouchableOpacity>
      {!isLast && <View style={{ height: 1, backgroundColor: '#f3f4f6', marginLeft: 50 }} />}
    </View>
  );
}

export default function GuideProfile() {
  const navigation  = useNavigation();
  const { isOnline } = useNetworkStatus();
  const { logout }  = useAuth();
  const [showSignOut, setShowSignOut] = useState(false);

  // Editable profile fields
  const [name,      setName]      = useState('Amira Hassan');
  const [phone,     setPhone]     = useState('+1 555-0123');
  const [specialty, setSpecialty] = useState('Wildlife Conservation');
  const [email,     setEmail]     = useState('amira.hassan@parkguide.org');

  // Edit modal state
  const [showEdit,  setShowEdit]  = useState(false);
  const [draft, setDraft] = useState({ name, phone, specialty, email });

  // Change password modal state
  const [showChangePw,  setShowChangePw]  = useState(false);
  const [pwDraft,       setPwDraft]       = useState({ current: '', next: '', confirm: '' });
  const [pwError,       setPwError]       = useState('');
  const [pwVisible,     setPwVisible]     = useState({ current: false, next: false, confirm: false });

  function openChangePw() {
    setPwDraft({ current: '', next: '', confirm: '' });
    setPwError('');
    setShowChangePw(true);
  }

  function savePassword() {
    if (!pwDraft.current) { setPwError('Please enter your current password.'); return; }
    if (pwDraft.next.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    if (pwDraft.next !== pwDraft.confirm) { setPwError('Passwords do not match.'); return; }
    setPwError('');
    setShowChangePw(false);
  }

  function openEdit() {
    setDraft({ name, phone, specialty, email });
    setShowEdit(true);
  }

  function saveEdit() {
    setName(draft.name.trim() || name);
    setPhone(draft.phone.trim() || phone);
    setSpecialty(draft.specialty.trim() || specialty);
    setEmail(draft.email.trim() || email);
    setShowEdit(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ── Green header (scrollable) ── */}
        <View style={{
          backgroundColor: '#15803d',
          paddingTop: isOnline === false ? 12 : 52, paddingBottom: 48, paddingHorizontal: 20,
          alignItems: 'center',
        }}>
          {/* Top bar */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', marginBottom: 20,
          }}>
            <Text style={[T.h1, { color: '#fff' }]}>My Profile</Text>
            <TouchableOpacity onPress={openEdit}>
              <Ionicons name="create-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={{ position: 'relative', marginBottom: 14 }}>
            <View style={{
              width: 96, height: 96, borderRadius: 48,
              backgroundColor: '#86efac',
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 3, borderColor: '#fff',
            }}>
              <Ionicons name="person" size={44} color="#15803d" />
            </View>
            <View style={{
              position: 'absolute', bottom: 4, right: 4,
              width: 16, height: 16, borderRadius: 8,
              backgroundColor: '#22c55e', borderWidth: 2, borderColor: '#fff',
            }} />
          </View>

          <Text style={[T.h2, { color: '#fff', marginBottom: 4 }]}>{name}</Text>
          <Text style={[T.bodyDef, { color: 'rgba(255,255,255,0.85)', marginBottom: 4 }]}>
            {specialty}
          </Text>
          <Text style={[T.caption, { color: 'rgba(255,255,255,0.7)' }]}>
            {email}
          </Text>
        </View>

        {/* ── Stats row (overlaps green header) ── */}
        <View style={{
          flexDirection: 'row', marginHorizontal: 16, marginTop: -32, marginBottom: 8,
        }}>
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </View>

        {/* ── Account Info ── */}
        <Text style={[T.h3, { color: '#111827', marginHorizontal: 16, marginBottom: 10, marginTop: 24 }]}>
          Account Info
        </Text>
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
          marginHorizontal: 16, marginBottom: 24,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        }}>
          <InfoRow icon="person-outline"    label="FULL NAME"  value={name}      isLast={false} />
          <InfoRow icon="call-outline"      label="PHONE"      value={phone}     isLast={false} />
          <InfoRow icon="briefcase-outline" label="SPECIALTY"  value={specialty} isLast={false} />
          <InfoRow icon="mail-outline"      label="EMAIL"      value={email}     isLast={true}  />
        </View>

        {/* ── Badges ── */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          marginHorizontal: 16, marginBottom: 14,
        }}>
          <Text style={[T.h3, { color: '#111827' }]}>Badges</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Badges')}>
            <Text style={[T.label, { color: '#15803d' }]}>View All →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 4 }}
          style={{ marginBottom: 24 }}
        >
          {BADGES.map((b) => (
            <BadgeCircle key={b.id} badge={b} />
          ))}
        </ScrollView>

        {/* ── My Certifications row ── */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
          marginHorizontal: 16, marginBottom: 24,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Certification')}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
          >
            <View style={{
              width: 46, height: 46, borderRadius: 23,
              backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center',
              marginRight: 14,
            }}>
              <Ionicons name="ribbon" size={22} color="#3b82f6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[T.h4, { color: '#111827' }]}>My Certifications</Text>
              <Text style={[T.caption, { color: '#9ca3af', marginTop: 3 }]}>5 certificates earned</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* ── Preferences ── */}
        <Text style={[T.h3, { color: '#111827', marginHorizontal: 16, marginBottom: 10 }]}>
          Preferences
        </Text>
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
          marginHorizontal: 16, marginBottom: 24,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        }}>
          {PREFERENCES.map((p, i) => (
            <PrefRow
              key={p.label}
              {...p}
              isLast={i === PREFERENCES.length - 1}
              onPress={p.label === 'Change Password' ? openChangePw : undefined}
            />
          ))}
        </View>

        {/* ── Sign Out ── */}
        <TouchableOpacity
          onPress={() => setShowSignOut(true)}
          style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            gap: 10, marginHorizontal: 16,
            borderWidth: 2, borderColor: '#dc2626', borderRadius: 14,
            paddingVertical: 16, backgroundColor: '#fff',
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text style={[T.h4, { color: '#dc2626' }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Edit Profile Modal ── */}
      <Modal
        visible={showEdit}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEdit(false)}
      >
        <View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
            padding: 24, paddingBottom: 40,
          }}>
            {/* Modal header */}
            <View style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 24,
            }}>
              <Text style={[T.h3, { color: '#111827' }]}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEdit(false)}>
                <Ionicons name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Fields */}
            {[
              { label: 'FULL NAME',  key: 'name',      keyboard: 'default'       },
              { label: 'PHONE',      key: 'phone',     keyboard: 'phone-pad'     },
              { label: 'SPECIALTY',  key: 'specialty', keyboard: 'default'       },
              { label: 'EMAIL',      key: 'email',     keyboard: 'email-address' },
            ].map((field, i, arr) => (
              <View key={field.key} style={{ marginBottom: i < arr.length - 1 ? 16 : 24 }}>
                <Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 6 }]}>
                  {field.label}
                </Text>
                <TextInput
                  value={draft[field.key]}
                  onChangeText={(v) => setDraft((prev) => ({ ...prev, [field.key]: v }))}
                  keyboardType={field.keyboard}
                  autoCapitalize={field.keyboard === 'email-address' ? 'none' : 'words'}
                  style={[T.bodyDef, {
                    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
                    paddingHorizontal: 14, paddingVertical: 12,
                    color: '#111827',
                  }]}
                />
              </View>
            ))}

            {/* Save button */}
            <TouchableOpacity
              onPress={saveEdit}
              style={{
                backgroundColor: '#15803d', borderRadius: 14,
                paddingVertical: 16, alignItems: 'center',
              }}
            >
              <Text style={[T.h4, { color: '#fff' }]}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Change Password Modal ── */}
      <Modal
        visible={showChangePw}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChangePw(false)}
      >
        <View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
            padding: 24, paddingBottom: 40,
          }}>
            {/* Header */}
            <View style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 24,
            }}>
              <Text style={[T.h3, { color: '#111827' }]}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowChangePw(false)}>
                <Ionicons name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Fields */}
            {[
              { label: 'CURRENT PASSWORD', key: 'current' },
              { label: 'NEW PASSWORD',     key: 'next'    },
              { label: 'CONFIRM PASSWORD', key: 'confirm' },
            ].map((field, i, arr) => (
              <View key={field.key} style={{ marginBottom: i < arr.length - 1 ? 16 : 8 }}>
                <Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 6 }]}>
                  {field.label}
                </Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center',
                  borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
                  paddingHorizontal: 14,
                }}>
                  <TextInput
                    value={pwDraft[field.key]}
                    onChangeText={(v) => { setPwDraft((prev) => ({ ...prev, [field.key]: v })); setPwError(''); }}
                    secureTextEntry={!pwVisible[field.key]}
                    autoCapitalize="none"
                    style={[T.bodyDef, { flex: 1, paddingVertical: 12, color: '#111827' }]}
                  />
                  <TouchableOpacity onPress={() => setPwVisible((prev) => ({ ...prev, [field.key]: !prev[field.key] }))}>
                    <Ionicons
                      name={pwVisible[field.key] ? 'eye-off-outline' : 'eye-outline'}
                      size={18} color="#9ca3af"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Error */}
            {pwError ? (
              <Text style={[T.caption, { color: '#dc2626', marginBottom: 16 }]}>{pwError}</Text>
            ) : (
              <View style={{ height: 16 }} />
            )}

            {/* Save */}
            <TouchableOpacity
              onPress={savePassword}
              style={{
                backgroundColor: '#15803d', borderRadius: 14,
                paddingVertical: 16, alignItems: 'center',
              }}
            >
              <Text style={[T.h4, { color: '#fff' }]}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Sign Out Modal ── */}
      <Modal
        visible={showSignOut}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSignOut(false)}
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
            <Text style={[T.h4, { color: '#111827', marginBottom: 10, fontSize: 18 }]}>Sign Out</Text>
            <Text style={[T.bodyDef, { color: '#6b7280', marginBottom: 24, lineHeight: 22 }]}>
              Are you sure you want to log out?
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowSignOut(false)}
                style={{
                  flex: 1, paddingVertical: 13, borderRadius: 10,
                  borderWidth: 1.5, borderColor: '#e5e7eb', alignItems: 'center',
                }}
              >
                <Text style={[T.label, { color: '#374151' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setShowSignOut(false); logout(); }}
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
