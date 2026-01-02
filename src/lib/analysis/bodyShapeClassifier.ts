import type { BodyShape, QuestionnaireAnswers, OptionalMeasurements, AnalysisResult } from '@/types';

/**
 * Body Shape Classification Engine
 * 
 * This is a rules-based classification system that analyzes questionnaire responses
 * and optional measurements to determine body shape. No AI or medical claims are made.
 * 
 * Classification is based on fashion industry standards for body proportions.
 */

interface ClassificationScore {
  pear: number;
  hourglass: number;
  apple: number;
  rectangle: number;
  'inverted-triangle': number;
}

interface RecommendationData {
  name: string;
  description: string;
  recommendations: Array<{
    category: string;
    recommendations: string[];
    avoid: string[];
  }>;
  colorTips: string[];
  fitTips: string[];
}

export function classifyBodyShape(
  answers: QuestionnaireAnswers,
  measurements?: OptionalMeasurements
): BodyShape {
  const scores: ClassificationScore = {
    pear: 0,
    hourglass: 0,
    apple: 0,
    rectangle: 0,
    'inverted-triangle': 0,
  };

  // Analyze shoulder width
  if (answers.shoulderWidth === 'narrow') {
    scores.pear += 2;
    scores.apple += 1;
  } else if (answers.shoulderWidth === 'broad') {
    scores['inverted-triangle'] += 2;
    scores.apple += 1;
  } else {
    scores.hourglass += 1;
    scores.rectangle += 1;
  }

  // Analyze hip width
  if (answers.hipWidth === 'wide') {
    scores.pear += 2;
    scores.hourglass += 1;
  } else if (answers.hipWidth === 'narrow') {
    scores['inverted-triangle'] += 2;
    scores.apple += 1;
    scores.rectangle += 1;
  } else {
    scores.hourglass += 1;
    scores.rectangle += 1;
  }

  // Analyze waist definition
  if (answers.waistDefinition === 'very-defined') {
    scores.hourglass += 3;
    scores.pear += 1;
  } else if (answers.waistDefinition === 'somewhat-defined') {
    scores.hourglass += 2;
    scores.pear += 1;
  } else if (answers.waistDefinition === 'straight' || answers.waistDefinition === 'undefined') {
    scores.rectangle += 2;
    scores.apple += 2;
  }

  // Analyze weight distribution
  if (answers.weightDistribution === 'lower-body') {
    scores.pear += 3;
  } else if (answers.weightDistribution === 'upper-body') {
    scores['inverted-triangle'] += 2;
    scores.apple += 1;
  } else if (answers.weightDistribution === 'midsection') {
    scores.apple += 3;
  } else if (answers.weightDistribution === 'evenly') {
    scores.hourglass += 2;
    scores.rectangle += 2;
  }

  // Analyze bust size
  if (answers.bustSize === 'large') {
    scores.apple += 1;
    scores.hourglass += 1;
    scores['inverted-triangle'] += 1;
  } else if (answers.bustSize === 'small') {
    scores.pear += 1;
    scores.rectangle += 1;
  }

  // Analyze largest body part
  if (answers.largestBodyPart === 'hips' || answers.largestBodyPart === 'thighs') {
    scores.pear += 2;
  } else if (answers.largestBodyPart === 'shoulders' || answers.largestBodyPart === 'bust') {
    scores['inverted-triangle'] += 2;
    scores.apple += 1;
  } else if (answers.largestBodyPart === 'waist') {
    scores.apple += 2;
  }

  // Analyze smallest body part
  if (answers.smallestBodyPart === 'shoulders') {
    scores.pear += 1;
  } else if (answers.smallestBodyPart === 'hips') {
    scores['inverted-triangle'] += 1;
  } else if (answers.smallestBodyPart === 'waist') {
    scores.hourglass += 2;
  }

  // If measurements are provided, use them for additional accuracy
  if (measurements && measurements.bust && measurements.waist && measurements.hips) {
    const { bust, waist, hips } = measurements;
    
    // Calculate ratios
    const bustToWaist = bust / waist;
    const hipsToWaist = hips / waist;
    const shoulderToHip = measurements.shoulderWidth && measurements.hips 
      ? measurements.shoulderWidth / measurements.hips 
      : bust / hips; // Use bust as proxy for shoulders if not provided

    // Hourglass: balanced bust and hips, defined waist
    if (bustToWaist >= 1.25 && hipsToWaist >= 1.25 && Math.abs(bust - hips) <= 5) {
      scores.hourglass += 3;
    }

    // Pear: hips significantly larger than bust
    if (hips > bust + 5 && hipsToWaist >= 1.25) {
      scores.pear += 3;
    }

    // Inverted Triangle: bust/shoulders significantly larger than hips
    if (bust > hips + 5 || shoulderToHip > 1.05) {
      scores['inverted-triangle'] += 3;
    }

    // Apple: waist measurement close to bust/hips
    if (bustToWaist < 1.15 && hipsToWaist < 1.15) {
      scores.apple += 3;
    }

    // Rectangle: all measurements similar
    if (Math.abs(bust - waist) <= 10 && Math.abs(hips - waist) <= 10) {
      scores.rectangle += 3;
    }
  }

  // Find the body shape with the highest score
  let maxScore = 0;
  let resultShape: BodyShape = 'rectangle'; // Default

  for (const [shape, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      resultShape = shape as BodyShape;
    }
  }

  return resultShape;
}

/**
 * Get detailed analysis result including recommendations
 */
export function getAnalysisResult(
  bodyShape: BodyShape,
  recommendations: Record<string, RecommendationData>
): AnalysisResult {
  const shapeData = recommendations[bodyShape];
  
  if (!shapeData) {
    throw new Error(`No recommendations found for body shape: ${bodyShape}`);
  }

  return {
    bodyShape,
    description: shapeData.description,
    stylingRecommendations: shapeData.recommendations,
    colorTips: shapeData.colorTips,
    fitTips: shapeData.fitTips,
  };
}