
let Notifications;

try {
  Notifications = require('expo-notifications');
} catch (e) {

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
