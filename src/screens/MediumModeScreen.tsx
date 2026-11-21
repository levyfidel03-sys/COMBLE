import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSettings } from '../context/SettingsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mediumSets, MediumQuestion } from '../data/mediumQuestions';

const TIMER_DURATION = 12;
const QUEUE_KEY = 'medium_set_queue';
const ALL_SETS = ['A', 'B', 'C', 'D'];
const partImages: Record<string, number> = {
  CPU: require('../assets/images/cpu.png'),
  RAM: require('../assets/images/ram.png'),
  GPU: require('../assets/images/gpu.png'),
  PSU: require('../assets/images/psu.png'),
  SSD: require('../assets/images/ssd.png'),
  Motherboard: require('../assets/images/motherboard.png'),
  Keyboard: require('../assets/images/keyboard.png'),
  Mouse: require('../assets/images/mouse.png'),
  ROM: require('../assets/images/rom.png'),
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MediumModeScreen({ navigation }: any) {
  const { theme, isDarkMode } = useSettings();
  const [questions, setQuestions]           = useState<MediumQuestion[]>([]);
  const [setName, setSetName]               = useState('A');
  const [loading, setLoading]               = useState(true);
  const [currentIndex, setCurrentIndex]     = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered]             = useState(false);
  const [score, setScore]                   = useState(0);
  const [timeLeft, setTimeLeft]             = useState(TIMER_DURATION);

  useEffect(() => { loadQuestions(); }, []);

  const loadQuestions = async () => {
    try {
      const stored = await AsyncStorage.getItem(QUEUE_KEY);
      let queue: string[] = stored ? JSON.parse(stored) : [];
      if (queue.length === 0) {
        queue = shuffle([...ALL_SETS]);
      }
      const pickedSet = queue[0];
      const remaining = queue.slice(1);
      setSetName(pickedSet);
      setQuestions(shuffle(mediumSets[pickedSet]));
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
    } catch {
      setSetName('A');
      setQuestions(shuffle(mediumSets['A']));
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer — resets when currentIndex changes
  useEffect(() => {
    setTimeLeft(TIMER_DURATION);
  }, [currentIndex]);

  useEffect(() => {
    if (answered || loading || questions.length === 0) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, answered, loading, questions.length]);

  const total   = questions.length;
  const current = questions[currentIndex];

  const advance = (newScore: number) => {
    const isLast = currentIndex + 1 >= total;
    if (isLast) {
      navigation.navigate('Result', { score: newScore, total, mode: 'medium' });
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  const handleAnswer = (choice: string) => {
    if (answered) return;
    setAnswered(true);
    setSelectedAnswer(choice);
    const isCorrect = choice === current.answer;
    const newScore  = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);
    setTimeout(() => advance(newScore), 1200);
  };

  const handleTimeout = () => {
    if (answered) return;
    setAnswered(true);
    setSelectedAnswer(null);
    setTimeout(() => advance(score), 1200);
  };

  const timerColor =
    timeLeft > 6 ? '#29B6F6' : timeLeft > 3 ? '#F5A623' : '#F44336';

  const getChoiceStyle = (choice: string) => {
    if (!answered) return [styles.choiceBtn, { backgroundColor: theme.card, borderColor: theme.border }];
    if (choice === current?.answer) return [styles.choiceBtn, styles.correct];
    if (choice === selectedAnswer)  return [styles.choiceBtn, styles.wrong];
    return [styles.choiceBtn, { backgroundColor: theme.card, borderColor: theme.border }];
  };

  const getLetterStyle = (choice: string) => {
    if (!answered) return [styles.choiceLetter, { color: theme.textSub }];
    if (choice === current?.answer || choice === selectedAnswer)
      return [styles.choiceLetter, styles.choiceLetterActive];
    return [styles.choiceLetter, { color: theme.textSub }];
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.bg }] }>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  if (!current) return null;

  const progress = (currentIndex / total) * 100;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}> 
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderColor: theme.border }] }>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtn, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>MEDIUM MODE</Text>
          <Text style={[styles.setLabel, { color: theme.textSub }]}>SET {setName}</Text>
        </View>
        <View style={[styles.scoreBox, { backgroundColor: theme.bg, borderColor: theme.border }] }>
          <Text style={[styles.scoreVal, { color: theme.text }]}>{score}</Text>
        </View>
      </View>

      {/* Timer bar */}
