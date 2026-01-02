import { 
  BodyMeasurements, 
  BodyRatios, 
  BodyShapeType, 
  BodyShapeResult, 
  QualityScore,
  DEFAULT_CLASSIFICATION_THRESHOLDS,
  ClassificationThresholds 
} from '@/types/camera';
import { MeasurementCalculator } from './MeasurementCalculator';

export class BodyShapeClassifier {
  private measurementCalculator: MeasurementCalculator;
  private thresholds: ClassificationThresholds;

  constructor(thresholds: ClassificationThresholds = DEFAULT_CLASSIFICATION_THRESHOLDS) {
    this.measurementCalculator = new MeasurementCalculator();
    this.thresholds = thresholds;
  }

  classify(measurements: BodyMeasurements, quality: QualityScore): BodyShapeResult {
    // Normalize measurements first
    const normalizedMeasurements = this.measurementCalculator.normalizeMeasurements(measurements);
    const ratios = this.measurementCalculator.calculateRatios(normalizedMeasurements);

    // Check for each body shape type
    const hourglassResult = this.checkHourglass(normalizedMeasurements, ratios);
    if (hourglassResult.confidence > 0.7) {
      return {
        ...hourglassResult,
        measurements: normalizedMeasurements,
        quality
      };
    }

    const pearResult = this.checkPear(normalizedMeasurements, ratios);
    if (pearResult.confidence > 0.7) {
      return {
        ...pearResult,
        measurements: normalizedMeasurements,
        quality
      };
    }

    const invertedTriangleResult = this.checkInvertedTriangle(normalizedMeasurements, ratios);
    if (invertedTriangleResult.confidence > 0.7) {
      return {
        ...invertedTriangleResult,
        measurements: normalizedMeasurements,
        quality
      };
    }

    const rectangleResult = this.checkRectangle(normalizedMeasurements, ratios);
    if (rectangleResult.confidence > 0.7) {
      return {
        ...rectangleResult,
        measurements: normalizedMeasurements,
        quality
      };
    }

    const appleResult = this.checkApple(normalizedMeasurements, ratios);
    if (appleResult.confidence > 0.7) {
      return {
        ...appleResult,
        measurements: normalizedMeasurements,
        quality
      };
    }

    // If no clear classification, return unknown
    return {
      shape: 'UNKNOWN',
      confidence: 0.5,
      ratios,
      measurements: normalizedMeasurements,
      quality
    };
  }

  private checkHourglass(measurements: BodyMeasurements, ratios: BodyRatios): { shape: BodyShapeType, confidence: number, ratios: BodyRatios } {
    const { shoulderWidth, waistCircumference, hipWidth } = measurements;
    const { shoulderToHip, waistToHip } = ratios;
    const { shoulderHipDiff, waistReduction } = this.thresholds.hourglass;

    // Hourglass: Shoulders and hips similar, waist significantly smaller
    const shoulderHipDifference = Math.abs(shoulderWidth - hipWidth);
    const waistReductionAmount = Math.min(shoulderWidth, hipWidth) - waistCircumference;

    const shoulderHipSimilarity = 1 - (shoulderHipDifference / Math.max(shoulderWidth, hipWidth));
    const waistDefinition = waistReductionAmount / Math.min(shoulderWidth, hipWidth);

    const shapeConfidence = (shoulderHipSimilarity + waistDefinition) / 2;

    if (shoulderHipDifference <= shoulderHipDiff && waistReductionAmount >= waistReduction) {
      return {
        shape: 'HOURGLASS',
        confidence: Math.min(shapeConfidence, 0.95),
        ratios
      };
    }

    return {
      shape: 'HOURGLASS',
      confidence: shapeConfidence,
      ratios
    };
  }

  private checkPear(measurements: BodyMeasurements, ratios: BodyRatios): { shape: BodyShapeType, confidence: number, ratios: BodyRatios } {
    const { shoulderWidth, hipWidth } = measurements;
    const { waistToHip } = ratios;
    const { hipShoulderDiff, waistHipRatio } = this.thresholds.pear;

    // Pear: Hips wider than shoulders, smaller waist-to-hip ratio
    const hipShoulderDifference = hipWidth - shoulderWidth;
    const hipDominance = hipShoulderDifference / Math.max(shoulderWidth, hipWidth);

    const shapeConfidence = (hipDominance + (1 - waistToHip)) / 2;

    if (hipShoulderDifference >= hipShoulderDiff && waistToHip <= waistHipRatio) {
      return {
        shape: 'PEAR',
        confidence: Math.min(shapeConfidence, 0.95),
        ratios
      };
    }

    return {
      shape: 'PEAR',
      confidence: shapeConfidence,
      ratios
    };
  }

