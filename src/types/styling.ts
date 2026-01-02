// Styling guide types for body shape analysis results

export interface StylingTip {
  title: string;
  description: string;
  icon?: string;
}

export interface ClothingCategory {
  category: 'tops' | 'bottoms' | 'dresses' | 'outerwear';
  title: string;
  recommendations: StylingTip[];
  icon: string;
}

export interface OutfitFormula {
  id: string;
  title: string;
  occasion: string;
  description: string;
  items: string[];
  image?: string;
}

export interface WhatToAvoid {
  title: string;
  description: string;
  reason: string;
  alternative: string;
}

export interface BodyShapeStylingGuide {
  shape: 'HOURGLASS' | 'PEAR' | 'RECTANGLE' | 'INVERTED_TRIANGLE' | 'APPLE' | 'UNKNOWN';
  
  // Core information
  description: string;
  keyCharacteristics: string[];
  stylingGoals: string[];
  
  // Visual representation
  silhouetteImage: string;
  illustrationImage?: string;
  
  // Detailed styling guidance
  bestSilhouettes: StylingTip[];
  clothingCategories: ClothingCategory[];
  fabricsAndFits: StylingTip[];
  
  // What to consider avoiding (gentle suggestions)
  considerations: WhatToAvoid[];
  
  // Complete outfit examples
  outfitFormulas: OutfitFormula[];
  
  // Confidence and metadata
  confidence: number;
  lastUpdated: string;
}

export interface ResultsPageProps {
  bodyShapeResult: {
    shape: 'HOURGLASS' | 'PEAR' | 'RECTANGLE' | 'INVERTED_TRIANGLE' | 'APPLE' | 'UNKNOWN';
    confidence: number;
    measurements: {
      shoulderWidth: number;
      waistCircumference: number;
      hipWidth: number;
      height: number;
    };
    ratios: {
      shoulderToHip: number;
      waistToHip: number;
      shoulderToWaist: number;
    };
    quality: {
      overall: number;
      landmarks: number;
      stability: number;
      lighting: number;
      framing: number;
    };
  };
  source: 'camera' | 'manual';
  timestamp: string;
}

export interface IllustrationProps {
  type: 'silhouette' | 'icon' | 'outfit';
  shape?: 'HOURGLASS' | 'PEAR' | 'RECTANGLE' | 'INVERTED_TRIANGLE' | 'APPLE';
  category?: 'dress' | 'top' | 'bottom' | 'outerwear';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}