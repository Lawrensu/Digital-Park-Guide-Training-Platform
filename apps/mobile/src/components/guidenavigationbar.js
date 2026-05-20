import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const sans = Platform.select({ ios: 'System', android: 'sans-serif' });

const TABS = [
  { name: 'Home',          icon: 'home',          iconOutline: 'home-outline',          badge: null },
  { name: 'Modules',       icon: 'book',          iconOutline: 'book-outline',           badge: null },
  { name: 'Notifications', icon: 'notifications', iconOutline: 'notifications-outline',  badge: 3    },
  { name: 'Profile',       icon: 'person',        iconOutline: 'person-outline',         badge: null },
];

export default function GuideNavigationBar({ state, navigation }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab, index) => {
        const isFocused = state.index === index;
        const color     = isFocused ? '#15803d' : '#9ca3af';

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
          <TouchableOpacity
            key={tab.name}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            {/* Icon + badge */}
            <View style={styles.iconWrapper}>
              <Ionicons
                name={isFocused ? tab.icon : tab.iconOutline}
                size={22}
                color={color}
              />
              {tab.badge !== null && (
                <View style={styles.badgePill}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </View>

            {/* Label */}
            <Text style={[styles.label, { color, fontFamily: sans }]}>
              {tab.name}
            </Text>
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
    paddingTop: 10,
    height: 68,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 3,
  },
  badgePill: {
    position: 'absolute',
    top: -5,
    right: -10,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
});
