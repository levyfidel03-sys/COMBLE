import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── SCORES ───────────────────────────────────────
export const saveBestScore = async (mode: string, score: number) => {
  try {
    const key = `bestScore_${mode}`;
    const existing = await AsyncStorage.getItem(key);
    const current = existing ? parseInt(existing) : 0;
    if (score > current) {
      await AsyncStorage.setItem(key, score.toString());
      return true; // new high score!
    }
    return false;
  } catch (e) {
    console.error('saveBestScore error:', e);
    return false;
  }
};

export const getBestScore = async (mode: string) => {
  try {
    const key = `bestScore_${mode}`;
    const value = await AsyncStorage.getItem(key);
    return value ? parseInt(value) : 0;
  } catch (e) {
    return 0;
  }
};

// ─── SETTINGS ─────────────────────────────────────
export const saveSetting = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(`setting_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('saveSetting error:', e);
  }
};

export const getSetting = async (key: string, defaultValue: any) => {
  try {
    const value = await AsyncStorage.getItem(`setting_${key}`);
    return value !== null ? JSON.parse(value) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// ─── ANSWERED QUESTIONS ───────────────────────────
export const saveAnsweredQuestion = async (questionId: number) => {
  try {
    const existing = await AsyncStorage.getItem('answeredQuestions');
    const list: number[] = existing ? JSON.parse(existing) : [];
    if (!list.includes(questionId)) {
      list.push(questionId);
      await AsyncStorage.setItem('answeredQuestions', JSON.stringify(list));
    }
  } catch (e) {
    console.error('saveAnsweredQuestion error:', e);
  }
};

export const getAnsweredQuestions = async (): Promise<number[]> => {
  try {
    const value = await AsyncStorage.getItem('answeredQuestions');
    return value ? JSON.parse(value) : [];
  } catch (e) {
    return [];
  }
};

export const resetAnsweredQuestions = async () => {
  try {
    await AsyncStorage.removeItem('answeredQuestions');
  } catch (e) {
    console.error('resetAnsweredQuestions error:', e);
  }
};

// ─── RESET ALL ────────────────────────────────────
export const resetAllData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.error('resetAllData error:', e);
  }
};