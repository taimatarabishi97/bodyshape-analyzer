import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStylingGuide } from '@/lib/getStylingGuide';
import { BodyShapeType } from '@/data/stylingGuides';
import { Check, X, AlertCircle, Star, Heart, Zap, Shield } from 'lucide-react';

interface StylingGuideProps {
  shape: BodyShapeType;
}

const StylingGuide = ({ shape }: StylingGuideProps) => {
  const stylingGuide = getStylingGuide(shape);
  const [activeTab, setActiveTab] = useState('clothing');

  if (!stylingGuide) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <p className="text-gray-400 text-center">No styling guide found for shape: {shape}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Guide Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          Complete Styling Guide for {shape.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto">
          Your personalized fashion roadmap to enhance your natural proportions and express your unique style
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-gray-800 border border-gray-700 grid grid-cols-3">
          <TabsTrigger value="clothing" className="data-[state=active]:bg-gray-700">
            Clothing Guide
          </TabsTrigger>
          <TabsTrigger value="formulas" className="data-[state=active]:bg-gray-700">
            Outfit Formulas
          </TabsTrigger>
          <TabsTrigger value="considerations" className="data-[state=active]:bg-gray-700">
            Considerations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clothing" className="space-y-6">
          {/* Clothing Categories */}
          <div className="grid md:grid-cols-2 gap-6">
            {stylingGuide.clothingCategories.map((category, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {category.icon ? (
                      <img
                        src={category.icon}
                        alt={category.title}
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-lg">👗</span>
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        Best styles for your {shape.toLowerCase()} shape
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.recommendations.map((rec, recIndex) => (
                      <div key={recIndex} className="bg-gray-900/30 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-start gap-3">
                          <div className="bg-accent/20 rounded-full p-1.5 mt-0.5">
                            <Check className="h-3 w-3 text-accent" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-200">{rec.title}</h4>
                            <p className="text-sm text-gray-400 mt-1">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Fabrics & Fits */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="p-1.5 bg-purple-500/20 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-400" />
                </div>
                Fabrics & Fits Guide
              </CardTitle>
              <CardDescription className="text-gray-400">
                Material recommendations for optimal fit and comfort
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {stylingGuide.fabricsAndFits.map((fabric, index) => (
                  <div key={index} className="bg-gray-900/30 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-500/20 rounded-full p-1.5 mt-0.5">
                        <Heart className="h-3 w-3 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-200">{fabric.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{fabric.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulas" className="space-y-6">
          {/* Outfit Formulas */}
          <div className="grid md:grid-cols-3 gap-6">
            {stylingGuide.outfitFormulas.map((formula, index) => (
              <Card key={formula.id} className="bg-gray-800/50 border-gray-700 hover:border-accent/30 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-gray-700/50">
                      {formula.occasion}
                    </Badge>
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-3">{formula.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {formula.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formula.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-2">
                        <div className="bg-gray-700 rounded-full p-1 mt-0.5">
                          <div className="h-1.5 w-1.5 bg-accent rounded-full"></div>
                        </div>
                        <span className="text-gray-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Style Impact</span>
                      <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300">
                        <Zap className="mr-1 h-3 w-3" />
                        High Impact
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Formula Tips */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl">How to Use These Formulas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-200">Adapt to Your Wardrobe</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start gap-2">
                      <div className="bg-accent/20 rounded-full p-1 mt-0.5">
                        <div className="h-1.5 w-1.5 bg-accent rounded-full"></div>
                      </div>
                      <span>Use similar items you already own</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-accent/20 rounded-full p-1 mt-0.5">
                        <div className="h-1.5 w-1.5 bg-accent rounded-full"></div>
                      </div>
                      <span>Adjust colors to match your palette</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-accent/20 rounded-full p-1 mt-0.5">
                        <div className="h-1.5 w-1.5 bg-accent rounded-full"></div>
                      </div>
                      <span>Swap pieces for similar silhouettes</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-200">Build Your Capsule</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-500/20 rounded-full p-1 mt-0.5">
                        <div className="h-1.5 w-1.5 bg-purple-400 rounded-full"></div>
                      </div>
                      <span>Start with one complete outfit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-500/20 rounded-full p-1 mt-0.5">
                        <div className="h-1.5 w-1.5 bg-purple-400 rounded-full"></div>
                      </div>
                      <span>Mix and match pieces across formulas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-500/20 rounded-full p-1 mt-0.5">
                        <div className="h-1.5 w-1.5 bg-purple-400 rounded-full"></div>
                      </div>
                      <span>Invest in versatile foundational pieces</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="considerations" className="space-y-6">
          {/* What to Consider */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="p-1.5 bg-amber-500/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                </div>
                Gentle Considerations
              </CardTitle>
              <CardDescription className="text-gray-400">
                Not rules, but suggestions for optimal styling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stylingGuide.considerations.map((consideration, index) => (
                  <div key={index} className="bg-gray-900/30 rounded-lg p-4 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-500/20 rounded-full p-1.5 mt-0.5">
                        <X className="h-3 w-3 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-200">{consideration.title}</h4>
                            <p className="text-sm text-gray-400 mt-1">{consideration.description}</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <span className="text-sm font-medium text-amber-300">Why:</span>
                            <span className="text-sm text-gray-300">{consideration.reason}</span>
                          </div>
                          <div className="flex items-start gap-2 mt-2">
                            <span className="text-sm font-medium text-emerald-300">Try Instead:</span>
                            <span className="text-sm text-gray-300">{consideration.alternative}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Style Philosophy */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl">Your Style Philosophy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-700">
                  <h4 className="font-medium text-gray-200 mb-2">Remember These Principles</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start gap-2">
                      <div className="bg-emerald-500/20 rounded-full p-1 mt-0.5">
                        <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full"></div>
                      </div>
                      <span>These are guidelines, not rules - personal style always comes first</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-emerald-500/20 rounded-full p-1 mt-0.5">
                        <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full"></div>
                      </div>
                      <span>Confidence is the best accessory - wear what makes you feel amazing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-emerald-500/20 rounded-full p-1 mt-0.5">
                        <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full"></div>
                      </div>
                      <span>Body shapes can change over time - reassess periodically</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-emerald-500/20 rounded-full p-1 mt-0.5">
                        <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full"></div>
                      </div>
                      <span>Mix and match these suggestions with your personal preferences</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Guide Summary */}
      <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl">Guide Summary</CardTitle>
          <CardDescription className="text-gray-400">
            Last updated: {stylingGuide.lastUpdated}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stylingGuide.clothingCategories.length}</div>
              <div className="text-sm text-gray-400">Clothing Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stylingGuide.outfitFormulas.length}</div>
              <div className="text-sm text-gray-400">Outfit Formulas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{Math.round(stylingGuide.confidence * 100)}%</div>
              <div className="text-sm text-gray-400">Guide Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stylingGuide.considerations.length}</div>
              <div className="text-sm text-gray-400">Considerations</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StylingGuide;