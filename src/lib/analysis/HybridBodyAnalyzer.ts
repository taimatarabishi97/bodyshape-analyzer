/**
 * HybridBodyAnalyzer.ts
 * 
 * Combines pose estimation (for anatomical level detection) with 
 * silhouette segmentation (for accurate width measurements) to produce
 * reliable body shape analysis.
 * 
 * This is the main entry point for the hybrid analysis system.
 */

import { PoseLandmark, LANDMARK_INDICES, BodyShapeType, QualityScore } from '@/types/camera';
import { SilhouetteSegmenter, getSegmenter, SegmentationResult } from './SilhouetteSegmenter';
import { SilhouetteMeasurer, SilhouetteWidths, SilhouetteRatios, silhouetteMeasurer } from './SilhouetteMeasurer';

// ============================================================================
// Types
// ============================================================================

export interface PoseQualityCheck {
  isFullBodyVisible: boolean;
  isUpright: boolean;              // Not too much yaw/roll
  yawAngle: number;                // Estimated yaw rotation
  rollAngle: number;               // Estimated roll (tilt)
  isAtGoodDistance: boolean;       // Person fills frame appropriately
  frameFillRatio: number;          // How much of frame person fills
  issues: string[];                // List of detected issues
}

export interface HybridMeasurements {
  // Pixel widths from silhouette
  shoulderWidthPx: number;
  bustWidthPx: number | null;
  waistWidthPx: number | null;
  hipWidthPx: number;

  // Optional: Estimated cm (only if calibrated)
  shoulderWidthCm?: number;
  bustWidthCm?: number;
  waistWidthCm?: number;
  hipWidthCm?: number;

  // Normalized widths (relative to image width)
  shoulderWidthNorm: number;
  bustWidthNorm: number | null;
  waistWidthNorm: number | null;
  hipWidthNorm: number;
}

export interface HybridAnalysisResult {
  // Core results
  bodyShape: BodyShapeType;
  confidence: number;
  
  // Measurements & ratios
  measurements: HybridMeasurements;
  ratios: SilhouetteRatios;
  
  // Curvature analysis
  waistCurvatureIndex: number;    // 0-1, higher = more defined waist
  
  // Quality metrics
  quality: HybridQualityScore;
  poseCheck: PoseQualityCheck;
  
  // Raw data for debugging
  silhouetteWidths: SilhouetteWidths | null;
  landmarks: PoseLandmark[];
  
  // Manual override
  userOverride?: BodyShapeType;
  
  // Explanation
  explanation: string;
}

export interface HybridQualityScore {
  overall: number;            // 0-1
  poseConfidence: number;     // Average landmark confidence
  segmentationConfidence: number;
  measurementConfidence: number;
  orientationScore: number;   // How well aligned/upright
}

export interface AnalyzerConfig {
  // Quality thresholds
  minLandmarkConfidence: number;
  minSegmentationConfidence: number;
  maxYawAngle: number;           // degrees
  maxRollAngle: number;          // degrees
  minFrameFill: number;          // 0-1
  maxFrameFill: number;          // 0-1
  
  // Classification thresholds
  hourglassWaistReduction: number;     // Minimum waist indent for hourglass
  pearHipDominance: number;            // Hip > shoulder by this ratio
  invertedTriangleShoulderDominance: number;
  rectangleTolerance: number;          // Max deviation for rectangle
}

const DEFAULT_CONFIG: AnalyzerConfig = {
  minLandmarkConfidence: 0.6,
  minSegmentationConfidence: 0.7,
  maxYawAngle: 30,
  maxRollAngle: 15,
  minFrameFill: 0.3,
  maxFrameFill: 0.85,
  
  hourglassWaistReduction: 0.20,       // Waist 20% smaller than avg of shoulder/hip
  pearHipDominance: 1.05,              // Hips 5% wider than shoulders
  invertedTriangleShoulderDominance: 1.05,
  rectangleTolerance: 0.08,            // 8% tolerance for "equal" measurements
};

// ============================================================================
// Main Analyzer Class
// ============================================================================

export class HybridBodyAnalyzer {
  private segmenter: SilhouetteSegmenter | null = null;
  private measurer: SilhouetteMeasurer;
  private config: AnalyzerConfig;
  private isInitialized: boolean = false;

  constructor(config: Partial<AnalyzerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.measurer = silhouetteMeasurer;
  }

  /**
   * Initialize the analyzer (loads segmentation model)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('[HybridBodyAnalyzer] Initializing...');
    this.segmenter = await getSegmenter();
    this.isInitialized = true;
    console.log('[HybridBodyAnalyzer] Initialized successfully');
  }

  /**
   * Check if analyzer is ready
   */
  isReady(): boolean {
    return this.isInitialized && this.segmenter !== null;
  }

