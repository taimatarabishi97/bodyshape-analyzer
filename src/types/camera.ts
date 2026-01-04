// Core types for pose detection
export interface PoseLandmark {
  x: number;          // Normalized x coordinate (0-1)
  y: number;          // Normalized y coordinate (0-1)
  z?: number;         // Normalized z coordinate (0-1, optional)
  score: number;      // Confidence score (0-1)
  name: string;       // Landmark name (e.g., "left_shoulder")
}

export interface BodyMeasurements {
  shoulderWidth: number;     // Relative units (pixels normalized by height)
  waistCircumference: number; // Relative units
  hipWidth: number;          // Relative units
  height: number;            // Relative units (pixels)
}

export interface BodyRatios {
  shoulderToHip: number;     // shoulderWidth / hipWidth
  waistToHip: number;        // waistCircumference / hipWidth
  shoulderToWaist: number;   // shoulderWidth / waistCircumference
}

export type BodyShapeType = 
  | 'HOURGLASS'
  | 'PEAR' 
  | 'INVERTED_TRIANGLE'
  | 'RECTANGLE'
  | 'APPLE'
  | 'UNKNOWN';

export interface BodyShapeResult {
  shape: BodyShapeType;
  confidence: number;        // 0-1 confidence score
  ratios: BodyRatios;
  measurements: BodyMeasurements;
  quality: QualityScore;
}

export interface QualityScore {
  overall: number;           // 0-1 overall quality
  landmarks: number;         // Landmark confidence score
  stability: number;         // Pose stability score
  lighting: number;          // Lighting condition score
  framing: number;           // Person framing in frame
}

export interface QualityFeedback {
  message: string;
  suggestions: string[];
  canProceed: boolean;
}

// Camera state management
export type CameraStatus = 
  | 'IDLE'
  | 'REQUESTING_PERMISSION'
  | 'ACTIVE'
  | 'CAPTURING'
  | 'PROCESSING'
  | 'COMPLETE'
  | 'ERROR';

export type PermissionStatus = 
  | 'GRANTED'
  | 'DENIED'
  | 'PROMPT';

export type CameraType = 'front' | 'back';

export interface CameraState {
  status: CameraStatus;
  permission: PermissionStatus;
  stream: MediaStream | null;
  currentCamera: CameraType;
  error: string | null;
  landmarks: PoseLandmark[] | null;
  quality: QualityScore | null;
  result: BodyShapeResult | null;
}

// Context and hooks
export interface CameraContextValue {
  state: CameraState;
  requestPermission: () => Promise<void>;
  startCamera: (cameraType?: CameraType) => Promise<void>;
  stopCamera: () => void;
  capture: () => Promise<BodyShapeResult>;
  switchCamera: () => Promise<void>;
  reset: () => void;
  detectPose: (videoElement: HTMLVideoElement) => Promise<PoseLandmark[]>;
  analyzePose: (landmarks: PoseLandmark[], imageData?: ImageData) => Promise<BodyShapeResult>;
}

// Configuration types
export interface PoseDetectionConfig {
  modelType: 'movenet' | 'blazepose';
  modelUrl: string;
  maxPoses: number;
  scoreThreshold: number;
  nmsRadius: number;
}

export interface ClassificationThresholds {
  hourglass: {
    shoulderHipDiff: number;      // Maximum difference for hourglass
    waistReduction: number;       // Minimum waist reduction
  };
  pear: {
    hipShoulderDiff: number;      // Minimum hip > shoulder difference
    waistHipRatio: number;        // Maximum waist-to-hip ratio
  };
  invertedTriangle: {
    shoulderHipDiff: number;      // Minimum shoulder > hip difference
    shoulderWaistRatio: number;   // Maximum shoulder-to-waist ratio
  };
  rectangle: {
    measurementVariance: number;  // Maximum variance between measurements
  };
  apple: {
    waistDominance: number;       // Minimum waist dominance over others
  };
}

export interface QualityThresholds {
  minLandmarkConfidence: number;  // Minimum confidence for key landmarks
  minPoseStability: number;       // Minimum stability score
  minLightingScore: number;       // Minimum lighting quality
  frameFillMin: number;           // Minimum person fill in frame (0-1)
  frameFillMax: number;           // Maximum person fill in frame (0-1)
}

// MoveNet landmark indices (17 keypoints)
export const LANDMARK_INDICES = {
  NOSE: 0,
  LEFT_EYE: 1,
  RIGHT_EYE: 2,
  LEFT_EAR: 3,
  RIGHT_EAR: 4,
  LEFT_SHOULDER: 5,
  RIGHT_SHOULDER: 6,
  LEFT_ELBOW: 7,
  RIGHT_ELBOW: 8,
  LEFT_WRIST: 9,
  RIGHT_WRIST: 10,
  LEFT_HIP: 11,
  RIGHT_HIP: 12,
  LEFT_KNEE: 13,
  RIGHT_KNEE: 14,
  LEFT_ANKLE: 15,
  RIGHT_ANKLE: 16
} as const;

// Key landmarks for body shape analysis
export const KEY_LANDMARKS = [
  LANDMARK_INDICES.LEFT_SHOULDER,
  LANDMARK_INDICES.RIGHT_SHOULDER,
  LANDMARK_INDICES.LEFT_HIP,
  LANDMARK_INDICES.RIGHT_HIP,
  LANDMARK_INDICES.LEFT_ANKLE,
  LANDMARK_INDICES.RIGHT_ANKLE
] as const;

// Default configuration
export const DEFAULT_CLASSIFICATION_THRESHOLDS: ClassificationThresholds = {
  hourglass: {
    shoulderHipDiff: 0.05,    // 5% maximum difference
    waistReduction: 0.25      // Waist 25% smaller than shoulders/hips
  },
  pear: {
    hipShoulderDiff: 0.05,    // Hips 5% wider than shoulders
    waistHipRatio: 0.85       // Waist-to-hip ratio < 0.85
  },
  invertedTriangle: {
    shoulderHipDiff: 0.05,    // Shoulders 5% wider than hips
    shoulderWaistRatio: 0.85  // Shoulder-to-waist ratio < 0.85
  },
  rectangle: {
    measurementVariance: 0.05 // All measurements within 5% of each other
  },
  apple: {
    waistDominance: 0.05      // Waist 5% larger than shoulders/hips
  }
};

export const DEFAULT_QUALITY_THRESHOLDS: QualityThresholds = {
  minLandmarkConfidence: 0.7,
  minPoseStability: 0.6,
  minLightingScore: 0.5,
  frameFillMin: 0.4,
  frameFillMax: 0.8
};

export const DEFAULT_POSE_DETECTION_CONFIG: PoseDetectionConfig = {
  modelType: 'movenet',
  modelUrl: 'https://tfhub.dev/google/movenet/singlepose/lightning/4',
  maxPoses: 1,
  scoreThreshold: 0.3,
  nmsRadius: 20
};