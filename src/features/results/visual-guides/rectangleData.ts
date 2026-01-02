import { BodyShapeOutfitData, OutfitCard, SilhouetteItem, CapsuleFormula } from './types';

// ============================================================================
// RECTANGLE BODY SHAPE DATA
// ============================================================================
const rectangleOutfits: OutfitCard[] = [
  // Dresses
  {
    id: 'rc-dress-1',
    category: 'dresses',
    title: 'Wrap Dress',
    illustrationType: 'dress-wrap',
    worksWhy: 'The wrap creates the illusion of curves by nipping at the waist and adding diagonal lines.',
    fitNotes: ['True wrap allows adjustment', 'Ruching adds dimension', 'V-neck elongates'],
  },
  {
    id: 'rc-dress-2',
    category: 'dresses',
    title: 'Belted Sheath',
    illustrationType: 'dress-slip',
    worksWhy: 'A sheath with a belt creates waist definition on a streamlined silhouette.',
    fitNotes: ['Add a statement belt', 'Choose structured fabrics', 'Peplum detail optional'],
  },
  {
    id: 'rc-dress-3',
    category: 'dresses',
    title: 'Fit & Flare Dress',
    illustrationType: 'dress-aline',
    worksWhy: 'The fitted bodice and flared skirt create curves and visual interest.',
    fitNotes: ['Nipped waist essential', 'Full skirt adds volume at hips', 'Great for special occasions'],
  },
  {
    id: 'rc-dress-4',
    category: 'dresses',
    title: 'Ruched Bodycon',
    illustrationType: 'dress-bodycon',
    worksWhy: 'Strategic ruching creates the illusion of curves and adds visual interest.',
    fitNotes: ['Side ruching is most flattering', 'Choose stretch fabrics', 'Avoid completely smooth bodycon'],
  },
  // Tops
  {
    id: 'rc-top-1',
    category: 'tops',
    title: 'Peplum Top',
    illustrationType: 'top-peplum',
    worksWhy: 'The peplum flare creates the illusion of a smaller waist and fuller hips.',
    fitNotes: ['Fitted bodice essential', 'Peplum should hit at hip bone', 'Great with slim pants'],
  },
  {
    id: 'rc-top-2',
    category: 'tops',
    title: 'Wrap Style Top',
    illustrationType: 'top-vneck',
    worksWhy: 'Creates diagonal lines and waist definition where it might not naturally exist.',
    fitNotes: ['Cross-body wrap is best', 'Ruching adds dimension', 'V-neck elongates'],
  },
  {
    id: 'rc-top-3',
    category: 'tops',
    title: 'Cropped Structured Top',
    illustrationType: 'top-cropped-jacket',
    worksWhy: 'Ending at the waist draws attention there and creates proportion play.',
    fitNotes: ['Pair with high-waist bottoms', 'Structured fabrics work well', 'Creates waist illusion'],
  },
  {
    id: 'rc-top-4',
    category: 'tops',
    title: 'Fitted Blazer with Belt',
    illustrationType: 'top-blazer',
    worksWhy: 'A belted blazer creates waist definition and adds structure.',
    fitNotes: ['Belt at natural waist', 'Nipped silhouette preferred', 'Single-button creates clean line'],
  },
  // Bottoms
  {
    id: 'rc-bottom-1',
    category: 'bottoms',
    title: 'High-Waist Jeans',
    illustrationType: 'bottom-high-waist-jeans',
    worksWhy: 'High-rise creates a waistline and elongates the leg.',
    fitNotes: ['Pocket placement adds curve', 'Back pockets help shape', 'Slight stretch for comfort'],
  },
  {
    id: 'rc-bottom-2',
    category: 'bottoms',
    title: 'A-Line Skirt',
    illustrationType: 'bottom-aline-skirt',
    worksWhy: 'Adds volume at the hips, creating the illusion of curves.',
    fitNotes: ['Fitted at waist', 'Flare adds hip dimension', 'Pleats add extra volume'],
  },
  {
    id: 'rc-bottom-3',
    category: 'bottoms',
    title: 'Pencil Skirt with Details',
    illustrationType: 'bottom-pencil-skirt',
    worksWhy: 'A pencil skirt with hip details or pockets creates curve illusion.',
    fitNotes: ['Look for peplum waist detail', 'Seaming adds dimension', 'High-waist defines waist'],
  },
  {
    id: 'rc-bottom-4',
    category: 'bottoms',
    title: 'Paperbag Waist Pants',
    illustrationType: 'bottom-wide-leg',
    worksWhy: 'The gathered waist creates dimension and visual interest at the waist.',
    fitNotes: ['Defines waist naturally', 'Add a belt for extra definition', 'Tapered leg balances'],
  },
  // Outerwear
  {
    id: 'rc-outer-1',
    category: 'outerwear',
    title: 'Belted Trench',
    illustrationType: 'outer-trench',
    worksWhy: 'The belt creates instant waist definition on any outfit.',
    fitNotes: ['Always wear belted', 'Look for details at shoulders', 'Knee-length is classic'],
  },
  {
    id: 'rc-outer-2',
    category: 'outerwear',
    title: 'Peplum Jacket',
    illustrationType: 'outer-biker-jacket',
    worksWhy: 'A jacket with peplum detail creates curves at the waist and hips.',
    fitNotes: ['Fitted through body', 'Flare at hips', 'Great alternative to standard blazer'],
  },
  // Fabrics
  {
    id: 'rc-fabric-1',
    category: 'fabrics',
    title: 'Textured & Layered',
    illustrationType: 'fabric-structure',
    worksWhy: 'Texture and layers add visual dimension and create the illusion of curves.',
    fitNotes: ['Ruffles, ruching, pleats', 'Interesting weaves', 'Strategic layering'],
  },
];

