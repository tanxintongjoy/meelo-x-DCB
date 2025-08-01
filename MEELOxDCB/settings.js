import React, { useState, useEffect } from 'react';
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
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Add this import

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isTablet = screenWidth > 768;


const scale = (size) => (screenWidth / 375) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const SettingsScreen = () => {
  const [reminderInterval, setReminderInterval] = useState('every 15 mins');
  const [pomodoroBreaks, setPomodoroBreaks] = useState(true);
  const [motivationalTips, setMotivationalTips] = useState(true);
  const [privacyLevel, setPrivacyLevel] = useState('show');
  const [showNicknameOnly, setShowNicknameOnly] = useState(false);
  const [nickname, setNickname] = useState('');

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      const reminder = await AsyncStorage.getItem('reminderInterval');
      const pomodoro = await AsyncStorage.getItem('pomodoroBreaks');
      const tips = await AsyncStorage.getItem('motivationalTips');
      const privacy = await AsyncStorage.getItem('privacyLevel');
      const nicknameOnly = await AsyncStorage.getItem('showNicknameOnly');
      const nick = await AsyncStorage.getItem('nickname');
      if (reminder) setReminderInterval(reminder);
      if (pomodoro) setPomodoroBreaks(pomodoro === 'true');
      if (tips) setMotivationalTips(tips === 'true');
      if (privacy) setPrivacyLevel(privacy);
      if (nicknameOnly) setShowNicknameOnly(nicknameOnly === 'true');
      if (nick) setNickname(nick);
    };
    loadSettings();
  }, []);

  // Save settings when they change
  useEffect(() => {
    AsyncStorage.setItem('reminderInterval', reminderInterval);
  }, [reminderInterval]);
  useEffect(() => {
    AsyncStorage.setItem('pomodoroBreaks', pomodoroBreaks.toString());
  }, [pomodoroBreaks]);
  useEffect(() => {
    AsyncStorage.setItem('motivationalTips', motivationalTips.toString());
  }, [motivationalTips]);
  useEffect(() => {
    AsyncStorage.setItem('privacyLevel', privacyLevel);
  }, [privacyLevel]);
  useEffect(() => {
    AsyncStorage.setItem('showNicknameOnly', showNicknameOnly.toString());
  }, [showNicknameOnly]);
  useEffect(() => {
    AsyncStorage.setItem('nickname', nickname);
  }, [nickname]);

  const reminderOptions = [
    'every 5 mins',
    'every 10 mins',
    'every 15 mins',
    'every 30 mins',
    'every hour',
    'never',
  ];

  const privacyOptions = ['show', 'hide', 'friends only'];

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
        <Text style={styles.header}>personal settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>notifications</Text>

          <View style={styles.card}>
            <View style={styles.itemRow}>
              <View style={styles.leftContent}>
                <Text style={styles.itemTitle}>reminders:</Text>
                <Text style={styles.itemSubtitle}>how often???</Text>
              </View>
              <View style={styles.rightControl}>
                <TouchableOpacity onPress={cycleReminder} style={styles.selectButton}>
                  <Text style={styles.selectButtonText}>{reminderInterval}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.itemRow}>
              <View style={styles.leftContent}>
                <Text style={styles.itemTitle}>pomodoro style breaks:</Text>
                <Text style={styles.itemSubtitle}>(25 work : 5 min rest)</Text>
              </View>
              <View style={styles.rightControl}>
                <View style={styles.switchContainer}>
                  <Text style={styles.statusLabel}>{pomodoroBreaks ? 'yes' : 'no'}</Text>
                  <Switch
                    value={pomodoroBreaks}
                    onValueChange={setPomodoroBreaks}
                    trackColor={{ false: '#ccc', true: '#faebd7' }}
                    thumbColor={pomodoroBreaks ? '#faebd7' : '#f3f4f6'}
                  />
                </View>
              </View>
            </View>

            <View style={styles.itemRow}>
              <View style={styles.leftContent}>
                <Text style={styles.itemTitle}>motivational tips:</Text>
              </View>
              <View style={styles.rightControl}>
                <View style={styles.switchContainer}>
                  <Text style={styles.statusLabel}>{motivationalTips ? 'yes' : 'no'}</Text>
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>privacy</Text>

          <View style={styles.card}>
            <View style={styles.itemRow}>
              <View style={styles.leftContent}>
                <Text style={styles.itemTitle}>profile visibility:</Text>
              </View>
              <View style={styles.rightControl}>
                <TouchableOpacity onPress={cyclePrivacy} style={styles.selectButtonSmall}>
                  <Text style={styles.selectButtonText}>{privacyLevel}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.itemRow}>
              <View style={styles.leftContent}>
                <Text style={styles.itemTitle}>only show nickname</Text>
              </View>
              <View style={styles.rightControl}>
                <View style={styles.switchContainer}>
                  <Text style={styles.statusLabel}>{showNicknameOnly ? 'on' : 'off'}</Text>
                  <Switch
                    value={showNicknameOnly}
                    onValueChange={setShowNicknameOnly}
                    trackColor={{ false: '#ccc', true: '#faebd7' }}
                    thumbColor={showNicknameOnly ? '#faebd7' : '#f3f4f6'}
                  />
                </View>
              </View>
            </View>

            <View style={[styles.itemRow, styles.nicknameInputRow]}>
              <View style={styles.leftContent}>
                <Text style={styles.itemTitle}>nickname:</Text>
                <Text style={styles.itemSubtitle}>enter your display name</Text>
              </View>
              <View style={styles.rightControl}>
                <TextInput
                  style={styles.nicknameInput}
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder="your nickname"
                  placeholderTextColor="#9ca3af"
                  maxLength={20}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(24),
    minHeight: scale(44),
  },
  leftContent: {
    flex: 1,
    marginRight: scale(16),
  },
  rightControl: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: scale(130),
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
  },
  selectButtonSmall: {
    backgroundColor: '#faebd7',
    borderWidth: 2,
    borderColor: '#d8c9b8',
    borderRadius: scale(16),
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    minWidth: scale(130),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButtonText: {
    fontWeight: '700',
    fontSize: moderateScale(16),
    color: '#7b6e61',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: scale(130),
    gap: scale(12),
  },
  statusLabel: {
    fontWeight: '700',
    fontSize: moderateScale(16),
    color: '#7b6e61',
  },
  nicknameInputRow: {
    marginBottom: 0,
  },
  nicknameInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: scale(12),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    fontSize: moderateScale(16),
    color: '#1f2937',
    minWidth: scale(130),
    textAlign: 'center',
  },
});

export default SettingsScreen;