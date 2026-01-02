import { BodyShapeOutfitData, OutfitCard, SilhouetteItem, CapsuleFormula } from './types';

// ============================================================================
// PEAR BODY SHAPE DATA
// ============================================================================
const pearOutfits: OutfitCard[] = [
  // Dresses
  {
    id: 'pr-dress-1',
    category: 'dresses',
    title: 'Fit & Flare Dress',
    illustrationType: 'dress-aline',
    worksWhy: 'The fitted bodice draws attention upward while the flared skirt skims gracefully over hips, creating beautiful balance.',
    fitNotes: ['Empire or natural waist works well', 'Look for interesting neckline details', 'Midi length is particularly elegant'],
  },
  {
    id: 'pr-dress-2',
    category: 'dresses',
    title: 'Wrap Dress',
    illustrationType: 'dress-wrap',
    worksWhy: 'The V-neckline draws the eye upward while the wrap creates lovely drape over the hip area.',
    fitNotes: ['True wrap allows adjustment', 'Choose fluid fabrics', 'A-line skirt portion is ideal'],
  },
  {
    id: 'pr-dress-3',
    category: 'dresses',
    title: 'A-Line Dress',
    illustrationType: 'dress-aline',
    worksWhy: 'The gentle flare from waist creates elegant proportions and allows comfortable movement.',
    fitNotes: ['Structured bodice adds balance', 'Boat or scoop necklines widen shoulders', 'Avoid clingy fabrics at hip'],
  },
  {
    id: 'pr-dress-4',
    category: 'dresses',
    title: 'Shift Dress with Detail',
    illustrationType: 'dress-slip',
    worksWhy: 'A shift with shoulder or neckline details draws attention upward while maintaining a clean silhouette.',
    fitNotes: ['Add a statement necklace', 'Shoulder embellishment helps', 'Dark, solid colors below waist'],
  },
  // Tops
  {
    id: 'pr-top-1',
    category: 'tops',
    title: 'Structured Blazer',
    illustrationType: 'top-blazer',
    worksWhy: 'Structured shoulders create visual width up top, bringing beautiful balance to your silhouette.',
    fitNotes: ['Slight shoulder padding is great', 'End above widest hip point', 'Single-button creates clean line'],
  },
  {
    id: 'pr-top-2',
    category: 'tops',
    title: 'Boat Neck Top',
    illustrationType: 'top-vneck',
    worksWhy: 'The horizontal neckline visually widens the shoulder area, creating proportion harmony.',
    fitNotes: ['Great in bright colors or prints', 'Pair with dark bottoms', 'Can add statement earrings'],
  },
  {
    id: 'pr-top-3',
    category: 'tops',
    title: 'Off-Shoulder Blouse',
    illustrationType: 'top-peplum',
    worksWhy: 'Exposes and widens the shoulder line, creating a lovely focal point.',
    fitNotes: ['Feminine and flattering', 'Pair with streamlined bottoms', 'Great for special occasions'],
  },
  {
    id: 'pr-top-4',
    category: 'tops',
    title: 'Cropped Jacket',
    illustrationType: 'top-cropped-jacket',
    worksWhy: 'Ends above hip, adding structure to shoulders without adding volume where you don\'t need it.',
    fitNotes: ['Structured shoulders ideal', 'End at natural waist', 'Great layering piece'],
  },
  // Bottoms
  {
    id: 'pr-bottom-1',
    category: 'bottoms',
    title: 'Dark Bootcut Jeans',
    illustrationType: 'bottom-high-waist-jeans',
    worksWhy: 'The bootcut opening balances the hip visually, creating a long, elegant leg line.',
    fitNotes: ['High-rise supports waist', 'Dark wash is most versatile', 'Slight flare, not extreme'],
  },
  {
    id: 'pr-bottom-2',
    category: 'bottoms',
    title: 'A-Line Skirt',
    illustrationType: 'bottom-aline-skirt',
    worksWhy: 'Gently flares from waist, skimming over hips without clinging, creating smooth lines.',
    fitNotes: ['Knee-length or midi', 'Avoid gathered waistbands', 'Flat-front styles are best'],
  },
  {
    id: 'pr-bottom-3',
    category: 'bottoms',
    title: 'Wide-Leg Trousers',
    illustrationType: 'bottom-wide-leg',
    worksWhy: 'The uniform width from hip to hem creates a streamlined, elongating effect.',
    fitNotes: ['High-waisted works best', 'Flowing fabrics drape beautifully', 'Pair with fitted tops'],
  },
  {
    id: 'pr-bottom-4',
    category: 'bottoms',
    title: 'Straight-Leg Pants',
    illustrationType: 'bottom-high-waist-jeans',
    worksWhy: 'A straight line from hip to hem creates visual balance and elongation.',
    fitNotes: ['Not too tight at thigh', 'Dark neutrals most versatile', 'Great for workwear'],
  },
  // Outerwear
  {
    id: 'pr-outer-1',
    category: 'outerwear',
    title: 'Structured Trench',
    illustrationType: 'outer-trench',
    worksWhy: 'Epaulets and structured shoulders add width up top, while A-line skirt skims hips.',
    fitNotes: ['Look for shoulder detail', 'Belt at waist optional', 'A-line rather than straight'],
  },
  {
    id: 'pr-outer-2',
    category: 'outerwear',
    title: 'Cropped Biker Jacket',
    illustrationType: 'outer-biker-jacket',
    worksWhy: 'Ends at waist, adding structure to shoulders while keeping hips free and streamlined.',
    fitNotes: ['Asymmetric zip adds interest', 'Structure without bulk', 'Great with dresses and jeans'],
  },
  // Fabrics
  {
    id: 'pr-fabric-1',
    category: 'fabrics',
    title: 'Fluid Drape Below',
    illustrationType: 'fabric-drape',
    worksWhy: 'Soft, flowing fabrics skim over curves gracefully without adding visual weight.',
    fitNotes: ['Matte fabrics minimize', 'Avoid clingy jersey at hips', 'Structure on top, drape below'],
  },
];

