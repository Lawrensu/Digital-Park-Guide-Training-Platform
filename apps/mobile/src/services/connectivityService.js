// src/services/connectivityService.js
// Connectivity detection — tries NetInfo, falls back to HTTP polling
// Wires into OfflineBanner and auto-syncs on reconnect

import { useState, useEffect, useRef, useCallback } from 'react';
import { syncOfflineData } from './apiService';

const HEALTH_URL = 'https://clients3.google.com/generate_204';
const POLL_MS    = 15000;

export default function useNetworkStatus() {
  const [isOnline, setIsOnline]     = useState(null);
  const [lastSynced, setLastSynced] = useState(null);
  const wasOfflineRef = useRef(false);

  const handleChange = useCallback(async (online) => {
    // Reconnected — trigger sync
    if (online && wasOfflineRef.current) {
      try {
        const result = await syncOfflineData();
        if (result.synced > 0) setLastSynced(new Date());
      } catch (err) {
        console.warn('Sync on reconnect failed:', err);
      }
    }
    wasOfflineRef.current = !online;
    setIsOnline(online);
  }, []);

  useEffect(() => {
    let NetInfo = null;
    let cleanup = () => {};

    const setup = async () => {
      try {
        // Try NetInfo (install: npx expo install @react-native-community/netinfo)
        NetInfo = require('@react-native-community/netinfo').default;
        const unsub = NetInfo.addEventListener((state) => {
          handleChange(!!state.isConnected && state.isInternetReachable !== false);
        });
        const state = await NetInfo.fetch();
        setIsOnline(!!state.isConnected);
        wasOfflineRef.current = !state.isConnected;
        cleanup = unsub;
      } catch {
        // Polling fallback
        const check = async () => {
          try {
            const ctrl = new AbortController();
            const t = setTimeout(() => ctrl.abort(), 4000);
            const res = await fetch(HEALTH_URL, { signal: ctrl.signal });
            clearTimeout(t);
            handleChange(res.ok);
          } catch {
            handleChange(false);
          }
        };
        check();
        const id = setInterval(check, POLL_MS);
        cleanup = () => clearInterval(id);
      }
    };

    setup();
    return () => cleanup();
  }, [handleChange]);

  return { isOnline, lastSynced };
}
