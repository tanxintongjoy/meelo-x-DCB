// Fallback for react-native-device-info when not available (e.g., in Expo Go)

const DeviceInfoFallback = {
  // Flag to indicate this is a fallback
  _isFallback: true,
  
  // App installation check - always returns false in web/Expo Go
  isAppInstalled: async (packageName) => {
    // Silently return false instead of logging every check
    return false;
  },
  
  // Device info methods with fallback values
  getSystemName: () => 'Unknown',
  getSystemVersion: () => 'Unknown',
  getModel: () => 'Unknown',
  getBrand: () => 'Unknown',
  getDeviceId: () => 'unknown-device',
  getUniqueId: () => 'unknown-unique-id',
  getApplicationName: () => 'MEELOxDCB',
  getBuildNumber: () => '1',
  getVersion: () => '1.0.0',
  
  // Add other commonly used methods as needed
  hasNotch: () => false,
  hasGmsSync: () => Promise.resolve(false),
  hasHmsSync: () => Promise.resolve(false),
};

let DeviceInfo;

try {
  // Try to import the real react-native-device-info
  DeviceInfo = require('react-native-device-info').default || require('react-native-device-info');
  
  // Ensure isAppInstalled exists
  if (!DeviceInfo.isAppInstalled) {
    console.log('isAppInstalled not available in DeviceInfo, using fallback method');
    DeviceInfo.isAppInstalled = DeviceInfoFallback.isAppInstalled;
  }
} catch (error) {
  console.log('react-native-device-info not available, using fallback');
  DeviceInfo = DeviceInfoFallback;
}

// Ensure DeviceInfo has all required methods
if (!DeviceInfo.isAppInstalled) {
  DeviceInfo.isAppInstalled = DeviceInfoFallback.isAppInstalled;
}

export default DeviceInfo;
