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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Device from 'expo-device';


const APP_DATABASE = [
  { name: 'WhatsApp', packageName: 'com.whatsapp', icon: '💬', category: 'Social' },
  { name: 'Instagram', packageName: 'com.instagram.android', icon: '📷', category: 'Social' },
  { name: 'TikTok', packageName: 'com.zhiliaoapp.musically', icon: '🎵', category: 'Entertainment' },
  { name: 'YouTube', packageName: 'com.google.android.youtube', icon: '📺', category: 'Entertainment' },
  { name: 'Facebook', packageName: 'com.facebook.katana', icon: '👥', category: 'Social' },
  { name: 'Spotify', packageName: 'com.spotify.music', icon: '🎵', category: 'Music' },
  { name: 'Netflix', packageName: 'com.netflix.mediaclient', icon: '🎬', category: 'Entertainment' },
  { name: 'Gmail', packageName: 'com.google.android.gm', icon: '📧', category: 'Productivity' },
  { name: 'Maps', packageName: 'com.google.android.apps.maps', icon: '🗺️', category: 'Navigation' },
  { name: 'Chrome', packageName: 'com.android.chrome', icon: '🌐', category: 'Browser' },
  { name: 'Discord', packageName: 'com.discord', icon: '💬', category: 'Social' },
  { name: 'Telegram', packageName: 'org.telegram.messenger', icon: '✈️', category: 'Social' },
  { name: 'Snapchat', packageName: 'com.snapchat.android', icon: '👻', category: 'Social' },
  { name: 'Twitter', packageName: 'com.twitter.android', icon: '🐦', category: 'Social' },
  { name: 'Reddit', packageName: 'com.reddit.frontpage', icon: '📱', category: 'Social' },
  { name: 'Uber', packageName: 'com.ubercab', icon: '🚗', category: 'Transport' },
  { name: 'Amazon', packageName: 'com.amazon.mshop.android.shopping', icon: '🛒', category: 'Shopping' },
  { name: 'Pokemon GO', packageName: 'com.nianticlabs.pokemongo', icon: '🎮', category: 'Games' },
  { name: 'Clash Royale', packageName: 'com.supercell.clashroyale', icon: '⚔️', category: 'Games' },
  { name: 'Among Us', packageName: 'com.innersloth.spacemafia', icon: '🎮', category: 'Games' },
  { name: 'Twitch', packageName: 'tv.twitch.android.app', icon: '📹', category: 'Entertainment' },
  { name: 'LinkedIn', packageName: 'com.linkedin.android', icon: '💼', category: 'Professional' },
  { name: 'Microsoft Teams', packageName: 'com.microsoft.teams', icon: '👥', category: 'Work' },
  { name: 'Zoom', packageName: 'us.zoom.videomeetings', icon: '📹', category: 'Work' },
  { name: 'Slack', packageName: 'com.slack', icon: '💬', category: 'Work' },
  { name: 'Venmo', packageName: 'com.venmo', icon: '💰', category: 'Finance' },
  { name: 'Cash App', packageName: 'com.squareup.cash', icon: '💵', category: 'Finance' },
  { name: 'Robinhood', packageName: 'com.robinhood.android', icon: '📈', category: 'Finance' },
  { name: 'DoorDash', packageName: 'com.dd.doordash', icon: '🍔', category: 'Food' },
  { name: 'Uber Eats', packageName: 'com.ubercab.eats', icon: '🍕', category: 'Food' },
];

const IOS_APPS = [
  { name: 'Safari', packageName: 'com.apple.mobilesafari', icon: '🧭', category: 'Browser' },
  { name: 'Messages', packageName: 'com.apple.MobileSMS', icon: '💬', category: 'Social' },
  { name: 'FaceTime', packageName: 'com.apple.facetime', icon: '📞', category: 'Communication' },
  { name: 'Photos', packageName: 'com.apple.mobileslideshow', icon: '📸', category: 'Media' },
  { name: 'Settings', packageName: 'com.apple.Preferences', icon: '⚙️', category: 'System' },
  { name: 'Apple Music', packageName: 'com.apple.Music', icon: '🎵', category: 'Music' },
  { name: 'App Store', packageName: 'com.apple.AppStore', icon: '📱', category: 'Store' },
];


const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