const pearSilhouettes: SilhouetteItem[] = [
  {
    id: 'sil-aline',
    name: 'A-Line',
    icon: 'aline',
    description: 'Fitted at top and gradually widens toward hem, creating balance and movement.',
    bestFor: ['Balancing proportions', 'Comfortable fit', 'Elegant movement'],
    tips: ['Your go-to silhouette', 'Works for skirts and dresses', 'Universally flattering'],
  },
  {
    id: 'sil-bootcut',
    name: 'Bootcut',
    icon: 'bootcut',
    description: 'Fitted through thigh with a gentle flare from knee to hem.',
    bestFor: ['Balancing hips', 'Elongating legs', 'Everyday elegance'],
    tips: ['Subtle flare is key', 'Works with heels or flats', 'Dark colors most versatile'],
  },
  {
    id: 'sil-empire',
    name: 'Empire Waist',
    icon: 'empire',
    description: 'Waistline sits just below the bust with fabric flowing from there.',
    bestFor: ['Skimming midsection', 'Creating vertical line', 'Feminine elegance'],
    tips: ['Great for dresses', 'Draws eye upward', 'Choose structured bust'],
  },
  {
    id: 'sil-wide-leg',
    name: 'Wide-Leg',
    icon: 'wideleg',
    description: 'Uniform width from hip to hem creates a column effect.',
    bestFor: ['Streamlined silhouette', 'Formal occasions', 'Tall or long-legged looks'],
    tips: ['High-waist essential', 'Flowing fabric preferred', 'Pair with fitted tops'],
  },
  {
    id: 'sil-structured-shoulder',
    name: 'Structured Shoulder',
    icon: 'structured',
    description: 'Tops and jackets with shoulder definition to create width.',
    bestFor: ['Balancing proportions', 'Power dressing', 'Visual width on top'],
    tips: ['Slight padding helps', 'Blazers are perfect', 'Creates professional polish'],
  },
];

