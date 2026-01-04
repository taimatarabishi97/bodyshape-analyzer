import React, { useRef, useEffect, useCallback, useState } from 'react';
import { PoseLandmark, LANDMARK_INDICES } from '@/types/camera';

interface PoseCanvasProps {
  videoElement: HTMLVideoElement | null;
  landmarks: PoseLandmark[] | null;
  isMirrored: boolean;
  objectFit: 'contain' | 'cover';
  showDebug?: boolean;
}

interface VideoDisplayRect {
  // The rectangle where video is actually displayed within the container
  x: number;      // offset from left of container
  y: number;      // offset from top of container
  width: number;  // displayed width
  height: number; // displayed height
  // Scale factors from video intrinsic size to display size
  scaleX: number;
  scaleY: number;
  // For cover mode: how much of the video is cropped (in video pixels)
  cropX: number;
  cropY: number;
}

/**
 * Calculate the actual displayed video rectangle considering object-fit
 */
function calculateVideoDisplayRect(
  video: HTMLVideoElement,
  containerWidth: number,
  containerHeight: number,
  objectFit: 'contain' | 'cover'
): VideoDisplayRect {
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;
  
  if (!videoWidth || !videoHeight) {
    return { x: 0, y: 0, width: containerWidth, height: containerHeight, scaleX: 1, scaleY: 1, cropX: 0, cropY: 0 };
  }

  const videoAspect = videoWidth / videoHeight;
  const containerAspect = containerWidth / containerHeight;

  let displayWidth: number;
  let displayHeight: number;
  let offsetX: number;
  let offsetY: number;
  let cropX = 0;
  let cropY = 0;

  if (objectFit === 'contain') {
    // Video fits entirely within container, may have letterboxing
    if (videoAspect > containerAspect) {
      // Video is wider - letterbox top/bottom
      displayWidth = containerWidth;
      displayHeight = containerWidth / videoAspect;
      offsetX = 0;
      offsetY = (containerHeight - displayHeight) / 2;
    } else {
      // Video is taller - letterbox left/right
      displayHeight = containerHeight;
      displayWidth = containerHeight * videoAspect;
      offsetX = (containerWidth - displayWidth) / 2;
      offsetY = 0;
    }
  } else {
    // object-fit: cover - video fills container, may be cropped
    if (videoAspect > containerAspect) {
      // Video is wider - crop left/right
      displayHeight = containerHeight;
      displayWidth = containerHeight * videoAspect;
      offsetX = (containerWidth - displayWidth) / 2; // negative = cropped
      offsetY = 0;
      // Calculate how much of video is cropped (in video pixels)
      cropX = ((displayWidth - containerWidth) / 2) * (videoWidth / displayWidth);
    } else {
      // Video is taller - crop top/bottom
      displayWidth = containerWidth;
      displayHeight = containerWidth / videoAspect;
      offsetX = 0;
      offsetY = (containerHeight - displayHeight) / 2; // negative = cropped
      cropY = ((displayHeight - containerHeight) / 2) * (videoHeight / displayHeight);
    }
  }

  return {
    x: offsetX,
    y: offsetY,
    width: displayWidth,
    height: displayHeight,
    scaleX: displayWidth / videoWidth,
    scaleY: displayHeight / videoHeight,
    cropX,
    cropY
  };
}

/**
 * Map a normalized landmark coordinate (0-1) to canvas pixel coordinates
 * Returns both raw and transformed coordinates for debugging
 */
