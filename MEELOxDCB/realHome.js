import React, { useState, useEffect } from 'react';
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
import DeviceInfo from 'react-native-device-info';
import UsageStats from 'react-native-usage-stats';

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
    } else if (Platform.OS === 'ios') {
      return await Linking.canOpenURL(app.urlScheme);
    }
    return false;
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

const HomeScreen = () => {
  const [appUsage, setAppUsage] = useState([]);
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppGoal, setNewAppGoal] = useState('60');
  const [selectedIcon, setSelectedIcon] = useState('📱');
  const [selectedColor, setSelectedColor] = useState('#69C9FF');
  const [installedApps, setInstalledApps] = useState([]);
  const [showInstalledApps, setShowInstalledApps] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [usageStatsPermission, setUsageStatsPermission] = useState(false);
  const [badges, setBadges] = useState([
    { name: 'first app', earned: false, icon: '📱', description: 'add your first tracked app', color: '#9C27B0' },
    { name: '7 day streak', earned: false, icon: '🔥', description: '7 consecutive days of goals', color: '#FF5722' },
    { name: '50 goals', earned: false, icon: '✅', description: 'hit 50 daily goals', color: '#4CAF50' },
    { name: '2hr streak', earned: false, icon: '⏰', description: 'stay under 2hr daily limit', color: '#2196F3' },
    { name: '10 day fire', earned: false, icon: '🔥', description: '10 day streak maintaining goals', color: '#FF5722' },
  ]);
  const [goalsHit, setGoalsHit] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);

  const availableIcons = ['📱', '🎵', '📷', '🎮', '💬', '📺', '🛒', '📚', '🏃', '🍔', '🎬', '📧'];
  const availableColors = ['#69C9FF', '#FF6B6B', '#4ECDC4', '#25D366', '#FFD700', '#FF69B4', '#9370DB', '#FF4500'];

  const updateGoalsFromUsage = (apps) => {
    const hit = apps.filter(app => app.todayTime <= app.dailyGoal).length;
    setGoalsHit(hit);
    setTotalGoals(apps.length);
    if (apps.length > 0 && !badges.find(b => b.name === 'first app').earned) {
        setBadges(prev => prev.map(b => b.name === 'first app' ? {...b, earned: true} : b));
    }
  };

  const fetchUsageData = async (currentApps) => {
    if (Platform.OS === 'android') {
      const usageData = await getAndroidUsageStats();
      const updatedApps = currentApps.map(app => {
        const realData = usageData.find(usage => usage.packageName === app.packageName);
        return realData ? { ...app, todayTime: realData.totalTimeInForeground } : app;
      });
      setAppUsage(updatedApps);
      updateGoalsFromUsage(updatedApps);
    } else {
        updateGoalsFromUsage(currentApps);
    }
  };

  const checkUsagePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await UsageStats.isUsageStatsPermissionGranted();
      setUsageStatsPermission(granted);
      if (granted) {
        fetchUsageData(appUsage);
      }
    }
  };

  useEffect(() => {
    checkUsagePermission();
    const interval = setInterval(() => fetchUsageData(appUsage), 30 * 60 * 1000); 
    return () => clearInterval(interval);
  }, [appUsage]);

  const handleScanApps = async () => {
    setIsScanning(true);
    const detectedApps = [];
    for (const app of APP_DATABASE) {
      if (await checkAppInstalled(app)) {
        detectedApps.push(app);
      }
    }
    setInstalledApps(detectedApps);
    setIsScanning(false);
    setShowInstalledApps(true);
    if (detectedApps.length === 0) {
        Alert.alert('no apps found', 'we couldn\'t detect any of the common apps on your device.');
    }
  };

  const handleAddApp = () => {
    if (!newAppName.trim() || !newAppGoal.trim()) {
      Alert.alert('error', 'please fill all fields.');
      return;
    }
    const selectedApp = installedApps.find(app => app.name === newAppName) || { packageName: '' };
    const newApp = {
      id: Date.now(),
      name: newAppName,
      icon: selectedIcon,
      color: selectedColor,
      todayTime: 0,
      dailyGoal: parseInt(newAppGoal),
      packageName: selectedApp.packageName,
    };
    const updatedApps = [...appUsage, newApp];
    setAppUsage(updatedApps);
    fetchUsageData(updatedApps);
    setShowAddAppModal(false);
    setNewAppName('');
    setNewAppGoal('60');
  };

  const selectInstalledApp = (app) => {
    setNewAppName(app.name);
    setSelectedIcon(app.icon);
    setShowInstalledApps(false);
  };

  const AppUsageItem = ({ app }) => {
    const progressPercentage = Math.min((app.todayTime / app.dailyGoal) * 100, 100);
    const isOverGoal = app.todayTime > app.dailyGoal;
    return (
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        <PermissionPrompt />
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>daily summaries:</Text>
          <Text style={styles.goalProgressText}>you've hit {goalsHit}/{totalGoals} goals today!</Text>
          <TouchableOpacity style={styles.addAppButton} onPress={() => setShowAddAppModal(true)}>
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.addAppButtonText}>add new app</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={appUsage}
          renderItem={({ item }) => <AppUsageItem app={item} />}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyListText}>no apps tracked yet. add one!</Text>}
        />

        <View style={styles.badgesSection}>
          <Text style={styles.badgesHeader}>🏆 badges</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {badges.map((badge, index) => (
              <View key={index} style={[styles.badge, { backgroundColor: badge.color, opacity: badge.earned ? 1 : 0.4 }]}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <Modal visible={showAddAppModal} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>add new app</Text>
              <TouchableOpacity style={styles.scanButton} onPress={handleScanApps}>
                <Text style={styles.scanButtonText}>{isScanning ? 'scanning...' : 'scan device for apps'}</Text>
              </TouchableOpacity>
              
              {showInstalledApps && (
                <FlatList
                  data={installedApps}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.installedAppItem} onPress={() => selectInstalledApp(item)}>
                      <Text>{item.icon} {item.name}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.packageName}
                />
              )}

              <TextInput style={styles.input} placeholder="app name" value={newAppName} onChangeText={setNewAppName} />
              <TextInput style={styles.input} placeholder="daily goal (minutes)" value={newAppGoal} onChangeText={setNewAppGoal} keyboardType="numeric" />
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={handleAddApp}><Text>add</Text></TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => setShowAddAppModal(false)}><Text>cancel</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
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
    marginBottom: 10 },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 10 },
  modalButton: { 
    padding: 15, 
    borderRadius: 5, 
    backgroundColor: '#eee' },
});

export default HomeScreen;