  private checkInvertedTriangle(measurements: BodyMeasurements, ratios: BodyRatios): { shape: BodyShapeType, confidence: number, ratios: BodyRatios } {
    const { shoulderWidth, hipWidth } = measurements;
    const { shoulderToWaist } = ratios;
    const { shoulderHipDiff, shoulderWaistRatio } = this.thresholds.invertedTriangle;

    // Inverted Triangle: Shoulders wider than hips
    const shoulderHipDifference = shoulderWidth - hipWidth;
    const shoulderDominance = shoulderHipDifference / Math.max(shoulderWidth, hipWidth);

    const shapeConfidence = (shoulderDominance + (1 - shoulderToWaist)) / 2;

    if (shoulderHipDifference >= shoulderHipDiff && shoulderToWaist <= shoulderWaistRatio) {
      return {
        shape: 'INVERTED_TRIANGLE',
        confidence: Math.min(shapeConfidence, 0.95),
        ratios
      };
    }

    return {
      shape: 'INVERTED_TRIANGLE',
      confidence: shapeConfidence,
      ratios
    };
  }

  private checkRectangle(measurements: BodyMeasurements, ratios: BodyRatios): { shape: BodyShapeType, confidence: number, ratios: BodyRatios } {
    const { shoulderWidth, waistCircumference, hipWidth } = measurements;
    const { measurementVariance } = this.thresholds.rectangle;

    // Rectangle: All measurements similar
    const measurementsArray = [shoulderWidth, waistCircumference, hipWidth];
    const variance = this.measurementCalculator.calculateVariance(measurementsArray);
    const maxMeasurement = Math.max(...measurementsArray);
    const normalizedVariance = variance / maxMeasurement;

    const shapeConfidence = 1 - normalizedVariance;

    if (normalizedVariance <= measurementVariance) {
      return {
        shape: 'RECTANGLE',
        confidence: Math.min(shapeConfidence, 0.95),
        ratios
      };
    }

    return {
      shape: 'RECTANGLE',
      confidence: shapeConfidence,
      ratios
    };
  }

  private checkApple(measurements: BodyMeasurements, ratios: BodyRatios): { shape: BodyShapeType, confidence: number, ratios: BodyRatios } {
    const { shoulderWidth, waistCircumference, hipWidth } = measurements;
    const { waistDominance } = this.thresholds.apple;

    // Apple: Waist is the largest measurement
    const waistShoulderDifference = waistCircumference - shoulderWidth;
    const waistHipDifference = waistCircumference - hipWidth;
    
    const waistDominanceScore = (
      (Math.max(waistShoulderDifference, 0) / waistCircumference) +
      (Math.max(waistHipDifference, 0) / waistCircumference)
    ) / 2;

    const shapeConfidence = waistDominanceScore;

    if (waistCircumference >= shoulderWidth && 
        waistCircumference >= hipWidth + waistDominance) {
      return {
        shape: 'APPLE',
        confidence: Math.min(shapeConfidence, 0.95),
        ratios
      };
    }

    return {
      shape: 'APPLE',
      confidence: shapeConfidence,
      ratios
    };
  }

  calculateOverallConfidence(shapeResult: BodyShapeResult): number {
    const { confidence, quality } = shapeResult;
    
    // Combine classification confidence with quality score
    const qualityWeight = 0.3;
    const classificationWeight = 0.7;
    
    return (confidence * classificationWeight) + (quality.overall * qualityWeight);
  }

  getShapeDescription(shape: BodyShapeType): string {
    const descriptions: Record<BodyShapeType, string> = {
      HOURGLASS: 'Hourglass shape: Shoulders and hips are similar in width with a well-defined waist.',
      PEAR: 'Pear shape: Hips are wider than shoulders with a defined waist.',
      INVERTED_TRIANGLE: 'Inverted Triangle shape: Shoulders are wider than hips.',
      RECTANGLE: 'Rectangle shape: Shoulders, waist, and hips are similar in width.',
      APPLE: 'Apple shape: Waist is the widest part of the body.',
      UNKNOWN: 'Unable to determine body shape. Please try again with better lighting and positioning.'
    };

    return descriptions[shape];
  }

  getStyleRecommendations(shape: BodyShapeType): string[] {
    const recommendations: Record<BodyShapeType, string[]> = {
      HOURGLASS: [
        'Emphasize your waist with belts and fitted clothing',
        'Choose V-neck tops to highlight your balanced proportions',
        'A-line skirts and dresses work well',
        'Avoid shapeless or boxy clothing'
      ],
      PEAR: [
        'Draw attention upward with statement necklaces and earrings',
        'Choose tops with detailing on the shoulders',
        'Dark bottoms with brighter tops create balance',
        'A-line skirts and wide-leg pants are flattering'
      ],
      INVERTED_TRIANGLE: [
        'Create balance with fuller skirts and pants',
        'Choose V-neck or scoop neck tops',
        'Avoid shoulder pads or wide necklines',
        'Dark tops with lighter bottoms work well'
      ],
      RECTANGLE: [
        'Create curves with peplum tops and belted dresses',
        'Choose clothing with ruching or gathering at the waist',
        'A-line skirts create the illusion of curves',
        'Avoid boxy or shapeless silhouettes'
      ],
      APPLE: [
        'Empire waist dresses create a flattering silhouette',
        'Choose V-neck tops to elongate the torso',
        'Dark colors and vertical stripes are slimming',
        'Avoid tight clothing around the waist'
      ],
      UNKNOWN: [
        'Ensure good lighting and stand facing the camera',
        'Wear form-fitting clothing for better detection',
        'Stand about 6 feet from the camera',
        'Make sure your full body is visible in the frame'
      ]
    };

    return recommendations[shape];
  }
}