# Authentication Context

This directory contains the React Context implementation for authentication state management in the Binge Eating Disorder App.

## Overview

The `AuthContext` provides a centralized way to manage user authentication state, including:

- User authentication state (logged in/out)
- User profile information
- User roles (patient/clinician)
- Loading states
- Error handling
- Google Authentication support
- State persistence

## Files

- `AuthContext.tsx` - Main authentication context implementation
- `index.ts` - Exports for the context
- `README.md` - This documentation

## Usage

### 1. Wrap your app with AuthProvider

```tsx
import React from 'react';
import { AuthProvider } from './src/context';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

### 2. Use the useAuth hook in components

```tsx
import React from 'react';
import { useAuth } from './src/context';

function LoginComponent() {
  const {
    user,
    userProfile,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    error,
    clearError
  } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isAuthenticated) {
    return (
      <View>
        <Text>Welcome, {userProfile?.firstName}!</Text>
        <Button onPress={logout} title="Logout" />
      </View>
    );
  }

  return (
    <View>
      <Button onPress={handleLogin} title="Login" />
      <Button onPress={handleGoogleLogin} title="Login with Google" />
    </View>
  );
}
```

## Available Methods

### Authentication Methods

- `login(email, password)` - Sign in with email and password
- `signup(email, password, role, profileData)` - Create new account
- `loginWithGoogle()` - Sign in with Google (popup for web)
- `loginWithGoogleRedirect()` - Sign in with Google (redirect for mobile)
- `handleGoogleRedirect()` - Handle Google redirect result
- `logout()` - Sign out current user
- `refreshUserProfile()` - Refresh user profile data

### State Properties

- `user` - Firebase user object (null if not authenticated)
- `userProfile` - User profile from Firestore (null if not authenticated)
- `isAuthenticated` - Boolean indicating if user is logged in
- `isLoading` - Boolean indicating if auth operation is in progress
- `error` - String containing current error message (null if no error)
- `isPatient` - Boolean indicating if user is a patient
- `isClinician` - Boolean indicating if user is a clinician

### Utility Methods

- `hasRole(role)` - Check if user has specific role
- `clearError()` - Clear current error message

## Google Authentication Setup

### 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Authentication > Sign-in method
4. Enable Google sign-in provider
5. Add your app's SHA-1 fingerprint (for Android)

### 2. Environment Variables

Make sure your Firebase configuration is properly set in your environment variables:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Platform-specific Setup

#### Web
Google authentication uses popup by default. Make sure popups are not blocked.

#### Mobile (iOS/Android)
Google authentication uses redirect flow. The `handleGoogleRedirect()` method should be called when the app loads to handle the redirect result.

## Error Handling

The context provides comprehensive error handling:

- All authentication methods throw errors that can be caught
- Error messages are user-friendly and localized
- The `error` state contains the current error message
- Use `clearError()` to clear error messages

## TypeScript Support

The context is fully typed with TypeScript interfaces:

- `AuthContextType` - Main context interface
- `SignupData` - Interface for signup form data
- `UserProfile` - User profile interface (from auth service)

## State Persistence

The authentication state is automatically persisted using Firebase's `onAuthStateChanged` listener. When the app loads, it will:

1. Check if there's a current user
2. Load the user profile from Firestore
3. Set the authentication state accordingly

## Example Implementation

See `src/components/AuthExample.tsx` for a complete example of how to use the AuthContext with all available methods.

## Security Notes

- User roles are stored in Firestore and validated on the client
- For production, implement server-side role validation
- Google OAuth tokens are handled automatically by Firebase
- Never store sensitive data in the context state
