import { BodyShapeOutfitData, OutfitCard, SilhouetteItem, CapsuleFormula } from './types';

// ============================================================================
// HOURGLASS BODY SHAPE DATA
// ============================================================================
const hourglassOutfits: OutfitCard[] = [
  // Dresses
  {
    id: 'hg-dress-1',
    category: 'dresses',
    title: 'Wrap Dress',
    illustrationType: 'dress-wrap',
    worksWhy: 'The wrap silhouette naturally follows your balanced curves, creating a beautiful defined waist while flattering your proportions.',
    fitNotes: ['Look for true wrap styles vs faux-wrap', 'V-neckline elongates the torso', 'Tie at the natural waist for best effect'],
  },
  {
    id: 'hg-dress-2',
    category: 'dresses',
    title: 'Bodycon Dress',
    illustrationType: 'dress-bodycon',
    worksWhy: 'Celebrates your naturally balanced silhouette by following your curves smoothly from shoulder to hem.',
    fitNotes: ['Choose stretch fabrics for comfort', 'Midi length is universally flattering', 'Avoid overly tight fits—aim for skimming'],
  },
  {
    id: 'hg-dress-3',
    category: 'dresses',
    title: 'Fit & Flare Dress',
    illustrationType: 'dress-aline',
    worksWhy: 'The fitted bodice honors your defined waist while the flared skirt adds movement and elegance.',
    fitNotes: ['Nip at natural waist', 'Princess seams add structure', 'Great for events and everyday'],
  },
  {
    id: 'hg-dress-4',
    category: 'dresses',
    title: 'Belted Sheath',
    illustrationType: 'dress-slip',
    worksWhy: 'A structured sheath with a belt showcases your waist while keeping a polished, professional look.',
    fitNotes: ['Add a belt to define waist', 'Look for darting at bust and hips', 'Knee-length works for most occasions'],
  },
  // Tops
  {
    id: 'hg-top-1',
    category: 'tops',
    title: 'V-Neck Fitted Top',
    illustrationType: 'top-vneck',
    worksWhy: 'The V-neckline creates vertical lines that elongate, while the fitted cut honors your shape.',
    fitNotes: ['Tuck into high-waist bottoms', 'Look for stretch blends', 'Avoid boxy cuts'],
  },
  {
    id: 'hg-top-2',
    category: 'tops',
    title: 'Peplum Blouse',
    illustrationType: 'top-peplum',
    worksWhy: 'The peplum accentuates your defined waist while adding a feminine, polished detail.',
    fitNotes: ['Peplum should hit at hip bone', 'Pair with slim bottoms', 'Great for work and events'],
  },
  {
    id: 'hg-top-3',
    category: 'tops',
    title: 'Tailored Blazer',
    illustrationType: 'top-blazer',
    worksWhy: 'A nipped-waist blazer follows your natural curves and adds instant polish.',
    fitNotes: ['Look for princess seaming', 'Single-button creates waist emphasis', 'Should skim, not pull'],
  },
  // Bottoms
  {
    id: 'hg-bottom-1',
    category: 'bottoms',
    title: 'High-Waist Jeans',
    illustrationType: 'bottom-high-waist-jeans',
    worksWhy: 'High-rise sits at your natural waist, showcasing your curves and creating a long leg line.',
    fitNotes: ['Look for stretch denim', 'Bootcut or straight leg balances hips', 'Dark wash is versatile'],
  },
  {
    id: 'hg-bottom-2',
    category: 'bottoms',
    title: 'Pencil Skirt',
    illustrationType: 'bottom-pencil-skirt',
    worksWhy: 'The pencil silhouette glides over your curves beautifully, creating a streamlined look.',
    fitNotes: ['Knee-length is most flattering', 'Look for stretch or a back slit', 'Pair with tucked blouses'],
  },
  {
    id: 'hg-bottom-3',
    category: 'bottoms',
    title: 'Wide-Leg Trousers',
    illustrationType: 'bottom-wide-leg',
    worksWhy: 'High-waisted wide-legs honor your waist while creating elegant, elongating lines.',
    fitNotes: ['Must sit at natural waist', 'Pair with fitted tops', 'Great for a sophisticated look'],
  },
  // Outerwear
  {
    id: 'hg-outer-1',
    category: 'outerwear',
    title: 'Belted Trench Coat',
    illustrationType: 'outer-trench',
    worksWhy: 'The classic trench with a belt defines your waist and creates an hourglass silhouette.',
    fitNotes: ['Always belt at natural waist', 'Look for quality cotton or blend', 'Knee-length is classic'],
  },
  {
    id: 'hg-outer-2',
    category: 'outerwear',
    title: 'Fitted Tailored Coat',
    illustrationType: 'outer-tailored-coat',
    worksWhy: 'A tailored coat follows your shape rather than hiding it, maintaining your elegant silhouette.',
    fitNotes: ['Princess seams are ideal', 'Avoid boxy oversized styles', 'Single-breasted is sleeker'],
  },
  // Fabrics
  {
    id: 'hg-fabric-1',
    category: 'fabrics',
    title: 'Structured Fabrics',
    illustrationType: 'fabric-structure',
    worksWhy: 'Medium-weight structured fabrics hold shape without adding bulk, honoring your natural curves.',
    fitNotes: ['Cotton blends, ponte, wool crepe', 'Avoid very stiff or very flimsy', 'Quality fabric drapes better'],
  },
];