  /**
   * Perform quality checks on pose landmarks
   */
  checkPoseQuality(landmarks: PoseLandmark[], imageWidth: number, imageHeight: number): PoseQualityCheck {
    const issues: string[] = [];

    // Check full body visibility (head to ankles)
    const requiredLandmarks = [
      LANDMARK_INDICES.NOSE,
      LANDMARK_INDICES.LEFT_SHOULDER,
      LANDMARK_INDICES.RIGHT_SHOULDER,
      LANDMARK_INDICES.LEFT_HIP,
      LANDMARK_INDICES.RIGHT_HIP,
      LANDMARK_INDICES.LEFT_ANKLE,
      LANDMARK_INDICES.RIGHT_ANKLE,
    ];

    const missingLandmarks = requiredLandmarks.filter(idx => {
      const lm = landmarks[idx];
      return !lm || lm.score < this.config.minLandmarkConfidence;
    });

    const isFullBodyVisible = missingLandmarks.length === 0;
    if (!isFullBodyVisible) {
      issues.push('Full body not visible - ensure head to ankles are in frame');
    }

    // Calculate yaw (rotation around vertical axis)
    const leftShoulder = landmarks[LANDMARK_INDICES.LEFT_SHOULDER];
    const rightShoulder = landmarks[LANDMARK_INDICES.RIGHT_SHOULDER];
    const leftHip = landmarks[LANDMARK_INDICES.LEFT_HIP];
    const rightHip = landmarks[LANDMARK_INDICES.RIGHT_HIP];

    let yawAngle = 0;
    if (leftShoulder && rightShoulder && leftShoulder.z !== undefined && rightShoulder.z !== undefined) {
      // Use Z difference to estimate yaw
      const zDiff = rightShoulder.z - leftShoulder.z;
      yawAngle = Math.atan(zDiff) * (180 / Math.PI);
    } else if (leftShoulder && rightShoulder) {
      // Fallback: use shoulder width asymmetry as yaw proxy
      const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
      const expectedWidth = 0.25; // Expected normalized shoulder width facing camera
      const widthRatio = shoulderWidth / expectedWidth;
      yawAngle = Math.acos(Math.min(1, widthRatio)) * (180 / Math.PI);
    }

    const isYawOk = Math.abs(yawAngle) < this.config.maxYawAngle;
    if (!isYawOk) {
      issues.push(`Turn to face the camera directly (rotation: ${Math.round(yawAngle)}°)`);
    }

    // Calculate roll (camera tilt / body lean)
    let rollAngle = 0;
    if (leftShoulder && rightShoulder) {
      const dy = rightShoulder.y - leftShoulder.y;
      const dx = rightShoulder.x - leftShoulder.x;
      rollAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    }

    const isRollOk = Math.abs(rollAngle) < this.config.maxRollAngle;
    if (!isRollOk) {
      issues.push(`Keep the camera level (tilt: ${Math.round(rollAngle)}°)`);
    }

    // Check frame fill
    let frameFillRatio = 0;
    if (isFullBodyVisible) {
      const nose = landmarks[LANDMARK_INDICES.NOSE];
      const leftAnkle = landmarks[LANDMARK_INDICES.LEFT_ANKLE];
      const rightAnkle = landmarks[LANDMARK_INDICES.RIGHT_ANKLE];
      
      const topY = nose.y;
      const bottomY = Math.max(leftAnkle.y, rightAnkle.y);
      frameFillRatio = bottomY - topY;
    }

    const isAtGoodDistance = frameFillRatio >= this.config.minFrameFill && 
                             frameFillRatio <= this.config.maxFrameFill;
    if (frameFillRatio < this.config.minFrameFill) {
      issues.push('Move closer to the camera');
    } else if (frameFillRatio > this.config.maxFrameFill) {
      issues.push('Move further from the camera');
    }

    return {
      isFullBodyVisible,
      isUpright: isYawOk && isRollOk,
      yawAngle,
      rollAngle,
      isAtGoodDistance,
      frameFillRatio,
      issues,
    };
  }

