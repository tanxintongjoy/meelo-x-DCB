// Notifications fallback for development builds
let Notifications;

try {
  Notifications = require('expo-notifications');
} catch (e) {
  // Fallback for when expo-notifications is not available
  Notifications = {
    setNotificationHandler: () => {},
    getPermissionsAsync: async () => ({ status: 'denied' }),
    requestPermissionsAsync: async () => ({ status: 'denied' }),
    scheduleNotificationAsync: async () => null,
    cancelScheduledNotificationAsync: async () => {},
    getAllScheduledNotificationsAsync: async () => [],
  };
}

export default Notifications;
