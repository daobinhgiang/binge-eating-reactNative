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
  HelperText,
} from 'react-native-paper';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth, SignupData } from '../../context/AuthContext';
import { UserRole } from '../../types';

// Navigation types
interface SignUpScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

// Form data interface - make optional fields explicitly optional
interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  dateOfBirth?: string; // Optional
  phoneNumber?: string; // Optional
  agreeToTerms: boolean;
}

// Form validation schema - updated to match interface exactly
const signUpSchema: yup.ObjectSchema<SignUpFormData> = yup.object({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup
    .mixed<UserRole>()
    .oneOf(['patient', 'clinician'] as const, 'Please select a role')
    .required('Role selection is required'),
  dateOfBirth: yup
    .string()
    .optional()
    .test('age', 'You must be at least 18 years old', function(value) {
      if (!value) return true; // Optional field
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }),
  phoneNumber: yup
    .string()
    .optional()
    .matches(
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please enter a valid phone number'
    ),
  agreeToTerms: yup
    .boolean()
    .required('You must agree to the terms and conditions')
    .oneOf([true], 'You must agree to the terms and conditions'),
});

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { signup, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form setup with proper typing
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'patient' as UserRole,
      dateOfBirth: '',
      phoneNumber: '',
      agreeToTerms: false,
    },
  });

  const watchedRole = watch('role');
  const watchedPassword = watch('password');

  // Handle form submission with proper typing
  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      const { confirmPassword, agreeToTerms, ...signupData } = data;
      await signup(data.email, data.password, data.role, signupData);
      // Navigation will be handled by the auth state change in AuthContext
    } catch (error) {
      // Error is handled by the AuthContext
      console.error('Signup error:', error);
    }
  };

  // Handle login navigation
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '#e0e0e0' };
    if (password.length < 6) return { strength: 1, label: 'Weak', color: '#e74c3c' };
    if (password.length < 8) return { strength: 2, label: 'Fair', color: '#f39c12' };
    if (password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 3, label: 'Strong', color: '#27ae60' };
    }
    return { strength: 2, label: 'Fair', color: '#f39c12' };
  };

  const passwordStrength = getPasswordStrength(watchedPassword);

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
            <Title style={styles.title}>Create Account</Title>
            <Paragraph style={styles.subtitle}>
              Join us to start your journey
            </Paragraph>
          </View>

          {/* Sign Up Form */}
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

              {/* Name Fields */}
              <View style={styles.nameContainer}>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="First Name"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      mode="outlined"
                      autoCapitalize="words"
                      error={!!errors.firstName}
                      style={[styles.input, styles.halfInput]}
                      left={<TextInput.Icon icon="account" />}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Last Name"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      mode="outlined"
                      autoCapitalize="words"
                      error={!!errors.lastName}
                      style={[styles.input, styles.halfInput]}
                      left={<TextInput.Icon icon="account" />}
                    />
                  )}
                />
              </View>
              {(errors.firstName || errors.lastName) && (
                <Text style={styles.errorText}>
                  {errors.firstName?.message || errors.lastName?.message}
                </Text>
              )}

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
                    autoComplete="password-new"
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
              
              {/* Password Strength Indicator */}
              {watchedPassword && (
                <View style={styles.passwordStrengthContainer}>
                  <View style={styles.passwordStrengthBar}>
                    <View
                      style={[
                        styles.passwordStrengthFill,
                        {
                          width: `${(passwordStrength.strength / 3) * 100}%`,
                          backgroundColor: passwordStrength.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.passwordStrengthText, { color: passwordStrength.color }]}>
                    {passwordStrength.label}
                  </Text>
                </View>
              )}

              {/* Confirm Password Input */}
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Confirm Password"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    mode="outlined"
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="password-new"
                    error={!!errors.confirmPassword}
                    style={styles.input}
                    left={<TextInput.Icon icon="lock-check" />}
                    right={
                      <TextInput.Icon
                        icon={showConfirmPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    }
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
              )}

              {/* Optional Fields */}
              <Text style={styles.optionalSectionTitle}>Optional Information</Text>
              
              {/* Date of Birth */}
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Date of Birth"
                    value={value || ''}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    mode="outlined"
                    placeholder="YYYY-MM-DD"
                    error={!!errors.dateOfBirth}
                    style={styles.input}
                    left={<TextInput.Icon icon="calendar" />}
                  />
                )}
              />
              {errors.dateOfBirth && (
                <Text style={styles.errorText}>{errors.dateOfBirth.message}</Text>
              )}

              {/* Phone Number */}
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Phone Number"
                    value={value || ''}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    mode="outlined"
                    keyboardType="phone-pad"
                    error={!!errors.phoneNumber}
                    style={styles.input}
                    left={<TextInput.Icon icon="phone" />}
                  />
                )}
              />
              {errors.phoneNumber && (
                <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>
              )}

              {/* Terms and Conditions */}
              <Controller
                control={control}
                name="agreeToTerms"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.termsContainer}>
                    <RadioButton
                      value="agree"
                      status={value ? 'checked' : 'unchecked'}
                      onPress={() => onChange(!value)}
                    />
                    <Text style={styles.termsText}>
                      I agree to the{' '}
                      <Text style={styles.termsLink}>Terms and Conditions</Text>
                      {' '}and{' '}
                      <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>
                  </View>
                )}
              />
              {errors.agreeToTerms && (
                <Text style={styles.errorText}>{errors.agreeToTerms.message}</Text>
              )}

              {/* Sign Up Button */}
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || isLoading}
                style={styles.signUpButton}
                contentStyle={styles.buttonContent}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  'Create Account'
                )}
              </Button>
            </Card.Content>
          </Card>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Button
              mode="text"
              onPress={handleLogin}
              labelStyle={styles.loginButtonText}
            >
              Sign In
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
    padding: 20,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
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
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
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
  passwordStrengthContainer: {
    marginTop: -8,
    marginBottom: 16,
  },
  passwordStrengthBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 4,
  },
  passwordStrengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  optionalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 16,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 8,
    lineHeight: 20,
  },
  termsLink: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  signUpButton: {
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  loginButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  snackbar: {
    backgroundColor: '#e74c3c',
  },
});

export default SignUpScreen;