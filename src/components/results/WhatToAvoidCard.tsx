import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

interface Consideration {
  title: string;
  description: string;
  reason: string;
  alternative: string;
}

interface WhatToAvoidCardProps {
  considerations: Consideration[];
  title?: string;
  description?: string;
}

const WhatToAvoidCard = ({
  considerations,
  title = "Gentle Considerations",
  description = "Not rules, but suggestions for optimal styling"
}: WhatToAvoidCardProps) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="text-gray-400">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {considerations.map((consideration, index) => (
            <div
              key={index}
              className="bg-gray-900/30 rounded-lg p-4 border border-amber-500/20 hover:border-amber-500/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="bg-amber-500/20 rounded-full p-1.5 mt-0.5 flex-shrink-0">
                  <AlertCircle className="h-3 w-3 text-amber-400" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-200">{consideration.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{consideration.description}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-300 border-amber-500/20 text-xs">
                          Why
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300">{consideration.reason}</p>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-xs">
                          Try Instead
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300">{consideration.alternative}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center pt-2">
                    <ArrowRight className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-900/30 rounded-lg border border-gray-700">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-500/20 rounded-full p-1.5 mt-0.5">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-200 mb-1">Remember</h4>
              <p className="text-sm text-gray-400">
                These are gentle suggestions, not strict rules. Your personal comfort and confidence 
                should always guide your style choices. Use these as starting points for exploration.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatToAvoidCard;