import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSettings } from '../context/SettingsContext';

const { width } = Dimensions.get('window');

export default function GameModeScreen({ navigation }: any) {
  const { theme, isDarkMode } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}> 
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtn, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>GAME MODE</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Subtitle */}
      <Text style={[styles.subtitle, { color: theme.textSub }]}>CHOOSE YOUR MODE</Text>

      {/* Easy Mode Card */}
      <TouchableOpacity
        style={[styles.card, styles.cardGreen]}
        onPress={() => navigation.navigate('EasyMode')}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>EASY MODE</Text>
          <Text style={styles.cardTag}>Identification Quiz</Text>
          <Text style={styles.cardDesc}>
            Test your knowledge about computer parts.
          </Text>
        </View>
        <Text style={styles.cardIcon}>✓</Text>
      </TouchableOpacity>

      {/* Medium Mode Card */}
      <TouchableOpacity
        style={[styles.card, styles.cardBlue]}
        onPress={() => navigation.navigate('MediumMode')}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>MEDIUM MODE</Text>
          <Text style={styles.cardTag}>Mixed Quiz</Text>
          <Text style={styles.cardDesc}>
            20 questions per round. New set every time you play!
          </Text>
        </View>
        <Text style={styles.cardIcon}>🧠</Text>
      </TouchableOpacity>

      {/* Hard Mode Card */}
      <TouchableOpacity
        style={[styles.card, styles.cardPurple]}
        onPress={() => navigation.navigate('HardMode')}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>HARD MODE</Text>
          <Text style={styles.cardTag}>Assembly Challenge</Text>
          <Text style={styles.cardDesc}>
            Drag and drop the parts to assemble the PC.
          </Text>
        </View>
        <Text style={styles.cardIcon}>🖥</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
  },
  backBtn: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#8B9EC3',
    fontSize: 13,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardGreen:  { backgroundColor: '#1B4D2E' },
  cardBlue:   { backgroundColor: '#0D3B7A' },
  cardPurple: { backgroundColor: '#2D1B6E' },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  cardTag: {
    color: '#F5A623',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDesc: {
    color: '#8B9EC3',
    fontSize: 13,
    lineHeight: 20,
    maxWidth: '85%',
  },
  cardIcon: {
    fontSize: 40,
  },
});