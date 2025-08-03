// Fallback for react-native-installed-apps when not available (e.g., in Expo Go)

const InstalledAppsFallback = {
  // Flag to indicate this is a fallback
  _isFallback: true,
  
  // Get all installed apps - returns empty array in fallback
  getApps: async () => {
    // In fallback mode, return empty array
    return [];
  },
  
  // Get non-system apps - returns empty array in fallback
  getNonSystemApps: async () => {
    // In fallback mode, return empty array
    return [];
  },
};

let InstalledApps;

try {
  // Try to import the real react-native-installed-apps
  InstalledApps = require('react-native-installed-apps');
} catch (error) {
  console.log('react-native-installed-apps not available, using fallback');
  InstalledApps = InstalledAppsFallback;
}

export default InstalledApps;
