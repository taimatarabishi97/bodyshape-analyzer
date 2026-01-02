import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStylingGuide } from '@/lib/getStylingGuide';
import { BodyShapeType } from '@/data/stylingGuides';
import { CheckCircle, Target, Zap } from 'lucide-react';

interface BodyShapeDisplayProps {
  shape: BodyShapeType;
}

const BodyShapeDisplay = ({ shape }: BodyShapeDisplayProps) => {
  const stylingGuide = getStylingGuide(shape);

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
    <div className="space-y-6">
      {/* Shape Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">
            {shape.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h2>
          <p className="text-gray-400 mt-2 max-w-2xl">
            {stylingGuide.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
            <Target className="mr-1 h-3 w-3" />
            Primary Shape
          </Badge>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            Confidence: {Math.round(stylingGuide.confidence * 100)}%
          </Badge>
        </div>
      </div>

      {/* Silhouette Image */}
      <div className="relative bg-gray-900/50 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="aspect-square max-w-xs mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 flex items-center justify-center">
              {stylingGuide.silhouetteImage ? (
                <img
                  src={stylingGuide.silhouetteImage}
                  alt={`${shape} body shape silhouette`}
                  className="w-full h-auto object-contain"
                />
              ) : (
                <div className="text-gray-500 text-center">
                  <div className="text-4xl mb-2">👗</div>
                  <p className="text-sm">Silhouette Illustration</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-4">Key Characteristics</h3>
            <div className="space-y-3">
              {stylingGuide.keyCharacteristics.map((characteristic, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{characteristic}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Styling Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stylingGuide.stylingGoals.map((goal, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 text-accent mr-2" />
                      <span className="text-gray-300 text-sm">{goal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Common Proportions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-300">
              <li className="flex justify-between">
                <span className="text-gray-400">Shoulder:Hip Ratio</span>
                <span className="font-medium">
                  {shape === 'HOURGLASS' && '≈ 1:1'}
                  {shape === 'PEAR' && '≈ 0.9:1'}
                  {shape === 'RECTANGLE' && '≈ 1:1'}
                  {shape === 'INVERTED_TRIANGLE' && '≈ 1.1:1'}
                  {shape === 'APPLE' && '≈ 1:1'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Waist Definition</span>
                <span className="font-medium">
                  {shape === 'HOURGLASS' && 'Well-defined'}
                  {shape === 'PEAR' && 'Defined'}
                  {shape === 'RECTANGLE' && 'Minimal'}
                  {shape === 'INVERTED_TRIANGLE' && 'Moderate'}
                  {shape === 'APPLE' && 'Less defined'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Common Height</span>
                <span className="font-medium">
                  {shape === 'HOURGLASS' && 'Any height'}
                  {shape === 'PEAR' && 'Petite to Average'}
                  {shape === 'RECTANGLE' && 'Average to Tall'}
                  {shape === 'INVERTED_TRIANGLE' && 'Average to Tall'}
                  {shape === 'APPLE' && 'Any height'}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Celebrity Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-300">
              {shape === 'HOURGLASS' && (
                <>
                  <li>• Marilyn Monroe</li>
                  <li>• Sofia Vergara</li>
                  <li>• Kim Kardashian</li>
                </>
              )}
              {shape === 'PEAR' && (
                <>
                  <li>• Jennifer Lopez</li>
                  <li>• Rihanna</li>
                  <li>• Shakira</li>
                </>
              )}
              {shape === 'RECTANGLE' && (
                <>
                  <li>• Cameron Diaz</li>
                  <li>• Natalie Portman</li>
                  <li>• Keira Knightley</li>
                </>
              )}
              {shape === 'INVERTED_TRIANGLE' && (
                <>
                  <li>• Angelina Jolie</li>
                  <li>• Naomi Campbell</li>
                  <li>• Demi Moore</li>
                </>
              )}
              {shape === 'APPLE' && (
                <>
                  <li>• Oprah Winfrey</li>
                  <li>• Queen Latifah</li>
                  <li>• Drew Barrymore</li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Style Personality</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm mb-3">
              {shape === 'HOURGLASS' && 'Glamorous, feminine, curve-enhancing styles work beautifully'}
              {shape === 'PEAR' && 'Balanced, elegant, proportion-focused looks shine'}
              {shape === 'RECTANGLE' && 'Clean lines, structured pieces, and waist-defining styles'}
              {shape === 'INVERTED_TRIANGLE' && 'Powerful, athletic, proportion-balancing outfits'}
              {shape === 'APPLE' && 'Vertical lines, empire waists, and elongating silhouettes'}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-gray-700">
                {shape === 'HOURGLASS' && 'Feminine'}
                {shape === 'PEAR' && 'Elegant'}
                {shape === 'RECTANGLE' && 'Modern'}
                {shape === 'INVERTED_TRIANGLE' && 'Powerful'}
                {shape === 'APPLE' && 'Comfortable'}
              </Badge>
              <Badge variant="secondary" className="bg-gray-700">
                {shape === 'HOURGLASS' && 'Curve-loving'}
                {shape === 'PEAR' && 'Proportion-aware'}
                {shape === 'RECTANGLE' && 'Structure-loving'}
                {shape === 'INVERTED_TRIANGLE' && 'Balance-seeking'}
                {shape === 'APPLE' && 'Line-enhancing'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BodyShapeDisplay;