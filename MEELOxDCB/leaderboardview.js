import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const streakData = {
  currentStreak: 121,
  weekDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
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

export default function LeaderboardScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Leaderboard</Text>

        <View style={styles.streakAndStatsRow}>
          <View style={styles.streakCard}>
            <View style={styles.rowCenter}>
              <Ionicons name="flame" size={32} color="#f97316" />
              <Text style={styles.streakText}>{streakData.currentStreak}</Text>
            </View>
            <Text style={styles.streakLabel}>day streak!</Text>

            <View style={styles.weekRow}>
              {streakData.weekDays.map((day, index) => (
                <View key={day} style={styles.dayColumn}>
                  <Text style={styles.dayText}>{day}</Text>
                  <View
                    style={[
                      styles.dayCircle,
                      streakData.completedDays.includes(index) && styles.dayCompleted,
                    ]}
                  >
                    {streakData.completedDays.includes(index) && (
                      <Text style={styles.check}>✓</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>

            <Text style={styles.streakTip}>
              Great start! Keep your{' '}
              <Text style={styles.streakHighlight}>perfect streak</Text> going tomorrow.
            </Text>
          </View>

          <View style={styles.statsColumn}>
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>10</Text>
              <Text style={styles.statsLabel}>Badges</Text>
            </View>
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>127</Text>
              <Text style={styles.statsLabel}>Points</Text>
            </View>
          </View>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.sectionTitle}>Highest SSTreekers</Text>
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
          <Text style={styles.sectionTitle}>Badge Collectors</Text>
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
          <Text style={styles.sectionTitle}>Digital Wellness Heros!</Text>
          {digitalWellnessHeros.map((user) => (
            <View key={user.rank} style={styles.listItem}>
              <Text style={styles.listText}>
                {user.rank}. {user.username}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.tipBubble}>
          <Text style={styles.tipLabel}>Motivation Tip:</Text>
          <Text style={styles.tipText}>"pibble likes to be a good digital citizen"</Text>
        </View>
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
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 32,
    color: '#1f2937',
    textAlign: 'center',
    letterSpacing: -1,
  },
  streakAndStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
  },
  streakCard: {
    backgroundColor: '#1f2937',
    borderRadius: 24,
    padding: 24,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  statsColumn: {
    justifyContent: 'space-between',
    width: 130,
    gap: 16,
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakText: {
    fontSize: 36,
    color: 'white',
    marginLeft: 12,
    fontWeight: '900',
  },
  streakLabel: {
    color: '#fb923c',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '700',
    fontSize: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 6,
  },
  dayText: {
    color: '#d1d5db',
    fontSize: 13,
    fontWeight: '600',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4b5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCompleted: {
    backgroundColor: '#f97316',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  check: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  streakTip: {
    textAlign: 'center',
    color: '#e5e7eb',
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  streakHighlight: {
    color: '#fb923c',
    fontWeight: '700',
  },
  statsCard: {
    backgroundColor: 'white',
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 15,
    color: '#4b5563',
    fontWeight: '600',
  },
  listCard: {
    backgroundColor: '#fde68a',
    borderColor: '#facc15',
    borderWidth: 3,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  listItem: {
    backgroundColor: 'white',
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listText: {
    fontWeight: '700',
    color: '#1f2937',
    fontSize: 16,
    flex: 1,
  },
  listScore: {
    fontSize: 20,
    fontWeight: '900',
    color: '#dc2626',
    marginLeft: 12,
  },
  tipBubble: {
    backgroundColor: 'white',
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  tipLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 24,
  },
});
