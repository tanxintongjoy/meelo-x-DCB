// Fallback for react-native-usage-stats when not available (e.g., in Expo Go)

const UsageStatsFallback = {
  // Permission check - always returns false in web/Expo Go
  isUsageStatsPermissionGranted: async () => {
    return false;
  },
  
  // Open settings - no-op in fallback
  openUsageStatsSettings: () => {
    // Silently ignore in fallback mode
  },
  
  // Query usage stats - returns empty array
  queryUsageStats: async (startTime, endTime) => {
    return [];
  },
  
  // Add other commonly used methods as needed
  queryAndAggregateUsageStats: async (startTime, endTime) => {
    return [];
  },
};

let UsageStats;

try {
  // Try to import the real react-native-usage-stats
  const RealUsageStats = require('react-native-usage-stats');
  // Check if it's actually available and working
  if (RealUsageStats && typeof RealUsageStats.isUsageStatsPermissionGranted === 'function') {
    UsageStats = RealUsageStats;
  } else {
    throw new Error('UsageStats not properly available');
  }
} catch (error) {
  console.log('react-native-usage-stats not available, using fallback');
  UsageStats = UsageStatsFallback;
}

export default UsageStats;
