// src/services/authService.js
// Secure token storage using Expo SecureStore
// Handles: store/retrieve refresh token, silent refresh on app launch

import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'parkguide_refresh_token';
const API_BASE = 'http://localhost:3000/api';

/**
 * Store refresh token securely on device.
 */
export const storeRefreshToken = async (token) => {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (err) {
    console.warn('Failed to store refresh token:', err);
  }
};

/**
 * Retrieve stored refresh token.
 */
export const getRefreshToken = async () => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (err) {
    console.warn('Failed to get refresh token:', err);
    return null;
  }
};

/**
 * Delete stored refresh token (on logout).
 */
export const deleteRefreshToken = async () => {
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (err) {
    console.warn('Failed to delete refresh token:', err);
  }
};

/**
 * Silently refresh the access token using stored refresh token.
 * Called on app launch before showing the main screen.
 *
 * Returns: { user, accessToken } or null if refresh fails.
 */
export const silentRefresh = async () => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      // Refresh failed — clear stored token and force login
      await deleteRefreshToken();
      return null;
    }
    const data = await res.json();
    return { user: data.user, accessToken: data.accessToken };
  } catch {
    // Network unavailable — cannot refresh, but don't clear token
    // (User may be offline — let them proceed with cached data)
    console.log('Silent refresh failed — network unavailable');
    return null;
  }
};