  /**
   * Classify body shape based on ratios
   */
  classifyBodyShape(
    ratios: SilhouetteRatios,
    waistCurvature: number
  ): { shape: BodyShapeType; confidence: number; explanation: string } {
    const { WHR, WSR, SHR } = ratios;
    const scores: Record<BodyShapeType, number> = {
      HOURGLASS: 0,
      PEAR: 0,
      INVERTED_TRIANGLE: 0,
      RECTANGLE: 0,
      APPLE: 0,
      UNKNOWN: 0,
    };

    const explanations: string[] = [];

    // Hourglass: Shoulders ≈ Hips, defined waist
    const shouldersHipsBalanced = Math.abs(SHR - 1) < this.config.rectangleTolerance;
    const hasDefinedWaist = waistCurvature >= this.config.hourglassWaistReduction;

    if (shouldersHipsBalanced && hasDefinedWaist) {
      scores.HOURGLASS += 3;
      explanations.push(`Balanced shoulders/hips (SHR=${SHR.toFixed(2)}) with defined waist (${(waistCurvature*100).toFixed(0)}% indent)`);
    }

    // Pear: Hips wider than shoulders
    if (SHR < (1 / this.config.pearHipDominance)) {
      scores.PEAR += 3;
      explanations.push(`Hips wider than shoulders (SHR=${SHR.toFixed(2)})`);
    }

    // Inverted Triangle: Shoulders wider than hips
    if (SHR > this.config.invertedTriangleShoulderDominance) {
      scores.INVERTED_TRIANGLE += 3;
      explanations.push(`Shoulders wider than hips (SHR=${SHR.toFixed(2)})`);
    }

    // Rectangle: All measurements similar, no defined waist
    if (shouldersHipsBalanced && !hasDefinedWaist) {
      scores.RECTANGLE += 3;
      explanations.push(`Similar proportions with minimal waist definition (curvature=${(waistCurvature*100).toFixed(0)}%)`);
    }

    // Apple: Waist is largest (high WHR and WSR)
    if (WHR > 0.9 && WSR > 0.9) {
      scores.APPLE += 3;
      explanations.push(`Waist relatively larger (WHR=${WHR.toFixed(2)}, WSR=${WSR.toFixed(2)})`);
    }

    // Additional scoring based on waist curvature
    if (waistCurvature >= 0.25) {
      scores.HOURGLASS += 2;
    } else if (waistCurvature >= 0.15) {
      scores.HOURGLASS += 1;
      scores.PEAR += 1;
    } else {
      scores.RECTANGLE += 1;
      scores.APPLE += 1;
    }

    // Find highest scoring shape
    let maxScore = 0;
    let resultShape: BodyShapeType = 'UNKNOWN';
    
    for (const [shape, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        resultShape = shape as BodyShapeType;
      }
    }

    // Calculate confidence based on score margin
    const sortedScores = Object.values(scores).sort((a, b) => b - a);
    const margin = sortedScores[0] - sortedScores[1];
    const confidence = Math.min(1, (maxScore / 5) * (1 + margin / 3));

    const explanation = explanations.join('. ') || 'Unable to determine distinctive features';

    return { shape: resultShape, confidence, explanation };
  }

  /**
   * Perform full hybrid analysis on an image
   */
  async analyze(
    imageSource: HTMLVideoElement | HTMLCanvasElement | ImageData,
    landmarks: PoseLandmark[],
    imageWidth: number,
    imageHeight: number
  ): Promise<HybridAnalysisResult> {
    if (!this.isReady()) {
      await this.initialize();
    }

    // 1. Check pose quality
    const poseCheck = this.checkPoseQuality(landmarks, imageWidth, imageHeight);

    // 2. Perform segmentation
    let segmentation: SegmentationResult | null = null;
    if (this.segmenter) {
      segmentation = await this.segmenter.segment(imageSource);
    }

    // 3. Measure widths from silhouette
    let silhouetteWidths: SilhouetteWidths | null = null;
    if (segmentation) {
      silhouetteWidths = this.measurer.measureWidths(segmentation, landmarks, true);
    }

    // 4. Compute ratios and curvature
    let ratios: SilhouetteRatios;
    let waistCurvature = 0;
    let measurements: HybridMeasurements;

    if (silhouetteWidths) {
      ratios = this.measurer.computeRatios(silhouetteWidths);
      waistCurvature = this.measurer.computeWaistCurvatureIndex(silhouetteWidths);
      
      measurements = {
        shoulderWidthPx: silhouetteWidths.shoulder.width,
        bustWidthPx: silhouetteWidths.bust?.width ?? null,
        waistWidthPx: silhouetteWidths.waist.width,
        hipWidthPx: silhouetteWidths.hip.width,
        shoulderWidthNorm: silhouetteWidths.shoulder.width / imageWidth,
        bustWidthNorm: silhouetteWidths.bust ? silhouetteWidths.bust.width / imageWidth : null,
        waistWidthNorm: silhouetteWidths.waist.width / imageWidth,
        hipWidthNorm: silhouetteWidths.hip.width / imageWidth,
      };
    } else {
      // Fallback to skeleton-based estimation (less accurate)
      const fallback = this.fallbackSkeletonMeasurements(landmarks, imageWidth, imageHeight);
      ratios = fallback.ratios;
      waistCurvature = 0.1; // Assume minimal for fallback
      measurements = fallback.measurements;
    }

    // 5. Classify body shape
    const classification = this.classifyBodyShape(ratios, waistCurvature);

    // 6. Compute quality scores
    const avgLandmarkConfidence = this.computeAverageLandmarkConfidence(landmarks);
    const segmentationConfidence = segmentation?.confidence ?? 0;
    const measurementConfidence = silhouetteWidths 
      ? (silhouetteWidths.shoulder.confidence + 
         silhouetteWidths.waist.confidence + 
         silhouetteWidths.hip.confidence) / 3
      : 0.3;
    
    const orientationScore = poseCheck.isUpright ? 1 : 0.5;
    
    const quality: HybridQualityScore = {
      overall: (avgLandmarkConfidence * 0.3 + 
                segmentationConfidence * 0.3 + 
                measurementConfidence * 0.2 + 
                orientationScore * 0.2),
      poseConfidence: avgLandmarkConfidence,
      segmentationConfidence,
      measurementConfidence,
      orientationScore,
    };

    return {
      bodyShape: classification.shape,
      confidence: classification.confidence * quality.overall,
      measurements,
      ratios,
      waistCurvatureIndex: waistCurvature,
      quality,
      poseCheck,
      silhouetteWidths,
      landmarks,
      explanation: classification.explanation,
    };
  }

