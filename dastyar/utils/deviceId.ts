import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';

const DEVICE_ID_KEY = 'device_id';
const SESSION_ID_KEY = 'session_id';

export async function getDeviceId(): Promise<string> {
  try {
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    
    if (deviceId) {
      return deviceId;
    }

    const installationId = Constants.installationId || '';
    const deviceName = Constants.deviceName || '';
    const deviceYearClass = Constants.deviceYearClass || '';
    
    const uniqueString = `${installationId}-${deviceName}-${deviceYearClass}-${Date.now()}`;
    
    deviceId = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      uniqueString
    );

    await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    
    return deviceId;
  } catch (error) {
    console.error('Error getting device ID:', error);
    const fallbackId = `device_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await AsyncStorage.setItem(DEVICE_ID_KEY, fallbackId);
    return fallbackId;
  }
}

export async function getSessionId(): Promise<string> {
  try {
    let sessionId = await AsyncStorage.getItem(SESSION_ID_KEY);
    
    if (sessionId) {
      return sessionId;
    }

    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    await AsyncStorage.setItem(SESSION_ID_KEY, sessionId);
    
    return sessionId;
  } catch (error) {
    console.error('Error getting session ID:', error);
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

export async function resetSessionId(): Promise<string> {
  try {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await AsyncStorage.setItem(SESSION_ID_KEY, newSessionId);
    return newSessionId;
  } catch (error) {
    console.error('Error resetting session ID:', error);
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

export async function clearDeviceId(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DEVICE_ID_KEY);
  } catch (error) {
    console.error('Error clearing device ID:', error);
  }
}
