import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  FlatList,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DeviceInfo from './deviceInfoFallback';
import UsageStats from './usageStatsFallback';
import * as Notifications from './notificationsFallback';
import InstalledApps from './installedAppsFallback';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

const scale = (size) => (screenWidth / 375) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const APP_DATABASE = [
  { name: 'WhatsApp', packageName: 'com.whatsapp', urlScheme: 'whatsapp://', icon: '💬', category: 'Social' },
  { name: 'Instagram', packageName: 'com.instagram.android', urlScheme: 'instagram://', icon: '📷', category: 'Social' },
  { name: 'TikTok', packageName: 'com.zhiliaoapp.musically', urlScheme: 'tiktok://', icon: '🎵', category: 'Entertainment' },
  { name: 'YouTube', packageName: 'com.google.android.youtube', urlScheme: 'youtube://', icon: '📺', category: 'Entertainment' },
  { name: 'Facebook', packageName: 'com.facebook.katana', urlScheme: 'fb://', icon: '👥', category: 'Social' },
  { name: 'Spotify', packageName: 'com.spotify.music', urlScheme: 'spotify://', icon: '🎵', category: 'Music' },
  { name: 'Netflix', packageName: 'com.netflix.mediaclient', urlScheme: 'nflx://', icon: '🎬', category: 'Entertainment' },
  { name: 'Gmail', packageName: 'com.google.android.gm', urlScheme: 'googlegmail://', icon: '📧', category: 'Productivity' },
  { name: 'Maps', packageName: 'com.google.android.apps.maps', urlScheme: 'comgooglemaps://', icon: '🗺️', category: 'Navigation' },
  { name: 'Discord', packageName: 'com.discord', urlScheme: 'discord://', icon: '💬', category: 'Social' },
  { name: 'Telegram', packageName: 'org.telegram.messenger', urlScheme: 'tg://', icon: '✈️', category: 'Social' },
  { name: 'Snapchat', packageName: 'com.snapchat.android', urlScheme: 'snapchat://', icon: '👻', category: 'Social' },
  { name: 'Twitter', packageName: 'com.twitter.android', urlScheme: 'twitter://', icon: '🐦', category: 'Social' },
];

const checkAppInstalled = async (app) => {
  try {
    if (Platform.OS === 'android') {
      return await DeviceInfo.isAppInstalled(app.packageName);
    }
    return await Linking.canOpenURL(app.urlScheme);
  } catch (error) {
    console.error(`Error checking ${app.name}:`, error);
    return false;
  }
};

