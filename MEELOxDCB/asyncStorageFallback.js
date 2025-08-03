// AsyncStorage fallback for development builds
let AsyncStorage;

try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // Fallback for when AsyncStorage is not available
  AsyncStorage = {
    getItem: async (key) => {
      if (typeof Storage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    },
    setItem: async (key, value) => {
      if (typeof Storage !== 'undefined') {
        localStorage.setItem(key, value);
      }
    },
    removeItem: async (key) => {
      if (typeof Storage !== 'undefined') {
        localStorage.removeItem(key);
      }
    },
  };
}

export default AsyncStorage;
