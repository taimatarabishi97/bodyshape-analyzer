import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { 
  CameraState, 
  CameraContextValue, 
  CameraStatus, 
  PermissionStatus, 
  CameraType,
  BodyShapeResult,
  PoseLandmark,
  QualityScore
} from '@/types/camera';
import { CameraService } from '@/services/camera/CameraService';
import { PoseDetectionService } from '@/services/poseDetection/PoseDetectionService';
import { MeasurementCalculator } from '@/services/poseDetection/MeasurementCalculator';
import { BodyShapeClassifier } from '@/services/poseDetection/BodyShapeClassifier';
import { QualityAssessmentService } from '@/services/poseDetection/QualityAssessmentService';

// Initial state
const initialState: CameraState = {
  status: 'IDLE',
  permission: 'PROMPT',
  stream: null,
  currentCamera: 'front',
  error: null,
  landmarks: null,
  quality: null,
  result: null
};

// Action types
type CameraAction =
  | { type: 'SET_STATUS'; payload: CameraStatus }
  | { type: 'SET_PERMISSION'; payload: PermissionStatus }
  | { type: 'SET_STREAM'; payload: MediaStream | null }
  | { type: 'SET_CAMERA'; payload: CameraType }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LANDMARKS'; payload: PoseLandmark[] | null }
  | { type: 'SET_QUALITY'; payload: QualityScore | null }
  | { type: 'SET_RESULT'; payload: BodyShapeResult | null }
  | { type: 'RESET' };