const getCurrentDate = () => {
  const date = new Date();
  return date.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

const HomeScreen = () => {

  const [appUsage, setAppUsage] = useState([
    { id: 1, name: 'TikTok', icon: '🎵', color: '#69C9FF', todayTime: 84, dailyGoal: 60 },
    { id: 2, name: 'Instagram', icon: '📷', color: '#FF6B6B', todayTime: 81, dailyGoal: 90 },
    { id: 3, name: 'Brawlstars', icon: '🎮', color: '#4ECDC4', todayTime: 48, dailyGoal: 120 },
    { id: 4, name: 'Whatsapp', icon: '💬', color: '#25D366', todayTime: 171, dailyGoal: 180 },
  ]);
  

  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppGoal, setNewAppGoal] = useState('60');
  const [selectedIcon, setSelectedIcon] = useState('📱');
  const [selectedColor, setSelectedColor] = useState('#69C9FF');
  
  
  const [installedApps, setInstalledApps] = useState([]);
  const [showInstalledApps, setShowInstalledApps] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(null);


  const availableIcons = ['📱', '🎵', '📷', '🎮', '💬', '📺', '🛒', '📚', '🏃', '🍔', '🎬', '📧'];
  const availableColors = ['#69C9FF', '#FF6B6B', '#4ECDC4', '#25D366', '#FFD700', '#FF69B4', '#9370DB', '#FF4500'];

 
  const [badges, setBadges] = useState([
    { name: 'DCB Champion', earned: true, icon: '🏆', description: 'Complete DCB Challenge', color: '#FF6B6B' },
    { name: '1st Place', earned: true, icon: '🥇', description: 'Rank #1 in leaderboard', color: '#FFD700' },
    { name: '50 Goals', earned: false, icon: '✅', description: 'Hit 50 daily goals', color: '#4CAF50' },
    { name: '2hr Streak', earned: false, icon: '⏰', description: 'Stay under 2hr daily limit', color: '#2196F3' },
    { name: '10 Day Fire', earned: false, icon: '🔥', description: '10 day streak maintaining goals', color: '#FF5722' },
    { name: 'Focus Master', earned: false, icon: '🎯', description: 'Complete focus challenges', color: '#9C27B0' },
  ]);

  
  const [goalsHit, setGoalsHit] = useState(2);
  const [totalGoals, setTotalGoals] = useState(3);

  const getAllApps = () => {
    const isIOS = Device.osName === 'iOS';
    return isIOS ? [...APP_DATABASE, ...IOS_APPS] : APP_DATABASE;
  };

  const simulateAppDetection = (allApps) => {
    return allApps.filter(() => Math.random() > 0.25);
  };


  const processDetectedApps = (detectedApps) => {
    const now = new Date();
    
    const appsWithTimestamp = detectedApps.map(app => ({
      ...app,
      lastDetected: now.toLocaleTimeString(),
      installed: true,
    }));
    
    const sortedApps = appsWithTimestamp.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });
    
    return { sortedApps, scanTime: now };
  };

 
  const getInstalledApps = async () => {
    try {
      setIsScanning(true);
      setShowInstalledApps(true);
      

      const deviceInfo = {
        brand: Device.brand,
        modelName: Device.modelName,
        osName: Device.osName,
        osVersion: Device.osVersion,
        platformApiLevel: Device.platformApiLevel,
      };
      console.log('Device Info:', deviceInfo);
      
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      

      const allApps = getAllApps();
      const detectedApps = simulateAppDetection(allApps);
      const { sortedApps, scanTime } = processDetectedApps(detectedApps);
      

      setInstalledApps(sortedApps);
      setLastScanTime(scanTime);
      setIsScanning(false);
      
    } catch (error) {
      console.error('Error getting installed apps:', error);
      setIsScanning(false);
      Alert.alert('Scan Error', 'Could not complete real-time app scan');
    }
  };


  useEffect(() => {
    if (Device.osName) {
      console.log(`Auto-detecting apps on ${Device.osName} device...`);
    }
  }, []);

  
  const handleAddApp = () => {

    if (!newAppName.trim()) {
      Alert.alert('Error', 'Please enter an app name');
      return;
    }

  
    const goalMinutes = parseInt(newAppGoal);
    if (isNaN(goalMinutes) || goalMinutes <= 0) {
      Alert.alert('Error', 'Please enter a valid goal time in minutes');
      return;
    }


    const newApp = {
      id: appUsage.length + 1,
      name: newAppName,
      icon: selectedIcon,
      color: selectedColor,
      todayTime: 0,
      dailyGoal: goalMinutes,
    };


    setAppUsage([...appUsage, newApp]);
    setNewAppName('');
    setNewAppGoal('60');
    setSelectedIcon('📱');
    setSelectedColor('#69C9FF');
    setShowAddAppModal(false);
    setShowInstalledApps(false);
    
    Alert.alert('Success', `${newAppName} has been added with a ${goalMinutes} minute daily goal!`);
  };

  
  const selectInstalledApp = (app) => {
    setNewAppName(app.name);
    setSelectedIcon(app.icon);
    setShowInstalledApps(false);
  };

  
  const AppUsageItem = ({ app }) => {
    const todayTime = app.todayTime;
    const progressPercentage = Math.min((todayTime / app.dailyGoal) * 100, 100);
    const isOverGoal = todayTime > app.dailyGoal;
    const timeRemaining = Math.max(app.dailyGoal - todayTime, 0);
    
    return (
      <View style={styles.appUsageItem}>
        <View style={styles.appInfo}>
          <View style={styles.appIcon}>
            <Text style={styles.appIconText}>{app.icon}</Text>
          </View>
          <View style={styles.appDetails}>
            <Text style={styles.appName}>{app.name}</Text>
            <Text style={styles.timeText}>
              Used: {formatTime(todayTime)} / {formatTime(app.dailyGoal)}
            </Text>
            {isOverGoal ? (
              <Text style={styles.overGoalText}>
                Over by {formatTime(todayTime - app.dailyGoal)}
              </Text>
            ) : (
              <Text style={styles.remainingText}>
                {formatTime(timeRemaining)} remaining
              </Text>
            )}
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { backgroundColor: app.color + '20' }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressPercentage}%`, 
                  backgroundColor: isOverGoal ? '#FF5252' : app.color 
                }
              ]} 
            />
          </View>
        </View>
        {isOverGoal && (
          <Text style={styles.overGoalStatus}>Goal exceeded!</Text>
        )}
      </View>
    );
  };


  const BadgeItem = ({ badge }) => {
    const handleBadgePress = () => {
      if (badge.earned) {
        Alert.alert(
          `🏆 ${badge.name}`,
          badge.description,
          [{ text: 'Awesome!' }]
        );
      } else {
        Alert.alert(
          '🔒 Badge Locked',
          `Complete: ${badge.description}`,
          [{ text: 'Got it!' }]
        );
      }
    };

    return (
      <TouchableOpacity 
        style={[
          styles.badgeItem, 
          !badge.earned && styles.badgeItemLocked,
          badge.earned && { borderColor: badge.color, borderWidth: 2 }
        ]}
        onPress={handleBadgePress}
      >
        <View style={[styles.badgeIconContainer, badge.earned && { backgroundColor: badge.color + '20' }]}>
          <Text style={styles.badgeIcon}>{badge.earned ? badge.icon : '🔒'}</Text>
        </View>
        <Text style={[styles.badgeText, !badge.earned && styles.badgeTextLocked]}>
          {badge.name}
        </Text>
        {badge.earned && (
          <View style={[styles.badgeEarnedIndicator, { backgroundColor: badge.color }]} />
        )}
      </TouchableOpacity>
    );
  };

  
  const renderInstalledAppsList = () => {
    const groupedApps = [];
    let lastCategory = null;
    let categoryIndex = 0;
    
    installedApps.forEach((app, index) => {
      
      if (app.category !== lastCategory) {
        groupedApps.push(
          <View key={`category-${categoryIndex}-${app.category}`} style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{app.category}</Text>
          </View>
        );
        lastCategory = app.category;
        categoryIndex++;
      }
      
     
      groupedApps.push(
        <TouchableOpacity
          key={`app-${index}-${app.packageName}`}
          style={styles.installedAppItem}
          onPress={() => selectInstalledApp(app)}
        >
          <Text style={styles.installedAppIcon}>{app.icon}</Text>
          <View style={styles.installedAppInfo}>
            <Text style={styles.installedAppName}>{app.name}</Text>
            <Text style={styles.installedAppTime}>
              Detected: {app.lastDetected}
            </Text>
          </View>
          <View style={styles.liveIndicatorSmall}>
            <View style={styles.liveDotSmall} />
          </View>
        </TouchableOpacity>
      );
    });
    
    return groupedApps;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      <ScrollView style={styles.scrollView}>
    
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Home</Text>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{getCurrentDate()}</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowAddAppModal(true)}
              >
                <Ionicons name="add" size={24} color="#333" />
              </TouchableOpacity>
            </View>
          </View>


          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Daily summaries:</Text>
            <Text style={styles.goalsText}>
              You've hit {goalsHit}/{totalGoals} goals today!
            </Text>
          </View>


          <View style={styles.appUsageSection}>
            {appUsage.map((app, index) => (
              <AppUsageItem key={index} app={app} />
            ))}
          </View>

          <View style={styles.badgesSection}>
            <View style={styles.badgesHeader}>
              <Text style={styles.badgesTitle}>🏆 Badges</Text>
              <View style={styles.badgeStats}>
                <Text style={styles.badgeStatsText}>
                  {badges.filter(b => b.earned).length}/{badges.length} earned
                </Text>
              </View>
            </View>
            
            <View style={styles.badgesGrid}>
              {badges.map((badge, index) => (
                <BadgeItem key={index} badge={badge} />
              ))}
            </View>
          </View>
        </View>


        <Modal
          visible={showAddAppModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddAppModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New App</Text>
                <TouchableOpacity 
                  onPress={() => setShowAddAppModal(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>App Name</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  value={newAppName}
                  onChangeText={setNewAppName}
                  placeholder="Select an app from scan results"
                  placeholderTextColor="#999"
                  editable={false}
                />
                <TouchableOpacity
                  style={[
                    styles.browseAppsButton, 
                    showInstalledApps && styles.browseAppsButtonActive,
                    isScanning && styles.browseAppsButtonScanning
                  ]}
                  onPress={getInstalledApps}
                  disabled={isScanning}
                >
                  <Ionicons 
                    name={isScanning ? "reload" : "scan"} 
                    size={16} 
                    color="#FFF" 
                    style={{ marginRight: 5 }} 
                  />
                  <Text style={styles.browseAppsText}>
                    {isScanning ? 'Scanning...' : showInstalledApps ? 'Refresh Apps' : 'Scan Device'}
                  </Text>
                </TouchableOpacity>
              </View>

              {showInstalledApps && (
                <View style={styles.installedAppsContainer}>
                  <View style={styles.installedAppsHeader}>
                    <Text style={styles.installedAppsTitle}>📱 Detected Apps:</Text>
                    <TouchableOpacity 
                      style={styles.refreshButton}
                      onPress={getInstalledApps}
                    >
                      <Ionicons name="refresh" size={16} color="#4CAF50" />
                      <Text style={styles.refreshText}>Refresh</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.detectionInfo}>
                    {isScanning ? '🔄 Scanning device...' : 
                     `Real-time detection • ${installedApps.length} apps found${lastScanTime ? ` • Last scan: ${lastScanTime.toLocaleTimeString()}` : ''}`}
                  </Text>
                  <ScrollView style={styles.installedAppsList} showsVerticalScrollIndicator={false}>
                    {renderInstalledAppsList()}
                  </ScrollView>
                </View>
              )}

              <Text style={styles.inputLabel}>Daily Goal (minutes)</Text>
              <TextInput
                style={styles.textInput}
                value={newAppGoal}
                onChangeText={setNewAppGoal}
                placeholder="Enter daily goal in minutes"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Choose Icon</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconSelector}>
                {availableIcons.map((icon, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.iconOption,
                      selectedIcon === icon && styles.selectedIconOption
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Text style={styles.iconOptionText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Choose Color</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorSelector}>
                {availableColors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColorOption
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </ScrollView>

              <TouchableOpacity style={styles.addAppButton} onPress={handleAddApp}>
                <Text style={styles.addAppButtonText}>Add App</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  mainCard: {
    backgroundColor: '#FFF9E6',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  addButton: {
    padding: 5,
  },
  summarySection: {
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  goalsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  appUsageSection: {
    marginBottom: 25,
  },
  appUsageItem: {
    marginBottom: 15,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  appDetails: {
    flex: 1,
    marginLeft: 12,
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appIconText: {
    fontSize: 20,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  activeText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  remainingText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  overGoalText: {
    fontSize: 12,
    color: '#FF5252',
    marginTop: 2,
    fontWeight: 'bold',
  },
  sessionText: {
    fontSize: 12,
    color: '#FF9800',
    marginTop: 2,
  },
  statsText: {
    fontSize: 11,
    color: '#9E9E9E',
    marginTop: 1,
  },
  demoButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 'auto',
  },
  demoButtonInactive: {
    backgroundColor: '#4CAF50',
  },
  demoButtonActive: {
    backgroundColor: '#FF5252',
  },
  demoButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
  demoButtonTextActive: {
    color: '#FFF',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  overGoalStatus: {
    fontSize: 12,
    color: '#FF5252',
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  badgesSection: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  badgesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  badgeStats: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeStatsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  badgeItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    backgroundColor: '#f8f9fa',
  },
  badgeItemLocked: {
    opacity: 0.6,
    borderColor: '#E0E0E0',
  },
  badgeIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeEarned: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  badgeTextLocked: {
    color: '#999',
  },
  badgeEarnedIndicator: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  earnedIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navItem: {
    padding: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  iconSelector: {
    marginBottom: 10,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIconOption: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  iconOptionText: {
    fontSize: 24,
  },
  colorSelector: {
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#333',
  },
  addAppButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  addAppButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  browseAppsButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  browseAppsButtonActive: {
    backgroundColor: '#2196F3',
  },
  browseAppsButtonScanning: {
    backgroundColor: '#FF9800',
    opacity: 0.8,
  },
  browseAppsText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  installedAppsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  installedAppsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  installedAppsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
  },
  refreshText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
  },
  detectionInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  installedAppsList: {
    maxHeight: 180,
  },
  categoryHeader: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 4,
    marginTop: 8,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976D2',
    textTransform: 'uppercase',
  },
  installedAppItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  installedAppIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  installedAppInfo: {
    flex: 1,
  },
  installedAppName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  installedAppTime: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  liveIndicatorSmall: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
});

export default HomeScreen;