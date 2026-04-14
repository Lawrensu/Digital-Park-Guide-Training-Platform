// src/services/notificationService.js
// Push notification service using expo-notifications
// Handles registration, scheduling, and receiving notifications

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Configure how notifications appear when app is foregrounded ─────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ─── Register device for push notifications ──────────────────────────
export const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    console.warn('Push notifications only work on physical devices.');
    return null;
  }

  // Check existing permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request if not granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Push notification permission denied.');
    return null;
  }

  // Android channel setup
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#15803d',
    });

    await Notifications.setNotificationChannelAsync('alerts', {
      name: 'Live Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 200, 500],
      lightColor: '#dc2626',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Training Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: '#d97706',
    });
  }

  // Get Expo push token
  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    await AsyncStorage.setItem('pushToken', token);
    console.log('Push token:', token);
    return token;
  } catch (err) {
    console.warn('Failed to get push token:', err);
    return null;
  }
};

// ─── Schedule a local notification ───────────────────────────────────
export const scheduleLocalNotification = async ({
  title,
  body,
  data = {},
  triggerSeconds = null,
  channelId = 'default',
}) => {
  const trigger = triggerSeconds
    ? { seconds: triggerSeconds }
    : null; // null = immediate

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
      ...(Platform.OS === 'android' && { channelId }),
    },
    trigger,
  });

  return id;
};

// ─── Cancel a scheduled notification ─────────────────────────────────
export const cancelNotification = async (notifId) => {
  await Notifications.cancelScheduledNotificationAsync(notifId);
};

// ─── Cancel all scheduled notifications ──────────────────────────────
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// ─── Schedule deadline reminder (24h before) ─────────────────────────
export const scheduleDeadlineReminder = async (moduleTitle, deadlineDate) => {
  const reminderTime = new Date(deadlineDate);
  reminderTime.setHours(reminderTime.getHours() - 24);
  const secondsUntil = Math.floor((reminderTime - new Date()) / 1000);

  if (secondsUntil <= 0) return null; // Already past reminder time

  return scheduleLocalNotification({
    title: '⏰ Deadline Reminder',
    body: `"${moduleTitle}" is due in 24 hours. Complete it now!`,
    data: { type: 'reminder', moduleTitle },
    triggerSeconds: secondsUntil,
    channelId: 'reminders',
  });
};

// ─── Send quiz result notification ───────────────────────────────────
export const sendQuizResultNotification = async (moduleName, score, total, passed) => {
  const percentage = Math.round((score / total) * 100);
  const title = passed ? '🎉 Congratulations!' : '📚 Quiz Result';
  const body = passed
    ? `You scored ${percentage}% and passed ${moduleName}!`
    : `You scored ${percentage}% on ${moduleName}. Would you like to retake?`;

  return scheduleLocalNotification({
    title,
    body,
    data: { type: passed ? 'result_pass' : 'result_fail', moduleName, score, total, percentage },
    channelId: 'default',
  });
};

// ─── Send new module notification (admin triggered) ──────────────────
export const sendNewModuleNotification = async (moduleTitle, description, deadline) => {
  return scheduleLocalNotification({
    title: '📚 New Training Module',
    body: `${moduleTitle} is now available${deadline ? `. Deadline: ${deadline}` : ''}.`,
    data: { type: 'course', moduleTitle, description },
    channelId: 'default',
  });
};

// ─── Send certificate approval notification ───────────────────────────
export const sendCertificateNotification = async (moduleName) => {
  return scheduleLocalNotification({
    title: '🎖 Certificate Approved!',
    body: `Congratulations! Your certificate from ${moduleName} has been approved. Download it now.`,
    data: { type: 'cert', moduleName },
    channelId: 'default',
  });
};

// ─── Send live alert notification (admin) ────────────────────────────
export const sendLiveAlertNotification = async (location, time) => {
  return scheduleLocalNotification({
    title: '⚠️ Abnormal Activity Detected',
    body: `Unusual activity detected at ${location} at ${time}. Review evidence frames.`,
    data: { type: 'alert', location, time },
    channelId: 'alerts',
  });
};

// ─── Set app badge count ──────────────────────────────────────────────
export const setBadgeCount = async (count) => {
  await Notifications.setBadgeCountAsync(count);
};

// ─── Clear badge ──────────────────────────────────────────────────────
export const clearBadge = async () => {
  await Notifications.setBadgeCountAsync(0);
};
