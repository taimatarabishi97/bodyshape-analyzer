import { BodyShapeOutfitData, OutfitCard, SilhouetteItem, CapsuleFormula } from './types';

// ============================================================================
// APPLE BODY SHAPE DATA
// ============================================================================
const appleOutfits: OutfitCard[] = [
  // Dresses
  {
    id: 'ap-dress-1',
    category: 'dresses',
    title: 'Empire Waist Dress',
    illustrationType: 'dress-slip',
    worksWhy: 'The waistline sits just below the bust at your narrowest point, with fabric flowing gracefully.',
    fitNotes: ['Fitted bust for support', 'Flowing A-line skirt', 'V-neck elongates'],
  },
  {
    id: 'ap-dress-2',
    category: 'dresses',
    title: 'Wrap Dress',
    illustrationType: 'dress-wrap',
    worksWhy: 'The wrap creates a V-neck that elongates while the wrap style drapes beautifully.',
    fitNotes: ['True wrap allows adjustment', 'A-line skirt preferred', 'Ruching can be flattering'],
  },
  {
    id: 'ap-dress-3',
    category: 'dresses',
    title: 'A-Line Shift',
    illustrationType: 'dress-aline',
    worksWhy: 'A gentle A-line flows away from the body while maintaining a polished silhouette.',
    fitNotes: ['V or scoop neckline best', 'Should skim, not cling', 'Knee-length is flattering'],
  },
  {
    id: 'ap-dress-4',
    category: 'dresses',
    title: 'Fit & Flare Dress',
    illustrationType: 'dress-aline',
    worksWhy: 'Fitted bodice showcases your bust while the flared skirt skims the midsection.',
    fitNotes: ['Empire or just under bust', 'Full skirt adds movement', 'Great for special occasions'],
  },
  // Tops
  {
    id: 'ap-top-1',
    category: 'tops',
    title: 'V-Neck Top',
    illustrationType: 'top-vneck',
    worksWhy: 'The V-neckline creates a vertical line that elongates and draws attention to your face.',
    fitNotes: ['Deep V is most flattering', 'Should drape, not cling', 'Avoid high necklines'],
  },
  {
    id: 'ap-top-2',
    category: 'tops',
    title: 'Empire Waist Top',
    illustrationType: 'top-peplum',
    worksWhy: 'Fitted at the bust with fabric flowing from below, creating a graceful line.',
    fitNotes: ['Supportive bust fit', 'Flowing fabric below', 'Creates beautiful drape'],
  },
  {
    id: 'ap-top-3',
    category: 'tops',
    title: 'Structured Blazer',
    illustrationType: 'top-blazer',
    worksWhy: 'A well-structured blazer creates strong shoulder lines and elongates the torso.',
    fitNotes: ['Single-button or open front', 'Should clear hip bone', 'Creates vertical lines'],
  },
  {
    id: 'ap-top-4',
    category: 'tops',
    title: 'Waterfall Cardigan',
    illustrationType: 'top-blazer',
    worksWhy: 'The flowing open front creates vertical lines and drapes beautifully.',
    fitNotes: ['Longer length covers hips', 'Creates visual slimming', 'Great layering piece'],
  },
  // Bottoms
  {
    id: 'ap-bottom-1',
    category: 'bottoms',
    title: 'Bootcut Pants',
    illustrationType: 'bottom-high-waist-jeans',
    worksWhy: 'The slight flare at the hem balances the silhouette and elongates the leg.',
    fitNotes: ['Mid-rise often most comfortable', 'Flat front preferred', 'Dark colors versatile'],
  },
  {
    id: 'ap-bottom-2',
    category: 'bottoms',
    title: 'Straight-Leg Trousers',
    illustrationType: 'bottom-wide-leg',
    worksWhy: 'A clean straight line from hip to hem creates elongation and balance.',
    fitNotes: ['Flat front is most flattering', 'Avoid pleats at waist', 'Comfortable rise'],
  },
  {
    id: 'ap-bottom-3',
    category: 'bottoms',
    title: 'A-Line Skirt',
    illustrationType: 'bottom-aline-skirt',
    worksWhy: 'Gently flares away from the body, creating movement and elegant lines.',
    fitNotes: ['Sits at narrowest point', 'Flows over midsection', 'Knee-length flattering'],
  },
  {
    id: 'ap-bottom-4',
    category: 'bottoms',
    title: 'Midi Skirt',
    illustrationType: 'bottom-aline-skirt',
    worksWhy: 'A midi length draws attention to slim lower legs and creates a long line.',
    fitNotes: ['A-line or straight', 'Flows gracefully', 'Showcases great legs'],
  },
  // Outerwear
  {
    id: 'ap-outer-1',
    category: 'outerwear',
    title: 'Longline Cardigan',
    illustrationType: 'outer-tailored-coat',
    worksWhy: 'Creates vertical lines and layers beautifully without adding bulk.',
    fitNotes: ['Open front creates V', 'Should hit mid-thigh or below', 'Flowing fabric preferred'],
  },
  {
    id: 'ap-outer-2',
    category: 'outerwear',
    title: 'A-Line Coat',
    illustrationType: 'outer-tailored-coat',
    worksWhy: 'The gentle flare creates space without adding structure at the midsection.',
    fitNotes: ['V-neckline preferred', 'Single-breasted is cleaner', 'Avoids bulk at center'],
  },
  // Fabrics
  {
    id: 'ap-fabric-1',
    category: 'fabrics',
    title: 'Draping Matte Fabrics',
    illustrationType: 'fabric-drape',
    worksWhy: 'Soft, matte fabrics drape away from the body without clinging or adding shine.',
    fitNotes: ['Matte jersey, rayon, silk', 'Avoid clingy or shiny', 'Quality fabric drapes better'],
  },
];

