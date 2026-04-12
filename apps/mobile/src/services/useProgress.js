// src/services/useProgress.js
// Custom hook: loads and updates lesson/course progress with SQLite + API sync.

import { useState, useEffect, useCallback } from 'react';
import { getProgressByUser, getCourseProgress } from '../database/db';
import { updateProgress } from './apiService';
import { useAuth } from './AuthContext';

/**
 * Returns progress data for the current user.
 *
 * Usage:
 *   const { courseProgress, markLessonComplete, getProgress } = useProgress();
 */
export default function useProgress() {
  const { user } = useAuth();
  const [progressMap, setProgressMap] = useState({}); // { courseId: pct }
  const [loading, setLoading] = useState(false);

  const loadProgress = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const records = await getProgressByUser(user.id);

      // Build a map: courseId → average progress %
      const courseMap = {};
      const courseTotals = {};

      records.forEach((r) => {
        if (!courseMap[r.course_id]) {
          courseMap[r.course_id] = 0;
          courseTotals[r.course_id] = { sum: 0, count: 0 };
        }
        courseTotals[r.course_id].sum += r.progress_pct;
        courseTotals[r.course_id].count += 1;
      });

      Object.keys(courseTotals).forEach((courseId) => {
        const { sum, count } = courseTotals[courseId];
        courseMap[courseId] = Math.round(sum / count);
      });

      setProgressMap(courseMap);
    } catch (err) {
      console.warn('Failed to load progress:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  /**
   * Mark a lesson complete and update progress records.
   * Automatically saves to SQLite and queues server sync.
   */
  const markLessonComplete = useCallback(
    async (courseId, lessonId, pct = 100) => {
      if (!user) return;
      try {
        await updateProgress(user.id, courseId, lessonId, pct);
        // Refresh map
        await loadProgress();
      } catch (err) {
        console.warn('Failed to save progress:', err);
      }
    },
    [user, loadProgress]
  );

  /**
   * Get progress percentage for a specific course.
   */
  const getProgress = useCallback(
    (courseId) => progressMap[courseId] || 0,
    [progressMap]
  );

  return { progressMap, loading, markLessonComplete, getProgress, refreshProgress: loadProgress };
}
