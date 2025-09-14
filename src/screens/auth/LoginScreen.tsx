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
  RadioButton,
  ActivityIndicator,
  Snackbar,
  Divider,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

// Navigation types
interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

// Form validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: yup
    .string()
    .oneOf(['patient', 'clinician'], 'Please select a role')
    .required('Role selection is required'),
});

// Form data interface
interface LoginFormData {
  email: string;
  password: string;
  role: UserRole;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      role: 'patient',
    },
  });

  const watchedRole = watch('role');

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      // Navigation will be handled by the auth state change in AuthContext
    } catch (error) {
      // Error is handled by the AuthContext
      console.error('Login error:', error);
    }
  };

  // Handle forgot password navigation
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  // Handle sign up navigation
  const handleSignUp = () => {
    navigation.navigate('Register');
  };

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
            <Title style={styles.title}>Welcome Back</Title>
            <Paragraph style={styles.subtitle}>
              Sign in to your account to continue
            </Paragraph>
          </View>

          {/* Login Form */}
          <Card style={styles.card}>
            <Card.Content>
              {/* Role Selection */}
              <View style={styles.roleSection}>
                <Text style={styles.sectionTitle}>I am a:</Text>
                <Controller
                  control={control}
                  name="role"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.roleContainer}>
                      <View style={styles.roleOption}>
                        <RadioButton
                          value="patient"
                          status={value === 'patient' ? 'checked' : 'unchecked'}
                          onPress={() => onChange('patient')}
                        />
                        <Text style={styles.roleLabel}>Patient</Text>
                      </View>
                      <View style={styles.roleOption}>
                        <RadioButton
                          value="clinician"
                          status={value === 'clinician' ? 'checked' : 'unchecked'}
                          onPress={() => onChange('clinician')}
                        />
                        <Text style={styles.roleLabel}>Clinician</Text>
                      </View>
                    </View>
                  )}
                />
                {errors.role && (
                  <Text style={styles.errorText}>{errors.role.message}</Text>
                )}
              </View>

              <Divider style={styles.divider} />

              {/* Email Input */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Email"
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
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}

              {/* Password Input */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Password"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    mode="outlined"
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    error={!!errors.password}
                    style={styles.input}
                    left={<TextInput.Icon icon="lock" />}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}

              {/* Forgot Password Link */}
              <Button
                mode="text"
                onPress={handleForgotPassword}
                style={styles.forgotPasswordButton}
                labelStyle={styles.forgotPasswordText}
              >
                Forgot Password?
              </Button>

              {/* Login Button */}
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || isLoading}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Card.Content>
          </Card>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <Button
              mode="text"
              onPress={handleSignUp}
              labelStyle={styles.signUpButtonText}
            >
              Sign Up
            </Button>
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
    justifyContent: 'center',
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  card: {
    elevation: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  roleSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 8,
  },
  divider: {
    marginVertical: 20,
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#3498db',
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  signUpButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  snackbar: {
    backgroundColor: '#e74c3c',
  },
});

export default LoginScreen;
