import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { SettingsProvider } from './src/context/SettingsContext';

const { width } = Dimensions.get('window');

export default function App() {
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const scaleAnim  = useRef(new Animated.Value(0.8)).current;
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(loadingAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      setShowMenu(true);
    });
  }, []);

  const loadingWidth = loadingAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (showMenu) {
    return (
      <SettingsProvider>
        <AppNavigator />
      </SettingsProvider>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}>
        <View style={styles.pcIcon}>
          <View style={styles.pcTop} />
          <View style={styles.pcMiddle}>
            <View style={styles.pcLight} />
            <View style={[styles.pcLight, { backgroundColor: '#4CAF50' }]} />
          </View>
          <View style={styles.pcBottom} />
        </View>
        <Text style={styles.title}>COMBLE</Text>
        <Text style={styles.subtitle}>COMPUTER ASSEMBLY GAME</Text>
        <Text style={styles.tagline}>LEARN. ASSEMBLE. MASTER.</Text>
      </Animated.View>
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBar}>
          <Animated.View
            style={[styles.loadingFill, { width: loadingWidth }]}
          />
        </View>
        <Text style={styles.loadingText}>LOADING...</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  pcIcon: {
    width: 80,
    height: 100,
    marginBottom: 20,
    alignItems: 'center',
  },
  pcTop: {
    width: 70,
    height: 10,
    backgroundColor: '#1E3A5F',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  pcMiddle: {
    width: 70,
    height: 70,
    backgroundColor: '#162040',
    borderWidth: 2,
    borderColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  pcLight: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F5A623',
  },
  pcBottom: {
    width: 80,
    height: 8,
    backgroundColor: '#1E3A5F',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F5A623',
    letterSpacing: 3,
    marginTop: 4,
  },
  tagline: {
    fontSize: 11,
    color: '#4A9EFF',
    letterSpacing: 2,
    marginTop: 12,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    width: width * 0.6,
    alignItems: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#162040',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  loadingFill: {
    height: '100%',
    backgroundColor: '#4A9EFF',
    borderRadius: 4,
  },
  loadingText: {
    color: '#4A9EFF',
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 8,
  },
});