  /**
   * Fallback skeleton-based measurements (when segmentation fails)
   */
  private fallbackSkeletonMeasurements(
    landmarks: PoseLandmark[],
    imageWidth: number,
    imageHeight: number
  ): { measurements: HybridMeasurements; ratios: SilhouetteRatios } {
    const leftShoulder = landmarks[LANDMARK_INDICES.LEFT_SHOULDER];
    const rightShoulder = landmarks[LANDMARK_INDICES.RIGHT_SHOULDER];
    const leftHip = landmarks[LANDMARK_INDICES.LEFT_HIP];
    const rightHip = landmarks[LANDMARK_INDICES.RIGHT_HIP];

    // Calculate distances in pixels
    const shoulderWidthPx = Math.abs(rightShoulder.x - leftShoulder.x) * imageWidth;
    const hipWidthPx = Math.abs(rightHip.x - leftHip.x) * imageWidth;
    
    // Estimate waist (this is the problematic skeleton-only approach)
    const waistWidthPx = shoulderWidthPx * 0.7 + hipWidthPx * 0.3;

    const measurements: HybridMeasurements = {
      shoulderWidthPx,
      bustWidthPx: null,
      waistWidthPx,
      hipWidthPx,
      shoulderWidthNorm: shoulderWidthPx / imageWidth,
      bustWidthNorm: null,
      waistWidthNorm: waistWidthPx / imageWidth,
      hipWidthNorm: hipWidthPx / imageWidth,
    };

    const ratios: SilhouetteRatios = {
      WHR: waistWidthPx / hipWidthPx,
      WSR: waistWidthPx / shoulderWidthPx,
      SHR: shoulderWidthPx / hipWidthPx,
    };

    return { measurements, ratios };
  }

  /**
   * Compute average landmark confidence
   */
  private computeAverageLandmarkConfidence(landmarks: PoseLandmark[]): number {
    const keyIndices = [
      LANDMARK_INDICES.LEFT_SHOULDER,
      LANDMARK_INDICES.RIGHT_SHOULDER,
      LANDMARK_INDICES.LEFT_HIP,
      LANDMARK_INDICES.RIGHT_HIP,
    ];

    const scores = keyIndices
      .map(idx => landmarks[idx]?.score ?? 0)
      .filter(s => s > 0);

    return scores.length > 0 
      ? scores.reduce((a, b) => a + b, 0) / scores.length 
      : 0;
  }
}

// ============================================================================
// Singleton
// ============================================================================

let analyzerInstance: HybridBodyAnalyzer | null = null;

export async function getHybridAnalyzer(): Promise<HybridBodyAnalyzer> {
  if (!analyzerInstance) {
    analyzerInstance = new HybridBodyAnalyzer();
    await analyzerInstance.initialize();
  }
  return analyzerInstance;
}

export function disposeHybridAnalyzer(): void {
  analyzerInstance = null;
}
