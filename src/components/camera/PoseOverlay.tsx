import React from 'react';
import { PoseLandmark, LANDMARK_INDICES } from '@/types/camera';

interface PoseOverlayProps {
  landmarks: PoseLandmark[];
  mirrored?: boolean;
}

export function PoseOverlay({ landmarks, mirrored = false }: PoseOverlayProps) {
  // Define connections between landmarks (skeleton)
  const connections = [
    // Left side
    [LANDMARK_INDICES.LEFT_SHOULDER, LANDMARK_INDICES.LEFT_ELBOW],
    [LANDMARK_INDICES.LEFT_ELBOW, LANDMARK_INDICES.LEFT_WRIST],
    [LANDMARK_INDICES.LEFT_SHOULDER, LANDMARK_INDICES.LEFT_HIP],
    [LANDMARK_INDICES.LEFT_HIP, LANDMARK_INDICES.LEFT_KNEE],
    [LANDMARK_INDICES.LEFT_KNEE, LANDMARK_INDICES.LEFT_ANKLE],
    
    // Right side
    [LANDMARK_INDICES.RIGHT_SHOULDER, LANDMARK_INDICES.RIGHT_ELBOW],
    [LANDMARK_INDICES.RIGHT_ELBOW, LANDMARK_INDICES.RIGHT_WRIST],
    [LANDMARK_INDICES.RIGHT_SHOULDER, LANDMARK_INDICES.RIGHT_HIP],
    [LANDMARK_INDICES.RIGHT_HIP, LANDMARK_INDICES.RIGHT_KNEE],
    [LANDMARK_INDICES.RIGHT_KNEE, LANDMARK_INDICES.RIGHT_ANKLE],
    
    // Center/torso
    [LANDMARK_INDICES.LEFT_SHOULDER, LANDMARK_INDICES.RIGHT_SHOULDER],
    [LANDMARK_INDICES.LEFT_HIP, LANDMARK_INDICES.RIGHT_HIP],
    [LANDMARK_INDICES.LEFT_SHOULDER, LANDMARK_INDICES.RIGHT_HIP],
    [LANDMARK_INDICES.RIGHT_SHOULDER, LANDMARK_INDICES.LEFT_HIP],
  ];

  // Key landmarks for body shape analysis (highlighted differently)
  const keyLandmarkIndices = [
    LANDMARK_INDICES.LEFT_SHOULDER,
    LANDMARK_INDICES.RIGHT_SHOULDER,
    LANDMARK_INDICES.LEFT_HIP,
    LANDMARK_INDICES.RIGHT_HIP,
  ];

  const getLandmarkColor = (index: number, score: number) => {
    // Key landmarks get special colors
    if (keyLandmarkIndices.includes(index)) {
      if (score > 0.7) return '#10B981'; // Green for high confidence key landmarks
      if (score > 0.4) return '#F59E0B'; // Amber for medium confidence
      return '#EF4444'; // Red for low confidence
    }
    
    // Regular landmarks
    if (score > 0.7) return '#3B82F6'; // Blue for high confidence
    if (score > 0.4) return '#8B5CF6'; // Purple for medium confidence
    return '#6B7280'; // Gray for low confidence
  };

  const getConnectionColor = (score1: number, score2: number) => {
    const avgScore = (score1 + score2) / 2;
    if (avgScore > 0.7) return '#3B82F6'; // Blue
    if (avgScore > 0.4) return '#8B5CF6'; // Purple
    return '#6B7280'; // Gray
  };

  const getLandmarkSize = (score: number) => {
    if (score > 0.7) return 8;
    if (score > 0.4) return 6;
    return 4;
  };

  const getConnectionWidth = (score1: number, score2: number) => {
    const avgScore = (score1 + score2) / 2;
    if (avgScore > 0.7) return 3;
    if (avgScore > 0.4) return 2;
    return 1;
  };

  // Use raw coordinates - the CSS transform on the overlay container handles mirroring
  const toPercent = (value: number) => `${value * 100}%`;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Draw connections (skeleton) */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map(([startIdx, endIdx], index) => {
          const startLandmark = landmarks[startIdx];
          const endLandmark = landmarks[endIdx];
          
          if (!startLandmark || !endLandmark || startLandmark.score < 0.1 || endLandmark.score < 0.1) {
            return null;
          }

          const startX = startLandmark.x * 100;
          const startY = startLandmark.y * 100;
          const endX = endLandmark.x * 100;
          const endY = endLandmark.y * 100;

          return (
            <line
              key={`connection-${index}`}
              x1={`${startX}%`}
              y1={`${startY}%`}
              x2={`${endX}%`}
              y2={`${endY}%`}
              stroke={getConnectionColor(startLandmark.score, endLandmark.score)}
              strokeWidth={getConnectionWidth(startLandmark.score, endLandmark.score)}
              strokeLinecap="round"
              opacity={0.8}
            />
          );
        })}
      </svg>

      {/* Draw landmarks (joints) */}
      <div className="absolute inset-0">
        {landmarks.map((landmark, index) => {
          if (!landmark || landmark.score < 0.1) return null;

          const color = getLandmarkColor(index, landmark.score);
          const size = getLandmarkSize(landmark.score);
          const isKeyLandmark = keyLandmarkIndices.includes(index);

          return (
            <div
              key={`landmark-${index}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: toPercent(landmark.x),
                top: toPercent(landmark.y),
              }}
            >
              <div
                className="rounded-full border-2 border-white shadow-lg"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  boxShadow: isKeyLandmark 
                    ? `0 0 0 2px ${color}40, 0 0 10px ${color}80`
                    : `0 0 0 1px ${color}40`,
                }}
              />
              
              {/* Confidence indicator for key landmarks */}
              {isKeyLandmark && landmark.score < 0.7 && (
                <div
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap"
                  style={{ color }}
                >
                  {Math.round(landmark.score * 100)}%
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Body shape measurement lines */}
      {landmarks[LANDMARK_INDICES.LEFT_SHOULDER] && landmarks[LANDMARK_INDICES.RIGHT_SHOULDER] && 
       landmarks[LANDMARK_INDICES.LEFT_SHOULDER].score > 0.5 && landmarks[LANDMARK_INDICES.RIGHT_SHOULDER].score > 0.5 && (
        <div className="absolute transform -translate-y-1/2"
          style={{
            left: toPercent(Math.min(landmarks[LANDMARK_INDICES.LEFT_SHOULDER].x, landmarks[LANDMARK_INDICES.RIGHT_SHOULDER].x)),
            top: toPercent(landmarks[LANDMARK_INDICES.LEFT_SHOULDER].y),
            width: toPercent(Math.abs(landmarks[LANDMARK_INDICES.RIGHT_SHOULDER].x - landmarks[LANDMARK_INDICES.LEFT_SHOULDER].x)),
          }}
        >
          <div className="h-0.5 bg-blue-500/50 relative">
            <div className="absolute -top-2 left-0 right-0 flex justify-center">
              <span className="text-xs font-medium bg-blue-500 text-white px-2 py-0.5 rounded">
                Shoulders
              </span>
            </div>
          </div>
        </div>
      )}

      {landmarks[LANDMARK_INDICES.LEFT_HIP] && landmarks[LANDMARK_INDICES.RIGHT_HIP] && 
       landmarks[LANDMARK_INDICES.LEFT_HIP].score > 0.5 && landmarks[LANDMARK_INDICES.RIGHT_HIP].score > 0.5 && (
        <div className="absolute transform -translate-y-1/2"
          style={{
            left: toPercent(Math.min(landmarks[LANDMARK_INDICES.LEFT_HIP].x, landmarks[LANDMARK_INDICES.RIGHT_HIP].x)),
            top: toPercent(landmarks[LANDMARK_INDICES.LEFT_HIP].y),
            width: toPercent(Math.abs(landmarks[LANDMARK_INDICES.RIGHT_HIP].x - landmarks[LANDMARK_INDICES.LEFT_HIP].x)),
          }}
        >
          <div className="h-0.5 bg-green-500/50 relative">
            <div className="absolute -top-2 left-0 right-0 flex justify-center">
              <span className="text-xs font-medium bg-green-500 text-white px-2 py-0.5 rounded">
                Hips
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}