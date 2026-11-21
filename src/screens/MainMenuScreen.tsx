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

export default function MainMenuScreen({ navigation }: any) {
  const { theme, isDarkMode } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}> 
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.text }]}>COMBLE</Text>
        <Text style={[styles.subtitle, { color: theme.textSub }]}>COMPUTER ASSEMBLY GAME</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
     <TouchableOpacity
  style={[styles.button, styles.btnOrange]}
  onPress={() => {
    console.log('Start Game pressed, navigating to GameMode');
    navigation.navigate('GameMode');
  }}>
  <Text style={styles.btnIcon}>▶</Text>
  <Text style={styles.btnText}>START GAME</Text>
</TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.btnBlue]}
          onPress={() => navigation.navigate('Information')}>
          <Text style={styles.btnIcon}>ℹ</Text>
          <Text style={styles.btnText}>INFORMATION</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.btnGreen]}
          onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.btnIcon}>⚙</Text>
          <Text style={styles.btnText}>SETTINGS</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    marginTop: 4,
  },
  buttonContainer: {
    width: width * 0.75,
    gap: 14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 10,
    gap: 10,
  },
  btnOrange: { backgroundColor: '#F5A623' },
  btnBlue:   { backgroundColor: '#2196F3' },
  btnGreen:  { backgroundColor: '#4CAF50' },
  btnIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
});