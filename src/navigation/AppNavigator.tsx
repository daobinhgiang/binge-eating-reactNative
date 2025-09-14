import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types';

// Import navigators
import AuthNavigator from './AuthNavigator';
import PatientTabNavigator from './PatientTabNavigator';
import ClinicianTabNavigator from './ClinicianTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

// Loading screen component
const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#6366f1" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

// Main App Navigator with role-based navigation
const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, isPatient, isClinician } = useAuth();

  // Show loading screen while checking authentication state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#ffffff' },
        }}
      >
        {!isAuthenticated ? (
          // Show auth flow when user is not authenticated
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{
              animationTypeForReplace: 'push',
            }}
          />
        ) : isPatient ? (
          // Show patient tabs when user is authenticated as patient
          <Stack.Screen
            name="Main"
            component={PatientTabNavigator}
            options={{
              animationTypeForReplace: 'push',
            }}
          />
        ) : isClinician ? (
          // Show clinician tabs when user is authenticated as clinician
          <Stack.Screen
            name="Main"
            component={ClinicianTabNavigator}
            options={{
              animationTypeForReplace: 'push',
            }}
          />
        ) : (
          // Fallback - this shouldn't happen in normal flow
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{
              animationTypeForReplace: 'push',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default AppNavigator;
