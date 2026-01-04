/**
 * SilhouetteMeasurer.ts
 * 
 * Extracts precise body width measurements from a segmentation mask
 * at anatomically-defined Y-levels (shoulder, bust, waist, hip).
 * 
 * Uses a vertical band ±Δ pixels around each level and computes
 * the median width for stability.
 */

import { PoseLandmark, LANDMARK_INDICES } from '@/types/camera';
import { SegmentationResult } from './SilhouetteSegmenter';

export interface AnatomicalLevels {
  shoulderY: number;    // Normalized Y (0-1)
  bustY: number;        // Normalized Y (0-1) - optional, estimated
  waistY: number;       // Normalized Y (0-1) - geometrically inferred
  hipY: number;         // Normalized Y (0-1)
}

export interface WidthMeasurement {
  leftEdge: number;     // X coordinate of left body edge (pixels)
  rightEdge: number;    // X coordinate of right body edge (pixels)
  width: number;        // Width in pixels (rightEdge - leftEdge)
  centerX: number;      // Center X coordinate (pixels)
  confidence: number;   // Measurement confidence (0-1)
  level: string;        // Which anatomical level
}

export interface SilhouetteWidths {
  shoulder: WidthMeasurement;
  bust: WidthMeasurement | null;     // Optional
  waist: WidthMeasurement;
  hip: WidthMeasurement;
  imageWidth: number;                 // Original image width
  imageHeight: number;                // Original image height
}

export interface SilhouetteRatios {
  WHR: number;    // Waist / Hip
  WSR: number;    // Waist / Shoulder
  SHR: number;    // Shoulder / Hip
  BWR?: number;   // Bust / Waist (optional)
}

export interface MeasurerConfig {
  bandHeight: number;         // ±pixels for measurement band
  minEdgeConfidence: number;  // Minimum confidence to accept edge
  smoothingKernel: number;    // Kernel size for edge smoothing
}

const DEFAULT_CONFIG: MeasurerConfig = {
  bandHeight: 10,             // ±10 pixels (20 pixel total band)
  minEdgeConfidence: 0.5,
  smoothingKernel: 3,
};

// Anatomical level estimation constants
const WAIST_POSITION = 0.35;   // Waist is 35% up from hips toward shoulders
const BUST_POSITION = 0.18;    // Bust is 18% down from shoulders toward hips

export class SilhouetteMeasurer {
  private config: MeasurerConfig;

  constructor(config: Partial<MeasurerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Compute anatomical Y-levels from pose landmarks
   */
  computeAnatomicalLevels(landmarks: PoseLandmark[]): AnatomicalLevels | null {
    const leftShoulder = landmarks[LANDMARK_INDICES.LEFT_SHOULDER];
    const rightShoulder = landmarks[LANDMARK_INDICES.RIGHT_SHOULDER];
    const leftHip = landmarks[LANDMARK_INDICES.LEFT_HIP];
    const rightHip = landmarks[LANDMARK_INDICES.RIGHT_HIP];

    // Check we have the required landmarks with sufficient confidence
    const requiredLandmarks = [leftShoulder, rightShoulder, leftHip, rightHip];
    if (requiredLandmarks.some(lm => !lm || lm.score < 0.5)) {
      console.warn('[SilhouetteMeasurer] Missing required landmarks');
      return null;
    }

    // Compute average Y positions
    const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipY = (leftHip.y + rightHip.y) / 2;

    // Torso height
    const torsoHeight = hipY - shoulderY;

    if (torsoHeight <= 0) {
      console.warn('[SilhouetteMeasurer] Invalid torso height (hips above shoulders)');
      return null;
    }

    // Waist is geometrically inferred (not a pose landmark)
    // Position: 35% up from hips toward shoulders
    const waistY = hipY - WAIST_POSITION * torsoHeight;

    // Bust is optional, estimated as 18% down from shoulders
    const bustY = shoulderY + BUST_POSITION * torsoHeight;

    return {
      shoulderY,
      bustY,
      waistY,
      hipY,
    };
  }

  /**
   * Measure width at a specific Y-level from segmentation mask
   * Uses a vertical band and computes median width for stability
   */
  measureWidthAtLevel(
    maskData: Uint8ClampedArray,
    width: number,
    height: number,
    normalizedY: number,
    levelName: string
  ): WidthMeasurement | null {
    // Convert normalized Y to pixel Y
    const centerPixelY = Math.round(normalizedY * height);
    const bandHalf = this.config.bandHeight;

    // Define measurement band
    const startY = Math.max(0, centerPixelY - bandHalf);
    const endY = Math.min(height - 1, centerPixelY + bandHalf);

    const widths: number[] = [];
    const leftEdges: number[] = [];
    const rightEdges: number[] = [];

    // Measure width at each row in the band
    for (let y = startY; y <= endY; y++) {
      let leftEdge = -1;
      let rightEdge = -1;

      // Scan from left to find left edge
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        if (maskData[idx] > 128) {  // Foreground pixel
          leftEdge = x;
          break;
        }
      }

      // Scan from right to find right edge
      for (let x = width - 1; x >= 0; x--) {
        const idx = (y * width + x) * 4;
        if (maskData[idx] > 128) {
          rightEdge = x;
          break;
        }
      }

      // Only include valid measurements (found both edges)
      if (leftEdge >= 0 && rightEdge > leftEdge) {
        const rowWidth = rightEdge - leftEdge;
        widths.push(rowWidth);
        leftEdges.push(leftEdge);
        rightEdges.push(rightEdge);
      }
    }

    // Need at least half the band to be valid
    const minValidRows = Math.floor((endY - startY + 1) * 0.5);
    if (widths.length < minValidRows) {
      console.warn(`[SilhouetteMeasurer] Insufficient valid rows at ${levelName} level`);
      return null;
    }

    // Compute median values for stability
    widths.sort((a, b) => a - b);
    leftEdges.sort((a, b) => a - b);
    rightEdges.sort((a, b) => a - b);

    const medianIdx = Math.floor(widths.length / 2);
    const medianWidth = widths[medianIdx];
    const medianLeft = leftEdges[medianIdx];
    const medianRight = rightEdges[medianIdx];

    // Calculate confidence based on consistency of measurements
    const variance = this.calculateVariance(widths);
    const maxVariance = medianWidth * 0.3;  // Allow 30% variance
    const confidence = Math.max(0, Math.min(1, 1 - (variance / maxVariance)));

    return {
      leftEdge: medianLeft,
      rightEdge: medianRight,
      width: medianWidth,
      centerX: (medianLeft + medianRight) / 2,
      confidence,
      level: levelName,
    };
  }