function mapLandmarkToCanvas(
  landmark: { x: number; y: number },
  videoRect: VideoDisplayRect,
  canvasWidth: number,
  canvasHeight: number,
  isMirrored: boolean,
  objectFit: 'contain' | 'cover',
  dpr: number
): { x: number; y: number; rawX: number; rawY: number; visible: boolean } {
  // Landmark x,y are normalized 0-1 relative to video intrinsic dimensions
  const rawX = landmark.x;
  const rawY = landmark.y;
  let { x, y } = landmark;

  // NO rotation - landmarks should be in correct orientation from model
  // The model outputs coordinates matching the video frame orientation

  // If mirrored display (front camera), flip x coordinate to match what user sees
  if (isMirrored) {
    x = 1 - x;
  }

  // Convert from normalized to display pixels
  let displayX: number;
  let displayY: number;
  let visible = true;

  if (objectFit === 'contain') {
    // Simple case: map to the displayed video rectangle
    displayX = videoRect.x + x * videoRect.width;
    displayY = videoRect.y + y * videoRect.height;
  } else {
    // Cover mode: need to account for cropping
    // The video extends beyond the container bounds
    displayX = videoRect.x + x * videoRect.width;
    displayY = videoRect.y + y * videoRect.height;
    
    // Check if point is within visible area (container bounds)
    if (displayX < 0 || displayX > canvasWidth / dpr || 
        displayY < 0 || displayY > canvasHeight / dpr) {
      visible = false;
    }
  }

  // Scale by device pixel ratio for sharp rendering
  return {
    x: displayX * dpr,
    y: displayY * dpr,
    rawX,
    rawY,
    visible
  };
}

// Skeleton connections
const SKELETON_CONNECTIONS: [number, number][] = [
  // Torso
  [LANDMARK_INDICES.LEFT_SHOULDER, LANDMARK_INDICES.RIGHT_SHOULDER],
  [LANDMARK_INDICES.LEFT_SHOULDER, LANDMARK_INDICES.LEFT_HIP],
  [LANDMARK_INDICES.RIGHT_SHOULDER, LANDMARK_INDICES.RIGHT_HIP],
  [LANDMARK_INDICES.LEFT_HIP, LANDMARK_INDICES.RIGHT_HIP],
  // Cross torso
  [LANDMARK_INDICES.LEFT_SHOULDER, LANDMARK_INDICES.RIGHT_HIP],
  [LANDMARK_INDICES.RIGHT_SHOULDER, LANDMARK_INDICES.LEFT_HIP],
  // Left arm
  [LANDMARK_INDICES.LEFT_SHOULDER, LANDMARK_INDICES.LEFT_ELBOW],
  [LANDMARK_INDICES.LEFT_ELBOW, LANDMARK_INDICES.LEFT_WRIST],
  // Right arm
  [LANDMARK_INDICES.RIGHT_SHOULDER, LANDMARK_INDICES.RIGHT_ELBOW],
  [LANDMARK_INDICES.RIGHT_ELBOW, LANDMARK_INDICES.RIGHT_WRIST],
  // Left leg
  [LANDMARK_INDICES.LEFT_HIP, LANDMARK_INDICES.LEFT_KNEE],
  [LANDMARK_INDICES.LEFT_KNEE, LANDMARK_INDICES.LEFT_ANKLE],
  // Right leg
  [LANDMARK_INDICES.RIGHT_HIP, LANDMARK_INDICES.RIGHT_KNEE],
  [LANDMARK_INDICES.RIGHT_KNEE, LANDMARK_INDICES.RIGHT_ANKLE],
];

const KEY_LANDMARKS = [
  LANDMARK_INDICES.LEFT_SHOULDER,
  LANDMARK_INDICES.RIGHT_SHOULDER,
  LANDMARK_INDICES.LEFT_HIP,
  LANDMARK_INDICES.RIGHT_HIP,
];

