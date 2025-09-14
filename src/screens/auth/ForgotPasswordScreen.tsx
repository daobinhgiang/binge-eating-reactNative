import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Snackbar,
  IconButton,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';

// Navigation types
interface ForgotPasswordScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

// Form validation schema
const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

// Form data interface
interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const watchedEmail = watch('email');

  // Clear error
  const clearError = () => setError(null);

  // Handle form submission
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      await sendPasswordResetEmail(auth, data.email);
      setIsEmailSent(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many requests. Please try again later.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection and try again.');
          break;
        default:
          setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend email
  const handleResendEmail = () => {
    setIsEmailSent(false);
    setError(null);
  };

  // Handle back to login
  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  // Handle go back
  const handleGoBack = () => {
    navigation.goBack();
  };

  if (isEmailSent) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <IconButton
                icon="arrow-left"
                size={24}
                onPress={handleGoBack}
                style={styles.backButton}
              />
              <Title style={styles.title}>Check Your Email</Title>
              <Paragraph style={styles.subtitle}>
                We've sent a password reset link to
              </Paragraph>
              <Text style={styles.emailText}>{watchedEmail}</Text>
            </View>

            {/* Success Card */}
            <Card style={styles.card}>
              <Card.Content style={styles.successContent}>
                <View style={styles.successIcon}>
                  <IconButton
                    icon="email-check"
                    size={48}
                    iconColor="#27ae60"
                  />
                </View>
                <Title style={styles.successTitle}>Email Sent Successfully!</Title>
                <Paragraph style={styles.successDescription}>
                  Please check your email and click the link to reset your password.
                  The link will expire in 1 hour for security reasons.
                </Paragraph>
                
                <View style={styles.instructionsContainer}>
                  <Text style={styles.instructionsTitle}>Next Steps:</Text>
                  <Text style={styles.instructionItem}>
                    • Check your email inbox (and spam folder)
                  </Text>
                  <Text style={styles.instructionItem}>
                    • Click the "Reset Password" link in the email
                  </Text>
                  <Text style={styles.instructionItem}>
                    • Create a new secure password
                  </Text>
                  <Text style={styles.instructionItem}>
                    • Sign in with your new password
                  </Text>
                </View>
              </Card.Content>
            </Card>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                onPress={handleResendEmail}
                style={styles.resendButton}
                contentStyle={styles.buttonContent}
              >
                Resend Email
              </Button>
              <Button
                mode="contained"
                onPress={handleBackToLogin}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
              >
                Back to Login
              </Button>
            </View>

            {/* Help Text */}
            <View style={styles.helpContainer}>
              <Text style={styles.helpText}>
                Didn't receive the email? Check your spam folder or try resending.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Error Snackbar */}
        <Snackbar
          visible={!!error}
          onDismiss={clearError}
          duration={5000}
          style={styles.snackbar}
        >
          {error}
        </Snackbar>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={handleGoBack}
              style={styles.backButton}
            />
            <Title style={styles.title}>Forgot Password?</Title>
            <Paragraph style={styles.subtitle}>
              No worries! Enter your email address and we'll send you a link to reset your password.
            </Paragraph>
          </View>

          {/* Reset Form */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.formIcon}>
                <IconButton
                  icon="lock-reset"
                  size={48}
                  iconColor="#3498db"
                />
              </View>
              
              <Title style={styles.formTitle}>Reset Your Password</Title>
              <Paragraph style={styles.formDescription}>
                Enter the email address associated with your account and we'll send you a secure link to reset your password.
              </Paragraph>

              {/* Email Input */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Email Address"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    error={!!errors.email}
                    style={styles.input}
                    left={<TextInput.Icon icon="email" />}
                    placeholder="Enter your email address"
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}

              {/* Reset Button */}
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || isLoading}
                style={styles.resetButton}
                contentStyle={styles.buttonContent}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </Card.Content>
          </Card>

          {/* Back to Login */}
          <View style={styles.backToLoginContainer}>
            <Text style={styles.backToLoginText}>Remember your password? </Text>
            <Button
              mode="text"
              onPress={handleBackToLogin}
              labelStyle={styles.backToLoginButtonText}
            >
              Sign In
            </Button>
          </View>

          {/* Help Text */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              Having trouble? Make sure you're using the same email address you used to create your account.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Error Snackbar */}
      <Snackbar
        visible={!!error}
        onDismiss={clearError}
        duration={5000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498db',
    marginTop: 8,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  formIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  formDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  successContent: {
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 8,
  },
  successDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  instructionsContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  instructionItem: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    lineHeight: 20,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 12,
  },
  resetButton: {
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  resendButton: {
    borderRadius: 8,
  },
  loginButton: {
    borderRadius: 8,
  },
  backToLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backToLoginText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  backToLoginButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  helpContainer: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  snackbar: {
    backgroundColor: '#e74c3c',
  },
});

export default ForgotPasswordScreen;
