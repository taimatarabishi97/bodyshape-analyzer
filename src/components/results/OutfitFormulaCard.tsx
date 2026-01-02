import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Star, Zap, Heart, Calendar } from 'lucide-react';

interface OutfitFormulaCardProps {
  title: string;
  occasion: string;
  description: string;
  items: string[];
  impact?: 'low' | 'medium' | 'high';
  onSave?: () => void;
  onTry?: () => void;
}

const OutfitFormulaCard = ({
  title,
  occasion,
  description,
  items,
  impact = 'medium',
  onSave,
  onTry,
}: OutfitFormulaCardProps) => {
  const impactConfig = {
    low: {
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: <Star className="h-3 w-3" />,
      label: 'Easy Style',
    },
    medium: {
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: <Zap className="h-3 w-3" />,
      label: 'Balanced',
    },
    high: {
      color: 'bg-accent/20 text-accent border-accent/30',
      icon: <Heart className="h-3 w-3" />,
      label: 'High Impact',
    },
  };

  const config = impactConfig[impact];

  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors group">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-gray-700/50">
            <Calendar className="mr-1 h-3 w-3" />
            {occasion}
          </Badge>
          <Badge variant="outline" className={config.color}>
            {config.icon}
            <span className="ml-1">{config.label}</span>
          </Badge>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <h4 className="font-medium text-gray-300 text-sm">Outfit Components:</h4>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="bg-gray-700 rounded-full p-1 mt-0.5 flex-shrink-0">
                  <Check className="h-2 w-2 text-gray-300" />
                </div>
                <span className="text-gray-300 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Style Notes</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  className="h-3 w-3 text-yellow-400 fill-current"
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
          onClick={onSave}
        >
          Save Formula
        </Button>
        <Button
          className="flex-1 bg-accent hover:bg-accent/90"
          onClick={onTry}
        >
          Try This Look
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OutfitFormulaCard;