export function PoseCanvas({ 
  videoElement, 
  landmarks, 
  isMirrored, 
  objectFit,
  showDebug = false 
}: PoseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const animationFrameRef = useRef<number>();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !container || !ctx || !videoElement) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Resize canvas to match container with DPR scaling
    const canvasWidth = Math.round(containerWidth * dpr);
    const canvasHeight = Math.round(containerHeight * dpr);
    
    if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Calculate video display rectangle
    const videoRect = calculateVideoDisplayRect(
      videoElement,
      containerWidth,
      containerHeight,
      objectFit
    );

    // Debug info
    if (showDebug) {
      // Get nose landmark for debug display
      const noseLandmark = landmarks?.[0]; // Nose is index 0 in MoveNet
      const leftShoulder = landmarks?.[5]; // Left shoulder
      const rightShoulder = landmarks?.[6]; // Right shoulder
      
      const info = [
        `Video Native: ${videoElement.videoWidth}x${videoElement.videoHeight}`,
        `Video Aspect: ${(videoElement.videoWidth / videoElement.videoHeight).toFixed(2)}`,
        `Container: ${containerWidth.toFixed(0)}x${containerHeight.toFixed(0)}`,
        `Container Aspect: ${(containerWidth / containerHeight).toFixed(2)}`,
        `Canvas: ${canvasWidth}x${canvasHeight} (DPR: ${dpr})`,
        `VideoRect: x=${videoRect.x.toFixed(1)}, y=${videoRect.y.toFixed(1)}`,
        `VideoRect: w=${videoRect.width.toFixed(1)}, h=${videoRect.height.toFixed(1)}`,
        `ObjectFit: ${objectFit} | Mirrored: ${isMirrored}`,
        `Orientation: ${screen.orientation?.angle ?? 'N/A'}°`,
        `---RAW LANDMARKS---`,
        noseLandmark ? `Nose: (${noseLandmark.x.toFixed(3)}, ${noseLandmark.y.toFixed(3)})` : 'Nose: N/A',
        leftShoulder ? `L.Shoulder: (${leftShoulder.x.toFixed(3)}, ${leftShoulder.y.toFixed(3)})` : 'L.Shoulder: N/A',
        rightShoulder ? `R.Shoulder: (${rightShoulder.x.toFixed(3)}, ${rightShoulder.y.toFixed(3)})` : 'R.Shoulder: N/A',
      ];
      setDebugInfo(info);

      // Draw video bounds rectangle
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
      ctx.lineWidth = 2 * dpr;
      ctx.setLineDash([5 * dpr, 5 * dpr]);
      ctx.strokeRect(
        videoRect.x * dpr,
        videoRect.y * dpr,
        videoRect.width * dpr,
        videoRect.height * dpr
      );
      ctx.setLineDash([]);
      
      // Draw center crosshair
      const centerX = (videoRect.x + videoRect.width / 2) * dpr;
      const centerY = (videoRect.y + videoRect.height / 2) * dpr;
      ctx.strokeStyle = 'rgba(255, 0, 255, 0.8)';
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      ctx.moveTo(centerX - 20 * dpr, centerY);
      ctx.lineTo(centerX + 20 * dpr, centerY);
      ctx.moveTo(centerX, centerY - 20 * dpr);
      ctx.lineTo(centerX, centerY + 20 * dpr);
      ctx.stroke();
    }

    // Draw landmarks
    if (landmarks && landmarks.length > 0) {
      // Map all landmarks to canvas coordinates
      const mappedLandmarks = landmarks.map((lm, idx) => {
        if (!lm || lm.score < 0.1) {
          return null;
        }
        const mapped = mapLandmarkToCanvas(
          lm,
          videoRect,
          canvasWidth,
          canvasHeight,
          isMirrored,
          objectFit,
          dpr
        );
        return { ...mapped, score: lm.score, index: idx };
      });

      // Debug: Draw raw landmark position for nose (red dot) vs transformed (green dot)
      if (showDebug && landmarks[0] && landmarks[0].score > 0.3) {
        const nose = landmarks[0];
        // Raw position (no mirroring)
        const rawX = (videoRect.x + nose.x * videoRect.width) * dpr;
        const rawY = (videoRect.y + nose.y * videoRect.height) * dpr;
        
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(rawX, rawY, 8 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `${10 * dpr}px sans-serif`;
        ctx.fillText('RAW', rawX + 10 * dpr, rawY);
        
        // Transformed position
        const mapped = mappedLandmarks[0];
        if (mapped) {
          ctx.fillStyle = 'lime';
          ctx.beginPath();
          ctx.arc(mapped.x, mapped.y, 8 * dpr, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.fillText('MAPPED', mapped.x + 10 * dpr, mapped.y);
        }
      }

      // Draw skeleton connections
      ctx.lineCap = 'round';
      SKELETON_CONNECTIONS.forEach(([startIdx, endIdx]) => {
        const start = mappedLandmarks[startIdx];
        const end = mappedLandmarks[endIdx];
        
        if (!start || !end) return;
        if (!start.visible && !end.visible) return;
        
        const avgScore = (start.score + end.score) / 2;
        const alpha = Math.min(avgScore, 0.9);
        
        ctx.strokeStyle = avgScore > 0.7 
          ? `rgba(59, 130, 246, ${alpha})` // Blue
          : `rgba(139, 92, 246, ${alpha})`; // Purple
        ctx.lineWidth = (avgScore > 0.7 ? 3 : 2) * dpr;
        
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      });

      // Draw landmark points
      mappedLandmarks.forEach((point) => {
        if (!point || !point.visible) return;
        
        const isKey = KEY_LANDMARKS.includes(point.index);
        const radius = (isKey ? 6 : 4) * dpr;
        
        // Determine color based on confidence and if key landmark
        let color: string;
        if (isKey) {
          color = point.score > 0.7 ? '#10B981' : point.score > 0.4 ? '#F59E0B' : '#EF4444';
        } else {
          color = point.score > 0.7 ? '#3B82F6' : point.score > 0.4 ? '#8B5CF6' : '#6B7280';
        }
        
        // Draw outer glow for key landmarks
        if (isKey) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, radius + 4 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = `${color}40`;
          ctx.fill();
        }
        
        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2 * dpr;
        ctx.stroke();
      });

      // Draw measurement labels for shoulders and hips
      const leftShoulder = mappedLandmarks[LANDMARK_INDICES.LEFT_SHOULDER];
      const rightShoulder = mappedLandmarks[LANDMARK_INDICES.RIGHT_SHOULDER];
      const leftHip = mappedLandmarks[LANDMARK_INDICES.LEFT_HIP];
      const rightHip = mappedLandmarks[LANDMARK_INDICES.RIGHT_HIP];

      if (leftShoulder && rightShoulder && leftShoulder.visible && rightShoulder.visible &&
          leftShoulder.score > 0.5 && rightShoulder.score > 0.5) {
        const midX = (leftShoulder.x + rightShoulder.x) / 2;
        const midY = Math.min(leftShoulder.y, rightShoulder.y) - 20 * dpr;
        
        ctx.font = `${12 * dpr}px sans-serif`;
        ctx.fillStyle = '#3B82F6';
        ctx.textAlign = 'center';
        ctx.fillText('Shoulders', midX, midY);
      }

      if (leftHip && rightHip && leftHip.visible && rightHip.visible &&
          leftHip.score > 0.5 && rightHip.score > 0.5) {
        const midX = (leftHip.x + rightHip.x) / 2;
        const midY = Math.min(leftHip.y, rightHip.y) - 20 * dpr;
        
        ctx.font = `${12 * dpr}px sans-serif`;
        ctx.fillStyle = '#10B981';
        ctx.textAlign = 'center';
        ctx.fillText('Hips', midX, midY);
      }

      // Debug: show some landmark coordinates
      if (showDebug && leftShoulder) {
        ctx.font = `${10 * dpr}px monospace`;
        ctx.fillStyle = 'yellow';
        ctx.textAlign = 'left';
        ctx.fillText(
          `L.Shoulder: (${(leftShoulder.x/dpr).toFixed(0)}, ${(leftShoulder.y/dpr).toFixed(0)})`,
          10 * dpr,
          containerHeight * dpr - 40 * dpr
        );
      }
      if (showDebug && rightShoulder) {
        ctx.fillText(
          `R.Shoulder: (${(rightShoulder.x/dpr).toFixed(0)}, ${(rightShoulder.y/dpr).toFixed(0)})`,
          10 * dpr,
          containerHeight * dpr - 25 * dpr
        );
      }
    }

    // Schedule next frame
    animationFrameRef.current = requestAnimationFrame(draw);
  }, [videoElement, landmarks, isMirrored, objectFit, showDebug]);

  // Start/stop animation loop
  useEffect(() => {
    if (videoElement && landmarks) {
      animationFrameRef.current = requestAnimationFrame(draw);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [videoElement, landmarks, draw]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      // Force redraw on resize
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [draw]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Debug overlay */}
      {showDebug && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-2 rounded font-mono z-50">
          {debugInfo.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
