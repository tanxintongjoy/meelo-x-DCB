
const InstalledAppsFallback = {
  getApps: async () => {
    return [];
  },

  getNonSystemApps: async () => {
    return [];
  },
};

let InstalledApps;

try {
  InstalledApps = require('react-native-installed-apps');
} catch (error) {
  console.log('react-native-installed-apps not available, using fallback');
  InstalledApps = InstalledAppsFallback;
}

export default InstalledApps;
