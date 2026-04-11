// src/database/db.js
// Using AsyncStorage instead of expo-sqlite for Expo Go compatibility
// SQLite can be added back when doing a native build with expo prebuild

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── COURSE OPERATIONS ───────────────────────────────────────────────

export const saveCourses = async (courses) => {
  try {
    await AsyncStorage.setItem('courses', JSON.stringify(courses));
  } catch (err) {
    console.warn('saveCourses error:', err);
  }
};

export const getCourses = async () => {
  try {
    const data = await AsyncStorage.getItem('courses');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.warn('getCourses error:', err);
    return [];
  }
};

// ─── LESSON OPERATIONS ───────────────────────────────────────────────

export const saveLessons = async (lessons) => {
  try {
    await AsyncStorage.setItem('lessons', JSON.stringify(lessons));
  } catch (err) {
    console.warn('saveLessons error:', err);
  }
};

export const getLessonsByCourse = async (courseId) => {
  try {
    const data = await AsyncStorage.getItem('lessons');
    const lessons = data ? JSON.parse(data) : [];
    return lessons.filter((l) => l.courseId === courseId);
  } catch (err) {
    console.warn('getLessonsByCourse error:', err);
    return [];
  }
};

// ─── PROGRESS OPERATIONS ─────────────────────────────────────────────

export const saveProgress = async (userId, courseId, lessonId, progressPct) => {
  try {
    const key = `progress_${userId}`;
    const data = await AsyncStorage.getItem(key);
    const progress = data ? JSON.parse(data) : [];
    const existing = progress.findIndex(
      (p) => p.course_id === courseId && p.lesson_id === lessonId
    );
    const record = {
      user_id: userId,
      course_id: courseId,
      lesson_id: lessonId,
      completed: progressPct >= 100 ? 1 : 0,
      progress_pct: progressPct,
      last_accessed: new Date().toISOString(),
    };
    if (existing >= 0) {
      progress[existing] = record;
    } else {
      progress.push(record);
    }
    await AsyncStorage.setItem(key, JSON.stringify(progress));
  } catch (err) {
    console.warn('saveProgress error:', err);
  }
};

export const getProgressByUser = async (userId) => {
  try {
    const key = `progress_${userId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.warn('getProgressByUser error:', err);
    return [];
  }
};

export const getCourseProgress = async (userId, courseId) => {
  try {
    const progress = await getProgressByUser(userId);
    const courseRecords = progress.filter((p) => p.course_id === courseId);
    if (courseRecords.length === 0) return 0;
    const avg = courseRecords.reduce((sum, p) => sum + p.progress_pct, 0) / courseRecords.length;
    return Math.round(avg);
  } catch (err) {
    return 0;
  }
};

// ─── QUIZ RESULT OPERATIONS ──────────────────────────────────────────

export const saveQuizResult = async (userId, courseId, quizId, score, total, answers) => {
  try {
    const key = `quiz_results_${userId}`;
    const data = await AsyncStorage.getItem(key);
    const results = data ? JSON.parse(data) : [];
    const percentage = Math.round((score / total) * 100);
    const record = {
      id: Date.now(),
      user_id: userId,
      course_id: courseId,
      quiz_id: quizId,
      score,
      total,
      percentage,
      answers,
      completed_at: new Date().toISOString(),
    };
    results.push(record);
    await AsyncStorage.setItem(key, JSON.stringify(results));
    return { score, total, percentage };
  } catch (err) {
    console.warn('saveQuizResult error:', err);
    return { score, total, percentage: Math.round((score / total) * 100) };
  }
};

export const getQuizResults = async (userId) => {
  try {
    const key = `quiz_results_${userId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

// ─── SYNC OPERATIONS ─────────────────────────────────────────────────

export const getPendingSyncItems = async () => {
  try {
    const data = await AsyncStorage.getItem('sync_queue');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

export const markSyncComplete = async (ids) => {
  try {
    const data = await AsyncStorage.getItem('sync_queue');
    const queue = data ? JSON.parse(data) : [];
    const remaining = queue.filter((item) => !ids.includes(item.id));
    await AsyncStorage.setItem('sync_queue', JSON.stringify(remaining));
  } catch (err) {
    console.warn('markSyncComplete error:', err);
  }
};

export const initDatabase = async () => {
  console.log('✅ AsyncStorage ready (SQLite disabled for Expo Go)');
  return true;
};

export const openDatabase = () => {
  return true;
};