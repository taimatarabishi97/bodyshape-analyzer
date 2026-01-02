import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OutfitCard, OutfitCategory } from './types';
import { ClothingIllustrationSVG } from './ClothingIllustrations';
import { Shirt, Sparkles } from 'lucide-react';

interface OutfitCardGridProps {
  outfits: OutfitCard[];
  title?: string;
  showCategories?: boolean;
}

const categoryLabels: Record<OutfitCategory, string> = {
  dresses: 'Dresses',
  tops: 'Tops & Layers',
  bottoms: 'Bottoms',
  outerwear: 'Outerwear',
  fabrics: 'Fabrics & Fit',
};

const categoryIcons: Record<OutfitCategory, React.ReactNode> = {
  dresses: <Sparkles className="w-4 h-4" />,
  tops: <Shirt className="w-4 h-4" />,
  bottoms: <Shirt className="w-4 h-4 rotate-180" />,
  outerwear: <Shirt className="w-4 h-4" />,
  fabrics: <Sparkles className="w-4 h-4" />,
};

export function OutfitCardGrid({ outfits, title, showCategories = true }: OutfitCardGridProps) {
  const [activeCategory, setActiveCategory] = useState<OutfitCategory | 'all'>('all');

  // Group outfits by category
  const groupedOutfits = outfits.reduce((acc, outfit) => {
    if (!acc[outfit.category]) {
      acc[outfit.category] = [];
    }
    acc[outfit.category].push(outfit);
    return acc;
  }, {} as Record<OutfitCategory, OutfitCard[]>);

  const categories = Object.keys(groupedOutfits) as OutfitCategory[];
  
  const filteredOutfits = activeCategory === 'all' 
    ? outfits 
    : groupedOutfits[activeCategory] || [];

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>
      )}

      {showCategories && categories.length > 1 && (
        <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setActiveCategory(v as OutfitCategory | 'all')}>
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-full px-4 py-2 text-sm"
            >
              All Styles
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-full px-4 py-2 text-sm flex items-center gap-1.5"
              >
                {categoryIcons[category]}
                {categoryLabels[category]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredOutfits.map((outfit) => (
          <OutfitCardComponent key={outfit.id} outfit={outfit} />
        ))}
      </div>
    </div>
  );
}

interface OutfitCardComponentProps {
  outfit: OutfitCard;
}

function OutfitCardComponent({ outfit }: OutfitCardComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-white overflow-hidden"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Badge variant="secondary" className="mb-2 text-xs bg-purple-50 text-purple-700 hover:bg-purple-100">
              {categoryLabels[outfit.category]}
            </Badge>
            <CardTitle className="text-base font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
              {outfit.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Illustration */}
        <div className="flex justify-center py-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg mb-4">
          <div className="text-purple-600">
            <ClothingIllustrationSVG type={outfit.illustrationType} size="lg" />
          </div>
        </div>

        {/* Why it works */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Why it flatters</p>
            <p className="text-sm text-gray-600 leading-relaxed">{outfit.worksWhy}</p>
          </div>

          {/* Fit Notes - Expandable */}
          <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
            <p className="text-xs font-medium text-purple-600 uppercase tracking-wide pt-2">Fit Notes</p>
            <ul className="space-y-1">
              {outfit.fitNotes.map((note, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          {/* Expand indicator */}
          <button 
            className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 pt-1"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? '− Less details' : '+ Fit notes'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact variant for embedding
export function OutfitCardCompact({ outfit }: { outfit: OutfitCard }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
        <div className="text-purple-600">
          <ClothingIllustrationSVG type={outfit.illustrationType} size="sm" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{outfit.title}</p>
        <p className="text-xs text-gray-500 truncate">{categoryLabels[outfit.category]}</p>
      </div>
    </div>
  );
}
