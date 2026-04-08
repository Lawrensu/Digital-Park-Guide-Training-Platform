// src/services/useNetworkStatus.js
// React hook that tracks online/offline connectivity and triggers sync on reconnect.

import { useState, useEffect, useRef, useCallback } from 'react';
import { syncOfflineData } from './apiService';

const POLL_INTERVAL_MS = 15000; // check every 15 seconds
const HEALTH_URL = 'http://localhost:3000/api/health';
const TIMEOUT_MS = 4000;

/**
 * Returns { isOnline, lastSynced, pendingCount } and auto-syncs on reconnect.
 *
 * Usage:
 *   const { isOnline, lastSynced } = useNetworkStatus();
 */
export default function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSynced, setLastSynced] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const wasOfflineRef = useRef(false);
  const pollingRef = useRef(null);

  const checkConnectivity = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const res = await fetch(HEALTH_URL, { signal: controller.signal });
      clearTimeout(timer);

      const online = res.ok;

      if (online && wasOfflineRef.current) {
        // Just came back online — trigger sync
        try {
          const result = await syncOfflineData();
          if (result.synced > 0) {
            setLastSynced(new Date());
            setPendingCount(0);
          }
        } catch (syncErr) {
          console.warn('Sync after reconnect failed:', syncErr);
        }
      }

      wasOfflineRef.current = !online;
      setIsOnline(online);
    } catch {
      wasOfflineRef.current = true;
      setIsOnline(false);
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkConnectivity();

    // Poll periodically
    pollingRef.current = setInterval(checkConnectivity, POLL_INTERVAL_MS);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [checkConnectivity]);

  return { isOnline, lastSynced, pendingCount };
}
