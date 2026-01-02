import { BodyShapeStylingGuide } from '@/types/styling';

export const appleGuide: BodyShapeStylingGuide = {
  shape: 'APPLE',
  description: 'The apple shape carries weight around the midsection with slimmer limbs. Your silhouette is rounded through the torso with beautiful slender arms and legs to showcase.',
  keyCharacteristics: [
    'Weight carried around midsection',
    'Slimmer arms and legs',
    'Less defined waist',
    'Fuller bust and back'
  ],
  stylingGoals: [
    'Create vertical elongation',
    'Draw attention to face and limbs',
    'Define waist without constriction',
    'Create clean, uninterrupted lines'
  ],
  silhouetteImage: 'https://mgx-backend-cdn.metadl.com/generate/images/874524/2026-01-01/15044550-d4d1-4505-bb90-6faaad80f755.png',
  bestSilhouettes: [
    {
      title: 'Empire Waists',
      description: 'Dresses that gather under bust'
    },
    {
      title: 'A-line Shapes',
      description: 'Skirts and dresses that flare from under bust'
    },
    {
      title: 'Wrap Styles',
      description: 'Create diagonal lines and gentle definition'
    },
    {
      title: 'Structured Shapes',
      description: 'Clothing that holds its own shape'
    }
  ],
  clothingCategories: [
    {
      category: 'tops',
      title: 'Tops & Blouses',
      icon: 'https://mgx-backend-cdn.metadl.com/generate/images/874524/2026-01-01/de471781-3858-451c-9286-45fa372306d6.png',
      recommendations: [
        {
          title: 'V-necks and scoop necks',
          description: 'Draw eye downward and elongate torso'
        },
        {
          title: 'Empire waist tops',
          description: 'Define smallest part of torso'
        },
        {
          title: 'Tops with vertical details',
          description: 'Create elongation'
        },
        {
          title: 'Three-quarter length sleeves',
          description: 'Showcase slender arms'
        }
      ]
    },
    {
      category: 'bottoms',
      title: 'Bottoms',
      icon: 'https://mgx-backend-cdn.metadl.com/generate/images/874524/2026-01-01/ec1748d4-9ea9-4878-acf6-8e46b7b986c8.png',
      recommendations: [
        {
          title: 'A-line and flared skirts',
          description: 'Balance torso proportions'
        },
        {
          title: 'Mid-rise pants and skirts',
          description: 'Avoid cutting at widest part'
        },
        {
          title: 'Straight-leg and wide-leg pants',
          description: 'Create clean vertical lines'
        },
        {
          title: 'Dark-colored bottoms',
          description: 'Create slimming effect'
        }
      ]
    },
    {
      category: 'dresses',
      title: 'Dresses',
      icon: 'https://mgx-backend-cdn.metadl.com/generate/images/874524/2026-01-01/5a677f66-67cc-4b14-91ab-d0d4db3162c9.png',
      recommendations: [
        {
          title: 'Empire waist dresses',
          description: 'Define smallest part of torso'
        },
        {
          title: 'Wrap dresses',
          description: 'Create gentle definition without constriction'
        },
        {
          title: 'A-line and fit-and-flare styles',
          description: 'Skim over midsection'
        },
        {
          title: 'Shirt dresses worn open over cami',
          description: 'Create vertical lines'
        }
      ]
    },
    {
      category: 'outerwear',
      title: 'Outerwear',
      icon: 'https://mgx-backend-cdn.metadl.com/generate/images/874524/2026-01-01/820dca6c-27a4-478d-a5c5-3d86587c591a.png',
      recommendations: [
        {
          title: 'Open-front jackets and cardigans',
          description: 'Create vertical lines'
        },
        {
          title: 'Longline styles',
          description: 'Elongate silhouette'
        },
        {
          title: 'Belted coats worn loosely',
          description: 'Define without constricting'
        },
        {
          title: 'Structured blazers with slight shaping',
          description: 'Create clean lines'
        }
      ]
    }
  ],
  fabricsAndFits: [
    {
      title: 'Structured fabrics that hold shape',
      description: 'Create clean lines without clinging'
    },
    {
      title: 'Medium-weight materials',
      description: 'Provide coverage without bulk'
    },
    {
      title: 'Avoid clingy, thin fabrics',
      description: 'Can emphasize midsection'
    },
    {
      title: 'Consider fabrics with subtle stretch',
      description: 'Allow comfort without losing shape'
    }
  ],
  considerations: [
    {
      title: 'Tight waistbands and belts',
      description: 'Can create unflattering bulges',
      reason: 'Constricts at widest part',
      alternative: 'Choose gentle definition or empire waists'
    },
    {
      title: 'Crop tops and short tops',
      description: 'Can emphasize midsection',
      reason: 'Cuts at widest part of body',
      alternative: 'Choose tops that extend over hip area'
    },
    {
      title: 'Horizontal stripes and patterns',
      description: 'Can widen torso visually',
      reason: 'Draws eye across widest part',
      alternative: 'Opt for vertical details or solid colors'
    }
  ],
  outfitFormulas: [
    {
      id: 'apple-1',
      title: 'Professional Polish',
      occasion: 'Work / Professional',
      description: 'Creates elegant vertical lines for a polished office look',
      items: [
        'Empire waist blouse in silk or crepe',
        'A-line midi skirt in dark color',
        'Open-front blazer or long cardigan',
        'Nude pumps to elongate legs',
        'Statement necklace to draw eye upward'
      ]
    },
    {
      id: 'apple-2',
      title: 'Casual Comfort',
      occasion: 'Casual / Weekend',
      description: 'Comfortable yet stylish casual outfit',
      items: [
        'V-neck tee with vertical stripe detail',
        'Straight-leg jeans in dark wash',
        'Longline cardigan worn open',
        'Comfortable flats or low heels',
        'Crossbody bag worn at hip level'
      ]
    },
    {
      id: 'apple-3',
      title: 'Evening Elegance',
      occasion: 'Evening / Special Occasion',
      description: 'Glamorous look that flatters your silhouette',
      items: [
        'Empire waist cocktail dress',
        'Statement earrings (draw attention to face)',
        'Clutch with metallic details',
        'Strappy heels',
        'Light wrap worn open if needed'
      ]
    }
  ],
  confidence: 0.89,
  lastUpdated: '2026-01-01'
};