import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';

const sans  = Platform.select({ ios: 'System', android: 'sans-serif' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const T = {
  h1:      { fontFamily: sans,  fontSize: 30, fontWeight: '600' },
  h3:      { fontFamily: sans,  fontSize: 20, fontWeight: '500' },
  h4:      { fontFamily: sans,  fontSize: 16, fontWeight: '600' },
  bodyDef: { fontFamily: serif, fontSize: 16, fontWeight: '400' },
  bodySm:  { fontFamily: serif, fontSize: 14, fontWeight: '400' },
  label:   { fontFamily: sans,  fontSize: 14, fontWeight: '500' },
  caption: { fontFamily: sans,  fontSize: 12, fontWeight: '500' },
};

const CERT_DETAILS = {
  1: {
    certId: 'NBT-2026-A-001247', levelText: 'Level 1',
    issuedDate: '2026-04-27',    expiryText: '2028-04-27',
    issuedBy: 'Dr. Maria Santos', signatoryTitle: 'Chief Training Officer',
  },
  2: {
    certId: 'NBT-2026-B-002134', levelText: 'Level 2',
    issuedDate: '2026-05-10',    expiryText: '2029-05-10',
    issuedBy: 'Dr. Maria Santos', signatoryTitle: 'Chief Training Officer',
  },
  3: {
    certId: 'NBT-2026-C-003521', levelText: 'Level 3',
    issuedDate: '2026-06-01',    expiryText: '2029-06-01',
    issuedBy: 'Dr. Maria Santos', signatoryTitle: 'Chief Training Officer',
  },
  4: {
    certId: 'NBT-2026-D-004789', levelText: 'Level 1',
    issuedDate: '2026-04-10',    expiryText: '2028-04-10',
    issuedBy: 'Dr. Maria Santos', signatoryTitle: 'Chief Training Officer',
  },
  5: {
    certId: 'NBT-2026-E-005012', levelText: 'Level 2',
    issuedDate: '2026-05-20',    expiryText: '2029-05-20',
    issuedBy: 'Dr. Maria Santos', signatoryTitle: 'Chief Training Officer',
  },
};

/* ── QR placeholder ── */
const QR_ROWS = [
  '11111110101111111',
  '10000010001000001',
  '10111010101011101',
  '10111010011011101',
  '10111010110011101',
  '10000010001000001',
  '11111110101111111',
  '00000001001000000',
  '10110111001101010',
  '01001100110010101',
  '11010010101001011',
  '00100001001000100',
  '11111110101100010',
  '10000010001001001',
  '10111010100100100',
  '10000010011010010',
  '11111110110100101',
];

const CELL = 9;

function QRCode() {
  return (
    <View style={{
      alignSelf: 'center',
      borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb',
      padding: 10, backgroundColor: '#fff',
    }}>
      {QR_ROWS.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row' }}>
          {row.split('').map((cell, c) => (
            <View
              key={c}
              style={{ width: CELL, height: CELL, backgroundColor: cell === '1' ? '#111827' : '#fff' }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: '#f3f4f6', marginVertical: 20 }} />;
}

function DetailPair({ left, right }) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
      <View style={{ flex: 1 }}>
        <Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 4 }]}>
          {left.label}
        </Text>
        <Text style={[T.label, { color: '#111827' }]}>{left.value}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[T.caption, { color: '#9ca3af', letterSpacing: 0.5, marginBottom: 4 }]}>
          {right.label}
        </Text>
        <Text style={[T.label, { color: '#111827' }]}>{right.value}</Text>
      </View>
    </View>
  );
}

