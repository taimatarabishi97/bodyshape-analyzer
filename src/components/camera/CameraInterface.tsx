import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Camera, RotateCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
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
          } else {
            setPoseReady(false);
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
    if (countdown !== null) {
      return `Capturing in ${countdown}...`;
    }
    
    if (isDetecting) {
      return 'Detecting pose...';
    }
    
    if (poseReady) {
      return 'Ready to capture!';
    }
    
    if (state.landmarks && state.landmarks.length > 0) {
      return 'Adjust your position for better detection';
    }
    
    return 'Position yourself in frame';
  };

  const getStatusIcon = () => {
    if (countdown !== null) {
      return <AlertCircle className="w-5 h-5 text-amber-500" />;
    }
    
    if (poseReady) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    if (state.landmarks && state.landmarks.length > 0) {
      return <AlertCircle className="w-5 h-5 text-amber-500" />;
    }
    
    return <XCircle className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      {/* Camera preview */}
      <div className="relative w-full max-w-2xl aspect-[3/4] sm:aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
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
      </div>

      {/* Quality indicator */}
      {state.quality && (
        <div className="mt-4 w-full max-w-2xl">
          <QualityIndicator quality={state.quality} />
        </div>
      )}

      {/* Status card */}
      <Card className="mt-4 w-full max-w-2xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <h3 className="font-medium">Status</h3>
                <p className="text-sm text-muted-foreground">{getStatusMessage()}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium">
                {state.quality ? `${Math.round(state.quality.overall * 100)}% Quality` : '--'}
              </p>
              {state.quality && (
                <Progress value={state.quality.overall * 100} className="w-32 mt-1" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guidance card */}
      <Card className="mt-4 w-full max-w-2xl">
        <CardContent className="pt-6">
          <h3 className="font-medium mb-2">Guidelines for Best Results</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Stand about 6 feet (2 meters) from the camera</li>
            <li>• Face the camera directly with arms at your sides</li>
            <li>• Wear form-fitting clothing for better detection</li>
            <li>• Ensure good lighting without shadows</li>
            <li>• Keep your full body in the frame</li>
          </ul>
        </CardContent>
      </Card>

      {/* Control buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="flex-1"
          disabled={countdown !== null}
        >
          Cancel
        </Button>
        
        {onSwitchCamera && (
          <Button
            variant="outline"
            onClick={onSwitchCamera}
            className="flex-1"
            disabled={countdown !== null}
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Switch Camera
          </Button>
        )}
        
        <Button
          onClick={handleCapture}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={!poseReady || countdown !== null}
        >
          <Camera className="w-4 h-4 mr-2" />
          {countdown !== null ? `Capturing... (${countdown})` : 'Capture'}
        </Button>
      </div>

      {/* Error display */}
      {state.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg w-full max-w-2xl">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-sm text-red-800">{state.error}</p>
          </div>
        </div>
      )}
    </div>
  );
}