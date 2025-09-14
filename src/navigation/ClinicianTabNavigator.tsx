import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { MainTabParamList } from '../types';

// Import clinician screens (these will be created later)
// For now, we'll create placeholder components
import { View, Text, StyleSheet } from 'react-native';

// Placeholder components - replace with actual screens when created
const DashboardScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Dashboard Screen</Text>
  </View>
);

const PatientsScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Patients Screen</Text>
  </View>
);

const AnalyticsScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Analytics Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Profile Screen</Text>
  </View>
);

const Tab = createBottomTabNavigator<MainTabParamList>();

const ClinicianTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'CheckIn': // This will be Patients for clinicians
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Progress': // This will be Analytics for clinicians
              iconName = focused ? 'analytics' : 'analytics-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#059669', // Emerald-600
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
        headerTintColor: '#059669',
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          headerTitle: 'Clinician Dashboard',
        }}
      />
      <Tab.Screen
        name="CheckIn" // This will show as "Patients" for clinicians
        component={PatientsScreen}
        options={{
          title: 'Patients',
          headerTitle: 'Patient Management',
        }}
      />
      <Tab.Screen
        name="Progress" // This will show as "Analytics" for clinicians
        component={AnalyticsScreen}
        options={{
          title: 'Analytics',
          headerTitle: 'Analytics & Reports',
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
    backgroundColor: '#f0fdf4', // Green-50
  },
  placeholderText: {
    fontSize: 18,
    color: '#6b7280', // Gray-500
    fontWeight: '500',
  },
});

export default ClinicianTabNavigator;