// Reducer function
function cameraReducer(state: CameraState, action: CameraAction): CameraState {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_PERMISSION':
      return { ...state, permission: action.payload };
    case 'SET_STREAM':
      return { ...state, stream: action.payload };
    case 'SET_CAMERA':
      return { ...state, currentCamera: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LANDMARKS':
      return { ...state, landmarks: action.payload };
    case 'SET_QUALITY':
      return { ...state, quality: action.payload };
    case 'SET_RESULT':
      return { ...state, result: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Create context
const CameraContext = createContext<CameraContextValue | undefined>(undefined);

// Service instances (created once)
let cameraService: CameraService;
let poseDetectionService: PoseDetectionService;
let measurementCalculator: MeasurementCalculator;
let bodyShapeClassifier: BodyShapeClassifier;
let qualityAssessmentService: QualityAssessmentService;

function getServices() {
  if (!cameraService) cameraService = new CameraService();
  if (!poseDetectionService) poseDetectionService = new PoseDetectionService();
  if (!measurementCalculator) measurementCalculator = new MeasurementCalculator();
  if (!bodyShapeClassifier) bodyShapeClassifier = new BodyShapeClassifier();
  if (!qualityAssessmentService) qualityAssessmentService = new QualityAssessmentService();
  
  return {
    cameraService,
    poseDetectionService,
    measurementCalculator,
    bodyShapeClassifier,
    qualityAssessmentService
  };
}

// Provider component
export function CameraProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cameraReducer, initialState);

  const requestPermission = useCallback(async () => {
    try {
      dispatch({ type: 'SET_STATUS', payload: 'REQUESTING_PERMISSION' });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { cameraService } = getServices();
      const permission = await cameraService.requestPermission();
      
      dispatch({ type: 'SET_PERMISSION', payload: permission });
      dispatch({ type: 'SET_STATUS', payload: 'IDLE' });

      if (permission === 'DENIED') {
        throw new Error('Camera permission denied. Please allow camera access in your browser settings.');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_STATUS', payload: 'ERROR' });
      throw error;
    }
  }, []);

  const startCamera = useCallback(async (cameraType: CameraType = 'front') => {
    try {
      dispatch({ type: 'SET_STATUS', payload: 'ACTIVE' });
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_CAMERA', payload: cameraType });

      const { cameraService, poseDetectionService } = getServices();
      
      // Initialize pose detection
      await poseDetectionService.initialize();
      
      // Get camera stream
      const stream = await cameraService.getStream(cameraType);
      dispatch({ type: 'SET_STREAM', payload: stream });
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_STATUS', payload: 'ERROR' });
      throw error;
    }
  }, []);

  const stopCamera = useCallback(() => {
    const { cameraService, poseDetectionService, qualityAssessmentService } = getServices();
    
    cameraService.releaseStream();
    poseDetectionService.dispose();
    qualityAssessmentService.clearHistory();
    
    dispatch({ type: 'SET_STREAM', payload: null });
    dispatch({ type: 'SET_LANDMARKS', payload: null });
    dispatch({ type: 'SET_QUALITY', payload: null });
    dispatch({ type: 'SET_STATUS', payload: 'IDLE' });
  }, []);

  const capture = useCallback(async (): Promise<BodyShapeResult> => {
    try {
      dispatch({ type: 'SET_STATUS', payload: 'CAPTURING' });
      dispatch({ type: 'SET_ERROR', payload: null });

      const services = getServices();
      const { cameraService, poseDetectionService, measurementCalculator, bodyShapeClassifier, qualityAssessmentService } = services;

      // Get video element (would be provided by component)
      // For now, we'll assume the component provides this
      throw new Error('Capture functionality requires video element from component');

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_STATUS', payload: 'ERROR' });
      throw error;
    }
  }, []);

  const switchCamera = useCallback(async () => {
    try {
      dispatch({ type: 'SET_STATUS', payload: 'ACTIVE' });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { cameraService } = getServices();
      const newCameraType = await cameraService.switchCamera();
      
      dispatch({ type: 'SET_CAMERA', payload: newCameraType });
      dispatch({ type: 'SET_STATUS', payload: 'ACTIVE' });
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_STATUS', payload: 'ERROR' });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    const { cameraService, poseDetectionService, qualityAssessmentService } = getServices();
    
    cameraService.releaseStream();
    poseDetectionService.dispose();
    qualityAssessmentService.clearHistory();
    
    dispatch({ type: 'RESET' });
  }, []);

  const detectPose = useCallback(async (videoElement: HTMLVideoElement): Promise<PoseLandmark[]> => {
    try {
      const { poseDetectionService } = getServices();
      const landmarks = await poseDetectionService.detectFromVideo(videoElement);
      
      dispatch({ type: 'SET_LANDMARKS', payload: landmarks });
      
      // Assess quality
      const { qualityAssessmentService } = getServices();
      const quality = qualityAssessmentService.assessPoseQuality(landmarks);
      dispatch({ type: 'SET_QUALITY', payload: quality });
      
      return landmarks;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const analyzePose = useCallback(async (landmarks: PoseLandmark[], imageData?: ImageData): Promise<BodyShapeResult> => {
    try {
      dispatch({ type: 'SET_STATUS', payload: 'PROCESSING' });

      const services = getServices();
      const { measurementCalculator, bodyShapeClassifier, qualityAssessmentService } = services;

      // Calculate measurements
      const measurements = measurementCalculator.calculateBodyMeasurements(landmarks);
      
      // Assess quality with image data if available
      const quality = imageData 
        ? qualityAssessmentService.assessPoseQuality(landmarks, imageData)
        : qualityAssessmentService.assessPoseQuality(landmarks);
      
      // Classify body shape
      const result = bodyShapeClassifier.classify(measurements, quality);
      
      dispatch({ type: 'SET_RESULT', payload: result });
      dispatch({ type: 'SET_STATUS', payload: 'COMPLETE' });
      
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_STATUS', payload: 'ERROR' });
      throw error;
    }
  }, []);

  const value: CameraContextValue = {
    state,
    requestPermission,
    startCamera,
    stopCamera,
    capture,
    switchCamera,
    reset,
    // Additional methods for component use
    detectPose,
    analyzePose
  } as CameraContextValue;

  return (
    <CameraContext.Provider value={value}>
      {children}
    </CameraContext.Provider>
  );
}

// Custom hook for using camera context
export function useCamera() {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
}