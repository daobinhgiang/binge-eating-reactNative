// Firebase Timestamp type for compatibility
export type Timestamp = {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
  toMillis(): number;
};

// User roles
export type UserRole = 'patient' | 'clinician';

// User interface
export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  profileImageUrl?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Patient-specific fields
  patientInfo?: {
    diagnosis?: string;
    treatmentStartDate?: Date;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
    medicalHistory?: string[];
    currentMedications?: string[];
  };
  
  // Clinician-specific fields
  clinicianInfo?: {
    licenseNumber: string;
    specialization: string[];
    yearsOfExperience: number;
    bio?: string;
    availability?: {
      timezone: string;
      workingHours: {
        start: string;
        end: string;
        days: string[];
      };
    };
  };
}

// Mood scale for check-ins
export type MoodScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// Binge episode severity
export type BingeSeverity = 'mild' | 'moderate' | 'severe';

// Coping strategy effectiveness
export type CopingEffectiveness = 'not_helpful' | 'somewhat_helpful' | 'helpful' | 'very_helpful';

// Check-in survey interface
export interface CheckInSurvey {
  id: string;
  patientId: string;
  completedAt: Timestamp;
  
  // Mood assessment
  mood: {
    overall: MoodScale;
    anxiety: MoodScale;
    depression: MoodScale;
    stress: MoodScale;
    selfEsteem: MoodScale;
  };
  
  // Binge eating episodes
  bingeEpisodes: {
    hadBingeEpisode: boolean;
    episodes: {
      date: Date;
      severity: BingeSeverity;
      triggers: string[];
      emotions: string[];
      duration: number; // in minutes
      foodTypes: string[];
      amount: 'small' | 'medium' | 'large' | 'excessive';
      location: string;
      aloneOrWithOthers: 'alone' | 'with_others' | 'mixed';
    }[];
  };
  
  // Triggers and coping strategies
  triggers: {
    emotional: string[];
    environmental: string[];
    social: string[];
    physical: string[];
    other: string[];
  };
  
  copingStrategies: {
    used: {
      strategy: string;
      effectiveness: CopingEffectiveness;
      duration: number; // in minutes
    }[];
    available: string[];
  };
  
  // Wellbeing indicators
  wellbeing: {
    sleepQuality: MoodScale;
    energyLevel: MoodScale;
    socialConnection: MoodScale;
    physicalActivity: {
      didExercise: boolean;
      duration?: number; // in minutes
      type?: string;
    };
    selfCare: {
      activities: string[];
      timeSpent: number; // in minutes
    };
  };
  
  // Additional notes
  notes?: string;
  goalsForToday?: string[];
  challenges?: string[];
  wins?: string[];
}

// Education module categories
export type EducationCategory = 
  | 'understanding_bed'
  | 'coping_strategies'
  | 'nutrition_guidance'
  | 'mindfulness'
  | 'therapy_techniques'
  | 'lifestyle_changes'
  | 'relapse_prevention'
  | 'family_support';

// Education module difficulty levels
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Education module interface
export interface EducationModule {
  id: string;
  title: string;
  description: string;
  content: {
    text: string;
    images?: string[];
    videos?: {
      url: string;
      duration: number; // in seconds
      thumbnail?: string;
    }[];
    audio?: {
      url: string;
      duration: number; // in seconds
    }[];
    interactiveElements?: {
      type: 'quiz' | 'reflection' | 'exercise';
      content: any;
    }[];
  };
  category: EducationCategory;
  difficulty: DifficultyLevel;
  readingTime: number; // in minutes
  prerequisites?: string[]; // module IDs
  tags: string[];
  isActive: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Completion tracking
  completionCriteria?: {
    minTimeSpent?: number; // in minutes
    requiredInteractions?: string[];
    quizPassed?: boolean;
  };
}

// Clinician-Patient relationship interface
export interface ClinicianPatientRelation {
  id: string;
  clinicianId: string;
  patientId: string;
  status: 'pending' | 'active' | 'inactive' | 'terminated';
  startDate: Timestamp;
  endDate?: Timestamp;
  notes?: string;
  
  // Treatment plan
  treatmentPlan?: {
    goals: string[];
    strategies: string[];
    frequency: {
      checkIns: 'daily' | 'weekly' | 'biweekly' | 'monthly';
      sessions: 'weekly' | 'biweekly' | 'monthly';
    };
    duration: number; // in weeks
    milestones: {
      description: string;
      targetDate: Date;
      completed: boolean;
      completedAt?: Timestamp;
    }[];
  };
  
