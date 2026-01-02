// Types for visual outfit guides

export type BodyShape = 'hourglass' | 'pear' | 'inverted-triangle' | 'rectangle' | 'apple';

export type OutfitCategory = 'dresses' | 'tops' | 'bottoms' | 'outerwear' | 'fabrics';

export interface OutfitCard {
  id: string;
  category: OutfitCategory;
  title: string;
  illustrationType: ClothingIllustration;
  worksWhy: string;
  fitNotes: string[];
  priority?: number; // For sorting based on user preferences
}

export type ClothingIllustration = 
  | 'dress-bodycon'
  | 'dress-wrap'
  | 'dress-aline'
  | 'dress-slip'
  | 'top-vneck'
  | 'top-blazer'
  | 'top-cropped-jacket'
  | 'top-peplum'
  | 'bottom-high-waist-jeans'
  | 'bottom-wide-leg'
  | 'bottom-pencil-skirt'
  | 'bottom-aline-skirt'
  | 'outer-trench'
  | 'outer-tailored-coat'
  | 'outer-biker-jacket'
  | 'fabric-drape'
  | 'fabric-structure';

export interface SilhouetteItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  bestFor: string[];
  tips: string[];
}

export interface CapsuleFormula {
  id: string;
  name: string;
  occasion: string;
  items: FormulaItem[];
  styling: string;
}

export interface FormulaItem {
  type: 'top' | 'bottom' | 'layer' | 'shoes' | 'accessory';
  name: string;
  icon: ClothingIllustration | string;
}

export interface StylePreferences {
  goals: string[];
  vibes: string[];
  fitPreference: 'fitted' | 'relaxed' | 'mix';
  comfortBoundaries: {
    showLegs: boolean;
    showArms: boolean;
    showWaist: boolean;
  };
  struggleAreas: string[];
  occasions: string[];
  colorConfidence: 'neutrals' | 'some-color' | 'love-color';
  heightRange?: 'petite' | 'average' | 'tall';
}

export interface BodyShapeOutfitData {
  shape: BodyShape;
  shapeName: string;
  shapeDescription: string;
  keyTips: string[];
  outfitCards: OutfitCard[];
  silhouettes: SilhouetteItem[];
  capsuleFormulas: CapsuleFormula[];
}
