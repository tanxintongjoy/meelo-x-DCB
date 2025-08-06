
const UsageStatsFallback = {

  isUsageStatsPermissionGranted: async () => {
    return false;
  },
  
  
  openUsageStatsSettings: () => {
    
  },
  
  
  queryUsageStats: async (startTime, endTime) => {
    return [];
  },

  queryAndAggregateUsageStats: async (startTime, endTime) => {
    return [];
  },
};

let UsageStats;

try {

  const RealUsageStats = require('react-native-usage-stats');

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