const appleSilhouettes: SilhouetteItem[] = [
  {
    id: 'sil-empire',
    name: 'Empire Waist',
    icon: 'empire',
    description: 'Waistline sits just below the bust, fabric flows from there.',
    bestFor: ['Highlighting bust', 'Flowing over midsection', 'Elegant drape'],
    tips: ['Your most flattering style', 'Works for tops and dresses', 'Creates beautiful line'],
  },
  {
    id: 'sil-vneck',
    name: 'V-Neckline',
    icon: 'vneck',
    description: 'A V-shaped neckline that creates elongation.',
    bestFor: ['Elongating torso', 'Drawing eye to face', 'Creating vertical lines'],
    tips: ['Deep V is most flattering', 'Avoid high necklines', 'Wrap styles create this'],
  },
  {
    id: 'sil-aline',
    name: 'A-Line',
    icon: 'aline',
    description: 'Gradually widens from top to hem, like the letter A.',
    bestFor: ['Graceful flow', 'Movement and elegance', 'Skimming silhouette'],
    tips: ['Works for skirts, dresses, coats', 'Should skim not cling', 'Very flattering'],
  },
  {
    id: 'sil-longline',
    name: 'Longline Layers',
    icon: 'longline',
    description: 'Longer cardigans, jackets, or vests that create vertical lines.',
    bestFor: ['Elongating silhouette', 'Creating vertical lines', 'Stylish layering'],
    tips: ['Open front creates V', 'Should hit mid-thigh or below', 'Flowing fabrics best'],
  },
  {
    id: 'sil-bootcut',
    name: 'Bootcut',
    icon: 'bootcut',
    description: 'Fitted through thigh with gentle flare from knee.',
    bestFor: ['Balancing proportions', 'Elongating legs', 'Classic elegance'],
    tips: ['Creates visual balance', 'Mid-rise often comfortable', 'Dark colors versatile'],
  },
];

const appleFormulas: CapsuleFormula[] = [
  {
    id: 'ap-formula-1',
    name: 'Elegant Professional',
    occasion: 'Office & Meetings',
    items: [
      { type: 'top', name: 'V-Neck Blouse', icon: 'top-vneck' },
      { type: 'bottom', name: 'Straight-Leg Trousers', icon: 'bottom-wide-leg' },
      { type: 'layer', name: 'Longline Blazer', icon: 'top-blazer' },
      { type: 'shoes', name: 'Pointed Flats', icon: 'shoes' },
    ],
    styling: 'V-neck elongates, longline blazer creates vertical lines.',
  },
  {
    id: 'ap-formula-2',
    name: 'Weekend Ease',
    occasion: 'Casual Outings',
    items: [
      { type: 'top', name: 'Empire Waist Tunic', icon: 'top-peplum' },
      { type: 'bottom', name: 'Dark Bootcut Jeans', icon: 'bottom-high-waist-jeans' },
      { type: 'layer', name: 'Longline Cardigan', icon: 'outer-tailored-coat' },
      { type: 'shoes', name: 'White Sneakers', icon: 'shoes' },
    ],
    styling: 'Empire top with open cardigan creates vertical lines throughout.',
  },
  {
    id: 'ap-formula-3',
    name: 'Special Evening',
    occasion: 'Date Night & Events',
    items: [
      { type: 'top', name: 'Empire Wrap Dress', icon: 'dress-wrap' },
      { type: 'accessory', name: 'Statement Necklace', icon: 'accessory' },
      { type: 'shoes', name: 'Kitten Heels', icon: 'shoes' },
      { type: 'accessory', name: 'Clutch Bag', icon: 'accessory' },
    ],
    styling: 'Wrap dress with empire waist flatters beautifully. Statement necklace draws eye up.',
  },
  {
    id: 'ap-formula-4',
    name: 'Polished Casual',
    occasion: 'Brunch & Shopping',
    items: [
      { type: 'top', name: 'V-Neck Knit', icon: 'top-vneck' },
      { type: 'bottom', name: 'A-Line Midi Skirt', icon: 'bottom-aline-skirt' },
      { type: 'layer', name: 'Waterfall Cardigan', icon: 'outer-tailored-coat' },
      { type: 'shoes', name: 'Ankle Boots', icon: 'shoes' },
    ],
    styling: 'A-line skirt showcases legs, cardigan creates elongating vertical.',
  },
  {
    id: 'ap-formula-5',
    name: 'Summer Fresh',
    occasion: 'Warm Weather',
    items: [
      { type: 'top', name: 'Flowy V-Neck Top', icon: 'top-vneck' },
      { type: 'bottom', name: 'Wide-Leg Cropped Pants', icon: 'bottom-wide-leg' },
      { type: 'shoes', name: 'Wedge Sandals', icon: 'shoes' },
      { type: 'accessory', name: 'Long Pendant', icon: 'accessory' },
    ],
    styling: 'Cropped wide-leg shows ankles, long pendant adds vertical line.',
  },
];

export const appleData: BodyShapeOutfitData = {
  shape: 'apple',
  shapeName: 'Apple',
  shapeDescription: 'You carry weight through your midsection with slimmer legs and often a beautiful bust. This shape is flattered by styles that elongate, create vertical lines, and flow gracefully over the center.',
  keyTips: [
    'Empire waistlines and V-necklines are your best friends',
    'Create vertical lines with longline layers and open cardigans',
    'Choose fabrics that drape rather than cling',
    'Show off your great legs and décolletage',
  ],
  outfitCards: appleOutfits,
  silhouettes: appleSilhouettes,
  capsuleFormulas: appleFormulas,
};
