import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  signUp, 
  signIn, 
  signOutUser, 
  getCurrentUser, 
  getCurrentUserProfile, 
  onAuthStateChange,
  signInWithGoogle,
  signInWithGoogleRedirect,
  handleGoogleRedirectResult,
  UserProfile,
  AuthError 
} from '../services/auth';
import { UserRole } from '../types';

// Authentication context types
export interface AuthContextType {
  // User state
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Authentication methods
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole, profileData: SignupData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGoogleRedirect: () => Promise<void>;
  handleGoogleRedirect: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  
  // Role checking
  hasRole: (role: UserRole) => boolean;
  isPatient: boolean;
  isClinician: boolean;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

// Signup data interface
export interface SignupData {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phoneNumber?: string;
}

// Context creation
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State management
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Computed values
  const isAuthenticated = user !== null;
  const isPatient = userProfile?.role === 'patient';
  const isClinician = userProfile?.role === 'clinician';

  // Error handling
  const clearError = () => setError(null);

  // Handle authentication errors
  const handleAuthError = (error: unknown) => {
    console.error('Authentication error:', error);
    
    if (error instanceof Error) {
      setError(error.message);
    } else if (typeof error === 'string') {
      setError(error);
    } else {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // Load user profile
  const loadUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const profile = await getCurrentUserProfile();
      if (profile) {
        setUserProfile(profile);
      } else {
        console.warn('User profile not found for authenticated user');
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
    }
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (user) {
      await loadUserProfile(user);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { user: firebaseUser, profile } = await signIn(email, password);
      setUser(firebaseUser);
      setUserProfile(profile);
      
      if (__DEV__) {
        console.log('User logged in successfully:', firebaseUser.uid);
      }
    } catch (error) {
      handleAuthError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (
    email: string, 
    password: string, 
    role: UserRole, 
    profileData: SignupData
  ) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { user: firebaseUser, profile } = await signUp(email, password, role, profileData);
      setUser(firebaseUser);
      setUserProfile(profile);
      
      if (__DEV__) {
        console.log('User signed up successfully:', firebaseUser.uid);
      }
    } catch (error) {
      handleAuthError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign In with Popup (for web)
  const loginWithGoogle = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { user: firebaseUser, profile } = await signInWithGoogle();
      setUser(firebaseUser);
      setUserProfile(profile);
      
      if (__DEV__) {
        console.log('User signed in with Google successfully:', firebaseUser.uid);
      }
    } catch (error) {
      handleAuthError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign In with Redirect (for mobile)
  const loginWithGoogleRedirect = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      await signInWithGoogleRedirect();
      
      if (__DEV__) {
        console.log('Google redirect initiated');
      }
    } catch (error) {
      handleAuthError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Redirect Result
  const handleGoogleRedirect = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const result = await handleGoogleRedirectResult();
      if (result) {
        const { user: firebaseUser, profile } = result;
        setUser(firebaseUser);
        setUserProfile(profile);
        
        if (__DEV__) {
          console.log('User signed in with Google redirect successfully:', firebaseUser.uid);
        }
      }
    } catch (error) {
      handleAuthError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      await signOutUser();
      setUser(null);
      setUserProfile(null);
      
      if (__DEV__) {
        console.log('User logged out successfully');
      }
    } catch (error) {
      handleAuthError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has specific role
  const hasRole = (role: UserRole): boolean => {
    return userProfile?.role === role;
  };

  // Initialize authentication state
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Set up auth state listener
        unsubscribe = onAuthStateChange(async (firebaseUser) => {
          if (firebaseUser) {
            setUser(firebaseUser);
            await loadUserProfile(firebaseUser);
          } else {
            setUser(null);
            setUserProfile(null);
          }
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error initializing authentication:', error);
        setError('Failed to initialize authentication');
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Context value
  const contextValue: AuthContextType = {
    // User state
    user,
    userProfile,
    isAuthenticated,
    isLoading,
    
    // Authentication methods
    login,
    signup,
    loginWithGoogle,
    loginWithGoogleRedirect,
    handleGoogleRedirect,
    logout,
    refreshUserProfile,
    
    // Role checking
    hasRole,
    isPatient,
    isClinician,
    
    // Error handling
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export the context for advanced usage
export { AuthContext };
