import { BodyShapeOutfitData, OutfitCard, SilhouetteItem, CapsuleFormula } from './types';

// ============================================================================
// INVERTED TRIANGLE BODY SHAPE DATA
// ============================================================================
const invertedTriangleOutfits: OutfitCard[] = [
  // Dresses
  {
    id: 'it-dress-1',
    category: 'dresses',
    title: 'A-Line Dress',
    illustrationType: 'dress-aline',
    worksWhy: 'The flared skirt adds volume below while keeping the top streamlined, creating lovely balance.',
    fitNotes: ['V or scoop neckline preferred', 'Avoid halter styles', 'Flare starts at waist or hip'],
  },
  {
    id: 'it-dress-2',
    category: 'dresses',
    title: 'Wrap Dress',
    illustrationType: 'dress-wrap',
    worksWhy: 'The V-neckline softens broad shoulders while the wrap adds volume at the hip area.',
    fitNotes: ['Deep V elongates torso', 'A-line skirt adds balance', 'Avoid stiff shoulder seams'],
  },
  {
    id: 'it-dress-3',
    category: 'dresses',
    title: 'Fit & Flare with Full Skirt',
    illustrationType: 'dress-aline',
    worksWhy: 'A fuller skirt creates volume in the lower body to balance your strong shoulder line.',
    fitNotes: ['Box pleats add volume', 'Midi length works beautifully', 'Avoid shoulder pads'],
  },
  {
    id: 'it-dress-4',
    category: 'dresses',
    title: 'Empire Waist Dress',
    illustrationType: 'dress-slip',
    worksWhy: 'Flow from under the bust creates gentle volume below while softening the shoulder area.',
    fitNotes: ['Soft, flowing fabrics', 'V-neck or sweetheart neckline', 'Movement in the skirt'],
  },
  // Tops
  {
    id: 'it-top-1',
    category: 'tops',
    title: 'V-Neck Soft Top',
    illustrationType: 'top-vneck',
    worksWhy: 'The V draws the eye vertically and inward, creating a softening effect on shoulders.',
    fitNotes: ['Deep V is most flattering', 'Soft fabrics, not stiff', 'Avoid boat necks and wide straps'],
  },
  {
    id: 'it-top-2',
    category: 'tops',
    title: 'Wrap Style Blouse',
    illustrationType: 'top-vneck',
    worksWhy: 'Creates diagonal lines that soften the shoulder area while adding waist definition.',
    fitNotes: ['Draping fabric works best', 'Pair with volume on bottom', 'Avoid puff sleeves'],
  },
  {
    id: 'it-top-3',
    category: 'tops',
    title: 'Raglan Sleeve Top',
    illustrationType: 'top-vneck',
    worksWhy: 'Raglan sleeves create diagonal seams that visually narrow the shoulder line.',
    fitNotes: ['Great for casual and athletic', 'Soft, stretchy fabrics', 'Creates a softer shoulder line'],
  },
  {
    id: 'it-top-4',
    category: 'tops',
    title: 'Soft Unstructured Blazer',
    illustrationType: 'top-blazer',
    worksWhy: 'A soft, unconstructed blazer provides polish without adding shoulder width.',
    fitNotes: ['No shoulder pads', 'Soft fabrics like jersey or knit', 'Single-button or open front'],
  },
  // Bottoms
  {
    id: 'it-bottom-1',
    category: 'bottoms',
    title: 'Wide-Leg Trousers',
    illustrationType: 'bottom-wide-leg',
    worksWhy: 'Adds volume to the lower body, creating beautiful balance with your shoulders.',
    fitNotes: ['High-waist or mid-rise', 'Full leg from hip to hem', 'Lighter colors add volume'],
  },
  {
    id: 'it-bottom-2',
    category: 'bottoms',
    title: 'A-Line Skirt',
    illustrationType: 'bottom-aline-skirt',
    worksWhy: 'The flare adds visual weight to your lower body, balancing proportions.',
    fitNotes: ['Can add prints and details', 'Pleats add extra volume', 'Light colors work wonderfully'],
  },
  {
    id: 'it-bottom-3',
    category: 'bottoms',
    title: 'Bootcut or Flare Jeans',
    illustrationType: 'bottom-high-waist-jeans',
    worksWhy: 'The flare at the hem creates width at the bottom to balance your silhouette.',
    fitNotes: ['Medium to dark wash versatile', 'Pockets add detail at hip', 'Can try lighter washes too'],
  },
  {
    id: 'it-bottom-4',
    category: 'bottoms',
    title: 'Detailed Skirt',
    illustrationType: 'bottom-aline-skirt',
    worksWhy: 'Ruffles, pleats, or prints on skirts draw the eye down and add visual interest.',
    fitNotes: ['Cargo pockets work great', 'Horizontal details below waist', 'Tiered skirts add volume'],
  },
  // Outerwear
  {
    id: 'it-outer-1',
    category: 'outerwear',
    title: 'A-Line Coat',
    illustrationType: 'outer-tailored-coat',
    worksWhy: 'Flares from shoulder or waist, adding volume below while keeping shoulders streamlined.',
    fitNotes: ['Avoid epaulets', 'V-neck or collarless preferred', 'Single-breasted is cleaner'],
  },
  {
    id: 'it-outer-2',
    category: 'outerwear',
    title: 'Waterfall Cardigan',
    illustrationType: 'outer-tailored-coat',
    worksWhy: 'The soft, draped front creates vertical lines that elongate and soften.',
    fitNotes: ['No shoulder seams', 'Soft, flowing fabric', 'Great layering piece'],
  },
  // Fabrics
  {
    id: 'it-fabric-1',
    category: 'fabrics',
    title: 'Soft Draping Fabrics',
    illustrationType: 'fabric-drape',
    worksWhy: 'Soft fabrics fall gently over shoulders without adding bulk or structure.',
    fitNotes: ['Jersey, silk, rayon', 'Avoid stiff cotton at shoulders', 'Matte fabrics soften'],
  },
];

