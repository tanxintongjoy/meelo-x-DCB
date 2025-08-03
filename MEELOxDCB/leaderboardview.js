import AsyncStorage from './asyncStorageFallback';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isTablet = screenWidth > 768;


const scale = (size) => (screenWidth / 375) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const streakData = {
  currentStreak: 0,
  completedDays: [0],
};

const highestSSTreekers = [
  { rank: 1, username: 'coolclara451', score: 100 },
  { rank: 2, username: 'imEmmanuel', score: 75 },
  { rank: 3, username: 'jiangkorealuvENGforlife12', score: 50 },
];

const badgeCollectors = [
  { rank: 1, username: 'coolclara451', badges: 5 },
  { rank: 2, username: 'imEmmanuel', badges: 3 },
];

const digitalWellnessHeros = [
  { rank: 1, username: 'coolclara451' },
  { rank: 2, username: 'imEmmanuel' },
  { rank: 3, username: 'jiangkorealuvENGforlife12' },
];

const motivationalQuotes = [
  "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
  "You are never too old to set another goal or to dream a new dream.",
  "The only limit to our realization of tomorrow will be our doubts of today.",
  "Act as if what you do makes a difference. It does.",
];

export default function LeaderboardScreen() {
  const navigation = useNavigation();
  const [showTip, setShowTip] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const loadSetting = async () => {
      const tips = await AsyncStorage.getItem('motivationalTips');
      setShowTip(tips === 'true');
      setQuoteIndex(Math.floor(Math.random() * motivationalQuotes.length));
    };
    loadSetting();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>leaderboard</Text>

        <View style={styles.streakAndStatsRow}>
          <View style={styles.streakCard}>
            <View style={styles.rowCenter}>
              <Ionicons name="flame" size={32} color="#f97316" />
              <Text style={styles.streakText}>{streakData.currentStreak}</Text>
            </View>
            <Text style={styles.streakLabel}>day streak!</Text>

            <Text style={styles.streakTip}>
              great start! keep your{' '}
              <Text style={styles.streakHighlight}>streak</Text> going tomorrow.
            </Text>
          </View>

          <View style={styles.statsColumn}>
            <View style={styles.statsCard}>
              <TouchableOpacity onPress={() => navigation.navigate('Badges')}>
                <Text style={styles.statsNumber}>2</Text>
                <Text style={styles.statsLabel}>badges</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>20</Text>
              <Text style={styles.statsLabel}>points</Text>
            </View>
          </View>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.sectionTitle}>highest sstrekers</Text>
          {highestSSTreekers.map((user) => (
            <View key={user.rank} style={styles.listItem}>
              <Text style={styles.listText}>
                {user.rank}. {user.username}
              </Text>
              <Text style={styles.listScore}>{user.score}</Text>
            </View>
          ))}
        </View>

        <View style={styles.listCard}>
          <TouchableOpacity onPress={() => navigation.navigate('Badges')}>
            <Text style={[styles.sectionTitle, styles.clickableTitle]}>badge collectors</Text>
          </TouchableOpacity>
          {badgeCollectors.map((user) => (
            <View key={user.rank} style={styles.listItem}>
              <Text style={styles.listText}>
                {user.rank}. {user.username}
              </Text>
              <Text style={styles.listScore}>{user.badges}</Text>
            </View>
          ))}
        </View>
     
        <View style={styles.listCard}>
          <Text style={styles.sectionTitle}>digital wellness heros!</Text>
          {digitalWellnessHeros.map((user) => (
            <View key={user.rank} style={styles.listItem}>
              <Text style={styles.listText}>
                {user.rank}. {user.username}
              </Text>
            </View>
          ))}
        </View>

        {showTip && (
          <View style={styles.tipBubble}>
            <Text style={styles.tipLabel}>motivation tip:</Text>
            <Text style={styles.tipText}>{motivationalQuotes[quoteIndex]}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fef9c3',
  },
  container: {
    padding: scale(24),
    paddingBottom: scale(40),
  },
  header: {
    fontSize: moderateScale(36),
    fontWeight: '900',
    marginBottom: scale(32),
    color: '#1f2937',
    textAlign: 'center',
    letterSpacing: -1,
  },
  streakAndStatsRow: {
    flexDirection: isTablet ? 'row' : (isSmallScreen ? 'column' : 'row'),
    justifyContent: 'space-between',
    marginBottom: scale(32),
    gap: scale(16),
  },
  streakCard: {
    backgroundColor: '#1f2937',
    borderRadius: scale(24),
    padding: scale(24),
    flex: isTablet ? 2 : 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(8) },
    shadowOpacity: 0.15,
    shadowRadius: scale(16),
    elevation: 8,
  },
  statsColumn: {
    justifyContent: 'space-between',
    width: isSmallScreen ? '100%' : scale(130),
    gap: scale(16),
    flexDirection: isSmallScreen ? 'row' : 'column',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  streakText: {
    fontSize: moderateScale(36),
    color: 'white',
    marginLeft: scale(12),
    fontWeight: '900',
  },
  streakLabel: {
    color: '#fb923c',
    textAlign: 'center',
    marginBottom: scale(16),
    fontWeight: '700',
    fontSize: moderateScale(16),
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: scale(16),
    paddingHorizontal: scale(8),
  },
  dayColumn: {
    alignItems: 'center',
    gap: scale(6),
  },
  dayText: {
    color: '#d1d5db',
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
  dayCircle: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: '#4b5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCompleted: {
    backgroundColor: '#f97316',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(8),
    elevation: 4,
  },
  check: {
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  streakTip: {
    textAlign: 'center',
    color: '#e5e7eb',
    fontSize: moderateScale(13),
    lineHeight: scale(18),
    paddingHorizontal: scale(8),
  },
  streakHighlight: {
    color: '#fb923c',
    fontWeight: '700',
  },
  statsCard: {
    backgroundColor: 'white',
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: scale(16),
    padding: scale(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.1,
    shadowRadius: scale(8),
    elevation: 4,
    flex: isSmallScreen ? 1 : 0,
  },
  statsNumber: {
    fontSize: moderateScale(28),
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: scale(4),
  },
  statsLabel: {
    fontSize: moderateScale(15),
    color: '#4b5563',
    fontWeight: '600',
  },
  listCard: {
    backgroundColor: '#fde68a',
    borderColor: '#facc15',
    borderWidth: 3,
    borderRadius: scale(20),
    padding: scale(24),
    marginBottom: scale(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(6) },
    shadowOpacity: 0.1,
    shadowRadius: scale(12),
    elevation: 6,
  },
  sectionTitle: {
    fontSize: moderateScale(22),
    fontWeight: '800',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: scale(20),
    letterSpacing: -0.5,
  },
  clickableTitle: {
    textDecorationLine: 'underline',
    color: '#2563eb',
  },
  listItem: {
    backgroundColor: 'white',
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: scale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.05,
    shadowRadius: scale(4),
    elevation: 2,
  },
  listText: {
    fontWeight: '700',
    color: '#1f2937',
    fontSize: moderateScale(16),
    flex: 1,
  },
  listScore: {
    fontSize: moderateScale(20),
    fontWeight: '900',
    color: '#dc2626',
    marginLeft: scale(12),
  },
  tipBubble: {
    backgroundColor: 'white',
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: scale(20),
    padding: scale(24),
    alignItems: 'center',
    marginTop: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(6) },
    shadowOpacity: 0.1,
    shadowRadius: scale(12),
    elevation: 6,
  },
  tipLabel: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    marginBottom: scale(8),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipText: {
    fontSize: moderateScale(17),
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: scale(24),
  },
});