export default function GuideViewCert() {
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();
  const route      = useRoute();
  const cert       = route.params?.cert ?? {};
  const details    = CERT_DETAILS[cert.id] ?? CERT_DETAILS[1];

  const certColor = cert.color ?? '#15803d';
  const iconBg    = cert.iconBg ?? '#dcfce7';

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

      {/* ── Green header ── */}
      <View style={{
        backgroundColor: '#15803d',
        paddingTop: isOnline === false ? 12 : 52, paddingBottom: 20, paddingHorizontal: 20,
        flexDirection: 'row', alignItems: 'center',
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={[T.h1, { color: '#fff' }]}>My Certificate</Text>
      </View>

      {/* ── Certificate card ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
      >
        <View style={{
          backgroundColor: '#fff', borderRadius: 20,
          paddingVertical: 28, paddingHorizontal: 24,
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.07, shadowRadius: 12, elevation: 4,
        }}>

          {/* Ribbon icon */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              width: 72, height: 72, borderRadius: 36,
              backgroundColor: iconBg,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name="ribbon" size={34} color={certColor} />
            </View>
          </View>

          {/* Issuing authority */}
          <Text style={[T.caption, { color: '#9ca3af', textAlign: 'center', letterSpacing: 1, marginBottom: 6 }]}>
            CERTIFICATE OF COMPLETION
          </Text>
          <Text style={[T.bodySm, { color: '#374151', textAlign: 'center' }]}>
            National Park Training Authority
          </Text>

          <Divider />

          {/* Name block */}
          <Text style={[T.bodySm, { color: '#9ca3af', textAlign: 'center', fontStyle: 'italic', marginBottom: 10 }]}>
            This certifies that
          </Text>
          <Text style={{
            fontFamily: sans, fontSize: 26, fontWeight: '700',
            color: '#111827', textAlign: 'center', letterSpacing: 1.5, marginBottom: 10,
          }}>
            AMIRA HASSAN
          </Text>
          <Text style={[T.bodySm, { color: '#15803d', textAlign: 'center', fontStyle: 'italic', marginBottom: 10 }]}>
            has successfully completed
          </Text>
          <Text style={[T.h3, { color: '#15803d', textAlign: 'center', fontWeight: '600', marginBottom: 6 }]}>
            {cert.title ?? 'Certified Biodiversity Guide'}
          </Text>
          <Text style={[T.bodySm, { color: '#6b7280', textAlign: 'center' }]}>
            {cert.course ?? 'Rainforest Biodiversity Fundamentals'}
          </Text>

          <Divider />

          {/* Detail pairs */}
          <DetailPair
            left={{ label: 'CERT ID',  value: details.certId }}
            right={{ label: 'LEVEL',   value: details.levelText }}
          />
          <DetailPair
            left={{ label: 'ISSUED',   value: details.issuedDate }}
            right={{ label: 'EXPIRES', value: details.expiryText }}
          />
          <DetailPair
            left={{ label: 'ISSUED BY', value: details.issuedBy }}
            right={{ label: 'TITLE',    value: details.signatoryTitle }}
          />

          <Divider />

          {/* QR code */}
          <QRCode />
          <Text style={[T.caption, { color: '#9ca3af', textAlign: 'center', marginTop: 12, marginBottom: 4 }]}>
            Scan to verify
          </Text>
          <Text style={[T.caption, { color: '#15803d', textAlign: 'center' }]}>
            verify.parkguide.org/{details.certId}
          </Text>

          <Divider />

          {/* Signature */}
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 160, height: 1, backgroundColor: '#374151', marginBottom: 10 }} />
            <Text style={[T.label, { color: '#111827', textAlign: 'center' }]}>
              {details.issuedBy}
            </Text>
            <Text style={[T.caption, { color: '#9ca3af', textAlign: 'center', marginTop: 3 }]}>
              {details.signatoryTitle}
            </Text>
          </View>

        </View>
      </ScrollView>

      {/* ── Sticky bottom bar ── */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1, borderTopColor: '#e5e7eb',
        paddingHorizontal: 16, paddingVertical: 14, paddingBottom: 28,
        flexDirection: 'row', gap: 12,
      }}>
        <TouchableOpacity style={{
          flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
          gap: 8, paddingVertical: 14, borderRadius: 12,
          backgroundColor: '#15803d',
        }}>
          <Ionicons name="download-outline" size={18} color="#fff" />
          <Text style={[T.label, { color: '#fff' }]}>Download PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
          gap: 8, paddingVertical: 14, borderRadius: 12,
          borderWidth: 1.5, borderColor: '#15803d',
        }}>
          <Ionicons name="share-outline" size={18} color="#15803d" />
          <Text style={[T.label, { color: '#15803d' }]}>Share Certificate</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