const invertedTriangleSilhouettes: SilhouetteItem[] = [
  {
    id: 'sil-vneck',
    name: 'V-Neckline',
    icon: 'vneck',
    description: 'A V-shaped neckline that draws the eye inward and downward.',
    bestFor: ['Softening shoulders', 'Elongating torso', 'Creating vertical lines'],
    tips: ['The deeper the V, the more elongating', 'Wrap styles create this naturally', 'Avoid wide necklines'],
  },
  {
    id: 'sil-aline',
    name: 'A-Line',
    icon: 'aline',
    description: 'Fitted at top and gradually widens toward hem.',
    bestFor: ['Adding volume below', 'Balancing shoulders', 'Elegant movement'],
    tips: ['Your most flattering silhouette', 'Works for skirts, dresses, coats', 'Creates proportion harmony'],
  },
  {
    id: 'sil-wide-leg',
    name: 'Wide-Leg',
    icon: 'wideleg',
    description: 'Full-leg pants that add volume to the lower body.',
    bestFor: ['Balancing broad shoulders', 'Creating proportion', 'Sophisticated looks'],
    tips: ['Light colors add volume', 'Palazzo styles work great', 'Pair with soft tops'],
  },
  {
    id: 'sil-raglan',
    name: 'Raglan Sleeve',
    icon: 'raglan',
    description: 'Sleeves that extend from the neckline diagonally.',
    bestFor: ['Softening shoulder line', 'Athletic-inspired looks', 'Comfortable fit'],
    tips: ['Creates diagonal line across shoulder', 'Great for casual wear', 'Avoid if you want structure'],
  },
  {
    id: 'sil-empire',
    name: 'Empire Waist',
    icon: 'empire',
    description: 'Waistline sits just below bust, fabric flows from there.',
    bestFor: ['Creating flow', 'Softening silhouette', 'Feminine elegance'],
    tips: ['Draws attention to bust', 'Fabric should flow, not cling', 'Great for dresses'],
  },
];

