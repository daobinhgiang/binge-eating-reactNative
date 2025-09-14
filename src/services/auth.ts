import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  AuthError as FirebaseAuthError,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserRole } from '../types';

/**
 * Authentication Service for Healthcare React Native App
 * 
 * This service provides authentication functions for both patients and clinicians
 * with proper error handling and user profile management.
 */

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication error interface
export interface AuthError {
  code: string;
  message: string;
}

// Sign up function with user role and profile data
export const signUp = async (
  email: string,
  password: string,
  role: UserRole,
  profileData: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    phoneNumber?: string;
  }
): Promise<{ user: User; profile: UserProfile }> => {
  try {
    // Create user account
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    const now = new Date().toISOString();

    // Create user profile
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      role,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      dateOfBirth: profileData.dateOfBirth,
      phoneNumber: profileData.phoneNumber,
      createdAt: now,
      updatedAt: now,
    };

    // Save user profile to Firestore
    await setDoc(doc(db, 'users', user.uid), userProfile);

    if (__DEV__) {
      console.log('User signed up successfully:', user.uid);
    }

    return { user, profile: userProfile };
  } catch (error) {
    const authError = error as FirebaseAuthError;
    console.error('Sign up error:', authError.message);
    
    // Handle specific Firebase auth errors
    switch (authError.code) {
      case 'auth/email-already-in-use':
        throw new Error('An account with this email already exists.');
      case 'auth/invalid-email':
        throw new Error('Please enter a valid email address.');
      case 'auth/weak-password':
        throw new Error('Password should be at least 6 characters long.');
      case 'auth/operation-not-allowed':
        throw new Error('Email/password accounts are not enabled.');
      default:
        throw new Error('Failed to create account. Please try again.');
    }
  }
};

// Sign in function
export const signIn = async (email: string, password: string): Promise<{ user: User; profile: UserProfile }> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found. Please contact support.');
    }

    const userProfile = userDoc.data() as UserProfile;

    if (__DEV__) {
      console.log('User signed in successfully:', user.uid);
    }

    return { user, profile: userProfile };
  } catch (error) {
    const authError = error as FirebaseAuthError;
    console.error('Sign in error:', authError.message);
    
    // Handle specific Firebase auth errors
    switch (authError.code) {
      case 'auth/user-not-found':
        throw new Error('No account found with this email address.');
      case 'auth/wrong-password':
        throw new Error('Incorrect password. Please try again.');
      case 'auth/invalid-email':
        throw new Error('Please enter a valid email address.');
      case 'auth/user-disabled':
        throw new Error('This account has been disabled. Please contact support.');
      case 'auth/too-many-requests':
        throw new Error('Too many failed attempts. Please try again later.');
      default:
        throw new Error('Failed to sign in. Please check your credentials.');
    }
  }
};

// Sign out function
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    
    if (__DEV__) {
      console.log('User signed out successfully');
    }
  } catch (error) {
    const authError = error as FirebaseAuthError;
    console.error('Sign out error:', authError.message);
    throw new Error('Failed to sign out. Please try again.');
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Get current user profile
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return null;
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      console.warn('User profile not found for current user');
      return null;
    }

    return userDoc.data() as UserProfile;
  } catch (error) {
    console.error('Error getting current user profile:', error);
    return null;
  }
};

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Google Sign In with Popup (for web)
export const signInWithGoogle = async (): Promise<{ user: User; profile: UserProfile }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user profile exists
    let userProfile = await getCurrentUserProfile();
    
    // If no profile exists, create one with default role
    if (!userProfile) {
      const now = new Date().toISOString();
      const defaultProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        role: 'patient', // Default role, can be changed later
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        createdAt: now,
        updatedAt: now,
      };
      
      // Save user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), defaultProfile);
      userProfile = defaultProfile;
    }

    if (__DEV__) {
      console.log('User signed in with Google successfully:', user.uid);
    }

    return { user, profile: userProfile };
  } catch (error) {
    const authError = error as FirebaseAuthError;
    console.error('Google sign in error:', authError.message);
    
    // Handle specific Google auth errors
    switch (authError.code) {
      case 'auth/popup-closed-by-user':
        throw new Error('Sign in was cancelled. Please try again.');
      case 'auth/popup-blocked':
        throw new Error('Popup was blocked by your browser. Please allow popups and try again.');
      case 'auth/cancelled-popup-request':
        throw new Error('Sign in was cancelled. Please try again.');
      case 'auth/account-exists-with-different-credential':
        throw new Error('An account already exists with this email address. Please sign in with your existing method.');
      default:
        throw new Error('Failed to sign in with Google. Please try again.');
    }
  }
};

// Google Sign In with Redirect (for mobile)
export const signInWithGoogleRedirect = async (): Promise<void> => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    const authError = error as FirebaseAuthError;
    console.error('Google redirect sign in error:', authError.message);
    throw new Error('Failed to initiate Google sign in. Please try again.');
  }
};

// Handle Google Sign In Redirect Result
export const handleGoogleRedirectResult = async (): Promise<{ user: User; profile: UserProfile } | null> => {
  try {
    const result = await getRedirectResult(auth);
    
    if (!result) {
      return null;
    }
    
    const user = result.user;
    
    // Check if user profile exists
    let userProfile = await getCurrentUserProfile();
    
    // If no profile exists, create one with default role
    if (!userProfile) {
      const now = new Date().toISOString();
      const defaultProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        role: 'patient', // Default role, can be changed later
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        createdAt: now,
        updatedAt: now,
      };
      
      // Save user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), defaultProfile);
      userProfile = defaultProfile;
    }

    if (__DEV__) {
      console.log('User signed in with Google redirect successfully:', user.uid);
    }

    return { user, profile: userProfile };
  } catch (error) {
    const authError = error as FirebaseAuthError;
    console.error('Google redirect result error:', authError.message);
    throw new Error('Failed to complete Google sign in. Please try again.');
  }
};

// Auth state change listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Check if user has specific role
export const hasRole = async (role: UserRole): Promise<boolean> => {
  try {
    const profile = await getCurrentUserProfile();
    return profile?.role === role;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};
