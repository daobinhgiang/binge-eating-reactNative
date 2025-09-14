import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { MainTabParamList } from '../types';

// Import patient screens (these will be created later)
// For now, we'll create placeholder components
import { View, Text, StyleSheet } from 'react-native';

// Placeholder components - replace with actual screens when created
const EducationScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Education Screen</Text>
  </View>
);

const CheckInScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Check-in Screen</Text>
  </View>
);

const ProgressScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Progress Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Profile Screen</Text>
  </View>
);

const Tab = createBottomTabNavigator<MainTabParamList>();

const PatientTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Education"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Education':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'CheckIn':
              iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
              break;
            case 'Progress':
              iconName = focused ? 'trending-up' : 'trending-up-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1', // Indigo-500
        tabBarInactiveTintColor: '#9ca3af', // Gray-400
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb', // Gray-200
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          paddingTop: 5,
          height: Platform.OS === 'ios' ? 85 : 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#111827', // Gray-900
        },
        headerTintColor: '#6366f1',
      })}
    >
      <Tab.Screen
        name="Education"
        component={EducationScreen}
        options={{
          title: 'Education',
          headerTitle: 'Learning Modules',
        }}
      />
      <Tab.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={{
          title: 'Check-in',
          headerTitle: 'Daily Check-in',
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: 'Progress',
          headerTitle: 'Your Progress',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerTitle: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb', // Gray-50
  },
  placeholderText: {
    fontSize: 18,
    color: '#6b7280', // Gray-500
    fontWeight: '500',
  },
});

export default PatientTabNavigator;
