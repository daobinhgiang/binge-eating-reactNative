# Navigation Structure

This directory contains the main navigation components for the Binge Eating Disorder app, built with React Navigation v7.

## Architecture Overview

The navigation follows a role-based architecture that automatically switches between different user experiences based on authentication state and user role.

```
AppNavigator (Root)
├── AuthNavigator (Unauthenticated users)
│   ├── LoginScreen
│   ├── SignUpScreen
│   └── ForgotPasswordScreen
└── Main (Authenticated users)
    ├── PatientTabNavigator (Patient role)
    │   ├── Education
    │   ├── Check-in
    │   ├── Progress
    │   └── Profile
    └── ClinicianTabNavigator (Clinician role)
        ├── Dashboard
        ├── Patients
        ├── Analytics
        └── Profile
```

## Components

### 1. AppNavigator.tsx
The main navigator that handles:
- Authentication state checking
- Role-based navigation switching
- Loading screen display
- Navigation container setup

**Key Features:**
- Integrates with `AuthContext` for user state
- Shows loading screen while checking auth state
- Automatically switches between auth and main flows
- Role-based navigation (patient vs clinician)

### 2. AuthNavigator.tsx
Stack navigator for unauthenticated users:
- Login screen
- Registration screen
- Forgot password screen

**Key Features:**
- Clean stack navigation
- Modal presentation for forgot password
- Consistent styling and animations

### 3. PatientTabNavigator.tsx
Bottom tab navigator for patients:
- **Education**: Learning modules and resources
- **Check-in**: Daily mood and symptom tracking
- **Progress**: Personal progress tracking and insights
- **Profile**: User profile and settings

**Key Features:**
- Indigo color scheme for patients
- Intuitive icons and labels
- Responsive design for different screen sizes

### 4. ClinicianTabNavigator.tsx
Bottom tab navigator for clinicians:
- **Dashboard**: Overview of patient data and alerts
- **Patients**: Patient management and communication
- **Analytics**: Reports and data analysis
- **Profile**: Clinician profile and settings

**Key Features:**
- Emerald color scheme for clinicians
- Professional icons and layout
- Optimized for clinical workflow

## TypeScript Integration

All navigators use proper TypeScript typing with:
- `RootStackParamList` for main app navigation
- `AuthStackParamList` for authentication flow
- `MainTabParamList` for tab navigation
- Full type safety for navigation parameters

## Styling and Theming

### Color Schemes
- **Patient**: Indigo (#6366f1) - Calming, supportive
- **Clinician**: Emerald (#059669) - Professional, trustworthy
- **Common**: Gray tones for neutral elements

### Design Principles
- Consistent spacing and typography
- Platform-specific adaptations (iOS/Android)
- Accessible color contrasts
- Clean, modern interface

## Integration with AuthContext

The navigation system integrates seamlessly with the `AuthContext`:

```typescript
const { isAuthenticated, isLoading, isPatient, isClinician } = useAuth();
```

**Navigation Logic:**
1. Show loading screen while `isLoading` is true
2. Show `AuthNavigator` when `!isAuthenticated`
3. Show `PatientTabNavigator` when `isPatient` is true
4. Show `ClinicianTabNavigator` when `isClinician` is true

## Usage

### Basic Setup
```typescript
import { AppNavigator } from './src/navigation';

// In your main App component
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
```

### Navigation Between Screens
```typescript
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const MyComponent = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  
  const handleNavigate = () => {
    navigation.navigate('Register');
  };
};
```

## Screen Placeholders

Currently, the tab navigators use placeholder components for screens that haven't been implemented yet. These should be replaced with actual screen components as they're developed:

- Patient screens: `EducationScreen`, `CheckInScreen`, `ProgressScreen`, `ProfileScreen`
- Clinician screens: `DashboardScreen`, `PatientsScreen`, `AnalyticsScreen`, `ProfileScreen`

## Future Enhancements

1. **Deep Linking**: Add support for deep linking to specific screens
2. **Nested Navigation**: Add stack navigators within tabs for complex flows
3. **Modal Presentations**: Add modal screens for specific workflows
4. **Gesture Navigation**: Enhance gesture-based navigation
5. **Accessibility**: Improve accessibility features and screen reader support

## Dependencies

- `@react-navigation/native`: Core navigation library
- `@react-navigation/stack`: Stack navigator
- `@react-navigation/bottom-tabs`: Tab navigator
- `react-native-safe-area-context`: Safe area handling
- `@expo/vector-icons`: Icon library
