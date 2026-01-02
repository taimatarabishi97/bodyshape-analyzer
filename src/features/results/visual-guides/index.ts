// Main export file for outfit data
import { hourglassData } from './hourglassData';
import { pearData } from './pearData';
import { invertedTriangleData } from './invertedTriangleData';
import { rectangleData } from './rectangleData';
import { appleData } from './appleData';
import { BodyShape, BodyShapeOutfitData, StylePreferences, OutfitCard } from './types';

export * from './types';
export { hourglassData, pearData, invertedTriangleData, rectangleData, appleData };

// Get data by body shape
export function getBodyShapeData(shape: string): BodyShapeOutfitData {
  const normalizedShape = shape.toLowerCase().replace(/[\s_]/g, '-');
  
  switch (normalizedShape) {
    case 'hourglass':
      return hourglassData;
    case 'pear':
      return pearData;
    case 'inverted-triangle':
    case 'invertedtriangle':
      return invertedTriangleData;
    case 'rectangle':
      return rectangleData;
    case 'apple':
      return appleData;
    default:
      // Default to hourglass if unknown
      console.warn(`Unknown body shape: ${shape}, defaulting to hourglass`);
      return hourglassData;
  }
}

// Personalize outfit recommendations based on user preferences
export function personalizeOutfits(
  baseOutfits: OutfitCard[],
  preferences?: StylePreferences
): OutfitCard[] {
  if (!preferences) return baseOutfits;
  
  // Clone and add priority scores based on preferences
  const scoredOutfits = baseOutfits.map(outfit => {
    let priority = 0;
    
    // Boost priority based on user goals
    if (preferences.goals.includes('define-waist')) {
      if (outfit.title.toLowerCase().includes('belt') || 
          outfit.title.toLowerCase().includes('wrap') ||
          outfit.title.toLowerCase().includes('peplum')) {
        priority += 2;
      }
    }
    
    if (preferences.goals.includes('elongate') || preferences.goals.includes('look-taller')) {
      if (outfit.title.toLowerCase().includes('v-neck') ||
          outfit.illustrationType.includes('vneck') ||
          outfit.title.toLowerCase().includes('high-waist')) {
        priority += 2;
      }
    }
    
    // Adjust based on comfort boundaries
    if (!preferences.comfortBoundaries.showLegs) {
      if (outfit.category === 'bottoms' && 
          (outfit.title.toLowerCase().includes('skirt') ||
           outfit.title.toLowerCase().includes('shorts'))) {
        priority -= 1;
      }
    }
    
    if (!preferences.comfortBoundaries.showArms) {
      if (outfit.illustrationType === 'top-vneck' ||
          outfit.title.toLowerCase().includes('sleeveless')) {
        priority -= 1;
      }
    }
    
    // Boost based on occasions
    if (preferences.occasions.includes('work')) {
      if (outfit.title.toLowerCase().includes('blazer') ||
          outfit.title.toLowerCase().includes('trouser') ||
          outfit.title.toLowerCase().includes('professional')) {
        priority += 1;
      }
    }
    
    if (preferences.occasions.includes('casual')) {
      if (outfit.title.toLowerCase().includes('jeans') ||
          outfit.title.toLowerCase().includes('casual')) {
        priority += 1;
      }
    }
    
    return { ...outfit, priority };
  });
  
  // Sort by priority (higher first), then by original order
  return scoredOutfits.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

// Get top tips summary for clipboard copy
export function getTopTipsSummary(data: BodyShapeOutfitData): string {
  const tips = data.keyTips.slice(0, 3);
  return `Body Shape: ${data.shapeName}\n\nTop Styling Tips:\n${tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}`;
}

// All body shapes for iteration
export const allBodyShapes: BodyShape[] = [
  'hourglass',
  'pear',
  'inverted-triangle',
  'rectangle',
  'apple'
];

// Display names mapping
export const bodyShapeDisplayNames: Record<BodyShape, string> = {
  'hourglass': 'Hourglass',
  'pear': 'Pear',
  'inverted-triangle': 'Inverted Triangle',
  'rectangle': 'Rectangle',
  'apple': 'Apple'
};
