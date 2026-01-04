/**
 * HybridCameraInterface.tsx
 * 
 * Camera interface with integrated hybrid body shape analysis.
 * Uses pose estimation + silhouette segmentation for accurate measurements.
 * 
 * Features:
 * - Real-time pose quality checks (yaw, roll, framing)
 * - Visual guidance for correct positioning
 * - Silhouette-based width measurements
 * - Confidence scoring and explanations
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, SwitchCamera, AlertCircle, CheckCircle, XCircle, X, Bug, Info } from 'lucide-react';
import { useCamera } from '@/contexts/CameraContext';
import { PoseCanvas } from './PoseCanvas';
import { PoseLandmark } from '@/types/camera';
import { 
  HybridBodyAnalyzer, 
  getHybridAnalyzer, 
  HybridAnalysisResult,
  PoseQualityCheck 
} from '@/lib/analysis/HybridBodyAnalyzer';

interface HybridCameraInterfaceProps {
  onCapture: (imageData: ImageData, landmarks: PoseLandmark[], hybridResult?: HybridAnalysisResult) => void;
  onCancel: () => void;
  onSwitchCamera?: () => void;
}

export function HybridCameraInterface({ onCapture, onCancel, onSwitchCamera }: HybridCameraInterfaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, detectPose, stopCamera } = useCamera();
  
  const [isDetecting, setIsDetecting] = useState(false);
  const [poseReady, setPoseReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMessage, setCaptureMessage] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [poseCheck, setPoseCheck] = useState<PoseQualityCheck | null>(null);
  const [analyzerReady, setAnalyzerReady] = useState(false);
  const [showGuidance, setShowGuidance] = useState(true);
  
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoCaptureTriggeredRef = useRef(false);
  const excellentFrameCountRef = useRef(0);
  const qualityRef = useRef(state.quality);
  const landmarksRef = useRef(state.landmarks);
  const analyzerRef = useRef<HybridBodyAnalyzer | null>(null);
  
  // Configuration
  const AUTO_CAPTURE_THRESHOLD = 0.85;
  const REQUIRED_EXCELLENT_FRAMES = 5;
  const OBJECT_FIT: 'contain' | 'cover' = 'contain';
  
  // Is front camera (mirrored display)
  const isMirrored = state.currentCamera === 'front';

  // Initialize hybrid analyzer
  useEffect(() => {
    const initAnalyzer = async () => {
      try {
        analyzerRef.current = await getHybridAnalyzer();
        setAnalyzerReady(true);
        console.log('[HybridCamera] Analyzer initialized');
      } catch (error) {
        console.error('[HybridCamera] Failed to initialize analyzer:', error);
      }
    };
    initAnalyzer();
  }, []);

  // Keep refs in sync with state
  useEffect(() => {
    qualityRef.current = state.quality;
  }, [state.quality]);

  useEffect(() => {
    landmarksRef.current = state.landmarks;
  }, [state.landmarks]);

  // Initialize video stream
  useEffect(() => {
    if (state.stream && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = state.stream;
      video.play().catch(console.error);
    }
  }, [state.stream]);

  // Start pose detection when camera is active
  useEffect(() => {
    if (state.status === 'ACTIVE' && videoRef.current) {
      startPoseDetection();
    } else {
      stopPoseDetection();
    }

    return () => {
      stopPoseDetection();
    };
  }, [state.status]);

  // Reset auto-capture when camera switches
  useEffect(() => {
    autoCaptureTriggeredRef.current = false;
    excellentFrameCountRef.current = 0;
  }, [state.currentCamera]);

  const startPoseDetection = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    const interval = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState >= 2 && !isCapturing) {
        setIsDetecting(true);
        
        try {
          await detectPose(videoRef.current);
          
          const currentLandmarks = landmarksRef.current;
          const currentQuality = qualityRef.current;
          
          // Run pose quality check with analyzer
          if (currentLandmarks && analyzerRef.current && videoRef.current) {
            const check = analyzerRef.current.checkPoseQuality(
              currentLandmarks,
              videoRef.current.videoWidth,
              videoRef.current.videoHeight
            );
            setPoseCheck(check);
            
            // All checks passed?
            const allGood = check.isFullBodyVisible && 
                           check.isUpright && 
                           check.isAtGoodDistance;
            
            if (allGood && currentQuality && currentQuality.overall > 0.7) {
              setPoseReady(true);
              setShowGuidance(false);
              
              if (currentQuality.overall >= AUTO_CAPTURE_THRESHOLD && 
                  !autoCaptureTriggeredRef.current && !isCapturing) {
                excellentFrameCountRef.current += 1;
                
                if (excellentFrameCountRef.current >= REQUIRED_EXCELLENT_FRAMES) {
                  autoCaptureTriggeredRef.current = true;
                  performCapture(true);
                }
              } else if (currentQuality.overall < AUTO_CAPTURE_THRESHOLD) {
                excellentFrameCountRef.current = 0;
              }
            } else {
              setPoseReady(false);
              setShowGuidance(true);
              excellentFrameCountRef.current = 0;
            }
          } else if (currentQuality && currentQuality.overall > 0.7) {
            setPoseReady(true);
          } else {
            setPoseReady(false);
          }
        } catch (error) {
          console.error('Pose detection error:', error);
        } finally {
          setIsDetecting(false);
        }
      }
    }, 200);

    detectionIntervalRef.current = interval;
  }, [detectPose, isCapturing]);

  const stopPoseDetection = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setIsDetecting(false);
  }, []);

  const performCapture = useCallback(async (isAuto: boolean = false) => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;
    
    setIsCapturing(true);
    setCaptureMessage(isAuto ? 'Auto-capturing...' : 'Capturing...');
    stopPoseDetection();
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Failed to get canvas context');
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      const currentLandmarks = landmarksRef.current;
      
      if (!currentLandmarks || currentLandmarks.length === 0) {
        throw new Error('No pose detected. Please ensure your full body is visible.');
      }
      
      setCaptureMessage('Analyzing body shape...');
      
      // Perform hybrid analysis
      let hybridResult: HybridAnalysisResult | undefined;
      if (analyzerRef.current) {
        try {
          hybridResult = await analyzerRef.current.analyze(
            canvas,
            currentLandmarks,
            canvas.width,
            canvas.height
          );
          console.log('[HybridCamera] Analysis result:', hybridResult);
        } catch (err) {
          console.warn('[HybridCamera] Hybrid analysis failed, using fallback:', err);
        }
      }
      
      setCaptureMessage('Processing...');
      onCapture(imageData, currentLandmarks, hybridResult);
      setCaptureMessage(null);
      setIsCapturing(false);
    } catch (error: unknown) {
      console.error('Capture error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Capture failed';
      setCaptureMessage(`Error: ${errorMessage}`);
      
      setTimeout(() => {
        setCaptureMessage(null);
        setIsCapturing(false);
        autoCaptureTriggeredRef.current = false;
        excellentFrameCountRef.current = 0;
        startPoseDetection();
      }, 2000);
    }
  }, [isCapturing, onCapture, stopPoseDetection, startPoseDetection]);

  const handleCapture = useCallback(() => {
    performCapture(false);
  }, [performCapture]);

  const handleCancel = () => {
    stopPoseDetection();
    stopCamera();
    onCancel();
  };

  const getStatusMessage = () => {
    if (captureMessage) return captureMessage;
    if (!analyzerReady) return 'Loading analyzer...';
    if (isDetecting && !state.landmarks?.length) return 'Detecting pose...';
    
    // Show quality issues if any
    if (poseCheck && poseCheck.issues.length > 0) {
      return poseCheck.issues[0]; // Show first issue
    }
    
    if (state.quality && state.quality.overall >= AUTO_CAPTURE_THRESHOLD && 
        !autoCaptureTriggeredRef.current && !isCapturing) {
      const progress = Math.min(excellentFrameCountRef.current, REQUIRED_EXCELLENT_FRAMES);
      return `Excellent! Hold still... (${progress}/${REQUIRED_EXCELLENT_FRAMES})`;
    }
    
    if (poseReady) return 'Great pose! Hold still for auto-capture';
    if (state.landmarks && state.landmarks.length > 0) return 'Adjust your position';
    return 'Position yourself in frame';
  };

  const getStatusIcon = () => {
    if (isCapturing) {
      return <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />;
    }
    if (poseCheck && poseCheck.issues.length > 0) {
      return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
    if (state.quality && state.quality.overall >= AUTO_CAPTURE_THRESHOLD && 
        !autoCaptureTriggeredRef.current && !isCapturing) {
      return <CheckCircle className="w-4 h-4 text-green-400 animate-pulse" />;
    }
    if (poseReady) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    if (state.landmarks && state.landmarks.length > 0) {
      return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
    return <XCircle className="w-4 h-4 text-white/50" />;
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Video container */}
      <div className="relative flex-1 w-full overflow-hidden bg-black">
        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: OBJECT_FIT,
            transform: isMirrored ? 'scaleX(-1)' : 'none',
          }}
        />
        
        {/* Canvas-based pose overlay */}
        {state.landmarks && state.landmarks.length > 0 && videoRef.current && (
          <PoseCanvas
            videoElement={videoRef.current}
            landmarks={state.landmarks}
            isMirrored={isMirrored}
            objectFit={OBJECT_FIT}
            showDebug={showDebug}
          />
        )}
        
        {/* Body framing guide overlay */}
        {showGuidance && !poseReady && (
          <div className="absolute inset-0 pointer-events-none z-5">
            {/* Body outline guide */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="guideGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
                  <stop offset="100%" stopColor="rgba(139, 92, 246, 0.5)" />
                </linearGradient>
              </defs>
              {/* Simple body outline */}
              <ellipse cx="50" cy="15" rx="8" ry="10" fill="none" stroke="url(#guideGradient)" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="50" y1="25" x2="50" y2="55" stroke="url(#guideGradient)" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="50" y1="30" x2="30" y2="45" stroke="url(#guideGradient)" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="50" y1="30" x2="70" y2="45" stroke="url(#guideGradient)" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="50" y1="55" x2="35" y2="90" stroke="url(#guideGradient)" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="50" y1="55" x2="65" y2="90" stroke="url(#guideGradient)" strokeWidth="0.5" strokeDasharray="2,2" />
            </svg>
          </div>
        )}
        
        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Top controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full w-12 h-12"
            disabled={isCapturing}
          >
            <X className="w-6 h-6" />
          </Button>

          <div className="flex gap-2">
            {/* Debug toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDebug(!showDebug)}
              className={`backdrop-blur-sm text-white rounded-full w-12 h-12 ${showDebug ? 'bg-yellow-500/50' : 'bg-white/20 hover:bg-white/30'}`}
            >
              <Bug className="w-5 h-5" />
            </Button>
            
            {/* Switch camera */}
            {onSwitchCamera && (
              <Button
                onClick={onSwitchCamera}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full px-4 py-2 flex items-center gap-2"
                disabled={isCapturing}
              >
                <SwitchCamera className="w-5 h-5" />
                <span className="text-sm font-medium">Flip</span>
              </Button>
            )}
          </div>
        </div>

        {/* Status overlay */}
        <div className="absolute top-20 left-0 right-0 flex justify-center z-10">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 max-w-[90%]">
            {getStatusIcon()}
            <span className="text-white text-sm font-medium truncate">{getStatusMessage()}</span>
          </div>
        </div>

        {/* Quality check indicators */}
        {poseCheck && showDebug && (
          <div className="absolute left-4 top-36 bg-black/70 backdrop-blur-sm rounded-lg p-3 z-10 text-xs space-y-1">
            <div className={`flex items-center gap-2 ${poseCheck.isFullBodyVisible ? 'text-green-400' : 'text-red-400'}`}>
              {poseCheck.isFullBodyVisible ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              <span>Full body visible</span>
            </div>
            <div className={`flex items-center gap-2 ${poseCheck.isUpright ? 'text-green-400' : 'text-red-400'}`}>
              {poseCheck.isUpright ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              <span>Yaw: {poseCheck.yawAngle.toFixed(0)}° / Roll: {poseCheck.rollAngle.toFixed(0)}°</span>
            </div>
            <div className={`flex items-center gap-2 ${poseCheck.isAtGoodDistance ? 'text-green-400' : 'text-red-400'}`}>
              {poseCheck.isAtGoodDistance ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              <span>Frame fill: {(poseCheck.frameFillRatio * 100).toFixed(0)}%</span>
            </div>
          </div>
        )}

        {/* Capture message overlay */}
        {isCapturing && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/30">
            <div className="bg-white/90 rounded-2xl px-8 py-6 text-center">
              <div className="text-2xl font-bold text-gray-800 animate-pulse">
                {captureMessage || 'Capturing...'}
              </div>
            </div>
          </div>
        )}

        {/* Quality indicator */}
        {state.quality && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <div className="text-white text-xs font-medium text-center mb-1">
                {Math.round(state.quality.overall * 100)}%
              </div>
              <div className="w-2 h-24 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="w-full bg-green-400 rounded-full transition-all duration-300"
                  style={{ 
                    height: `${state.quality.overall * 100}%`, 
                    marginTop: `${100 - state.quality.overall * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="bg-black/80 backdrop-blur-sm p-4 pb-8">
        <div className="text-white/70 text-xs text-center mb-4 space-y-1">
          <p>Stand 6ft back • Arms at sides • Face camera directly • Full body in frame</p>
          {!analyzerReady && <p className="text-amber-400">Loading analysis engine...</p>}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleCapture}
            className={`w-20 h-20 rounded-full transition-all duration-300 ${
              poseReady && !isCapturing && analyzerReady
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 scale-100' 
                : 'bg-gray-600 scale-95'
            }`}
            disabled={!poseReady || isCapturing || !analyzerReady}
          >
            <Camera className="w-8 h-8 text-white" />
          </Button>
        </div>

        <div className="text-center mt-3">
          {!analyzerReady ? (
            <span className="text-amber-400 text-sm font-medium animate-pulse">Loading...</span>
          ) : isCapturing ? (
            <span className="text-amber-400 text-sm font-medium animate-pulse">📸 {captureMessage}</span>
          ) : state.quality && state.quality.overall >= AUTO_CAPTURE_THRESHOLD && !autoCaptureTriggeredRef.current ? (
            <span className="text-green-400 text-sm font-medium animate-pulse">✨ Excellent! Hold still...</span>
          ) : poseReady ? (
            <span className="text-green-400 text-sm font-medium">✓ Ready - hold still for auto-capture</span>
          ) : (
            <span className="text-white/50 text-sm">Position yourself in frame</span>
          )}
        </div>
      </div>

      {/* Error display */}
      {state.error && (
        <div className="absolute bottom-32 left-4 right-4 p-3 bg-red-500/90 backdrop-blur-sm rounded-lg z-20">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />
            <p className="text-sm text-white">{state.error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
