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

       
          <Text style={styles.tipLabel}>Motivation Tip:</Text>
          <Text style={styles.tipText}>“pibble pibble pibble”</Text>
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
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 20,
    color: '#1f2937',
  },
  streakAndStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  streakCard: {
    backgroundColor: '#1f2937',
    borderRadius: 20,
    padding: 20,
    flex: 1,
    marginRight: 10,
  },
  statsColumn: {
    justifyContent: 'space-between',
    width: 120,
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 32,
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  streakLabel: {
    color: '#fb923c',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayText: {
    color: '#d1d5db',
    fontSize: 12,
    marginBottom: 4,
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4b5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCompleted: {
    backgroundColor: '#f97316',
  },
  check: {
    color: 'white',
    fontSize: 16,
  },
  streakTip: {
    textAlign: 'center',
    color: '#e5e7eb',
    fontSize: 12,
  },
  streakHighlight: {
    color: '#fb923c',
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: 'white',
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1f2937',
  },
  statsLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  listCard: {
    backgroundColor: '#fde68a',
    borderColor: '#facc15',
    borderWidth: 3,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 10,
  },
  listItem: {
    backgroundColor: 'white',
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listText: {
    fontWeight: '600',
    color: '#1f2937',
  },
  listScore: {
    fontSize: 18,
    fontWeight: '900',
    color: '#dc2626',
  },
  tipBubble: {
    backgroundColor: 'white',
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  tipLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
});
