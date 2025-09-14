import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ConsentPreferences, AnalyticsEvent } from '../../types';

interface ConsentContextType {
  preferences: ConsentPreferences | null;
  updatePreferences: (preferences: Partial<ConsentPreferences>) => void;
  hasConsent: (type: 'analytics' | 'marketing' | 'dataProcessing') => boolean;
  trackEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'consent' | 'user_context'>) => void;
  isConsentRequired: boolean;
  setConsentRequired: (required: boolean) => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

interface ConsentManagerProps {
  children: ReactNode;
  initialPreferences?: ConsentPreferences;
}

export const ConsentManager: React.FC<ConsentManagerProps> = ({
  children,
  initialPreferences,
}) => {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(initialPreferences || null);
  const [isConsentRequired, setIsConsentRequired] = useState<boolean>(!initialPreferences);

  const updatePreferences = (newPreferences: Partial<ConsentPreferences>) => {
    setPreferences(prev => {
      if (!prev) {
        // If no previous preferences, we need to create a complete ConsentPreferences object
        // This should only happen if we're initializing with partial data
        return null; // Let the parent component handle initial setup
      }
      
      return {
        ...prev,
        ...newPreferences,
        lastUpdated: new Date() as any,
      };
    });
  };

  const hasConsent = (type: 'analytics' | 'marketing' | 'dataProcessing'): boolean => {
    if (!preferences) return false;
    return preferences[type].enabled;
  };

  const trackEvent = (event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'consent' | 'user_context'>) => {
    // Only track if analytics consent is given
    if (!hasConsent('analytics')) {
      console.log('Analytics tracking disabled - no consent given');
      return;
    }

    const analyticsEvent: AnalyticsEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date() as any,
      consent: {
        analytics_consent: preferences?.analytics.enabled || false,
        marketing_consent: preferences?.marketing.enabled || false,
        data_processing_consent: preferences?.dataProcessing.enabled || false,
        consent_version: preferences?.consentVersion || '1.0',
        consent_timestamp: preferences?.lastUpdated || new Date() as any,
      },
      user_context: {
        user_role: preferences ? 'patient' : undefined, // This would be determined by actual user context
        is_authenticated: !!preferences,
        session_duration: 0, // This would be calculated from session start
      },
    };

    // Here you would send the event to your analytics service
    console.log('Analytics Event:', analyticsEvent);
    
    // Example: Send to analytics service
    // analyticsService.track(analyticsEvent);
  };

  const setConsentRequired = (required: boolean) => {
    setIsConsentRequired(required);
  };

  const value: ConsentContextType = {
    preferences,
    updatePreferences,
    hasConsent,
    trackEvent,
    isConsentRequired,
    setConsentRequired,
  };

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = (): ConsentContextType => {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentManager');
  }
  return context;
};

export default ConsentManager;
