import { PoseLandmark, QualityScore, QualityFeedback, DEFAULT_QUALITY_THRESHOLDS, QualityThresholds, KEY_LANDMARKS } from '@/types/camera';

export class QualityAssessmentService {
  private thresholds: QualityThresholds;
  private landmarkHistory: PoseLandmark[][] = [];
  private readonly maxHistoryLength = 10;

  constructor(thresholds: QualityThresholds = DEFAULT_QUALITY_THRESHOLDS) {
    this.thresholds = thresholds;
  }

  assessPoseQuality(landmarks: PoseLandmark[], imageData?: ImageData): QualityScore {
    // Add to history for stability assessment
    this.addToHistory(landmarks);

    // 1. Landmark confidence assessment
    const landmarkScore = this.assessLandmarkConfidence(landmarks);

    // 2. Pose stability assessment
    const stabilityScore = this.assessStability();

    // 3. Lighting assessment (if image data available)
    const lightingScore = imageData ? this.assessLighting(imageData) : 0.7;

    // 4. Framing assessment
    const framingScore = this.assessFraming(landmarks);

    // 5. Pose frontality assessment
    const frontalityScore = this.assessFrontality(landmarks);

    // Calculate overall score with weights
    const overall = (
      landmarkScore * 0.4 +
      stabilityScore * 0.2 +
      lightingScore * 0.2 +
      framingScore * 0.1 +
      frontalityScore * 0.1
    );

    return {
      overall,
      landmarks: landmarkScore,
      stability: stabilityScore,
      lighting: lightingScore,
      framing: framingScore
    };
  }

  assessLandmarkConfidence(landmarks: PoseLandmark[]): number {
    const keyLandmarkConfidences = KEY_LANDMARKS.map(index => landmarks[index]?.score || 0);
    
    if (keyLandmarkConfidences.length === 0) return 0;

    const averageConfidence = keyLandmarkConfidences.reduce((sum, conf) => sum + conf, 0) / keyLandmarkConfidences.length;
    
    // Check if all key landmarks have minimum confidence
    const allKeyLandmarksDetected = keyLandmarkConfidences.every(conf => conf >= this.thresholds.minLandmarkConfidence);
    
    return allKeyLandmarksDetected ? averageConfidence : averageConfidence * 0.5;
  }

  assessStability(): number {
    if (this.landmarkHistory.length < 3) {
      return 0.5; // Not enough history for stability assessment
    }

    // Calculate position variance for key landmarks over time
    const stabilityScores = KEY_LANDMARKS.map(landmarkIndex => {
      const positions = this.landmarkHistory.map(landmarks => {
        const landmark = landmarks[landmarkIndex];
        return landmark ? { x: landmark.x, y: landmark.y } : null;
      }).filter(pos => pos !== null) as { x: number, y: number }[];

      if (positions.length < 2) return 0;

      // Calculate average position
      const avgX = positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length;
      const avgY = positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length;

      // Calculate variance
      const variance = positions.reduce((sum, pos) => {
        return sum + Math.pow(pos.x - avgX, 2) + Math.pow(pos.y - avgY, 2);
      }, 0) / positions.length;

      // Convert variance to stability score (lower variance = higher stability)
      return Math.max(0, 1 - variance * 100);
    });

    const averageStability = stabilityScores.reduce((sum, score) => sum + score, 0) / stabilityScores.length;
    return Math.min(1, Math.max(0, averageStability));
  }

  assessLighting(imageData: ImageData): number {
    // Simple lighting assessment based on image brightness and contrast
    const data = imageData.data;
    let sum = 0;
    let count = 0;

    // Sample pixels for efficiency
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Convert to grayscale brightness
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      sum += brightness;
      count++;
    }

    if (count === 0) return 0.5;

    const averageBrightness = sum / count / 255; // Normalize to 0-1

    // Ideal brightness is around 0.5 (mid-range)
    const brightnessScore = 1 - Math.abs(averageBrightness - 0.5) * 2;

    // Simple contrast estimation (not implemented in detail)
    const contrastScore = 0.7;

