// Body Shape Types
export type BodyShape = 'pear' | 'hourglass' | 'apple' | 'rectangle' | 'inverted-triangle';

export type ServiceTier = 'basic' | 'standard' | 'premium';

// Questionnaire Types
export interface QuestionnaireAnswers {
  // Body Proportions
  shoulderWidth: 'narrow' | 'average' | 'broad';
  hipWidth: 'narrow' | 'average' | 'wide';
  waistDefinition: 'very-defined' | 'somewhat-defined' | 'straight' | 'undefined';
  weightDistribution: 'upper-body' | 'midsection' | 'lower-body' | 'evenly';
  bustSize: 'small' | 'medium' | 'large';
  
  // Shape Perception
  largestBodyPart: 'shoulders' | 'bust' | 'waist' | 'hips' | 'thighs';
  smallestBodyPart: 'shoulders' | 'bust' | 'waist' | 'hips' | 'thighs';
  bodyFrameSize: 'petite' | 'average' | 'plus-size';
}

export interface OptionalMeasurements {
  height?: number; // in cm
  weight?: number; // in kg
  bust?: number; // in cm
  waist?: number; // in cm
  hips?: number; // in cm
  shoulderWidth?: number; // in cm
}

// Analysis Result Types
export interface StylingRecommendation {
  category: string;
  recommendations: string[];
  avoid: string[];
}

export interface AnalysisResult {
  bodyShape: BodyShape;
  description: string;
  stylingRecommendations: StylingRecommendation[];
  colorTips: string[];
  fitTips: string[];
}

// Database Types
export interface Submission {
  id: string;
  email: string;
  timestamp: string;
  questionnaire_answers: QuestionnaireAnswers;
  measurements: OptionalMeasurements | null;
  body_shape_result: BodyShape;
  styling_recommendations: AnalysisResult;
  access_token_id: string | null;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface AccessToken {
  id: string;
  token: string;
  email: string;
  tier: ServiceTier;
  is_used: boolean;
  expires_at: string;
  created_at: string;
  used_at?: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Admin Session
export interface AdminSession {
  userId: string;
  email: string;
  exp: number;
}