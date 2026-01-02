import { BodyShapeStylingGuide } from '@/types/styling';

export const invertedTriangleGuide: BodyShapeStylingGuide = {
  shape: 'INVERTED_TRIANGLE',
  description: 'The inverted triangle shape features shoulders that are wider than hips, creating a powerful, athletic silhouette. Your upper body carries more visual weight while your lower body is more slender.',
  keyCharacteristics: [
    'Shoulders wider than hips',
    'Broad shoulders and back',
    'Slender hips and legs',
    'Minimal waist definition'
  ],
  stylingGoals: [
    'Balance proportions by adding volume to lower body',
    'Draw attention downward',
    'Minimize emphasis on shoulder area',
    'Create waist definition'
  ],
  silhouetteImage: 'https://mgx-backend-cdn.metadl.com/generate/images/874524/2026-01-01/379bccd2-4dab-4af4-a8b9-77d89a7e9205.png',
  bestSilhouettes: [
    {
      title: 'A-line Shapes',
      description: 'Adds volume to lower body for balance'
    },
    {
      title: 'Empire Waists',
      description: 'Draws attention away from shoulders'
    },
    {
      title: 'Fit-and-Flare',
      description: 'Balances broad shoulders'
    },
    {
      title: 'V-necklines',
      description: 'Lengthens and narrows upper body'
    }
  ],
  clothingCategories: [
    {
      category: 'tops',
      title: 'Tops & Blouses',
      icon: 'https://mgx-backend-cdn.metadl.com/generate/images/874524/2026-01-01/de471781-3858-451c-9286-45fa372306d6.png',
      recommendations: [
        {
          title: 'V-necks and deep plunges',
          description: 'Create vertical line to narrow shoulders'
        },
        {
          title: 'Raglan and dolman sleeves',
          description: 'Softer shoulder line'
        },
        {
          title: 'Dark colors and solid fabrics on top',
          description: 'Minimize focus on upper body'
        },
        {
          title: 'Avoid shoulder pads and details',
          description: 'Can emphasize broad shoulders'
        }
      ]
    },
    {
      category: 'bottoms',
      title: 'Bottoms',
      icon: 'https://mgx-backend-cdn.metadl.com/generate/images/874524/2026-01-01/ec1748d4-9ea9-4878-acf6-8e46b7b986c8.png',
      recommendations: [
        {
          title: 'A-line and full skirts',
          description: 'Add volume to lower body'
        },
        {
          title: 'Patterned and bright-colored bottoms',
          description: 'Draw attention downward'
        },
        {
          title: 'Wide-leg and flared pants',
          description: 'Balance shoulder width'
        },
        {
          title: 'Pockets and details on hips',
          description: 'Add visual width to lower body'
        }
      ]
    },
    {
      category: 'dresses',
      title: 'Dresses',
      icon: 'https://mgx-backend-cdn.metadl.com/generate/images/874524/2026-01-01/5a677f66-67cc-4b14-91ab-d0d4db3162c9.png',
      recommendations: [
        {
          title: 'Wrap dresses with V-neck',
          description: 'Narrows shoulders while defining waist'
        },
        {
          title: 'Empire waist dresses',
          description: 'Draws attention away from shoulders'
        },
        {
          title: 'Fit-and-flare styles',
          description: 'Balances proportions beautifully'
        },
        {
          title: 'Shirt dresses worn open as duster',
          description: 'Creates vertical lines'
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
          title: 'Trench coats worn open',
          description: 'Lengthens silhouette'
        },
        {
          title: 'Avoid structured shoulders',
          description: 'Can emphasize broad shoulders'
        },
        {
          title: 'Longline styles',
          description: 'Create vertical elongation'
        }
      ]
    }
  ],
  fabricsAndFits: [
    {
      title: 'Soft, drapey fabrics for tops',
      description: 'Minimize bulk on upper body'
    },
    {
      title: 'Structured fabrics for bottoms',
      description: 'Hold shape and add volume'
    },
    {
      title: 'Avoid stiff fabrics on shoulders',
      description: 'Can add unwanted structure'
    },
    {
      title: 'Consider texture on lower body',
      description: 'Adds visual interest and volume'
    }
  ],
  considerations: [
    {
      title: 'Puffed sleeves and shoulder details',
      description: 'Can emphasize shoulder width',
      reason: 'Adds volume to already broad area',
      alternative: 'Opt for raglan or dolman sleeves'
    },
    {
      title: 'Horizontal stripes on top',
      description: 'Can widen shoulders visually',
      reason: 'Draws eye across widest part',
      alternative: 'Choose vertical stripes or solid colors'
    },
    {
      title: 'Tight, skinny bottoms without balance',
      description: 'Can emphasize shoulder-to-hip ratio',
      reason: 'Makes lower body appear narrower',
      alternative: 'Balance with volume on bottom'
    }
  ],
  outfitFormulas: [
    {
      id: 'inverted-1',
      title: 'Professional Balance',
      occasion: 'Work / Professional',
      description: 'Creates proportional balance for a powerful yet feminine office look',
      items: [
        'V-neck silk shell in dark color',
        'A-line midi skirt in pattern or bright color',
        'Open-front blazer or cardigan',
        'Nude pumps to elongate legs',
        'Statement belt at natural waist'
      ]
    },
    {
      id: 'inverted-2',
      title: 'Casual Proportion Play',
      occasion: 'Casual / Weekend',
      description: 'Balanced casual outfit that honors your athletic build',
      items: [
        'Raglan sleeve tee in solid dark color',
        'Wide-leg jeans in light wash or pattern',
        'Longline cardigan worn open',
        'Platform sneakers or sandals',
        'Crossbody bag worn at hip level'
      ]
    },
    {
      id: 'inverted-3',
      title: 'Evening Elegance',
      occasion: 'Evening / Special Occasion',
      description: 'Glamorous look that balances your proportions beautifully',
      items: [
        'V-neck wrap cocktail dress',
        'Statement earrings (skip shoulder-dusting styles)',
        'Clutch with metallic details',
        'Strappy heels',
        'Light wrap worn open if needed'
      ]
    }
  ],
  confidence: 0.91,
  lastUpdated: '2026-01-01'
};