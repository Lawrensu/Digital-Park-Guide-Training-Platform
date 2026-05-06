import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';

export default function CourseModules() {
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();
  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <View style={{ backgroundColor: '#15803d', paddingTop: isOnline === false ? 12 : 52, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>Modules</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="albums-outline" size={48} color="#d1d5db" />
        <Text style={{ fontSize: 16, color: '#9ca3af', marginTop: 12 }}>Modules coming soon</Text>
      </View>
    </View>
  );
}
