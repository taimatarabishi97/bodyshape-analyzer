import { PoseLandmark, LANDMARK_INDICES, BodyMeasurements, BodyRatios } from '@/types/camera';

export class MeasurementCalculator {
  calculateShoulderWidth(landmarks: PoseLandmark[]): number {
    const leftShoulder = landmarks[LANDMARK_INDICES.LEFT_SHOULDER];
    const rightShoulder = landmarks[LANDMARK_INDICES.RIGHT_SHOULDER];

    if (!leftShoulder || !rightShoulder) {
      throw new Error('Shoulder landmarks not found');
    }

    // Calculate Euclidean distance between shoulders
    return Math.sqrt(
      Math.pow(rightShoulder.x - leftShoulder.x, 2) +
      Math.pow(rightShoulder.y - leftShoulder.y, 2)
    );
  }

  calculateHipWidth(landmarks: PoseLandmark[]): number {
    const leftHip = landmarks[LANDMARK_INDICES.LEFT_HIP];
    const rightHip = landmarks[LANDMARK_INDICES.RIGHT_HIP];

    if (!leftHip || !rightHip) {
      throw new Error('Hip landmarks not found');
    }

    // Calculate Euclidean distance between hips
    return Math.sqrt(
      Math.pow(rightHip.x - leftHip.x, 2) +
      Math.pow(rightHip.y - leftHip.y, 2)
    );
  }

  calculateWaistCircumference(landmarks: PoseLandmark[]): number {
    const leftShoulder = landmarks[LANDMARK_INDICES.LEFT_SHOULDER];
    const rightShoulder = landmarks[LANDMARK_INDICES.RIGHT_SHOULDER];
    const leftHip = landmarks[LANDMARK_INDICES.LEFT_HIP];
    const rightHip = landmarks[LANDMARK_INDICES.RIGHT_HIP];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      throw new Error('Required landmarks for waist calculation not found');
    }

    // Calculate shoulder width and hip width
    const shoulderWidth = this.calculateShoulderWidth(landmarks);
    const hipWidth = this.calculateHipWidth(landmarks);

    // Estimate waist width as interpolation between shoulders and hips
    // Waist is typically about 30% down from shoulders to hips
    const waistWidth = shoulderWidth * 0.7 + hipWidth * 0.3;
    
    // Approximate circumference from width (assuming elliptical shape)
    // Using formula: circumference ≈ π * (1.5 * (a + b) - sqrt(a*b))
    // where a and b are semi-axes. For simplicity, we'll use π * width as approximation
    return waistWidth * Math.PI;
  }

  calculateHeight(landmarks: PoseLandmark[]): number {
    const leftShoulder = landmarks[LANDMARK_INDICES.LEFT_SHOULDER];
    const rightShoulder = landmarks[LANDMARK_INDICES.RIGHT_SHOULDER];
    const leftAnkle = landmarks[LANDMARK_INDICES.LEFT_ANKLE];
    const rightAnkle = landmarks[LANDMARK_INDICES.RIGHT_ANKLE];

    if (!leftShoulder || !rightShoulder || !leftAnkle || !rightAnkle) {
      throw new Error('Required landmarks for height calculation not found');
    }

    // Calculate average shoulder and ankle positions
    const shoulderAvgY = (leftShoulder.y + rightShoulder.y) / 2;
    const ankleAvgY = (leftAnkle.y + rightAnkle.y) / 2;
    
    // Height is the vertical distance from ankles to shoulders
    return Math.abs(shoulderAvgY - ankleAvgY);
  }

  calculateBodyMeasurements(landmarks: PoseLandmark[]): BodyMeasurements {
    const shoulderWidth = this.calculateShoulderWidth(landmarks);
    const hipWidth = this.calculateHipWidth(landmarks);
    const waistCircumference = this.calculateWaistCircumference(landmarks);
    const height = this.calculateHeight(landmarks);

    return {
      shoulderWidth,
      waistCircumference,
      hipWidth,
      height
    };
  }

  calculateRatios(measurements: BodyMeasurements): BodyRatios {
    const { shoulderWidth, waistCircumference, hipWidth } = measurements;

    // Avoid division by zero
    if (hipWidth === 0) {
      throw new Error('Hip width cannot be zero');
    }
    if (waistCircumference === 0) {
      throw new Error('Waist circumference cannot be zero');
    }

    return {
      shoulderToHip: shoulderWidth / hipWidth,
      waistToHip: waistCircumference / hipWidth,
      shoulderToWaist: shoulderWidth / waistCircumference
    };
  }

  normalizeMeasurements(measurements: BodyMeasurements): BodyMeasurements {
    const { shoulderWidth, waistCircumference, hipWidth, height } = measurements;

    // Normalize all measurements by height to get relative proportions
    if (height === 0) {
      throw new Error('Height cannot be zero for normalization');
    }

    return {
      shoulderWidth: shoulderWidth / height,
      waistCircumference: waistCircumference / height,
      hipWidth: hipWidth / height,
      height: 1 // Height becomes 1 after normalization
    };
  }

  calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return variance;
  }

  calculateStandardDeviation(values: number[]): number {
    return Math.sqrt(this.calculateVariance(values));
  }

  calculateConfidence(landmarks: PoseLandmark[], keyLandmarkIndices: number[]): number {
    if (keyLandmarkIndices.length === 0) return 0;

    const confidences = keyLandmarkIndices.map(index => landmarks[index]?.score || 0);
    const averageConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    
    // Also consider how many key landmarks were detected
    const detectionRate = confidences.filter(conf => conf > 0.3).length / confidences.length;
    
    // Combine confidence and detection rate
    return averageConfidence * detectionRate;
  }
}