  // Communication preferences
  communication: {
    preferredMethod: 'in_app' | 'email' | 'phone' | 'video_call';
    emergencyContact: boolean;
    notificationSettings: {
      checkInReminders: boolean;
      moduleAssignments: boolean;
      progressUpdates: boolean;
      emergencyAlerts: boolean;
    };
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Patient progress tracking interface
export interface PatientProgress {
  id: string;
  patientId: string;
  clinicianId?: string;
  
  // Module completion tracking
  completedModules: {
    moduleId: string;
    completedAt: Timestamp;
    timeSpent: number; // in minutes
    score?: number; // if module has assessment
    notes?: string;
  }[];
  
  // Check-in streak tracking
  checkInStreak: {
    current: number;
    longest: number;
    lastCheckIn: Timestamp;
    streakStartDate: Timestamp;
  };
  
  // Overall progress metrics
  progressMetrics: {
    totalModulesCompleted: number;
    totalCheckIns: number;
    averageMoodScore: number;
    bingeEpisodesThisWeek: number;
    bingeEpisodesLastWeek: number;
    copingStrategiesUsed: number;
    daysSinceLastBinge: number;
    wellbeingScore: number;
  };
  
  // Goals and achievements
  goals: {
    id: string;
    description: string;
    targetDate: Date;
    isCompleted: boolean;
    completedAt?: Timestamp;
    progress: number; // 0-100
    milestones: {
      description: string;
      isCompleted: boolean;
      completedAt?: Timestamp;
    }[];
  }[];
  
  achievements: {
    id: string;
    title: string;
    description: string;
    earnedAt: Timestamp;
    category: 'streak' | 'module' | 'wellbeing' | 'coping' | 'milestone';
  }[];
  
  // Weekly and monthly summaries
  weeklySummaries: {
    weekStart: Date;
    weekEnd: Date;
    moodAverage: number;
    bingeEpisodes: number;
    modulesCompleted: number;
    checkInsCompleted: number;
    highlights: string[];
    challenges: string[];
    goalsForNextWeek: string[];
  }[];
  
  monthlySummaries: {
    month: number;
    year: number;
    overallProgress: number; // 0-100
    keyAchievements: string[];
    areasForImprovement: string[];
    nextMonthGoals: string[];
  }[];
  
  lastUpdated: Timestamp;
}

// React Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  CheckIn: undefined;
  Education: undefined;
  Progress: undefined;
  Profile: undefined;
};

export type PatientStackParamList = {
  PatientDashboard: undefined;
  CheckInForm: undefined;
  CheckInHistory: undefined;
  EducationModules: undefined;
  ModuleDetail: { moduleId: string };
  ProgressOverview: undefined;
  ProgressDetail: { period: 'week' | 'month' | 'year' };
  Profile: undefined;
  Settings: undefined;
};

export type ClinicianStackParamList = {
  ClinicianDashboard: undefined;
  PatientList: undefined;
  PatientDetail: { patientId: string };
  PatientProgress: { patientId: string };
  AssignModule: { patientId: string };
  Messages: undefined;
  Reports: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type EducationStackParamList = {
  ModuleList: undefined;
  ModuleDetail: { moduleId: string };
  ModuleQuiz: { moduleId: string };
  ModuleReflection: { moduleId: string };
  CompletedModules: undefined;
};

// Common UI component props
export interface BaseComponentProps {
  children?: React.ReactNode;
  style?: any;
  testID?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  values: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder';
  isRead: boolean;
  actionUrl?: string;
  createdAt: Timestamp;
}

// Analytics and Privacy Types
export type AnalyticsEventType = 
  | 'app_opened'
  | 'app_closed'
  | 'screen_viewed'
  | 'button_clicked'
  | 'form_submitted'
  | 'module_started'
  | 'module_completed'
  | 'check_in_completed'
  | 'error_occurred'
  | 'feature_used'
  | 'consent_given'
  | 'consent_withdrawn';

export type AnalyticsEventCategory = 
  | 'navigation'
  | 'engagement'
  | 'performance'
  | 'error'
  | 'privacy'
  | 'feature_usage'
  | 'user_behavior';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  category: AnalyticsEventCategory;
  timestamp: Timestamp;
  
  // Privacy-safe properties only
  properties: {
    // Screen/Page information (no personal data)
    screen_name?: string;
    previous_screen?: string;
    
    // Feature usage (generic identifiers only)
    feature_name?: string;
    module_id?: string;
    action_type?: string;
    
    // Performance metrics
    load_time?: number;
    response_time?: number;
    
    // Error information (no personal data)
    error_code?: string;
    error_message?: string;
    
    // User journey context (anonymized)
    session_id?: string;
    user_journey_step?: string;
    
    // Engagement metrics
    time_spent?: number;
    interaction_count?: number;
    
    // Device/Platform info (no personal identifiers)
    platform?: 'ios' | 'android' | 'web';
    app_version?: string;
    os_version?: string;
  };
  
  // Consent and privacy metadata
  consent: {
    analytics_consent: boolean;
    marketing_consent: boolean;
    data_processing_consent: boolean;
    consent_version: string;
    consent_timestamp: Timestamp;
  };
  
  // Anonymized user context (no PII)
  user_context: {
    user_role?: 'patient' | 'clinician';
    is_authenticated: boolean;
    session_duration?: number;
  };
}

export interface ConsentPreferences {
  id: string;
  userId: string;
  
  // Consent categories
  analytics: {
    enabled: boolean;
    consentGivenAt?: Timestamp;
    consentWithdrawnAt?: Timestamp;
    dataRetentionPeriod: number; // in days
  };
  
  marketing: {
    enabled: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
    consentGivenAt?: Timestamp;
    consentWithdrawnAt?: Timestamp;
  };
  
  dataProcessing: {
    enabled: boolean;
    research: boolean;
    improvement: boolean;
    thirdParty: boolean;
    consentGivenAt?: Timestamp;
    consentWithdrawnAt?: Timestamp;
  };
  
  // Privacy settings
  privacy: {
    dataAnonymization: boolean;
    dataMinimization: boolean;
    rightToErasure: boolean;
    dataPortability: boolean;
  };
  
  // Consent management
  consentVersion: string;
  lastUpdated: Timestamp;
  ipAddress?: string; // for legal compliance
  userAgent?: string; // for legal compliance
}

export interface ConsentScreenProps {
  onConsentChange: (preferences: Partial<ConsentPreferences>) => void;
  initialPreferences?: Partial<ConsentPreferences>;
  onComplete: () => void;
  onDecline?: () => void;
}

// All types are exported above