const getAndroidUsageStats = async () => {
  try {
    const granted = await UsageStats.isUsageStatsPermissionGranted();
    if (!granted) {
      Alert.alert(
        'usage permission required',
        'to track screen time, we need access to usage stats. you\'ll be redirected to settings.',
        [
          { text: 'cancel', style: 'cancel' },
          { text: 'go to settings', onPress: () => UsageStats.openUsageStatsSettings() }
        ]
      );
      return [];
    }
    const endTime = Date.now();
    const startTime = endTime - (24 * 60 * 60 * 1000);
    const stats = await UsageStats.queryUsageStats(startTime, endTime);
    return stats.map(app => ({
      packageName: app.packageName,
      totalTimeInForeground: Math.floor(app.totalTimeInForeground / (1000 * 60)),
    }));
  } catch (error) {
    console.error('Error getting usage stats:', error);
    return [];
  }
};

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const HomeScreen = ({ navigation }) => {
  const [appUsage, setAppUsage] = useState([]);
  const [badges, setBadges] = useState([
    { name: 'first app', earned: false, icon: '📱', description: 'add your first tracked app', color: '#9C27B0' },
    { name: '7 day streak', earned: false, icon: '🔥', description: '7 consecutive days of goals', color: '#FF5722' },
    { name: '50 goals', earned: false, icon: '✅', description: 'hit 50 daily goals', color: '#4CAF50' },
    { name: '2hr streak', earned: false, icon: '⏰', description: 'stay under 2hr daily limit', color: '#2196F3' },
    { name: '10 day fire', earned: false, icon: '🔥', description: '10 day streak maintaining goals', color: '#FF5722' },
  ]);
  const [goalStats, setGoalStats] = useState({ hit: 0, total: 0 });
  const [usageStatsPermission, setUsageStatsPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [installedApps, setInstalledApps] = useState({ show: false, data: [] });
  const [appSearchText, setAppSearchText] = useState('');
  const [modal, setModal] = useState({
    visible: false,
    appName: '',
    goal: '60',
    icon: '📱',
    color: '#69C9FF',
  });
  const [reminderInterval, setReminderInterval] = useState('never');
  const [pomodoroBreaks, setPomodoroBreaks] = useState(false);
  const [pomodoroState, setPomodoroState] = useState({}); 

  const availableIcons = ['📱', '🎵', '📷', '🎮', '💬', '📺', '🛒', '📚', '🏃', '🍔', '🎬', '📧'];
  const availableColors = ['#69C9FF', '#FF6B6B', '#4ECDC4', '#25D366', '#FFD700', '#FF69B4', '#9370DB', '#FF4500'];

  const updateGoalsFromUsage = useCallback((apps) => {
    const hit = apps.filter(app => app.todayTime <= app.dailyGoal).length;
    setGoalStats({ hit, total: 3 }); 
    if (apps.length > 0 && !badges.find(b => b.name === 'first app').earned) {
      setBadges(prev => prev.map(b => b.name === 'first app' ? { ...b, earned: true } : b));
    }
  }, [badges]);

  const fetchUsageData = useCallback(async () => {
    if (Platform.OS !== 'android') {
      updateGoalsFromUsage(appUsage);
      return;
    }
    const usageData = await getAndroidUsageStats();
    const updatedApps = appUsage.map(app => {
      const realData = usageData.find(usage => usage.packageName === app.packageName);
      return realData ? { ...app, todayTime: realData.totalTimeInForeground } : app;
    });
    setAppUsage(updatedApps);
    updateGoalsFromUsage(updatedApps);
  }, [appUsage, updateGoalsFromUsage]);

  const checkUsagePermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      const granted = await UsageStats.isUsageStatsPermissionGranted();
      setUsageStatsPermission(granted);
      if (granted) {
        fetchUsageData();
      }
    }
  }, [fetchUsageData]);

  useEffect(() => {
    checkUsagePermission();
    const interval = setInterval(fetchUsageData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkUsagePermission, fetchUsageData]);

  const handleScanApps = async () => {
    setIsScanning(true);
    
    
    if (DeviceInfo._isFallback || InstalledApps._isFallback) {
      setIsScanning(false);
      Alert.alert(
        'Feature Not Available', 
        'App scanning is not available in Expo Go. This feature requires a development build or production app to access device information.',
        [
          { text: 'OK', style: 'default' },
          { text: 'Add Apps Manually', onPress: () => setModal({ ...modal, visible: true }) }
        ]
      );
      return;
    }
    
    try {
      
      const allApps = await InstalledApps.getNonSystemApps();
      
      
      const userApps = allApps
        .filter(app => 
          app.packageName && 
          app.appName && 
          !app.packageName.startsWith('com.android.') &&
          !app.packageName.startsWith('com.google.android.') &&
          app.packageName !== 'android'
        )
        .map(app => ({
          name: app.appName,
          packageName: app.packageName,
          icon: app.icon || '📱', // Use app icon if available, otherwise default
          category: 'User App'
        }))
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
      
      setInstalledApps({ show: true, data: userApps });
      setIsScanning(false);
      
      if (userApps.length === 0) {
        Alert.alert('No Apps Found', 'Could not detect any user apps on your device.');
      } else {
        Alert.alert('Apps Found', `Found ${userApps.length} apps on your device! Select the ones you want to track.`);
      }
    } catch (error) {
      console.error('Error scanning apps:', error);
      setIsScanning(false);
      Alert.alert('Scan Failed', 'Failed to scan for apps. Please try adding apps manually.');
    }
  };

  const handleAddApp = () => {
    if (!modal.appName.trim() || !modal.goal.trim()) {
      return Alert.alert('error', 'please fill all fields.');
    }
    const selectedApp = installedApps.data.find(app => app.name === modal.appName) || {};
    const newApp = {
      id: Date.now(),
      name: modal.appName,
      icon: modal.icon,
      color: modal.color,
      todayTime: 0,
      dailyGoal: parseInt(modal.goal),
      packageName: selectedApp.packageName || '',
    };
    setAppUsage(prev => [...prev, newApp]);
    setModal({ visible: false, appName: '', goal: '60', icon: '📱', color: '#69C9FF' });
    setInstalledApps({ show: false, data: [] });
    setAppSearchText('');
  };

  const selectInstalledApp = (app) => {
    setModal(prev => ({ ...prev, appName: app.name, icon: app.icon }));
    setInstalledApps(prev => ({ ...prev, show: false }));
  };

  const AppUsageItem = ({ app }) => {
    const progressPercentage = Math.min((app.todayTime / app.dailyGoal) * 100, 100);
    const isOverGoal = app.todayTime > app.dailyGoal;
    return (
      <TouchableOpacity onPress={() => navigation.navigate('SpecificAppTimeScreen', { app })}>
        <View style={styles.appUsageItem}>
          <View style={styles.appInfo}>
            <Text style={styles.appIconText}>{app.icon}</Text>
            <View>
              <Text style={styles.appName}>{app.name}</Text>
              <Text style={styles.timeText}>used: {formatTime(app.todayTime)} / {formatTime(app.dailyGoal)}</Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%`, backgroundColor: isOverGoal ? '#FF5252' : app.color }]} />
          </View>
          {isOverGoal && <Text style={styles.overGoalStatus}>goal exceeded!</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const PermissionPrompt = () => {
    if (Platform.OS !== 'android' || usageStatsPermission) return null;
    return (
      <View style={styles.permissionPrompt}>
        <Text style={styles.permissionTitle}>📊 enable real-time tracking</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={() => UsageStats.openUsageStatsSettings()}>
          <Text style={styles.permissionButtonText}>enable tracking</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const intervalToMs = (interval) => {
    switch (interval) {
      case 'every 5 mins': return 5 * 60 * 1000;
      case 'every 10 mins': return 10 * 60 * 1000;
      case 'every 15 mins': return 15 * 60 * 1000;
      case 'every 30 mins': return 30 * 60 * 1000;
      case 'every hour': return 60 * 60 * 1000;
      default: return null;
    }
  };

  useEffect(() => {
    let notificationTimer;

    const scheduleUsageNotification = async () => {
      for (const app of appUsage) {
        
        const timeLeft = Math.max(0, app.dailyGoal - app.todayTime);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${app.name} usage update`,
            body: `You have ${timeLeft} min left on ${app.name}!`,
          },
          trigger: null, 
        });
      }
    };

    const startNotificationInterval = () => {
      if (reminderInterval === 'never') return;
      const ms = intervalToMs(reminderInterval);
      if (!ms) return;
      notificationTimer = setInterval(scheduleUsageNotification, ms);
    };

    startNotificationInterval();

    return () => {
      if (notificationTimer) clearInterval(notificationTimer);
    };
  }, [reminderInterval, appUsage]);

  useEffect(() => {
    if (!pomodoroBreaks) return; 

    const now = Date.now();
    let updatedState = { ...pomodoroState };

    appUsage.forEach(app => {
     
      if (app.todayTime > 0) {
        
        if (!updatedState[app.id]?.inBreak) {
          
          if (!updatedState[app.id]?.lastStart) {
            updatedState[app.id] = { inBreak: false, lastStart: now };
          } else {
            
            const usedMinutes = Math.floor((now - updatedState[app.id].lastStart) / (1000 * 60));
            if (usedMinutes >= 25) {
              updatedState[app.id] = { inBreak: true, lastStart: now };
              Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Pomodoro break!',
                  body: `Take a 5min break from ${app.name}!`,
                },
                trigger: null,
              });
            }
          }
        } else {
         
          const breakMinutes = Math.floor((now - updatedState[app.id].lastStart) / (1000 * 60));
          if (breakMinutes >= 5) {
            updatedState[app.id] = { inBreak: false, lastStart: now };
            Notifications.scheduleNotificationAsync({
              content: {
                title: 'Break over!',
                body: `You can use ${app.name} again.`,
              },
              trigger: null,
            });
          }
        }
      } else {
       
        updatedState[app.id] = { inBreak: false, lastStart: null };
      }
    });

    setPomodoroState(updatedState);
  }, [appUsage, pomodoroBreaks]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={appUsage}
        renderItem={({ item }) => <AppUsageItem app={item} />}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyListText}>no apps tracked yet. add one!</Text>}
        ListHeaderComponent={
          <>
            <PermissionPrompt />
            <View style={styles.mainCard}>
              <Text style={styles.cardTitle}>daily summaries:</Text>
              <Text style={styles.goalProgressText}>you've hit {goalStats.hit}/{goalStats.total} goals today!</Text>
              <TouchableOpacity style={styles.addAppButton} onPress={() => setModal(prev => ({ ...prev, visible: true }))}>
                <Ionicons name="add-circle" size={24} color="#fff" />
                <Text style={styles.addAppButtonText}>add new app</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addAppButton}
                onPress={() => navigation.navigate('Badges', { badges })}
              >
                <Ionicons name="trophy" size={24} color="#fff" />
                <Text style={styles.addAppButtonText}>view badges</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={styles.badgesSection}>
            <Text style={styles.badgesHeader}>🏆 badges</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Array.from({ length: 5 }).map((_, i) => {
                const badge = badges[i];
                return (
                  <View
                    key={i}
                    style={[
                      styles.badge,
                      { backgroundColor: badge?.color || '#ccc', opacity: badge?.earned ? 1 : 0.4 }
                    ]}
                  >
                    <Text style={styles.badgeIcon}>
                      {badge?.earned ? badge.icon : '?'}
                    </Text>
                    <Text style={styles.badgeName}>
                      {badge?.earned ? badge.name : 'locked'}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        }
      />

      <Modal visible={modal.visible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>add new app</Text>
            <TouchableOpacity style={styles.scanButton} onPress={handleScanApps}>
              <Text style={styles.scanButtonText}>{isScanning ? 'scanning all apps...' : 'scan all apps on device'}</Text>
            </TouchableOpacity>
            
            {installedApps.show && (
              <>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search apps..."
                  value={appSearchText}
                  onChangeText={setAppSearchText}
                  placeholderTextColor="#999"
                />
                <FlatList
                  data={installedApps.data.filter(app => 
                    app.name.toLowerCase().includes(appSearchText.toLowerCase()) ||
                    app.packageName.toLowerCase().includes(appSearchText.toLowerCase())
                  )}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.installedAppItem} onPress={() => selectInstalledApp(item)}>
                      <Text style={styles.appItemText}>{item.icon} {item.name}</Text>
                      <Text style={styles.packageNameText}>{item.packageName}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.packageName}
                  style={styles.modalFlatList}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                />
              </>
            )}

            <TextInput style={styles.input} placeholder="app name" value={modal.appName} onChangeText={text => setModal(p => ({ ...p, appName: text }))} />
            <TextInput style={styles.input} placeholder="daily goal (minutes)" value={modal.goal} onChangeText={text => setModal(p => ({ ...p, goal: text }))} keyboardType="numeric" />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddApp}><Text>add</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => {
                setModal(p => ({ ...p, visible: false }));
                setInstalledApps({ show: false, data: [] });
                setAppSearchText('');
              }}><Text>cancel</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { 
    flex: 1, backgroundColor: '#F8FAFC' 
  },
  permissionPrompt: { 
    backgroundColor: '#FFF3CD', 
    padding: 15, 
    margin: 15,
    borderRadius: 10, 
    alignItems: 'center' },
  permissionTitle: { 
    fontWeight: 'bold', 
    fontSize: 16, 
    color: '#856404', 
    marginBottom: 5 },
  permissionButton: { 
    backgroundColor: '#F39C12', 
    padding: 10, 
    borderRadius: 5 },
  permissionButtonText: { 
    color: '#fff', 
    fontWeight: 'bold' },
  mainCard: { 
    backgroundColor: '#fff', 
    margin: 15, 
    padding: 20, 
    borderRadius: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 5 },
  cardTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 10 },
  goalProgressText: { 
    fontSize: 16, 
    color: '#555', 
    marginBottom: 15 },
  addAppButton: { 
    
    flexDirection: 'row', 
    alignItems: 'center',
     backgroundColor: '#007AFF',
     padding: 12, 
     borderRadius: 10,
  justifyContent: 'center' },
  addAppButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    marginLeft: 8 },
  appUsageItem: { 
    backgroundColor: '#fff', 
    marginHorizontal: 15, 
    marginBottom: 10,
     padding: 15, 
     borderRadius: 10 },
  appInfo: { 
    flexDirection: 'row', 
    alignItems: 'center',
     marginBottom: 10 },
  appIconText: { 
    fontSize: 24, 
    marginRight: 10 },
  appName: { 
    fontSize: 16,
     fontWeight: 'bold' },
  timeText: { 
    fontSize: 14, 
    color: '#666' },
  progressBarContainer: { 
    height: 8, 
    backgroundColor: '#eee',
    borderRadius: 4, 
    overflow: 'hidden' },
  progressFill: { 
    height: '100%',
     borderRadius: 4 },
  overGoalStatus: { 
    color: '#FF5252', 
    fontSize: 12, 
    
    fontWeight: 'bold',
     marginTop: 5, 
     textAlign: 'right' },
  emptyListText: { 
    textAlign: 'center',
     marginVertical: 20, 
     color: '#888' },
  badgesSection: { 
    marginTop: 20, 
    paddingLeft: 15 },
  badgesHeader: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10 },
  badge: { 
    width: 100,
     height: 100, 
    marginRight: 10, 
    
    borderRadius: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 5 },
  badgeIcon: { fontSize: 30 },
  badgeName: { 
    color: '#fff', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    fontSize: 12 },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { 
    width: '90%', 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 15 },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    textAlign: 'center' },
  scanButton: { 
    backgroundColor: '#4CAF50', 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 10 },
  scanButtonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold' },
  installedAppItem: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 10, 
    backgroundColor: '#eee' 
  },
  modalButton: { 
    padding: 15, 
    borderRadius: 5, 
    backgroundColor: '#eee' 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalFlatList: {
    maxHeight: 200,
    marginVertical: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    fontSize: 16,
  },
  appItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  packageNameText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default HomeScreen;