const rectangleSilhouettes: SilhouetteItem[] = [
  {
    id: 'sil-wrap',
    name: 'Wrap',
    icon: 'wrap',
    description: 'Crosses over the body creating diagonal lines and waist definition.',
    bestFor: ['Creating curves', 'Waist definition', 'Flattering fit'],
    tips: ['Your most flattering style', 'Works for tops and dresses', 'Adjustable fit'],
  },
  {
    id: 'sil-peplum',
    name: 'Peplum',
    icon: 'peplum',
    description: 'Fitted bodice with a flared ruffle at the waist.',
    bestFor: ['Creating waist', 'Adding hip volume', 'Feminine silhouette'],
    tips: ['Should hit at hip bone', 'Pair with slim bottoms', 'Instant curve creation'],
  },
  {
    id: 'sil-belted',
    name: 'Belted',
    icon: 'belted',
    description: 'Adding a belt to create waist definition.',
    bestFor: ['Creating waist', 'Breaking up straight lines', 'Adding shape to loose items'],
    tips: ['Your secret weapon', 'Medium width is versatile', 'Cinch everything'],
  },
  {
    id: 'sil-fit-flare',
    name: 'Fit & Flare',
    icon: 'fitflare',
    description: 'Fitted through bodice, flares from waist to hem.',
    bestFor: ['Creating curves', 'Special occasions', 'Feminine elegance'],
    tips: ['Emphasizes waist', 'Full skirt adds hip volume', 'Very flattering'],
  },
  {
    id: 'sil-ruched',
    name: 'Ruched',
    icon: 'ruched',
    description: 'Gathered fabric that creates dimension and visual curves.',
    bestFor: ['Adding dimension', 'Creating curves', 'Forgiving fit'],
    tips: ['Strategic placement matters', 'Side ruching is best', 'Adds visual interest'],
  },
];

const rectangleFormulas: CapsuleFormula[] = [
  {
    id: 'rc-formula-1',
    name: 'Curve Creation Work',
    occasion: 'Office & Professional',
    items: [
      { type: 'top', name: 'Wrap Blouse', icon: 'top-vneck' },
      { type: 'bottom', name: 'High-Waist Trousers', icon: 'bottom-wide-leg' },
      { type: 'layer', name: 'Belted Blazer', icon: 'top-blazer' },
      { type: 'shoes', name: 'Heeled Loafers', icon: 'shoes' },
    ],
    styling: 'Wrap creates diagonal lines, belt defines waist, high-rise elongates.',
  },
  {
    id: 'rc-formula-2',
    name: 'Weekend Shape',
    occasion: 'Casual Outings',
    items: [
      { type: 'top', name: 'Peplum Tee', icon: 'top-peplum' },
      { type: 'bottom', name: 'High-Rise Skinny Jeans', icon: 'bottom-high-waist-jeans' },
      { type: 'layer', name: 'Cropped Jacket', icon: 'top-cropped-jacket' },
      { type: 'shoes', name: 'Ankle Boots', icon: 'shoes' },
    ],
    styling: 'Peplum creates curves, cropped jacket emphasizes waist.',
  },
  {
    id: 'rc-formula-3',
    name: 'Date Night Curves',
    occasion: 'Evening & Events',
    items: [
      { type: 'top', name: 'Ruched Wrap Dress', icon: 'dress-wrap' },
      { type: 'accessory', name: 'Statement Belt', icon: 'accessory' },
      { type: 'shoes', name: 'Strappy Heels', icon: 'shoes' },
      { type: 'accessory', name: 'Drop Earrings', icon: 'accessory' },
    ],
    styling: 'Ruching adds dimension, wrap creates curves naturally.',
  },
  {
    id: 'rc-formula-4',
    name: 'Structured Elegance',
    occasion: 'Business Events',
    items: [
      { type: 'top', name: 'Fitted Peplum Top', icon: 'top-peplum' },
      { type: 'bottom', name: 'Pencil Skirt', icon: 'bottom-pencil-skirt' },
      { type: 'layer', name: 'Structured Blazer', icon: 'top-blazer' },
      { type: 'shoes', name: 'Pointed Pumps', icon: 'shoes' },
    ],
    styling: 'Peplum and pencil combo creates hourglass illusion.',
  },
  {
    id: 'rc-formula-5',
    name: 'Layered Dimension',
    occasion: 'Everyday Style',
    items: [
      { type: 'top', name: 'Fitted Tank', icon: 'top-vneck' },
      { type: 'layer', name: 'Tied Button-Up', icon: 'top-blazer' },
      { type: 'bottom', name: 'A-Line Skirt', icon: 'bottom-aline-skirt' },
      { type: 'shoes', name: 'Sneakers', icon: 'shoes' },
    ],
    styling: 'Tied shirt creates waist, A-line adds hip volume.',
  },
];

export const rectangleData: BodyShapeOutfitData = {
  shape: 'rectangle',
  shapeName: 'Rectangle',
  shapeDescription: 'Your shoulders, waist, and hips are similar in width, creating an elegant, streamlined silhouette. This versatile shape is enhanced by creating curves and waist definition through strategic styling.',
  keyTips: [
    'Create waist definition with belts, wrap styles, and peplums',
    'Add volume at shoulders or hips to break the straight line',
    'Embrace ruching, pleats, and textured fabrics',
    'Layer strategically to add dimension',
  ],
  outfitCards: rectangleOutfits,
  silhouettes: rectangleSilhouettes,
  capsuleFormulas: rectangleFormulas,
};
