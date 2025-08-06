
const DeviceInfoFallback = {
  
  _isFallback: true,
  
 
  isAppInstalled: async (packageName) => {

    return false;
  },
  
 
  getSystemName: () => 'Unknown',
  getSystemVersion: () => 'Unknown',
  getModel: () => 'Unknown',
  getBrand: () => 'Unknown',
  getDeviceId: () => 'unknown-device',
  getUniqueId: () => 'unknown-unique-id',
  getApplicationName: () => 'MEELOxDCB',
  getBuildNumber: () => '1',
  getVersion: () => '1.0.0',
  hasNotch: () => false,
  hasGmsSync: () => Promise.resolve(false),
  hasHmsSync: () => Promise.resolve(false),
};

let DeviceInfo;

try {

  DeviceInfo = require('react-native-device-info').default || require('react-native-device-info');
  

  if (!DeviceInfo.isAppInstalled) {
    console.log('isAppInstalled not available in DeviceInfo, using fallback method');
    DeviceInfo.isAppInstalled = DeviceInfoFallback.isAppInstalled;
  }
} catch (error) {
  console.log('react-native-device-info not available, using fallback');
  DeviceInfo = DeviceInfoFallback;
}


if (!DeviceInfo.isAppInstalled) {
  DeviceInfo.isAppInstalled = DeviceInfoFallback.isAppInstalled;
}

export default DeviceInfo;
