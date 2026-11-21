import React, { useState, useMemo } from 'react';
import { saveAnsweredQuestion } from '../utils/storage';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { questions as rawQuestions } from '../data/questions';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function EasyModeScreen({ navigation }: any) {
  const { theme, isDarkMode } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const questions = useMemo(() => shuffle(rawQuestions), []);

  const total = questions.length;
  const current = questions[currentIndex];

  if (!current) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Loading...</Text>
      </View>
    );
  }

  const handleAnswer = (choice: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(choice);
  };

  const handleNext = async () => {
  if (selectedAnswer === null) return;
  
  // Save answered question ID
  await saveAnsweredQuestion(current.id);

  const newScore = selectedAnswer === current.answer ? score + 1 : score;
  setScore(newScore);

  if (currentIndex + 1 < total) {
    setCurrentIndex(currentIndex + 1);
    setSelectedAnswer(null);
  } else {
    navigation.navigate('Result', {
      score: newScore,
      total: total,
      mode: 'easy',
    });
  }
};
  const getChoiceStyle = (choice: string) => {
    if (selectedAnswer === null) return [styles.choiceBtn, { backgroundColor: theme.card, borderColor: theme.border }];
    if (choice === current.answer) return [styles.choiceBtn, styles.correct];
    if (choice === selectedAnswer) return [styles.choiceBtn, styles.wrong];
    return [styles.choiceBtn, { backgroundColor: theme.card, borderColor: theme.border }];
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}> 
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderColor: theme.border }] }>
        <Text style={[styles.headerTitle, { color: theme.text }]}>EASY MODE</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.pauseBtn, { color: theme.text }]}>⏸</Text>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Text style={[styles.questionNum, { color: theme.textSub }] }>
          QUESTION {currentIndex + 1}/{total}
        </Text>
        <View style={[styles.progressBar, { backgroundColor: theme.border }] }>
          {questions.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i <= currentIndex ? styles.progressDotActive : null,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Question Card */}
      <View style={[styles.questionCard, { backgroundColor: theme.card, borderColor: theme.border }] }>
        {current.image && (
          <View style={[styles.imageBox, { backgroundColor: theme.bg }] }>
            <Image
              source={current.image}
              style={styles.partImage}
              resizeMode="contain"
            />
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
            onPress={() => handleAnswer(choice)}>
            <Text style={[styles.choiceLetter, { color: theme.textSub }] }>
              {String.fromCharCode(65 + index)}
            </Text>
            <Text style={[styles.choiceText, { color: theme.text }]}>{choice}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={[
          styles.nextBtn,
          selectedAnswer === null && styles.nextBtnDisabled,
        ]}
        onPress={handleNext}>
        <Text style={styles.nextBtnText}>
          {currentIndex + 1 === total ? 'FINISH' : 'NEXT'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#2E7D32',
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  pauseBtn: {
    color: '#FFFFFF',
    fontSize: 22,
  },
  progressContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  questionNum: {
    color: '#8B9EC3',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 8,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 6,
  },
  progressDot: {
    flex: 1,
    height: 6,
    backgroundColor: '#162040',
    borderRadius: 3,
  },
  progressDotActive: {
    backgroundColor: '#4CAF50',
  },
  questionCard: {
    backgroundColor: '#162040',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  imageBox: {
    width: 120,
    height: 120,
    backgroundColor: '#0A1628',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
 partEmoji: {
    fontSize: 64,
  },
  partLabel: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F5A623',
    letterSpacing: 2,
  },
  partImage: {
    width: 100,
    height: 100,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  choicesContainer: {
    gap: 10,
    marginBottom: 20,
  },
  choiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#162040',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    gap: 12,
  },
  correct: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  wrong: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  choiceLetter: {
    color: '#8B9EC3',
    fontSize: 14,
    fontWeight: '700',
    width: 20,
  },
  choiceText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextBtnDisabled: {
    backgroundColor: '#1B4D2E',
    opacity: 0.6,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
});