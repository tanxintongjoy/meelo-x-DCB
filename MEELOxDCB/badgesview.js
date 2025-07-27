import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

//badge data
const badgesData = [
  { id: 1, title: 'first app added', earned: true },
  { id: 2, title: 'complete 50 goals', earned: false },
  { id: 3, title: 'no phone for a day', earned: true },
  { id: 4, title: '7 day streak', earned: false },
  { id: 5, title: 'first on leaderboard', earned: false },
];

export default function BadgesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>badges</Text>
      <View style={styles.grid}>
        {badgesData.map((badge) => (
          <View
            key={badge.id}
            style={[
              styles.badgeCard,
              !badge.earned && { opacity: 0.5 },
            ]}
          >
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderIcon}>
                {badge.earned ? '🏅' : '?'}
              </Text>
            </View>
            <Text style={styles.badgeText}>{badge.title}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 20,
    color: '#1f2937',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: (windowWidth - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#d1d5db',
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  placeholderBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  placeholderIcon: {
    fontSize: 32,
    color: '#6b7280',
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
});
