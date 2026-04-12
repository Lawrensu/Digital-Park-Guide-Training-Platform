// src/services/apiService.js
// Handles all API communication with graceful offline fallback

import { MOCK_COURSES, MOCK_LESSONS, MOCK_QUIZZES } from '../data/seedData';
import { getCourses, saveCourses, getLessonsByCourse, saveLessons,
         saveProgress, saveQuizResult, getPendingSyncItems, markSyncComplete } from '../database/db';

const API_BASE = 'http://172.20.10.4:3000/api';
const TIMEOUT_MS = 5000;

// Helper: fetch with timeout
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
};

// Check network availability
export const isOnline = async () => {
  try {
    await fetchWithTimeout(`${API_BASE}/health`);
    return true;
  } catch {
    return false;
  }
};

/**
 * Fetch courses — online first, SQLite fallback, mock fallback.
 */
export const fetchCourses = async () => {
  try {
    const data = await fetchWithTimeout(`${API_BASE}/courses`);
    await saveCourses(data.courses);
    return data.courses;
  } catch {
    console.log('📴 Offline: loading courses from SQLite');
    try {
      const local = await getCourses();
      if (local.length > 0) return local;
    } catch (dbErr) {
      console.warn('SQLite unavailable, using mock data');
    }
    // Ultimate fallback
    return MOCK_COURSES;
  }
};

/**
 * Fetch lessons for a course.
 */
export const fetchLessons = async (courseId) => {
  try {
    const data = await fetchWithTimeout(`${API_BASE}/courses/${courseId}/lessons`);
    await saveLessons(data.lessons);
    return data.lessons;
  } catch {
    console.log('📴 Offline: loading lessons from SQLite');
    try {
      const local = await getLessonsByCourse(courseId);
      if (local.length > 0) return local;
    } catch {
      console.warn('SQLite unavailable, using mock data');
    }
    return MOCK_LESSONS.filter((l) => l.courseId === courseId);
  }
};

/**
 * Fetch quiz for a course/lesson.
 */
export const fetchQuiz = async (courseId, lessonId) => {
  try {
    const data = await fetchWithTimeout(`${API_BASE}/quiz?courseId=${courseId}&lessonId=${lessonId}`);
    return data.quiz;
  } catch {
    return MOCK_QUIZZES.find((q) => q.courseId === courseId) || MOCK_QUIZZES[0];
  }
};

/**
 * Submit quiz results — saves locally and queues for sync.
 */
export const submitQuizResult = async (userId, courseId, quizId, score, total, answers) => {
  // Always save locally first (offline-safe)
  const result = await saveQuizResult(userId, courseId, quizId, score, total, answers);

  // Try to push to server
  try {
    await fetchWithTimeout(`${API_BASE}/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId, quizId, score, total, answers }),
    });
  } catch {
    console.log('📴 Quiz result queued for sync');
  }
  return result;
};

/**
 * Update progress — saves locally and queues for sync.
 */
export const updateProgress = async (userId, courseId, lessonId, progressPct) => {
  await saveProgress(userId, courseId, lessonId, progressPct);

  try {
    await fetchWithTimeout(`${API_BASE}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId, lessonId, progressPct }),
    });
  } catch {
    console.log('📴 Progress queued for sync');
  }
};

/**
 * Sync pending offline data to backend when connection is restored.
 */
export const syncOfflineData = async () => {
  const online = await isOnline();
  if (!online) return { synced: 0, message: 'Still offline' };

  const pending = await getPendingSyncItems();
  if (pending.length === 0) return { synced: 0, message: 'Nothing to sync' };

  const successIds = [];
  for (const item of pending) {
    try {
      await fetchWithTimeout(`${API_BASE}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: item.table_name,
          operation: item.operation,
          payload: JSON.parse(item.payload),
        }),
      });
      successIds.push(item.id);
    } catch {
      console.warn(`Failed to sync item ${item.id}`);
    }
  }

  if (successIds.length > 0) {
    await markSyncComplete(successIds);
  }

  return { synced: successIds.length, total: pending.length };
};
