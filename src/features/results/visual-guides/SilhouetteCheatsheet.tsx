import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SilhouetteItem } from './types';
import { SilhouetteIcon } from './ClothingIllustrations';
import { Info, CheckCircle } from 'lucide-react';

interface SilhouetteCheatsheetProps {
  silhouettes: SilhouetteItem[];
  title?: string;
}

export function SilhouetteCheatsheet({ silhouettes, title = "Silhouette Cheatsheet" }: SilhouetteCheatsheetProps) {
  const [selectedSilhouette, setSelectedSilhouette] = useState<SilhouetteItem | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-500">Tap to learn more</p>
      </div>

      {/* Horizontal scrollable strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {silhouettes.map((silhouette) => (
          <button
            key={silhouette.id}
            onClick={() => setSelectedSilhouette(silhouette)}
            className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border-2 border-transparent hover:border-purple-200 hover:shadow-md transition-all duration-200 min-w-[100px] group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="text-purple-600 w-10 h-12">
                <SilhouetteIcon type={silhouette.icon} className="w-full h-full" />
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center whitespace-nowrap">
              {silhouette.name}
            </span>
          </button>
        ))}
      </div>

      {/* Modal for silhouette details */}
      <Dialog open={!!selectedSilhouette} onOpenChange={() => setSelectedSilhouette(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedSilhouette && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <div className="text-purple-600 w-12 h-14">
                      <SilhouetteIcon type={selectedSilhouette.icon} className="w-full h-full" />
                    </div>
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedSilhouette.name}</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 mt-1">
                      {selectedSilhouette.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                {/* Best For */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Best For
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSilhouette.bestFor.map((item, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Styling Tips</h4>
                  <ul className="space-y-2">
                    {selectedSilhouette.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-purple-400 mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Inline variant without modal - just shows the strip
export function SilhouetteStrip({ silhouettes }: { silhouettes: SilhouetteItem[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {silhouettes.slice(0, 6).map((silhouette) => (
        <div
          key={silhouette.id}
          className="flex flex-col items-center gap-1 p-2 bg-purple-50 rounded-lg min-w-[70px]"
        >
          <div className="w-8 h-10 text-purple-600">
            <SilhouetteIcon type={silhouette.icon} className="w-full h-full" />
          </div>
          <span className="text-xs text-purple-700 text-center leading-tight">
            {silhouette.name}
          </span>
        </div>
      ))}
    </div>
  );
}
