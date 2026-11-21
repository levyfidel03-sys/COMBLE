import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSetting, saveSetting, resetAllData } from '../utils/storage';

type SettingsContextType = {
  soundEnabled: boolean;
  isDarkMode: boolean;
  vibrationEnabled: boolean;
  showTimer: boolean;
  showHints: boolean;
  setSoundEnabled: (val: boolean) => void;
  setIsDarkMode: (val: boolean) => void;
  setVibrationEnabled: (val: boolean) => void;
  setShowTimer: (val: boolean) => void;
  setShowHints: (val: boolean) => void;
  resetSettings: () => void;
  theme: {
    bg: string;
    card: string;
    border: string;
    text: string;
    textSub: string;
    header: string;
    headerBorder: string;
  };
};

const defaultTheme = {
  bg: '#0A1628',
  card: '#162040',
  border: '#1E3A5F',
  text: '#FFFFFF',
  textSub: '#8B9EC3',
  header: '#0A1628',
  headerBorder: '#162040',
};

const defaultSettingsContext: SettingsContextType = {
  soundEnabled: true,
  isDarkMode: true,
  vibrationEnabled: true,
  showTimer: true,
  showHints: false,
  setSoundEnabled: () => {},
  setIsDarkMode: () => {},
  setVibrationEnabled: () => {},
  setShowTimer: () => {},
  setShowHints: () => {},
  resetSettings: () => {},
  theme: defaultTheme,
};

const SettingsContext = createContext<SettingsContextType>(defaultSettingsContext);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [isDarkMode, setIsDarkModeState] = useState(true);
  const [vibrationEnabled, setVibrationEnabledState] = useState(true);
  const [showTimer, setShowTimerState] = useState(true);
  const [showHints, setShowHintsState] = useState(false);

  // Load all settings on app start
  useEffect(() => {
    const loadSettings = async () => {
      const sound = await getSetting('soundEnabled', true);
      const dark  = await getSetting('isDarkMode', true);
      const vibr  = await getSetting('vibrationEnabled', true);
      const timer = await getSetting('showTimer', true);
      const hints = await getSetting('showHints', false);
      setSoundEnabledState(sound);
      setIsDarkModeState(dark);
      setVibrationEnabledState(vibr);
      setShowTimerState(timer);
      setShowHintsState(hints);
    };
    loadSettings();
  }, []);

  // Save and update each setting
  const setSoundEnabled = async (val: boolean) => {
    setSoundEnabledState(val);
    await saveSetting('soundEnabled', val);
  };
  const setIsDarkMode = async (val: boolean) => {
    setIsDarkModeState(val);
    await saveSetting('isDarkMode', val);
  };
  const setVibrationEnabled = async (val: boolean) => {
    setVibrationEnabledState(val);
    await saveSetting('vibrationEnabled', val);
  };
  const setShowTimer = async (val: boolean) => {
    setShowTimerState(val);
    await saveSetting('showTimer', val);
  };
  const setShowHints = async (val: boolean) => {
    setShowHintsState(val);
    await saveSetting('showHints', val);
  };
  const resetSettings = async () => {
    await resetAllData();
    setSoundEnabledState(true);
    setIsDarkModeState(true);
    setVibrationEnabledState(true);
    setShowTimerState(true);
    setShowHintsState(false);
  };

  // Global theme object available to all screens
  const theme = {
    bg:          isDarkMode ? '#0A1628' : '#F0F4FF',
    card:        isDarkMode ? '#162040' : '#FFFFFF',
    border:      isDarkMode ? '#1E3A5F' : '#D0DCF0',
    text:        isDarkMode ? '#FFFFFF' : '#0A1628',
    textSub:     isDarkMode ? '#8B9EC3' : '#556080',
    header:      isDarkMode ? '#0A1628' : '#FFFFFF',
    headerBorder:isDarkMode ? '#162040' : '#D0DCF0',
  };

  return (
    <SettingsContext.Provider value={{
      soundEnabled,
      isDarkMode,
      vibrationEnabled,
      showTimer,
      showHints,
      setSoundEnabled,
      setIsDarkMode,
      setVibrationEnabled,
      setShowTimer,
      setShowHints,
      resetSettings,
      theme,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use settings in any screen
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return context;
}