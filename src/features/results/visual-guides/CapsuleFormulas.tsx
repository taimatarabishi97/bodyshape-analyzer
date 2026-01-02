import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CapsuleFormula, FormulaItem } from './types';
import { ClothingIllustrationSVG } from './ClothingIllustrations';
import { ArrowRight, Sparkles, Calendar } from 'lucide-react';

interface CapsuleFormulasProps {
  formulas: CapsuleFormula[];
  title?: string;
}

export function CapsuleFormulas({ formulas, title = "Capsule Outfit Formulas" }: CapsuleFormulasProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-4">
        {formulas.map((formula) => (
          <FormulaCard key={formula.id} formula={formula} />
        ))}
      </div>
    </div>
  );
}

interface FormulaCardProps {
  formula: CapsuleFormula;
}

function FormulaCard({ formula }: FormulaCardProps) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {formula.name}
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1 border-purple-200 text-purple-700">
            <Calendar className="w-3 h-3" />
            {formula.occasion}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Visual formula sequence */}
        <div className="flex items-center justify-start gap-1 overflow-x-auto pb-3 -mx-1 px-1">
          {formula.items.map((item, index) => (
            <React.Fragment key={index}>
              <FormulaItemCard item={item} />
              {index < formula.items.length - 1 && (
                <ArrowRight className="w-4 h-4 text-purple-300 flex-shrink-0 mx-1" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Styling tip */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-purple-600">Styling tip: </span>
            {formula.styling}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface FormulaItemCardProps {
  item: FormulaItem;
}

function FormulaItemCard({ item }: FormulaItemCardProps) {
  const typeColors = {
    top: 'from-purple-50 to-purple-100 border-purple-200',
    bottom: 'from-pink-50 to-pink-100 border-pink-200',
    layer: 'from-indigo-50 to-indigo-100 border-indigo-200',
    shoes: 'from-amber-50 to-amber-100 border-amber-200',
    accessory: 'from-emerald-50 to-emerald-100 border-emerald-200',
  };

  const typeLabels = {
    top: 'Top',
    bottom: 'Bottom',
    layer: 'Layer',
    shoes: 'Shoes',
    accessory: 'Accessory',
  };

  return (
    <div className={`flex flex-col items-center p-2 rounded-lg bg-gradient-to-br ${typeColors[item.type]} border min-w-[80px] max-w-[100px]`}>
      <div className="w-10 h-10 flex items-center justify-center text-gray-600">
        <ClothingIllustrationSVG type={item.icon} size="sm" />
      </div>
      <span className="text-xs font-medium text-gray-800 text-center mt-1 leading-tight line-clamp-2">
        {item.name}
      </span>
      <span className="text-[10px] text-gray-500 mt-0.5">
        {typeLabels[item.type]}
      </span>
    </div>
  );
}

// Compact horizontal formula display
export function FormulaCompact({ formula }: { formula: CapsuleFormula }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-white rounded-lg border shadow-sm">
      <div className="flex-shrink-0">
        <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
          {formula.occasion}
        </Badge>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto">
        {formula.items.map((item, index) => (
          <React.Fragment key={index}>
            <span className="text-sm text-gray-700 whitespace-nowrap">{item.name}</span>
            {index < formula.items.length - 1 && (
              <span className="text-purple-400">+</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
