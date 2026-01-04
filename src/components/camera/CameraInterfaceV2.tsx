import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, SwitchCamera, AlertCircle, CheckCircle, XCircle, X, Bug } from 'lucide-react';
import { useCamera } from '@/contexts/CameraContext';
import { PoseCanvas } from './PoseCanvas';
import { PoseLandmark } from '@/types/camera';

interface CameraInterfaceProps {
  onCapture: (imageData: ImageData, landmarks: PoseLandmark[]) => void;
  onCancel: () => void;
  onSwitchCamera?: () => void;
}

export function CameraInterfaceV2({ onCapture, onCancel, onSwitchCamera }: CameraInterfaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, detectPose, stopCamera } = useCamera();
  
  const [isDetecting, setIsDetecting] = useState(false);
  const [poseReady, setPoseReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMessage, setCaptureMessage] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoCaptureTriggeredRef = useRef(false);
  const excellentFrameCountRef = useRef(0);
  const qualityRef = useRef(state.quality);
  const landmarksRef = useRef(state.landmarks);
  
  // Configuration
  const AUTO_CAPTURE_THRESHOLD = 0.85;
  const REQUIRED_EXCELLENT_FRAMES = 5;
  const OBJECT_FIT: 'contain' | 'cover' = 'contain'; // Use contain for accurate overlay
  
  // Is front camera (mirrored display)
  const isMirrored = state.currentCamera === 'front';

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
      
      // Ensure video plays
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
          
          const currentQuality = qualityRef.current;
          
          if (currentQuality && currentQuality.overall > 0.7) {
            setPoseReady(true);
            
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
            excellentFrameCountRef.current = 0;
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
      
      setCaptureMessage('Processing...');
      onCapture(imageData, currentLandmarks);
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
    if (isDetecting && !state.landmarks?.length) return 'Detecting pose...';
    
    if (state.quality && state.quality.overall >= AUTO_CAPTURE_THRESHOLD && 
        !autoCaptureTriggeredRef.current && !isCapturing) {
      const progress = Math.min(excellentFrameCountRef.current, REQUIRED_EXCELLENT_FRAMES);
      return `Excellent! Hold still... (${progress}/${REQUIRED_EXCELLENT_FRAMES})`;
    }
    
    if (poseReady) return 'Great pose! Hold still for auto-capture';
    if (state.landmarks && state.landmarks.length > 0) return 'Adjust your position for better detection';
    return 'Position yourself in frame';
  };

  const getStatusIcon = () => {
    if (isCapturing) {
      return <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />;
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
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-white text-sm font-medium">{getStatusMessage()}</span>
          </div>
        </div>

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
          <p>Stand 6ft back • Arms at sides • Full body in frame</p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleCapture}
            className={`w-20 h-20 rounded-full transition-all duration-300 ${
              poseReady && !isCapturing 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 scale-100' 
                : 'bg-gray-600 scale-95'
            }`}
            disabled={!poseReady || isCapturing}
          >
            <Camera className="w-8 h-8 text-white" />
          </Button>
        </div>

        <div className="text-center mt-3">
          {isCapturing ? (
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
