import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
  { name: 'Home',          icon: 'home',              iconOutline: 'home-outline' },
  { name: 'Courses',       icon: 'book',              iconOutline: 'book-outline' },
  { name: 'Registrations', icon: 'person-add',        iconOutline: 'person-add-outline', badge: true },
  { name: 'Notifications', icon: 'notifications',     iconOutline: 'notifications-outline', badge: true },
  { name: 'Settings',      icon: 'settings',          iconOutline: 'settings-outline' },
];

export default function AdminNavigationBar({ state, navigation }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab, index) => {
        const isFocused = state.index === index;
        const color = isFocused ? '#15803d' : '#9ca3af';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[index]?.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(state.routes[index]?.name);
          }
        };

        return (
          <TouchableOpacity key={tab.name} onPress={onPress} style={styles.tab} activeOpacity={0.7}>
            <View style={styles.iconWrapper}>
              <Ionicons name={isFocused ? tab.icon : tab.iconOutline} size={22} color={color} />
              {tab.badge && <View style={styles.badge} />}
            </View>
            <Text style={[styles.label, { color }]}>{tab.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 16,
    paddingTop: 8,
    height: 64,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
  },
});
