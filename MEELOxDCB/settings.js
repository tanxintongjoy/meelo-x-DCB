import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isTablet = screenWidth > 768;


const scale = (size) => (screenWidth / 375) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const SettingsScreen = () => {
  const [reminderInterval, setReminderInterval] = useState('Every 15 mins');
  const [pomodoroBreaks, setPomodoroBreaks] = useState(true);
  const [motivationalTips, setMotivationalTips] = useState(true);
  const [privacyLevel, setPrivacyLevel] = useState('Show');
  const [showNicknameOnly, setShowNicknameOnly] = useState(false);

  const reminderOptions = [
    'Every 5 mins',
    'Every 10 mins',
    'Every 15 mins',
    'Every 30 mins',
    'Every hour',
    'Never',
  ];

  const privacyOptions = ['Show', 'Hide', 'Friends only'];

  const cycleReminder = () => {
    const currentIndex = reminderOptions.indexOf(reminderInterval);
    const nextIndex = (currentIndex + 1) % reminderOptions.length;
    setReminderInterval(reminderOptions[nextIndex]);
  };

  const cyclePrivacy = () => {
    const currentIndex = privacyOptions.indexOf(privacyLevel);
    const nextIndex = (currentIndex + 1) % privacyOptions.length;
    setPrivacyLevel(privacyOptions[nextIndex]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Personal Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.card}>

//reminders
            <View style={styles.itemRow}>
              <View>
                <Text style={styles.itemTitle}>Reminders:</Text>
                <Text style={styles.itemSubtitle}>How often do you want to be reminded?</Text>
              </View>
              <TouchableOpacity onPress={cycleReminder} style={styles.selectButton}>
                <Text style={styles.selectButtonText}>{reminderInterval}</Text>
              </TouchableOpacity>
            </View>

//pomodoro style breaks
            <View style={styles.itemRow}>
              <View>
                <Text style={styles.itemTitle}>Pomodoro style breaks:</Text>
                <Text style={styles.itemSubtitle}>(25 work : 5 min rest)</Text>
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.statusLabel}>{pomodoroBreaks ? 'Yes' : 'No'}</Text>
                <Switch
                  value={pomodoroBreaks}
                  onValueChange={setPomodoroBreaks}
                  trackColor={{ false: '#ccc', true: '#faebd7' }}
                  thumbColor={pomodoroBreaks ? '#faebd7' : '#f3f4f6'}
                />
              </View>
            </View>

//motivational tips - pibble pibble pibble
            <View style={styles.itemRow}>
              <Text style={styles.itemTitle}>Motivational tips:</Text>
              <View style={styles.switchContainer}>
                <Text style={styles.statusLabel}>{motivationalTips ? 'Yes' : 'No'}</Text>
                <Switch
                  value={motivationalTips}
                  onValueChange={setMotivationalTips}
                  trackColor={{ false: '#ccc', true: '#faebd7' }}
                  thumbColor={motivationalTips ? '#faebd7' : '#f3f4f6'}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>

          <View style={styles.card}>
    // privacy
            <View style={styles.itemRow}>
              <Text style={styles.itemTitle}>Profile Visibility:</Text>
              <TouchableOpacity onPress={cyclePrivacy} style={styles.selectButtonSmall}>
                <Text style={styles.selectButtonText}>{privacyLevel}</Text>
              </TouchableOpacity>
            </View>

   //nickname
            <View style={[styles.itemRow, styles.nicknameRow]}>
              <Text style={styles.itemTitle}>Only show Nickname</Text>
              <View style={styles.switchContainer}>
                <Text style={styles.statusLabel}>{showNicknameOnly ? 'On' : 'Off'}</Text>
                <Switch
                  value={showNicknameOnly}
                  onValueChange={setShowNicknameOnly}
                  trackColor={{ false: '#ccc', true: '#faebd7' }}
                  thumbColor={showNicknameOnly ? '#faebd7' : '#f3f4f6'}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContainer: {
    padding: scale(20),
  },
  header: {
    fontSize: moderateScale(32),
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: scale(20),
    textAlign: isSmallScreen ? 'center' : 'left',
  },
  section: {
    marginBottom: scale(30),
  },
  sectionTitle: {
    fontSize: moderateScale(26),
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: scale(12),
    textAlign: isSmallScreen ? 'center' : 'left',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#faebd7',
    borderRadius: scale(24),
    padding: scale(20),
    shadowColor: '#faebd7',
    shadowOffset: { width: 0, height: scale(3) },
    shadowOpacity: 0.25,
    shadowRadius: scale(4),
    elevation: 5,
  },
  itemRow: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isSmallScreen ? 'flex-start' : 'center',
    marginBottom: scale(24),
    gap: isSmallScreen ? scale(8) : 0,
  },
  itemTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1f2937',
  },
  itemSubtitle: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    marginTop: scale(4),
  },
  selectButton: {
    backgroundColor: '#faebd7',
    borderWidth: 2,
    borderColor: '#d8c9b8',
    borderRadius: scale(16),
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    minWidth: scale(130),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: isSmallScreen ? 'flex-end' : 'auto',
  },
  selectButtonSmall: {
    backgroundColor: '#faebd7',
    borderWidth: 2,
    borderColor: '#d8c9b8',
    borderRadius: scale(16),
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    minWidth: scale(100),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: isSmallScreen ? 'flex-end' : 'auto',
  },
  selectButtonText: {
    fontWeight: '700',
    fontSize: moderateScale(16),
    color: '#7b6e61',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    alignSelf: isSmallScreen ? 'flex-end' : 'auto',
  },
  statusLabel: {
    fontWeight: '700',
    fontSize: moderateScale(16),
    marginRight: scale(12),
    color: '#7b6e61',
  },
  nicknameRow: {
    marginBottom: 0,
  },
});

export default SettingsScreen;
