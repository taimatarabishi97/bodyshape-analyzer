import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, SwitchCamera, AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';
import { useCamera } from '@/contexts/CameraContext';
import { PoseOverlay } from './PoseOverlay';
import { QualityIndicator } from './QualityIndicator';

interface CameraInterfaceProps {
  onCapture: (imageData: ImageData, landmarks: any[]) => void;
  onCancel: () => void;
  onSwitchCamera?: () => void;
}

// Calculate the actual display dimensions of video with object-contain
function getVideoDisplayDimensions(video: HTMLVideoElement, container: HTMLElement) {
  const videoRatio = video.videoWidth / video.videoHeight;
  const containerRatio = container.clientWidth / container.clientHeight;
  
  let displayWidth, displayHeight, offsetX, offsetY;
  
  if (videoRatio > containerRatio) {
    // Video is wider than container - letterbox top/bottom
    displayWidth = container.clientWidth;
    displayHeight = container.clientWidth / videoRatio;
    offsetX = 0;
    offsetY = (container.clientHeight - displayHeight) / 2;
  } else {
    // Video is taller than container - letterbox left/right
    displayHeight = container.clientHeight;
    displayWidth = container.clientHeight * videoRatio;
    offsetX = (container.clientWidth - displayWidth) / 2;
    offsetY = 0;
  }
  
  return { displayWidth, displayHeight, offsetX, offsetY };
}