  /**
   * Calculate variance of an array of numbers
   */
  private calculateVariance(values: number[]): number {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
  }

  /**
   * Measure all anatomical widths from segmentation mask
   */
  measureWidths(
    segmentation: SegmentationResult,
    landmarks: PoseLandmark[],
    includeBust: boolean = false
  ): SilhouetteWidths | null {
    const levels = this.computeAnatomicalLevels(landmarks);
    if (!levels) {
      return null;
    }

    const { mask, width, height } = segmentation;
    const maskData = mask.data;

    // Measure at each level
    const shoulder = this.measureWidthAtLevel(
      maskData, width, height, levels.shoulderY, 'shoulder'
    );
    const waist = this.measureWidthAtLevel(
      maskData, width, height, levels.waistY, 'waist'
    );
    const hip = this.measureWidthAtLevel(
      maskData, width, height, levels.hipY, 'hip'
    );

    // Validate we got the essential measurements
    if (!shoulder || !waist || !hip) {
      console.warn('[SilhouetteMeasurer] Failed to measure essential levels');
      return null;
    }

    let bust: WidthMeasurement | null = null;
    if (includeBust) {
      bust = this.measureWidthAtLevel(
        maskData, width, height, levels.bustY, 'bust'
      );
    }

    return {
      shoulder,
      bust,
      waist,
      hip,
      imageWidth: width,
      imageHeight: height,
    };
  }

  /**
   * Compute body ratios from width measurements
   */
  computeRatios(widths: SilhouetteWidths): SilhouetteRatios {
    const ratios: SilhouetteRatios = {
      WHR: widths.waist.width / widths.hip.width,
      WSR: widths.waist.width / widths.shoulder.width,
      SHR: widths.shoulder.width / widths.hip.width,
    };

    if (widths.bust) {
      ratios.BWR = widths.bust.width / widths.waist.width;
    }

    return ratios;
  }

  /**
   * Compute a curvature index indicating how much the waist indents
   * compared to shoulders and hips. Higher = more defined waist.
   */
  computeWaistCurvatureIndex(widths: SilhouetteWidths): number {
    // Average of shoulder and hip widths
    const avgOuterWidth = (widths.shoulder.width + widths.hip.width) / 2;
    
    // How much smaller is the waist compared to the average?
    const indentation = 1 - (widths.waist.width / avgOuterWidth);
    
    // Clamp to 0-1 range
    return Math.max(0, Math.min(1, indentation));
  }

  /**
   * Convert pixel widths to estimated cm using a reference object
   * @param widths - Measured widths in pixels
   * @param cmPerPixel - Calibrated cm per pixel ratio
   */
  convertToCentimeters(
    widths: SilhouetteWidths,
    cmPerPixel: number
  ): { shoulder: number; bust: number | null; waist: number; hip: number } {
    return {
      shoulder: widths.shoulder.width * cmPerPixel,
      bust: widths.bust ? widths.bust.width * cmPerPixel : null,
      waist: widths.waist.width * cmPerPixel,
      hip: widths.hip.width * cmPerPixel,
    };
  }
}

// Export singleton instance
export const silhouetteMeasurer = new SilhouetteMeasurer();