const invertedTriangleFormulas: CapsuleFormula[] = [
  {
    id: 'it-formula-1',
    name: 'Balanced Professional',
    occasion: 'Office & Meetings',
    items: [
      { type: 'top', name: 'V-Neck Blouse', icon: 'top-vneck' },
      { type: 'bottom', name: 'Wide-Leg Trousers', icon: 'bottom-wide-leg' },
      { type: 'layer', name: 'Soft Unstructured Blazer', icon: 'top-blazer' },
      { type: 'shoes', name: 'Pointed Flats', icon: 'shoes' },
    ],
    styling: 'Wide-leg pants balance shoulders, soft blazer avoids adding width on top.',
  },
  {
    id: 'it-formula-2',
    name: 'Weekend Harmony',
    occasion: 'Casual Outings',
    items: [
      { type: 'top', name: 'Raglan Sleeve Tee', icon: 'top-vneck' },
      { type: 'bottom', name: 'Flare Jeans', icon: 'bottom-high-waist-jeans' },
      { type: 'layer', name: 'Waterfall Cardigan', icon: 'outer-tailored-coat' },
      { type: 'shoes', name: 'Platform Sneakers', icon: 'shoes' },
    ],
    styling: 'Raglan sleeves soften shoulders, flare jeans add volume below.',
  },
  {
    id: 'it-formula-3',
    name: 'Feminine Evening',
    occasion: 'Date Night & Events',
    items: [
      { type: 'top', name: 'Wrap Dress', icon: 'dress-wrap' },
      { type: 'accessory', name: 'Long Pendant', icon: 'accessory' },
      { type: 'shoes', name: 'Strappy Sandals', icon: 'shoes' },
      { type: 'accessory', name: 'Drop Earrings', icon: 'accessory' },
    ],
    styling: 'V-neck wrap with full skirt. Long necklace adds vertical line.',
  },
  {
    id: 'it-formula-4',
    name: 'Effortless Chic',
    occasion: 'Brunch & Shopping',
    items: [
      { type: 'top', name: 'Soft V-Neck Sweater', icon: 'top-vneck' },
      { type: 'bottom', name: 'A-Line Midi Skirt', icon: 'bottom-aline-skirt' },
      { type: 'shoes', name: 'Ankle Boots', icon: 'shoes' },
      { type: 'accessory', name: 'Crossbody Bag', icon: 'accessory' },
    ],
    styling: 'Soft knit with volume in skirt creates perfect balance.',
  },
  {
    id: 'it-formula-5',
    name: 'Summer Flow',
    occasion: 'Warm Weather',
    items: [
      { type: 'top', name: 'Flowy Camisole', icon: 'top-vneck' },
      { type: 'bottom', name: 'Wide-Leg Linen Pants', icon: 'bottom-wide-leg' },
      { type: 'layer', name: 'Light Kimono', icon: 'fabric-drape' },
      { type: 'shoes', name: 'Flat Sandals', icon: 'shoes' },
    ],
    styling: 'Soft, flowing layers create movement and balance proportions.',
  },
];

export const invertedTriangleData: BodyShapeOutfitData = {
  shape: 'inverted-triangle',
  shapeName: 'Inverted Triangle',
  shapeDescription: 'Your shoulders are broader than your hips, often with an athletic build. This striking silhouette is balanced by adding volume and interest to the lower body while softening the shoulder line.',
  keyTips: [
    'Soften the shoulder line with V-necks and raglan sleeves',
    'Add volume to the lower body with A-line and wide-leg styles',
    'Avoid shoulder pads, epaulets, and boat necklines',
    'Light colors and patterns below the waist help create balance',
  ],
  outfitCards: invertedTriangleOutfits,
  silhouettes: invertedTriangleSilhouettes,
  capsuleFormulas: invertedTriangleFormulas,
};
