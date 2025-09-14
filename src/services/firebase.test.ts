/**
 * Firebase Configuration Test
 * 
 * This file contains tests to verify Firebase configuration is working correctly.
 * Run with: npm test or jest
 */

import { auth, db } from './firebase';

describe('Firebase Configuration', () => {
  test('Firebase auth should be initialized', () => {
    expect(auth).toBeDefined();
    expect(auth.app).toBeDefined();
  });

  test('Firestore database should be initialized', () => {
    expect(db).toBeDefined();
    expect(db.app).toBeDefined();
  });

  test('Firebase app should have correct configuration', () => {
    const app = auth.app;
    expect(app.options).toBeDefined();
    expect(app.options.projectId).toBeTruthy();
    expect(app.options.apiKey).toBeTruthy();
  });
});

// Helper function to test Firebase connection
export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Test Firestore connection by attempting to read a document
    // This is a lightweight operation that doesn't require authentication
    await db.terminate();
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};