export function CameraInterface({ onCapture, onCancel, onSwitchCamera }: CameraInterfaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, detectPose, stopCamera } = useCamera();
  const [isDetecting, setIsDetecting] = useState(false);
  const [poseReady, setPoseReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMessage, setCaptureMessage] = useState<string | null>(null);
  const [videoDimensions, setVideoDimensions] = useState<{
    displayWidth: number;
    displayHeight: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoCaptureTriggeredRef = useRef(false);
  const excellentFrameCountRef = useRef(0);
  const qualityRef = useRef(state.quality);
  const landmarksRef = useRef(state.landmarks);
  
  // Auto-capture threshold: 85% quality score
  const AUTO_CAPTURE_THRESHOLD = 0.85;
  // Require 5 consecutive excellent frames before auto-capture (1 second at 200ms intervals)
  const REQUIRED_EXCELLENT_FRAMES = 5;

  // Keep refs in sync with state
  useEffect(() => {
    qualityRef.current = state.quality;
  }, [state.quality]);

  useEffect(() => {
    landmarksRef.current = state.landmarks;
  }, [state.landmarks]);

  // Calculate video display dimensions when video loads or resizes
  const updateVideoDimensions = useCallback(() => {
    if (videoRef.current && containerRef.current && videoRef.current.videoWidth > 0) {
      const dims = getVideoDisplayDimensions(videoRef.current, containerRef.current);
      setVideoDimensions(dims);
    }
  }, []);

  // Initialize video stream
  useEffect(() => {
    if (state.stream && videoRef.current) {
      videoRef.current.srcObject = state.stream;
      
      // Update dimensions when video metadata loads
      const handleLoadedMetadata = () => {
        updateVideoDimensions();
      };
      
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      // Also update on resize
      const handleResize = () => updateVideoDimensions();
      window.addEventListener('resize', handleResize);
      
      return () => {
        videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [state.stream, updateVideoDimensions]);

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
      if (videoRef.current && videoRef.current.readyState === 4 && !isCapturing) {
        setIsDetecting(true);
        
        // Update video dimensions on each detection cycle
        updateVideoDimensions();
        
        try {
          await detectPose(videoRef.current);
          
          // Use refs for current values to avoid stale closure
          const currentQuality = qualityRef.current;
          
          // Check if pose is ready for capture
          if (currentQuality && currentQuality.overall > 0.7) {
            setPoseReady(true);
            
            // Check for excellent quality for auto-capture
            if (currentQuality.overall >= AUTO_CAPTURE_THRESHOLD && !autoCaptureTriggeredRef.current && !isCapturing) {
              excellentFrameCountRef.current += 1;
              
              // Trigger auto-capture after consecutive excellent frames
              if (excellentFrameCountRef.current >= REQUIRED_EXCELLENT_FRAMES) {
                autoCaptureTriggeredRef.current = true;
                performCapture(true);
              }
            } else if (currentQuality.overall < AUTO_CAPTURE_THRESHOLD) {
              // Reset frame count if quality drops
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
    }, 200); // Detect every 200ms

    detectionIntervalRef.current = interval;
  }, [detectPose, isCapturing]);

  const stopPoseDetection = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setIsDetecting(false);
  }, []);

  // Unified capture function for both manual and auto capture
  const performCapture = useCallback(async (isAuto: boolean = false) => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;
    
    setIsCapturing(true);
    setCaptureMessage(isAuto ? 'Auto-capturing...' : 'Capturing...');
    
    // Stop pose detection during capture
    stopPoseDetection();
    
    // Brief delay for visual feedback
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
      
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      setCaptureMessage('Processing...');
      
      // Get current landmarks from ref
      const currentLandmarks = landmarksRef.current;
      
      if (!currentLandmarks || currentLandmarks.length === 0) {
        throw new Error('No pose detected. Please ensure your full body is visible.');
      }
      
      // Pass image data AND landmarks to parent
      onCapture(imageData, currentLandmarks);
      
      // Reset capture state after successful capture
      setCaptureMessage(null);
      setIsCapturing(false);
    } catch (error: unknown) {
      console.error('Capture error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Capture failed';
      setCaptureMessage(`Error: ${errorMessage}`);
      
      // Show error briefly then reset
      setTimeout(() => {
        setCaptureMessage(null);
        setIsCapturing(false);
        // Reset auto-capture so it can try again
        autoCaptureTriggeredRef.current = false;
        excellentFrameCountRef.current = 0;
        // Restart detection
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
    if (captureMessage) {
      return captureMessage;
    }
    
    if (isDetecting && !state.landmarks?.length) {
      return 'Detecting pose...';
    }
    
    // Show progress toward auto-capture
    if (state.quality && state.quality.overall >= AUTO_CAPTURE_THRESHOLD && !autoCaptureTriggeredRef.current && !isCapturing) {
      const progress = Math.min(excellentFrameCountRef.current, REQUIRED_EXCELLENT_FRAMES);
      return `Excellent! Hold still... (${progress}/${REQUIRED_EXCELLENT_FRAMES})`;
    }
    
    if (poseReady) {
      return 'Great pose! Hold still for auto-capture';
    }
    
    if (state.landmarks && state.landmarks.length > 0) {
      return 'Adjust your position for better detection';
    }
    
    return 'Position yourself in frame';
  };

  const getStatusIcon = () => {
    if (isCapturing) {
      return <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />;
    }
    
    // Excellent quality - show special indicator
    if (state.quality && state.quality.overall >= AUTO_CAPTURE_THRESHOLD && !autoCaptureTriggeredRef.current && !isCapturing) {
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

  // Check if mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Camera preview - full screen on mobile */}
      <div ref={containerRef} className="relative flex-1 w-full overflow-hidden bg-black">
        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={updateVideoDimensions}
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            transform: state.currentCamera === 'front' ? 'scaleX(-1)' : 'none'
          }}
        />
        
        {/* Pose overlay - positioned exactly over the video display area */}
        {state.landmarks && state.landmarks.length > 0 && videoDimensions && (
          <div 
            className="absolute pointer-events-none"
            style={{
              left: videoDimensions.offsetX,
              top: videoDimensions.offsetY,
              width: videoDimensions.displayWidth,
              height: videoDimensions.displayHeight,
            }}
          >
            <PoseOverlay 
              landmarks={state.landmarks} 
              mirrored={state.currentCamera === 'front'}
            />
          </div>
        )}
        
        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Top controls overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10 safe-area-pt">
          {/* Cancel button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full w-12 h-12"
            disabled={isCapturing}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Switch camera button - more prominent */}
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

        {/* Status overlay - at top center */}
        <div className="absolute top-20 left-0 right-0 flex justify-center z-10">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-white text-sm font-medium">{getStatusMessage()}</span>
          </div>
        </div>

        {/* Capture message overlay */}
        {isCapturing && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/30">
            <div className="bg-white/90 rounded-2xl px-8 py-6 text-center">
              <div className="text-2xl font-bold text-gray-800 animate-pulse">
                {captureMessage || 'Capturing...'}
              </div>
            </div>
          </div>
        )}

        {/* Quality indicator on the side */}
        {state.quality && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <div className="text-white text-xs font-medium text-center mb-1">
                {Math.round(state.quality.overall * 100)}%
              </div>
              <div className="w-2 h-24 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="w-full bg-green-400 rounded-full transition-all duration-300"
                  style={{ height: `${state.quality.overall * 100}%`, marginTop: `${100 - state.quality.overall * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="bg-black/80 backdrop-blur-sm p-4 pb-8 safe-area-pb">
        {/* Guidelines - compact for mobile */}
        <div className="text-white/70 text-xs text-center mb-4 space-y-1">
          <p>Stand 6ft back • Arms at sides • Full body in frame</p>
        </div>

        {/* Capture button */}
        <div className="flex justify-center">
          <Button
            onClick={handleCapture}
            className={`w-20 h-20 rounded-full ${poseReady && !isCapturing ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : 'bg-gray-600'} transition-all duration-300 ${poseReady && !isCapturing ? 'scale-100' : 'scale-95'}`}
            disabled={!poseReady || isCapturing}
          >
            <Camera className="w-8 h-8 text-white" />
          </Button>
        </div>

        {/* Ready status */}
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