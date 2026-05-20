import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  useEffect(() => {
    // Check initial user preference for notifications
    const checkPrefs = async () => {
      const prefs = await AsyncStorage.getItem('notifications_enabled');
      if (prefs !== null) {
        setNotificationsEnabled(JSON.parse(prefs));
      }
    };
    checkPrefs();
  }, []);

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('notifications_enabled', JSON.stringify(value));
    
    if (!value) {
      // If disabled, cancel all pending reminders
      await Notifications.cancelAllScheduledNotificationsAsync();
    } else {
      // If re-enabled, request permissions and schedule again
      await registerForPushNotificationsAsync();
      await scheduleDailyStreakReminder();
    }
  };

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7F00FF',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      setNotificationsEnabled(false);
      await AsyncStorage.setItem('notifications_enabled', JSON.stringify(false));
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    setExpoPushToken(token);
    return token;
  };

  // Schedule a daily reminder at 20:00 (8:00 PM) to check-in and save the streak
  const scheduleDailyStreakReminder = async () => {
    if (!notificationsEnabled) return;

    // First cancel previous ones to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔥 Tu vas perdre ton streak !",
        body: "N'oublie pas de styler ton humeur aujourd'hui pour garder ta série active. Rentre vite !",
        sound: true,
        data: { screen: 'questionnaire' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20, // 8 PM
        minute: 0,
      },
    });
  };

  // Trigger an immediate notification when user gets a badge
  const sendBadgeUnlockNotification = async (badgeName: string) => {
    if (!notificationsEnabled) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🏆 Objectif complété !",
        body: `Félicitations, vous venez d'obtenir le badge : ${badgeName} ✨`,
        sound: true,
        data: { screen: 'profile' },
      },
      trigger: null, // trigger immediately
    });
  };

  return {
    expoPushToken,
    notificationsEnabled,
    toggleNotifications,
    registerForPushNotificationsAsync,
    scheduleDailyStreakReminder,
    sendBadgeUnlockNotification
  };
}