    return Math.max(0, Math.min(1, (brightnessScore * 0.7 + contrastScore * 0.3)));
  }

  assessFraming(landmarks: PoseLandmark[]): number {
    // Calculate bounding box of person
    const boundingBox = this.calculateBoundingBox(landmarks);
    
    if (!boundingBox) return 0.5;

    const frameFill = boundingBox.height; // Height as proportion of frame

    // Check if person fills appropriate portion of frame
    if (frameFill >= this.thresholds.frameFillMin && frameFill <= this.thresholds.frameFillMax) {
      return 1.0;
    } else if (frameFill < this.thresholds.frameFillMin) {
      // Too small in frame
      return frameFill / this.thresholds.frameFillMin;
    } else {
      // Too large in frame
      return this.thresholds.frameFillMax / frameFill;
    }
  }

  assessFrontality(landmarks: PoseLandmark[]): number {
    // Check if person is facing forward by comparing shoulder and hip angles
    const leftShoulder = landmarks[5]; // LEFT_SHOULDER
    const rightShoulder = landmarks[6]; // RIGHT_SHOULDER
    const leftHip = landmarks[11]; // LEFT_HIP
    const rightHip = landmarks[12]; // RIGHT_HIP

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      return 0.5;
    }

    // Calculate shoulder angle (horizontal line through shoulders)
    const shoulderAngle = Math.atan2(
      rightShoulder.y - leftShoulder.y,
      rightShoulder.x - leftShoulder.x
    ) * (180 / Math.PI);

    // Calculate hip angle (horizontal line through hips)
    const hipAngle = Math.atan2(
      rightHip.y - leftHip.y,
      rightHip.x - leftHip.x
    ) * (180 / Math.PI);

    // Difference should be small for frontal pose
    const angleDifference = Math.abs(shoulderAngle - hipAngle);
    
    if (angleDifference < 15) {
      return 1.0;
    } else if (angleDifference < 45) {
      return 0.7;
    } else {
      return 0.3;
    }
  }

  getFeedback(score: QualityScore): QualityFeedback {
    const suggestions: string[] = [];
    let canProceed = true;

    // Check landmark confidence
    if (score.landmarks < this.thresholds.minLandmarkConfidence) {
      suggestions.push('Stand closer to the camera and ensure good lighting');
      suggestions.push('Make sure your shoulders and hips are visible');
      canProceed = false;
    }

    // Check stability
    if (score.stability < this.thresholds.minPoseStability) {
      suggestions.push('Hold still for a moment while we capture your pose');
      suggestions.push('Avoid moving during the analysis');
    }

    // Check lighting
    if (score.lighting < this.thresholds.minLightingScore) {
      suggestions.push('Move to a well-lit area');
      suggestions.push('Avoid standing with bright light behind you');
    }

    // Check framing
    if (score.framing < 0.8) {
      suggestions.push('Move closer or further from the camera');
      suggestions.push('Make sure your full body is in the frame');
    }

    // Determine message based on overall score
    let message: string;
    if (score.overall >= 0.8) {
      message = 'Great! Pose quality is excellent.';
    } else if (score.overall >= 0.6) {
      message = 'Good pose quality. Ready for analysis.';
    } else if (score.overall >= 0.4) {
      message = 'Fair pose quality. Consider adjusting your position.';
      canProceed = false;
    } else {
      message = 'Poor pose quality. Please follow the suggestions below.';
      canProceed = false;
    }

    return {
      message,
      suggestions: suggestions.length > 0 ? suggestions : ['Perfect! Ready to capture.'],
      canProceed
    };
  }

  isQualitySufficient(score: QualityScore): boolean {
    return (
      score.overall >= 0.6 &&
      score.landmarks >= this.thresholds.minLandmarkConfidence &&
      score.stability >= this.thresholds.minPoseStability &&
      score.lighting >= this.thresholds.minLightingScore
    );
  }

  private addToHistory(landmarks: PoseLandmark[]): void {
    this.landmarkHistory.push([...landmarks]);
    
    // Keep only recent history
    if (this.landmarkHistory.length > this.maxHistoryLength) {
      this.landmarkHistory.shift();
    }
  }

  private calculateBoundingBox(landmarks: PoseLandmark[]): { x: number, y: number, width: number, height: number } | null {
    const validLandmarks = landmarks.filter(landmark => landmark.score > 0.3);
    
    if (validLandmarks.length === 0) return null;

    const xs = validLandmarks.map(l => l.x);
    const ys = validLandmarks.map(l => l.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  clearHistory(): void {
    this.landmarkHistory = [];
  }
}