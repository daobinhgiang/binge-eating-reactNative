# Firebase Setup Guide for Healthcare React Native App

This guide will help you set up Firebase for your Binge Eating Disorder (BED) healthcare app.

## Prerequisites

- A Google account
- Node.js and npm/yarn installed
- Expo CLI installed (`npm install -g @expo/cli`)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "bed-healthcare-app")
4. Choose whether to enable Google Analytics (recommended for healthcare apps)
5. Click "Create project"

## Step 2: Add Your App to Firebase

1. In your Firebase project dashboard, click "Add app" and select the web icon (</>)
2. Register your app with a nickname (e.g., "BED App Web")
3. **Important**: Do NOT check "Set up Firebase Hosting" for now
4. Click "Register app"

## Step 3: Get Firebase Configuration

1. Copy the Firebase configuration object that appears
2. You'll see something like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef...",
  measurementId: "G-XXXXXXXXXX"
};
```

## Step 4: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and replace the placeholder values with your actual Firebase config:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef...
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

## Step 5: Enable Authentication

1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Optionally enable other providers (Google, Apple, etc.)

## Step 6: Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database (choose the closest to your users)

## Step 7: Configure Security Rules (Important for Healthcare Apps)

### Firestore Security Rules

Replace the default rules with these healthcare-appropriate rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Patient check-ins are private to the patient and their assigned clinician
    match /checkIns/{checkInId} {
      allow read, write: if request.auth != null && 
        (resource.data.patientId == request.auth.uid || 
         isAssignedClinician(request.auth.uid, resource.data.patientId));
    }
    
    // Education modules are readable by all authenticated users
    match /educationModules/{moduleId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && hasRole('clinician');
    }
    
    // Patient progress is accessible by the patient and their clinician
    match /patientProgress/{progressId} {
      allow read, write: if request.auth != null && 
        (resource.data.patientId == request.auth.uid || 
         isAssignedClinician(request.auth.uid, resource.data.patientId));
    }
    
    // Helper function to check if user is assigned clinician
    function isAssignedClinician(clinicianId, patientId) {
      return exists(/databases/$(database)/documents/clinicianPatientRelations/$(clinicianId + '_' + patientId));
    }
    
    // Helper function to check user role
    function hasRole(role) {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
  }
}
```

## Step 8: Test Your Configuration

1. Start your development server:
   ```bash
   npm start
   ```

2. Check the console for "Firebase initialized successfully" message
3. Try creating a test user account through your app

## Step 9: Production Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use different Firebase projects for development, staging, and production
- Consider using Expo's environment variables for different build types

### Security
- Review and tighten Firestore security rules before production
- Enable App Check for additional security
- Set up proper user roles and permissions
- Consider implementing audit logging for healthcare compliance

### Compliance
- Ensure your Firebase project complies with healthcare regulations (HIPAA, GDPR, etc.)
- Enable audit logging
- Set up proper data retention policies
- Consider Firebase's Business Associate Agreement (BAA) if handling PHI

## Troubleshooting

### Common Issues

1. **"Firebase not initialized" error**
   - Check that all environment variables are set correctly
   - Ensure variables have `EXPO_PUBLIC_` prefix
   - Restart your development server after changing `.env`

2. **Authentication not working**
   - Verify Email/Password is enabled in Firebase Console
   - Check that your app is properly registered
   - Ensure security rules allow user creation

3. **Firestore permission denied**
   - Review your security rules
   - Check that users are properly authenticated
   - Verify user roles are set correctly

### Getting Help

- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

## Next Steps

1. Set up user authentication flows
2. Create data models for your healthcare app
3. Implement proper error handling
4. Add offline support with Firestore
5. Set up push notifications
6. Configure analytics and monitoring

---

**Important**: This is a healthcare application handling sensitive patient data. Ensure you follow all applicable regulations and best practices for data security and privacy.