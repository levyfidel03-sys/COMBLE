import React from 'react';
import { useSettings } from '../context/SettingsContext';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
} from 'react-native';

export default function SettingsScreen({ navigation }: any) {
  const {
    soundEnabled, setSoundEnabled,
    isDarkMode,   setIsDarkMode,
    vibrationEnabled, setVibrationEnabled,
    showTimer,    setShowTimer,
    showHints,    setShowHints,
    resetSettings,
    theme,
  } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      {/* Header */}
      <View style={[styles.header, {
        backgroundColor: theme.header,
        borderBottomColor: theme.headerBorder,
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtn, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>SETTINGS</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* AUDIO SECTION */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textSub }]}>
            🔊 AUDIO
          </Text>
          <View style={[styles.card, {
            backgroundColor: theme.card,
            borderColor: theme.border,
          }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🔔</Text>
                <View>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>
                    Sound Effects
                  </Text>
                  <Text style={[styles.settingDesc, { color: theme.textSub }]}>
                    Correct/wrong answer sounds
                  </Text>
                </View>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={(val) => setSoundEnabled(val)}
                trackColor={{ false: '#1E3A5F', true: '#7B52E8' }}
                thumbColor={soundEnabled ? '#FFFFFF' : '#8B9EC3'}
              />
            </View>

          </View>
        </View>

        {/* DISPLAY SECTION */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textSub }]}>
            🎨 DISPLAY
          </Text>
          <View style={[styles.card, {
            backgroundColor: theme.card,
            borderColor: theme.border,
          }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>
                  {isDarkMode ? '🌙' : '☀️'}
                </Text>
                <View>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>
                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                  </Text>
                  <Text style={[styles.settingDesc, { color: theme.textSub }]}>
                    {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={(val) => setIsDarkMode(val)}
                trackColor={{ false: '#F5A623', true: '#7B52E8' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>⏱️</Text>
                <View>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>
                    Show Timer
                  </Text>
                  <Text style={[styles.settingDesc, { color: theme.textSub }]}>
                    Display countdown during game
                  </Text>
                </View>
              </View>
              <Switch
                value={showTimer}
                onValueChange={(val) => setShowTimer(val)}
                trackColor={{ false: '#1E3A5F', true: '#7B52E8' }}
                thumbColor={showTimer ? '#FFFFFF' : '#8B9EC3'}
              />
            </View>
          </View>
        </View>

        {/* GAMEPLAY SECTION */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textSub }]}>
            🎮 GAMEPLAY
          </Text>
          <View style={[styles.card, {
            backgroundColor: theme.card,
            borderColor: theme.border,
          }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📳</Text>
                <View>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>
                    Vibration
                  </Text>
                  <Text style={[styles.settingDesc, { color: theme.textSub }]}>
                    Vibrate on correct/wrong answers
                  </Text>
                </View>
              </View>
              <Switch
                value={vibrationEnabled}
                onValueChange={(val) => setVibrationEnabled(val)}
                trackColor={{ false: '#1E3A5F', true: '#7B52E8' }}
                thumbColor={vibrationEnabled ? '#FFFFFF' : '#8B9EC3'}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>💡</Text>
                <View>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>
                    Show Hints
                  </Text>
                  <Text style={[styles.settingDesc, { color: theme.textSub }]}>
                    Show hint after 2 wrong answers
                  </Text>
                </View>
              </View>
              <Switch
                value={showHints}
                onValueChange={(val) => setShowHints(val)}
                trackColor={{ false: '#1E3A5F', true: '#7B52E8' }}
                thumbColor={showHints ? '#FFFFFF' : '#8B9EC3'}
              />
            </View>
          </View>
        </View>

        {/* ABOUT SECTION */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textSub }]}> 
            ℹ️ ABOUT
          </Text>
          <View style={[styles.card, {
            backgroundColor: theme.card,
            borderColor: theme.border,
          }]}> 
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: theme.textSub }]}>App Name</Text>
              <Text style={[styles.aboutValue, { color: theme.text }]}>COMBLE</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: theme.textSub }]}>Version</Text>
              <Text style={[styles.aboutValue, { color: theme.text }]}>1.0.0</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: theme.textSub }]}>Developer</Text>
              <Text style={[styles.aboutValue, { color: theme.text }]}>COMBLE Team</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: theme.textSub }]}>Purpose</Text>
              <Text style={[styles.aboutValue, { color: theme.text }]}>Educational Game</Text>
            </View>
          </View>
        </View>

        {/* Reset Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => resetSettings()}>
            <Text style={styles.resetText}>🔄 Reset to Defaults</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backBtn: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 3,
  },
  scroll: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    fontSize: 22,
    width: 32,
    textAlign: 'center',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7B52E8',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  aboutLabel: {
    fontSize: 13,
  },
  aboutValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  resetBtn: {
    backgroundColor: '#162040',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  resetText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});