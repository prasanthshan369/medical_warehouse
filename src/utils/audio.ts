// This utility handles sound playback using the modern expo-audio API (SDK 54+)
import { AppState } from 'react-native';
import { NotificationType } from '../store/useNotificationStore';

const SOUNDS: Record<NotificationType, string> = {
  critical: 'https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/1000/1000-preview.mp3',
  warning: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',
  info: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',
};

let lastPlayedAt = 0;
const THROTTLE_MS = 2000;

/**
 * Plays a notification sound only if the app is in the foreground.
 * Includes throttling to prevent audio "overlap" in case of rapid events.
 */
export const playSound = async (type: NotificationType = 'info') => {
  // 1. Strict Foreground Check
  if (AppState.currentState !== 'active') return;

  // 2. Throttling Logic (Critical alerts bypass)
  const now = Date.now();
  if (now - lastPlayedAt < THROTTLE_MS && type !== 'critical') {
    return;
  }

  try {
    // 3. Dynamic Import for SDK 54 compatibility
    let Audio;
    try {
      Audio = require('expo-audio');
    } catch (e) {
      // Silence if dependency is not installed
      return;
    }

    if (!Audio || !Audio.createAudioPlayer) return;

    // 4. One-off Player Creation
    const player = Audio.createAudioPlayer(SOUNDS[type]);
    
    player.play();
    lastPlayedAt = now;

  } catch (error) {
    // Fail silently to avoid interrupting the main thread
  }
};
