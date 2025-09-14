import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
// CORRECTED: Import the Auth type and the new initializeAuth function
import { initializeAuth, Auth } from 'firebase/auth';
// CORRECTED: Import persistence from its own specific module
// import { getReactNativePersistence } from 'firebase/auth/react-native';
import { getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, Firestore } from 'firebase/firestore';
import Constants from 'expo-constants';

/**
 * Firebase Configuration for Healthcare React Native App
 * * This file initializes Firebase using environment variables for secure configuration.
 * * Setup Instructions:
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Add your app to the Firebase project
 * 3. Copy the config values from Firebase Console > Project Settings > General > Your apps
 * 4. Add the values to your .env file with EXPO_PUBLIC_ prefix
 * 5. Ensure .env is in your .gitignore file
 */

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Get environment variables with fallback values
const getFirebaseConfig = (): FirebaseConfig => {
  const config = {
    apiKey: Constants.expoConfig?.extra?.firebaseApiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: Constants.expoConfig?.extra?.firebaseProjectId || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: Constants.expoConfig?.extra?.firebaseAppId || process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId || process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
  };

  // Validate required configuration values
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    const errorMessage = `Missing required Firebase configuration: ${missingFields.join(', ')}. ` +
      'Please check your .env file and ensure all EXPO_PUBLIC_FIREBASE_* variables are set.';
    
    if (__DEV__) {
      console.error('Firebase Configuration Error:', errorMessage);
      console.error('Current config:', config);
    }
    
    throw new Error(errorMessage);
  }

  return config;
};

// Initialize Firebase app
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  // Check if Firebase is already initialized to prevent re-initialization
  if (getApps().length === 0) {
    const firebaseConfig = getFirebaseConfig();
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize Firebase services
  // CORRECTED: With Firebase v9+, you MUST explicitly provide persistence
  // to initializeAuth to save the user's session.
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
  
  db = getFirestore(app);

  if (__DEV__) {
    console.log('Firebase initialized successfully with Auth persistence');
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  throw error;
}

// Export Firebase services
export { auth, db };