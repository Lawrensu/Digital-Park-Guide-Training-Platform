import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Show notifications while the app is in the foreground
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});


export const registerForPushNotifications = async () => {
	if (!Device.isDevice) {
		return null;
	}

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== 'granted') {
		return null;
	}

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

	try {
		const token = (await Notifications.getExpoPushTokenAsync()).data;
		await SecureStore.setItemAsync('pushToken', token);
		return token;
	} catch {
		return null;
	}
};


export const scheduleLocalNotification = async ({
	title,
	body,
	data = {},
	triggerSeconds = null,
	channelId = 'default',
}) => {
	const trigger = triggerSeconds ? { seconds: triggerSeconds } : null;

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


export const cancelNotification = async (notifId) => {
	await Notifications.cancelScheduledNotificationAsync(notifId);
};


export const cancelAllNotifications = async () => {
	await Notifications.cancelAllScheduledNotificationsAsync();
};


export const scheduleDeadlineReminder = async (moduleTitle, deadlineDate) => {
	const reminderTime = new Date(deadlineDate);
	reminderTime.setHours(reminderTime.getHours() - 24);
	const secondsUntil = Math.floor((reminderTime - new Date()) / 1000);

	if (secondsUntil <= 0) return null;

	return scheduleLocalNotification({
		title: 'Deadline Reminder',
		body: `"${moduleTitle}" is due in 24 hours. Complete it now!`,
		data: { type: 'reminder', moduleTitle },
		triggerSeconds: secondsUntil,
		channelId: 'reminders',
	});
};


export const sendQuizResultNotification = async (moduleName, score, total, passed) => {
	const percentage = Math.round((score / total) * 100);
	const title = passed ? 'Congratulations!' : 'Quiz Result';
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


export const sendNewModuleNotification = async (moduleTitle, description, deadline) => {
	return scheduleLocalNotification({
		title: 'New Training Module',
		body: `${moduleTitle} is now available${deadline ? `. Deadline: ${deadline}` : ''}.`,
		data: { type: 'course', moduleTitle, description },
		channelId: 'default',
	});
};


export const sendCertificateNotification = async (moduleName) => {
	return scheduleLocalNotification({
		title: 'Certificate Approved!',
		body: `Congratulations! Your certificate from ${moduleName} has been approved. Download it now.`,
		data: { type: 'cert', moduleName },
		channelId: 'default',
	});
};


export const sendLiveAlertNotification = async (location, time) => {
	return scheduleLocalNotification({
		title: 'Abnormal Activity Detected',
		body: `Unusual activity detected at ${location} at ${time}. Review evidence frames.`,
		data: { type: 'alert', location, time },
		channelId: 'alerts',
	});
};


export const setBadgeCount = async (count) => {
	await Notifications.setBadgeCountAsync(count);
};


export const clearBadge = async () => {
	await Notifications.setBadgeCountAsync(0);
};
