import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'https://api.sheetbest.com/sheets/9ccf6dab-2ca4-4225-913d-aee1735da00a';

const ThemeIdeasScreen = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState('main');
  const [themeIdea, setThemeIdea] = useState('');
  const [themeQuestion, setThemeQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitToSheet = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        Alert.alert('Success', 'Your suggestion has been submitted!');
        setThemeIdea('');
        setThemeQuestion('');
      } else {
        Alert.alert('Error', 'Failed to submit. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
    setIsSubmitting(false);
  };


  if (currentScreen === 'main') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>theme ideas/questions</Text>
          <Text style={styles.subHeader}>
            submit theme ideas or questions anonymously! or vote on campaign themes and features
          </Text>
          <TouchableOpacity
            style={[styles.bigButton, styles.redButton]}
            onPress={() => setCurrentScreen('idea')}
          >
            <Text style={styles.buttonTitle}>theme ideas</Text>
            <Text style={styles.buttonSubtitle}>any ideas which came into mind?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bigButton, styles.blueButton]}
            onPress={() => setCurrentScreen('question')}
          >
            <Text style={styles.buttonTitle}>theme questions</Text>
            <Text style={styles.buttonSubtitle}>curious? feel free to ask!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bigButton, styles.brownButton]}
            onPress={() => {/* voting logic here */}}
          >
            <Text style={styles.buttonTitle}>voting</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }


  if (currentScreen === 'idea') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity onPress={() => setCurrentScreen('main')} style={styles.backArrow}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bigButton, styles.redButton, styles.headerButton]}>
            <Text style={styles.buttonTitle}>theme ideas</Text>
            <Text style={styles.buttonSubtitle}>any ideas which came into mind?</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="type your idea here"
            value={themeIdea}
            onChangeText={setThemeIdea}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => submitToSheet({
              type: 'theme_idea',
              content: themeIdea,
              category: 'Theme Ideas',
              timestamp: new Date().toISOString(),
            })}
            disabled={isSubmitting || !themeIdea.trim()}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Idea</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }


  if (currentScreen === 'question') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity onPress={() => setCurrentScreen('main')} style={styles.backArrow}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bigButton, styles.blueButton, styles.headerButton]}>
            <Text style={styles.buttonTitle}>theme questions</Text>
            <Text style={styles.buttonSubtitle}>curious? Feel free to ask!</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="type your question here"
            value={themeQuestion}
            onChangeText={setThemeQuestion}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => submitToSheet({
              type: 'theme_question',
              content: themeQuestion,
              category: 'Theme Questions',
              timestamp: new Date().toISOString(),
            })}
            disabled={isSubmitting || !themeQuestion.trim()}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Question</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  scrollContainer: { padding: 24 },
  header: { fontSize: 28, fontWeight: '900', marginBottom: 10, color: '#1f2937' },
  subHeader: { fontSize: 16, color: '#333', marginBottom: 24 },
  bigButton: {
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 12,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  redButton: { backgroundColor: '#e57373' },
  blueButton: { backgroundColor: '#7986cb' },
  brownButton: { backgroundColor: '#8d8072' },
  buttonTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  buttonSubtitle: { fontSize: 15, color: '#fff', marginTop: 4 },
  headerButton: {
    marginBottom: 18,
    marginTop: 0,
    shadowOpacity: 0,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#bbb',
    padding: 16,
    fontSize: 16,
    marginTop: 12,
    marginBottom: 12,
    color: '#333',
  },
  backArrow: {
    marginBottom: 18,
    marginLeft: -8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default ThemeIdeasScreen;