const hourglassSilhouettes: SilhouetteItem[] = [
  {
    id: 'sil-wrap',
    name: 'Wrap',
    icon: 'wrap',
    description: 'A wrap silhouette crosses over the body and ties at the waist, naturally following curves.',
    bestFor: ['Defined waist', 'Balanced proportions', 'Bust support'],
    tips: ['True wrap vs faux-wrap matters', 'V-neckline adds elongation', 'Adjustable fit'],
  },
  {
    id: 'sil-fitted',
    name: 'Fitted',
    icon: 'fitted',
    description: 'Fitted garments skim the body without being tight, following natural contours.',
    bestFor: ['Showcasing shape', 'Polished looks', 'Layering foundation'],
    tips: ['Should never pull or strain', 'Stretch fabrics help', 'Check fit at shoulders and bust'],
  },
  {
    id: 'sil-aline',
    name: 'A-Line',
    icon: 'aline',
    description: 'Fitted at top and gradually widens toward hem, like the letter A.',
    bestFor: ['Movement', 'Feminine elegance', 'Versatile occasions'],
    tips: ['Great for skirts and dresses', 'Can balance proportions', 'Universally flattering'],
  },
  {
    id: 'sil-high-waist',
    name: 'High-Waist',
    icon: 'highwaist',
    description: 'Sits at or above the natural waist, typically 1-2 inches above the belly button.',
    bestFor: ['Elongating legs', 'Defining waist', 'Tucked-in tops'],
    tips: ['Find your natural waist', 'Best with tucked or cropped tops', 'Creates balanced proportions'],
  },
  {
    id: 'sil-belted',
    name: 'Belted',
    icon: 'belted',
    description: 'Adding a belt at the natural waist to create definition and structure.',
    bestFor: ['Adding waist definition', 'Transforming loose garments', 'Polished finishing'],
    tips: ['Belt at narrowest point', 'Medium width is versatile', 'Match or contrast strategically'],
  },
];

const hourglassFormulas: CapsuleFormula[] = [
  {
    id: 'hg-formula-1',
    name: 'Effortless Work',
    occasion: 'Office & Meetings',
    items: [
      { type: 'top', name: 'Fitted V-Neck Blouse', icon: 'top-vneck' },
      { type: 'bottom', name: 'High-Waist Trousers', icon: 'bottom-wide-leg' },
      { type: 'layer', name: 'Tailored Blazer', icon: 'top-blazer' },
      { type: 'shoes', name: 'Pointed Flats', icon: 'shoes' },
    ],
    styling: 'Tuck the blouse, add a thin belt if blazer is open, keep accessories minimal.',
  },
  {
    id: 'hg-formula-2',
    name: 'Weekend Elevated',
    occasion: 'Casual Outings',
    items: [
      { type: 'top', name: 'Fitted Knit Top', icon: 'top-vneck' },
      { type: 'bottom', name: 'High-Rise Straight Jeans', icon: 'bottom-high-waist-jeans' },
      { type: 'layer', name: 'Cropped Jacket', icon: 'top-cropped-jacket' },
      { type: 'shoes', name: 'White Sneakers', icon: 'shoes' },
    ],
    styling: 'French tuck the top, roll jeans once at ankle, add a crossbody bag.',
  },
  {
    id: 'hg-formula-3',
    name: 'Date Night',
    occasion: 'Evening & Events',
    items: [
      { type: 'top', name: 'Wrap Dress', icon: 'dress-wrap' },
      { type: 'layer', name: 'Optional Cardigan', icon: 'top-blazer' },
      { type: 'shoes', name: 'Heeled Sandals', icon: 'shoes' },
      { type: 'accessory', name: 'Statement Earrings', icon: 'accessory' },
    ],
    styling: 'Keep the wrap dress as the focal point, add delicate jewelry, clutch bag.',
  },
  {
    id: 'hg-formula-4',
    name: 'Smart Casual',
    occasion: 'Lunch & Brunch',
    items: [
      { type: 'top', name: 'Peplum Top', icon: 'top-peplum' },
      { type: 'bottom', name: 'Pencil Skirt', icon: 'bottom-pencil-skirt' },
      { type: 'shoes', name: 'Block Heel Pumps', icon: 'shoes' },
      { type: 'accessory', name: 'Structured Bag', icon: 'accessory' },
    ],
    styling: 'The peplum adds visual interest—keep bottoms and accessories simple.',
  },
  {
    id: 'hg-formula-5',
    name: 'Travel Chic',
    occasion: 'Travel & Transit',
    items: [
      { type: 'top', name: 'Soft Wrap Top', icon: 'top-vneck' },
      { type: 'bottom', name: 'Ponte Leggings', icon: 'bottom-high-waist-jeans' },
      { type: 'layer', name: 'Long Cardigan', icon: 'outer-tailored-coat' },
      { type: 'shoes', name: 'Comfortable Loafers', icon: 'shoes' },
    ],
    styling: 'Wrap top can adjust temperature, ponte looks polished but stretches.',
  },
];

export const hourglassData: BodyShapeOutfitData = {
  shape: 'hourglass',
  shapeName: 'Hourglass',
  shapeDescription: 'Your shoulders and hips are balanced with a beautifully defined waist. This classic silhouette is enhanced by styles that honor your natural curves.',
  keyTips: [
    'Define your waist—it\'s your signature feature',
    'Choose fitted styles that skim rather than cling',
    'Wrap, belted, and tailored pieces are your friends',
    'Avoid boxy or overly loose silhouettes that hide your shape',
  ],
  outfitCards: hourglassOutfits,
  silhouettes: hourglassSilhouettes,
  capsuleFormulas: hourglassFormulas,
};
