import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, SwitchCamera, AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';
import { useCamera } from '@/contexts/CameraContext';
import { PoseOverlay } from './PoseOverlay';
import { QualityIndicator } from './QualityIndicator';

interface CameraInterfaceProps {
  onCapture: (imageData: ImageData) => void;
  onCancel: () => void;
  onSwitchCamera?: () => void;
}

export function CameraInterface({ onCapture, onCancel, onSwitchCamera }: CameraInterfaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, detectPose, stopCamera } = useCamera();
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null);
  const [poseReady, setPoseReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [autoCapturing, setAutoCapturing] = useState(false);
  const autoCaptureTriggeredRef = useRef(false);
  const excellentFrameCountRef = useRef(0);
  
  // Auto-capture threshold: 85% quality score
  const AUTO_CAPTURE_THRESHOLD = 0.85;
  // Require 5 consecutive excellent frames before auto-capture (1 second at 200ms intervals)
  const REQUIRED_EXCELLENT_FRAMES = 5;

  // Initialize video stream
  useEffect(() => {
    if (state.stream && videoRef.current) {
      videoRef.current.srcObject = state.stream;
    }

    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
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

  const startPoseDetection = () => {
    if (detectionInterval) {
      clearInterval(detectionInterval);
    }

    const interval = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        setIsDetecting(true);
        try {
          await detectPose(videoRef.current);
          
          // Check if pose is ready for capture
          if (state.quality && state.quality.overall > 0.7) {
            setPoseReady(true);
            
            // Check for excellent quality for auto-capture
            if (state.quality.overall >= AUTO_CAPTURE_THRESHOLD && !autoCaptureTriggeredRef.current && !autoCapturing) {
              excellentFrameCountRef.current += 1;
              
              // Trigger auto-capture after consecutive excellent frames
              if (excellentFrameCountRef.current >= REQUIRED_EXCELLENT_FRAMES) {
                autoCaptureTriggeredRef.current = true;
                triggerAutoCapture();
              }
            } else if (state.quality.overall < AUTO_CAPTURE_THRESHOLD) {
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

    setDetectionInterval(interval);
  };

  // Auto-capture function - instant capture without countdown
  const triggerAutoCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setAutoCapturing(true);
    setCountdown(1); // Brief visual indicator
    
    // Brief delay for user feedback
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Capture image
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    setCountdown(null);
    setAutoCapturing(false);
    
    // Pass image data to parent
    onCapture(imageData);
  };

  const stopPoseDetection = () => {
    if (detectionInterval) {
      clearInterval(detectionInterval);
      setDetectionInterval(null);
    }
    setIsDetecting(false);
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Start countdown
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    // Wait for countdown
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Capture image
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Pass image data to parent
    onCapture(imageData);
  };

  const handleCancel = () => {
    stopPoseDetection();
    stopCamera();
    onCancel();
  };

  const getStatusMessage = () => {
    if (autoCapturing) {
      return 'Auto-capturing...';
    }
    
    if (countdown !== null) {
      return `Capturing in ${countdown}...`;
    }
    
    if (isDetecting) {
      return 'Detecting pose...';
    }
    
    // Show progress toward auto-capture
    if (state.quality && state.quality.overall >= AUTO_CAPTURE_THRESHOLD && !autoCaptureTriggeredRef.current) {
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
    if (autoCapturing || countdown !== null) {
      return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
    
    // Excellent quality - show special indicator
    if (state.quality && state.quality.overall >= AUTO_CAPTURE_THRESHOLD && !autoCaptureTriggeredRef.current) {
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
      <div className="relative flex-1 w-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: state.currentCamera === 'front' ? 'scaleX(-1)' : 'none'
          }}
        />
        
        {/* Pose overlay */}
        {state.landmarks && state.landmarks.length > 0 && (
          <PoseOverlay 
            landmarks={state.landmarks} 
            mirrored={state.currentCamera === 'front'}
          />
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
            disabled={countdown !== null}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Switch camera button - more prominent */}
          {onSwitchCamera && (
            <Button
              onClick={onSwitchCamera}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full px-4 py-2 flex items-center gap-2"
              disabled={countdown !== null}
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

        {/* Countdown overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-9xl font-bold text-white drop-shadow-lg animate-pulse">
              {countdown}
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
            className={`w-20 h-20 rounded-full ${poseReady ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : 'bg-gray-600'} transition-all duration-300 ${poseReady ? 'scale-100' : 'scale-95'}`}
            disabled={!poseReady || countdown !== null}
          >
            <Camera className="w-8 h-8 text-white" />
          </Button>
        </div>

        {/* Ready status */}
        <div className="text-center mt-3">
          {autoCapturing ? (
            <span className="text-green-400 text-sm font-medium animate-pulse">✨ Auto-capturing...</span>
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