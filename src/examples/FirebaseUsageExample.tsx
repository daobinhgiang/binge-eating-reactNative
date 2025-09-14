/**
 * Firebase Usage Example
 * 
 * This file demonstrates how to use the Firebase services in React components.
 * This is for reference only and should not be used in production.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { 
  signUp, 
  signIn, 
  signOut, 
  getCurrentUser, 
  getCurrentUserProfile,
  UserProfile 
} from '../services/auth';

const FirebaseUsageExample: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already signed in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadUserProfile();
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await getCurrentUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { user: newUser, profile } = await signUp(
        'test@example.com',
        'password123',
        'patient',
        {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          phoneNumber: '+1234567890'
        }
      );
      
      setUser(newUser);
      setUserProfile(profile);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { user: signedInUser, profile } = await signIn(
        'test@example.com',
        'password123'
      );
      
      setUser(signedInUser);
      setUserProfile(profile);
      Alert.alert('Success', 'Signed in successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
      setUserProfile(null);
      Alert.alert('Success', 'Signed out successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Services Example</Text>
      
      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.subtitle}>User Information</Text>
          <Text>Email: {user.email}</Text>
          <Text>UID: {user.uid}</Text>
          
          {userProfile && (
            <View style={styles.profileInfo}>
              <Text style={styles.subtitle}>Profile Information</Text>
              <Text>Name: {userProfile.firstName} {userProfile.lastName}</Text>
              <Text>Role: {userProfile.role}</Text>
              <Text>Created: {new Date(userProfile.createdAt).toLocaleDateString()}</Text>
            </View>
          )}
          
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            disabled={loading}
          />
        </View>
      ) : (
        <View style={styles.authButtons}>
          <Button
            title="Sign Up"
            onPress={handleSignUp}
            disabled={loading}
          />
          <Button
            title="Sign In"
            onPress={handleSignIn}
            disabled={loading}
          />
        </View>
      )}
      
      {loading && <Text>Loading...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },
  userInfo: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  profileInfo: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  authButtons: {
    gap: 10,
  },
});

export default FirebaseUsageExample;