<View style={[styles.timerRow, { backgroundColor: theme.card, borderColor: theme.border }] }>
        <View style={[styles.timerBarBg, { backgroundColor: theme.border }] }>
          <View
            style={[
              styles.timerBarFill,
              {
                width: `${(timeLeft / TIMER_DURATION) * 100}%`,
                backgroundColor: timerColor,
              },
            ]}
          />
        </View>
        <Text style={[styles.timerText, { color: timerColor }]}>
          {timeLeft}s
        </Text>
      </View>

      {/* Progress */}
      <View style={[styles.progressContainer, { borderColor: theme.border }] }>
        <View style={styles.progressRow}>
          <Text style={[styles.questionNum, { color: theme.textSub }]}>{currentIndex + 1} / {total}</Text>
          <Text style={[styles.questionNum, { color: theme.textSub }]}>{Math.round(progress)}%</Text>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: theme.border, borderColor: theme.border }]}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Question Card */}
      <View style={[styles.questionCard, { backgroundColor: theme.card, borderColor: theme.border }] }>
        <View style={[styles.difficultyBadge, { backgroundColor: theme.bg }] }>
          <Text style={[styles.difficultyText, { color: theme.textSub }]}>⚡ MEDIUM</Text>
        </View>
        {partImages[current.answer] && (
          <View style={[styles.imageBox, { backgroundColor: theme.bg }] }>
            <Image source={partImages[current.answer]} style={styles.partImage} resizeMode="contain" />
          </View>
        )}
        <Text style={[styles.questionText, { color: theme.text }]}>{current.question}</Text>
      </View>

      {/* Choices */}
      <View style={styles.choicesContainer}>
        {current.choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
            style={getChoiceStyle(choice)}
            onPress={() => handleAnswer(choice)}
            disabled={answered}
            activeOpacity={0.75}>
            <Text style={getLetterStyle(choice)}>
              {String.fromCharCode(65 + index)}
            </Text>
            <Text style={[styles.choiceText, { color: theme.text }]}>{choice}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#0D1F3C',
    marginHorizontal: -20,
    gap: 10,
  },
  timerBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#162040',
    borderRadius: 4,
    overflow: 'hidden',
  },
  timerBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '900',
    width: 28,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A1628',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1565C0',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 14,
  },
  backBtn: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    width: 30,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 2,
  },
  setLabel: {
    color: '#90CAF9',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 2,
  },
  scoreBox: {
    backgroundColor: '#0D47A1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 36,
    alignItems: 'center',
  },
  scoreVal: {
    color: '#F5A623',
    fontSize: 18,
    fontWeight: '900',
  },
  progressContainer: {
    marginTop: 14,
    marginBottom: 18,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  questionNum: {
    color: '#8B9EC3',
    fontSize: 12,
    letterSpacing: 1,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#162040',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#29B6F6',
    borderRadius: 3,
  },
  questionCard: {
    backgroundColor: '#0D2244',
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#1565C0',
  },
  difficultyBadge: {
    backgroundColor: '#1565C0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 14,
  },
  difficultyText: {
    color: '#90CAF9',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  partImage: {
    width: 84,
    height: 84,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 25,
  },
  choicesContainer: {
    gap: 10,
  },
  choiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D2244',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1565C0',
    gap: 12,
  },
  correct: {
    backgroundColor: '#1B5E20',
    borderColor: '#4CAF50',
  },
  wrong: {
    backgroundColor: '#B71C1C',
    borderColor: '#F44336',
  },
  choiceLetter: {
    color: '#90CAF9',
    fontSize: 14,
    fontWeight: '800',
    width: 22,
  },
  choiceLetterActive: {
    color: '#FFFFFF',
  },
  choiceText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    lineHeight: 22,
  },
});
