import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { ConsentScreenProps, ConsentPreferences } from '../../types';

const ConsentScreen: React.FC<ConsentScreenProps> = ({
  onConsentChange,
  initialPreferences,
  onComplete,
  onDecline,
}) => {
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    id: '',
    userId: '',
    analytics: {
      enabled: false,
      dataRetentionPeriod: 365,
    },
    marketing: {
      enabled: false,
      email: false,
      push: false,
      sms: false,
    },
    dataProcessing: {
      enabled: false,
      research: false,
      improvement: false,
      thirdParty: false,
    },
    privacy: {
      dataAnonymization: true,
      dataMinimization: true,
      rightToErasure: true,
      dataPortability: true,
    },
    consentVersion: '1.0',
    lastUpdated: new Date() as any,
  });

  useEffect(() => {
    if (initialPreferences) {
      setPreferences(prev => ({ ...prev, ...initialPreferences }));
    }
  }, [initialPreferences]);

  const handlePreferenceChange = (section: keyof ConsentPreferences, field: string, value: any) => {
    const newPreferences = {
      ...preferences,
      [section]: {
        ...(preferences[section] as any),
        [field]: value,
      },
    };
    setPreferences(newPreferences);
    onConsentChange(newPreferences);
  };

  const handleNestedPreferenceChange = (
    section: keyof ConsentPreferences,
    subsection: string,
    field: string,
    value: any
  ) => {
    const newPreferences = {
      ...preferences,
      [section]: {
        ...(preferences[section] as any),
        [subsection]: {
          ...((preferences[section] as any)[subsection] as any),
          [field]: value,
        },
      },
    };
    setPreferences(newPreferences);
    onConsentChange(newPreferences);
  };

  const handleComplete = () => {
    if (!preferences.analytics.enabled && !preferences.marketing.enabled && !preferences.dataProcessing.enabled) {
      Alert.alert(
        'Consent Required',
        'Please enable at least one consent option to continue using the app.',
        [{ text: 'OK' }]
      );
      return;
    }
    onComplete();
  };

  const renderConsentSection = (
    title: string,
    description: string,
    enabled: boolean,
    onToggle: (value: boolean) => void,
    children?: React.ReactNode
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={enabled ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
      <Text style={styles.sectionDescription}>{description}</Text>
      {enabled && children}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Privacy & Consent</Text>
        <Text style={styles.subtitle}>
          We respect your privacy and want you to understand how we use your data.
        </Text>
      </View>

      {renderConsentSection(
        'Analytics & Usage Data',
        'Help us improve the app by sharing anonymous usage data. No personal information is collected.',
        preferences.analytics.enabled,
        (value) => handlePreferenceChange('analytics', 'enabled', value),
        <View style={styles.subsection}>
          <Text style={styles.subsectionText}>
            • App performance and crash reports{'\n'}
            • Feature usage statistics{'\n'}
            • Anonymous user journey data
          </Text>
        </View>
      )}

      {renderConsentSection(
        'Marketing Communications',
        'Receive updates about new features, educational content, and app improvements.',
        preferences.marketing.enabled,
        (value) => handlePreferenceChange('marketing', 'enabled', value),
        <View style={styles.subsection}>
          <View style={styles.checkboxRow}>
            <Text style={styles.checkboxLabel}>Email notifications</Text>
            <Switch
              value={preferences.marketing.email}
              onValueChange={(value) => handleNestedPreferenceChange('marketing', 'marketing', 'email', value)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={preferences.marketing.email ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          <View style={styles.checkboxRow}>
            <Text style={styles.checkboxLabel}>Push notifications</Text>
            <Switch
              value={preferences.marketing.push}
              onValueChange={(value) => handleNestedPreferenceChange('marketing', 'marketing', 'push', value)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={preferences.marketing.push ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>
      )}

      {renderConsentSection(
        'Data Processing & Research',
        'Allow us to process your data for research and app improvement purposes.',
        preferences.dataProcessing.enabled,
        (value) => handlePreferenceChange('dataProcessing', 'enabled', value),
        <View style={styles.subsection}>
          <View style={styles.checkboxRow}>
            <Text style={styles.checkboxLabel}>Research participation</Text>
            <Switch
              value={preferences.dataProcessing.research}
              onValueChange={(value) => handleNestedPreferenceChange('dataProcessing', 'dataProcessing', 'research', value)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={preferences.dataProcessing.research ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          <View style={styles.checkboxRow}>
            <Text style={styles.checkboxLabel}>App improvement</Text>
            <Switch
              value={preferences.dataProcessing.improvement}
              onValueChange={(value) => handleNestedPreferenceChange('dataProcessing', 'dataProcessing', 'improvement', value)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={preferences.dataProcessing.improvement ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>
      )}

      <View style={styles.privacySection}>
        <Text style={styles.privacyTitle}>Your Privacy Rights</Text>
        <Text style={styles.privacyText}>
          • Data anonymization: Your data is anonymized before analysis{'\n'}
          • Data minimization: We only collect necessary data{'\n'}
          • Right to erasure: You can request data deletion{'\n'}
          • Data portability: You can export your data
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {onDecline && (
          <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.acceptButton} onPress={handleComplete}>
          <Text style={styles.acceptButtonText}>Accept & Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  subsection: {
    marginTop: 12,
    paddingLeft: 8,
  },
  subsectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  privacySection: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConsentScreen;
