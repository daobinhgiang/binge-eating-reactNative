# Services Directory

This directory contains all the service modules for the Binge Eating Disorder healthcare app, including Firebase configuration, authentication, and other external service integrations.

## Files

### `firebase.ts`
Main Firebase configuration and initialization file.

**Features:**
- Environment variable-based configuration
- Fallback values for missing configuration
- Error handling for missing required fields
- Support for both `expo-constants` and `process.env` approaches
- Proper TypeScript typing

**Usage:**
```typescript
import { auth, db } from './services/firebase';

// Use Firebase Auth
const user = auth.currentUser;

// Use Firestore
const docRef = doc(db, 'users', 'userId');
```

### `auth.ts`
Authentication service with comprehensive user management.

**Features:**
- User registration with role assignment
- Email/password authentication
- User profile management
- Role-based access control
- Comprehensive error handling
- TypeScript interfaces for type safety

**Usage:**
```typescript
import { signUp, signIn, signOut, getCurrentUser } from './services/auth';

// Sign up a new user
const { user, profile } = await signUp(
  'user@example.com',
  'password123',
  'patient',
  {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01'
  }
);

// Sign in existing user
const { user, profile } = await signIn('user@example.com', 'password123');

// Sign out
await signOut();

// Get current user
const currentUser = getCurrentUser();
```

### `index.ts`
Central export file for all services.

**Exports:**
- `firebase` - Default Firebase app instance
- `auth` - Firebase Auth instance
- `db` - Firestore database instance
- All authentication functions from `auth.ts`

## Environment Variables

The Firebase configuration uses environment variables with the `EXPO_PUBLIC_` prefix:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Setup Instructions

1. Copy `.env.example` to `.env`
2. Fill in your Firebase configuration values
3. Ensure Firebase project is properly configured
4. Run the app and check console for "Firebase initialized successfully"

## Error Handling

All services include comprehensive error handling:

- **Configuration errors**: Clear messages for missing environment variables
- **Authentication errors**: User-friendly error messages for common auth issues
- **Network errors**: Graceful handling of connection issues
- **Validation errors**: Proper validation of user input and data

## Security Considerations

- Environment variables are properly secured
- User data is validated before storage
- Role-based access control implemented
- Proper error messages that don't leak sensitive information

## Testing

Run tests with:
```bash
npm test
```

The `firebase.test.ts` file includes basic configuration tests to verify Firebase is properly initialized.

## Healthcare Compliance

This service layer is designed with healthcare compliance in mind:

- Secure handling of patient data
- Proper authentication and authorization
- Audit trail capabilities
- Error logging for compliance monitoring
- Role-based access for different user types (patients, clinicians)

## Troubleshooting

### Common Issues

1. **"Firebase not initialized"**
   - Check environment variables are set correctly
   - Ensure `.env` file exists and is properly formatted
   - Restart development server after changing environment variables

2. **Authentication errors**
   - Verify Firebase Auth is enabled in Firebase Console
   - Check that Email/Password authentication is enabled
   - Ensure security rules allow user creation

3. **Permission denied errors**
   - Review Firestore security rules
   - Check user authentication status
   - Verify user roles are properly set

### Debug Mode

Enable debug logging by setting `__DEV__` to true in your environment. This will provide additional console output for troubleshooting.

## Future Enhancements

- [ ] Add Firebase Analytics integration
- [ ] Implement push notifications
- [ ] Add offline support with Firestore
- [ ] Implement advanced security features
- [ ] Add audit logging capabilities
- [ ] Integrate with healthcare APIs