const pearFormulas: CapsuleFormula[] = [
  {
    id: 'pr-formula-1',
    name: 'Power Work Look',
    occasion: 'Office & Presentations',
    items: [
      { type: 'top', name: 'Boat Neck Blouse', icon: 'top-vneck' },
      { type: 'bottom', name: 'Dark Straight Trousers', icon: 'bottom-wide-leg' },
      { type: 'layer', name: 'Structured Blazer', icon: 'top-blazer' },
      { type: 'shoes', name: 'Pointed Pumps', icon: 'shoes' },
    ],
    styling: 'Light/bright top with dark bottoms draws eye upward. Blazer adds shoulder definition.',
  },
  {
    id: 'pr-formula-2',
    name: 'Weekend Balance',
    occasion: 'Casual Outings',
    items: [
      { type: 'top', name: 'Striped Boat Neck Tee', icon: 'top-vneck' },
      { type: 'bottom', name: 'Dark Bootcut Jeans', icon: 'bottom-high-waist-jeans' },
      { type: 'layer', name: 'Cropped Denim Jacket', icon: 'top-cropped-jacket' },
      { type: 'shoes', name: 'White Sneakers', icon: 'shoes' },
    ],
    styling: 'Horizontal stripes on top widen shoulders, cropped jacket ends at waist.',
  },
  {
    id: 'pr-formula-3',
    name: 'Evening Elegance',
    occasion: 'Date Night & Events',
    items: [
      { type: 'top', name: 'Fit & Flare Dress', icon: 'dress-aline' },
      { type: 'layer', name: 'Embellished Shrug', icon: 'top-cropped-jacket' },
      { type: 'shoes', name: 'Strappy Heels', icon: 'shoes' },
      { type: 'accessory', name: 'Statement Necklace', icon: 'accessory' },
    ],
    styling: 'A-line skirt flows beautifully, add sparkle or detail at neckline.',
  },
  {
    id: 'pr-formula-4',
    name: 'Polished Casual',
    occasion: 'Lunch & Shopping',
    items: [
      { type: 'top', name: 'V-Neck Sweater', icon: 'top-vneck' },
      { type: 'bottom', name: 'A-Line Midi Skirt', icon: 'bottom-aline-skirt' },
      { type: 'shoes', name: 'Ankle Boots', icon: 'shoes' },
      { type: 'accessory', name: 'Long Pendant Necklace', icon: 'accessory' },
    ],
    styling: 'V-neck elongates, A-line skims gracefully. Long necklace adds vertical line.',
  },
  {
    id: 'pr-formula-5',
    name: 'Summer Fresh',
    occasion: 'Warm Weather',
    items: [
      { type: 'top', name: 'Off-Shoulder Top', icon: 'top-peplum' },
      { type: 'bottom', name: 'Wide-Leg Linen Pants', icon: 'bottom-wide-leg' },
      { type: 'shoes', name: 'Wedge Sandals', icon: 'shoes' },
      { type: 'accessory', name: 'Straw Tote', icon: 'accessory' },
    ],
    styling: 'Off-shoulder draws eye up, wide-leg creates streamlined silhouette.',
  },
];

export const pearData: BodyShapeOutfitData = {
  shape: 'pear',
  shapeName: 'Pear',
  shapeDescription: 'Your hips are wider than your shoulders with a defined waist. This beautiful feminine shape is enhanced by creating visual balance and drawing attention upward.',
  keyTips: [
    'Add visual interest and width to your upper body',
    'Choose structured shoulders and detailed necklines',
    'Opt for A-line and bootcut silhouettes below the waist',
    'Dark, smooth fabrics on bottom; lighter colors and prints on top',
  ],
  outfitCards: pearOutfits,
  silhouettes: pearSilhouettes,
  capsuleFormulas: pearFormulas,
};
