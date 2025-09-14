import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context';

/**
 * Example component demonstrating how to use the AuthContext
 * This component shows all the available authentication methods
 */
export const AuthExample: React.FC = () => {
  const {
    user,
    userProfile,
    isAuthenticated,
    isLoading,
    login,
    signup,
    loginWithGoogle,
    handleGoogleRedirect,
    logout,
    error,
    clearError,
    isPatient,
    isClinician,
  } = useAuth();

  // Form state for email/password login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Handle email/password login
  const handleLogin = async () => {
    try {
      await login(email, password);
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Login failed');
    }
  };

  // Handle email/password signup
  const handleSignup = async () => {
    try {
      await signup(email, password, 'patient', {
        firstName,
        lastName,
      });
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Signup failed');
    }
  };

  // Handle Google login (popup for web)
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      Alert.alert('Success', 'Logged in with Google successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Google login failed');
    }
  };

  // Handle Google login redirect (for mobile)
  const handleGoogleRedirectPress = async () => {
    try {
      await handleGoogleRedirect();
      // Note: The actual login will be handled by handleGoogleRedirectResult
      // when the user returns from the redirect
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Google redirect failed');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'Logged out successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Logout failed');
    }
  };

  // Clear error
  const handleClearError = () => {
    clearError();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isAuthenticated && user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.userInfo}>Email: {user.email}</Text>
        <Text style={styles.userInfo}>UID: {user.uid}</Text>
        {userProfile && (
          <>
            <Text style={styles.userInfo}>Name: {userProfile.firstName} {userProfile.lastName}</Text>
            <Text style={styles.userInfo}>Role: {userProfile.role}</Text>
            <Text style={styles.userInfo}>
              Type: {isPatient ? 'Patient' : isClinician ? 'Clinician' : 'Unknown'}
            </Text>
          </>
        )}
        
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication Example</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearError}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Email/Password Login</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Sign Up</Text>
        
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Google Authentication</Text>
        
        <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogleLogin}>
          <Text style={styles.buttonText}>Login with Google (Popup)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogleRedirectPress}>
          <Text style={styles.buttonText}>Login with Google (Redirect)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#c62828',
    flex: 1,
  },
  clearButton: {
    backgroundColor: '#c62828',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  formContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
