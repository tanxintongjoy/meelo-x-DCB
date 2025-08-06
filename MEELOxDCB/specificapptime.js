import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function SpecificAppTimeScreen({ route }) {
  
  const app = route?.params?.app;

  if (!app) {
    return (
      <View style={styles.container}>
        <Text>No app data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.iconBox, { backgroundColor: app.color }]}>
        <Text style={styles.icon}>{app.icon}</Text>
      </View>
      <Text style={styles.appName}>{app.name}</Text>
      <Text style={styles.goalText}>
        Goal: {app.dailyGoal} min | Today: {app.todayTime} min
      </Text>

      <Text style={styles.sectionTitle}>Last 7 Days</Text>
      <View style={styles.graphContainer}>
        {(app.usageHistory || []).map((minutes, i) => (
          <View key={i} style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  height: Math.max((minutes / app.dailyGoal) * 100, 10),
                  backgroundColor: minutes > app.dailyGoal ? '#FF5252' : app.color,
                },
              ]}
            />
            <Text style={styles.barLabel}>Day {i + 1}</Text>
            <Text style={styles.barValue}>{minutes}m</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f3f4f6',
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  goalText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937',
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth - 48,
    marginBottom: 24,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: 8,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#888',
  },
  barValue: {
    fontSize: 12,
    color: '#333',
  },
});