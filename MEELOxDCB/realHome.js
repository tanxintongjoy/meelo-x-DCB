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

const HomeScreen = () => {
  const [appUsage, setAppUsage] = useState([
    { id: 1, name: 'TikTok', icon: '🎵', color: '#69C9FF', todayTime: 84, dailyGoal: 60, currentSession: 0, isActive: false },
    { id: 2, name: 'Instagram', icon: '📷', color: '#FF6B6B', todayTime: 81, dailyGoal: 90, currentSession: 0, isActive: false },
    { id: 3, name: 'Brawlstars', icon: '🎮', color: '#4ECDC4', todayTime: 48, dailyGoal: 120, currentSession: 0, isActive: false },
    { id: 4, name: 'Whatsapp', icon: '💬', color: '#25D366', todayTime: 171, dailyGoal: 180, currentSession: 0, isActive: false },
  ]);
  
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppGoal, setNewAppGoal] = useState('60');
  const [selectedIcon, setSelectedIcon] = useState('📱');
  const [selectedColor, setSelectedColor] = useState('#69C9FF');
  const [notifications, setNotifications] = useState([]);

  const availableIcons = ['📱', '🎵', '📷', '🎮', '💬', '📺', '🛒', '📚', '🏃', '🍔', '🎬', '📧'];
  const availableColors = ['#69C9FF', '#FF6B6B', '#4ECDC4', '#25D366', '#FFD700', '#FF69B4', '#9370DB', '#FF4500'];

  const [badges, setBadges] = useState([
    { name: 'STAR', earned: true, icon: '⭐' },
    { name: '???', earned: false, icon: '' },
    { name: '???', earned: false, icon: '' },
    { name: '???', earned: false, icon: '' },
  ]);

  const [goalsHit, setGoalsHit] = useState(2);
  const [totalGoals, setTotalGoals] = useState(3);

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

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
      currentSession: 0,
      isActive: false,
    };

    setAppUsage([...appUsage, newApp]);
    setNewAppName('');
    setNewAppGoal('60');
    setSelectedIcon('📱');
    setSelectedColor('#69C9FF');
    setShowAddAppModal(false);
    
    Alert.alert('Success', `${newAppName} has been added with a ${goalMinutes} minute daily goal!`);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const showNotification = (appName, timeLeft) => {
    const newNotification = {
      id: Date.now(),
      message: `Only ${timeLeft} min left for ${appName} today`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); //only last 5 notfi
  };


  const simulateAppUsage = (appId) => {
    setAppUsage(prev => prev.map(app => {
      if (app.id === appId) {
        const newTodayTime = app.todayTime + 1;
        const timeLeft = app.dailyGoal - newTodayTime;


        if (timeLeft === 30) {
          showNotification(app.name, 30);
        } else if (timeLeft === 15) {
          showNotification(app.name, 15);
        } else if (timeLeft === 5) {
          showNotification(app.name, 5);
        } else if (timeLeft === 0) {
          showNotification(app.name, 0);
        }
        
        return {
          ...app,
          currentSession: app.currentSession + 1,
          todayTime: newTodayTime,
          isActive: true,
        };
      }
      return { ...app, isActive: false };
    }));
  }; 

  const startAppSession = (appId) => {
    const interval = setInterval(() => {
      simulateAppUsage(appId);
    }, 1000);
    
    setTimeout(() => {
      clearInterval(interval);
    }, 30000);
  };

  const AppUsageItem = ({ app }) => {
    const progressPercentage = Math.min((app.todayTime / app.dailyGoal) * 100, 100);
    const isOverGoal = app.todayTime > app.dailyGoal;
    const timeRemaining = app.dailyGoal - app.todayTime;
    
    return (
      <View style={styles.appUsageItem}>
        <View style={styles.appInfo}>
          <View style={styles.appIcon}>
            <Text style={styles.appIconText}>{app.icon}</Text>
          </View>
          <View style={styles.appDetails}>
            <Text style={styles.appName}>{app.name}</Text>
            <Text style={styles.timeText}>
              Used: {formatTime(app.todayTime)} / {formatTime(app.dailyGoal)}
              {app.isActive && <Text style={styles.activeText}> • Active</Text>}
            </Text>
            {isOverGoal ? (
              <Text style={styles.overGoalText}>
                Over by {formatTime(app.todayTime - app.dailyGoal)}
              </Text>
            ) : (
              <Text style={styles.remainingText}>
                {formatTime(timeRemaining)} remaining
              </Text>
            )}
            {app.currentSession > 0 && (
              <Text style={styles.sessionText}>
                Current session: {formatTime(app.currentSession)}
              </Text>
            )}
          </View>
          <TouchableOpacity 
            style={[styles.demoButton, app.isActive && styles.demoButtonActive]}
            onPress={() => startAppSession(app.id)}
          >
            <Text style={styles.demoButtonText}>
              {app.isActive ? 'Active' : 'Demo'}
            </Text>
          </TouchableOpacity>
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

  const BadgeItem = ({ badge }) => (
    <View style={[styles.badgeItem, !badge.earned && styles.badgeItemLocked]}>
      <Text style={styles.badgeIcon}>{badge.earned ? badge.icon : '🔒'}</Text>
      <Text style={[styles.badgeText, !badge.earned && styles.badgeTextLocked]}>
        {badge.name}
      </Text>
    </View>
  );

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


          {notifications.length > 0 && (
            <View style={styles.notificationsSection}>
              <Text style={styles.notificationsTitle}>Recent Notifications</Text>
              {notifications.map((notification) => (
                <View key={notification.id} style={styles.notificationItem}>
                  <Text style={styles.notificationText}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                </View>
              ))}
            </View>
          )}


          <View style={styles.badgesSection}>
            <View style={styles.badgesHeader}>
              <Text style={styles.badgesTitle}>Badges</Text>
              <TouchableOpacity>
                <Ionicons name="chevron-forward" size={24} color="#333" />
              </TouchableOpacity>
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
              <TextInput
                style={styles.textInput}
                value={newAppName}
                onChangeText={setNewAppName}
                placeholder="Enter app name"
                placeholderTextColor="#999"
              />

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
  demoButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 'auto',
  },
  demoButtonActive: {
    backgroundColor: '#4CAF50',
  },
  demoButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
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
  notificationsSection: {
    marginTop: 20,
    marginBottom: 15,
  },
  notificationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  notificationItem: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  badgesSection: {
    marginTop: 10,
  },
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  badgesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeItemLocked: {
    backgroundColor: '#999',
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  badgeTextLocked: {
    color: '#FFF',
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
});

export default HomeScreen;