import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { saveBestScore, getBestScore } from '../utils/storage';

export default function ResultScreen({ navigation, route }: any) {
  const { theme, isDarkMode } = useSettings();
  const { score, total, mode } = route.params || { score: 0, total: 6, mode: 'easy' };
  const stars = Math.round((score / total) * 5);
  const [bestScore, setBestScore] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);

  useEffect(() => {
    const handleScore = async () => {
      const isNew = await saveBestScore(mode || 'easy', score);
      const best = await getBestScore(mode || 'easy');
      setIsNewBest(isNew);
      setBestScore(best);
    };
    handleScore();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {isNewBest && (
        <View style={styles.newBestBanner}>
          <Text style={styles.newBestText}>🏆 NEW HIGH SCORE!</Text>
        </View>
      )}

      <Text style={[styles.title, { color: theme.text }]}>WELL DONE!</Text>
      <Text style={styles.trophy}>🏆</Text>
      <Text style={[styles.scoreLabel, { color: theme.textSub }]}>YOUR SCORE</Text>
      <Text style={[styles.score, { color: theme.text }] }>{score} / {total}</Text>

      {/* Stars */}
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(i => (
          <Text key={i} style={styles.star}>
            {i <= stars ? '⭐' : '☆'}
          </Text>
        ))}
      </View>

      {/* Best Score */}
      <View style={styles.bestScoreBox}>
        <Text style={styles.bestScoreLabel}>Best Score</Text>
        <Text style={styles.bestScoreValue}>{bestScore} / {total}</Text>
      </View>

      <TouchableOpacity
        style={styles.btnBlue}
        onPress={() => navigation.navigate(
          mode === 'hard' ? 'HardMode' : 'EasyMode'
        )}>
        <Text style={styles.btnText}>🔄 PLAY AGAIN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnGray}
        onPress={() => navigation.navigate('MainMenu')}>
        <Text style={styles.btnText}>🏠 MAIN MENU</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  newBestBanner: {
    backgroundColor: '#F5A623',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  newBestText: {
    color: '#0A1628',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 3,
    marginBottom: 10,
  },
  trophy: {
    fontSize: 80,
    marginBottom: 20,
  },
  scoreLabel: {
    color: '#8B9EC3',
    fontSize: 14,
    letterSpacing: 3,
    marginBottom: 8,
  },
  score: {
    color: '#F5A623',
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  star: {
    fontSize: 32,
  },
  bestScoreBox: {
    backgroundColor: '#162040',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  bestScoreLabel: {
    color: '#8B9EC3',
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 4,
  },
  bestScoreValue: {
    color: '#4A9EFF',
    fontSize: 20,
    fontWeight: '900',
  },
  btnBlue: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    marginBottom: 14,
  },
  btnGray: {
    backgroundColor: '#162040',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
});