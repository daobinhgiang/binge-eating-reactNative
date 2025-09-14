import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ onBack }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.sectionText}>
            We collect information you provide directly to us, such as when you create an account, 
            complete check-ins, or use our educational modules. This includes:
          </Text>
          <Text style={styles.bulletPoint}>• Personal information (name, email, date of birth)</Text>
          <Text style={styles.bulletPoint}>• Health-related data (mood assessments, binge episodes)</Text>
          <Text style={styles.bulletPoint}>• Usage data (app interactions, feature usage)</Text>
          <Text style={styles.bulletPoint}>• Device information (platform, app version)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.sectionText}>
            We use your information to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide and improve our services</Text>
          <Text style={styles.bulletPoint}>• Track your progress and provide insights</Text>
          <Text style={styles.bulletPoint}>• Communicate with you about the app</Text>
          <Text style={styles.bulletPoint}>• Conduct research (with your consent)</Text>
          <Text style={styles.bulletPoint}>• Ensure app security and prevent fraud</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Data Sharing and Disclosure</Text>
          <Text style={styles.sectionText}>
            We do not sell your personal information. We may share your information:
          </Text>
          <Text style={styles.bulletPoint}>• With your healthcare provider (if applicable)</Text>
          <Text style={styles.bulletPoint}>• For research purposes (anonymized, with consent)</Text>
          <Text style={styles.bulletPoint}>• To comply with legal obligations</Text>
          <Text style={styles.bulletPoint}>• To protect our rights and safety</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.sectionText}>
            We implement appropriate security measures to protect your information:
          </Text>
          <Text style={styles.bulletPoint}>• Encryption in transit and at rest</Text>
          <Text style={styles.bulletPoint}>• Access controls and authentication</Text>
          <Text style={styles.bulletPoint}>• Regular security audits</Text>
          <Text style={styles.bulletPoint}>• Staff training on data protection</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.sectionText}>
            You have the right to:
          </Text>
          <Text style={styles.bulletPoint}>• Access your personal data</Text>
          <Text style={styles.bulletPoint}>• Correct inaccurate information</Text>
          <Text style={styles.bulletPoint}>• Delete your data (right to erasure)</Text>
          <Text style={styles.bulletPoint}>• Export your data (data portability)</Text>
          <Text style={styles.bulletPoint}>• Withdraw consent at any time</Text>
          <Text style={styles.bulletPoint}>• Object to processing</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Data Retention</Text>
          <Text style={styles.sectionText}>
            We retain your information for as long as necessary to provide our services 
            and comply with legal obligations. Health data is typically retained for 7 years 
            after the last activity, unless you request earlier deletion.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
          <Text style={styles.sectionText}>
            Our services are not intended for children under 13. We do not knowingly 
            collect personal information from children under 13.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
          <Text style={styles.sectionText}>
            We may update this privacy policy from time to time. We will notify you 
            of any material changes by posting the new policy in the app and updating 
            the "Last updated" date.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Contact Us</Text>
          <Text style={styles.sectionText}>
            If you have any questions about this privacy policy or our data practices, 
            please contact us at:
          </Text>
          <Text style={styles.contactInfo}>
            Email: privacy@bingeatingapp.com{'\n'}
            Phone: 1-800-HELP-BED{'\n'}
            Address: 123 Health Street, Wellness City, WC 12345
          </Text>
        </View>
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
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 16,
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginTop: 8,
    fontFamily: 'monospace',
  },
});

export default PrivacyPolicyScreen;
