import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, RefreshCw, Download, Share2, Info } from 'lucide-react';
import { BodyShapeResult, BodyShapeType } from '@/types/camera';

interface ResultsDisplayProps {
  result: BodyShapeResult;
  onRetry: () => void;
  onUseResult: (result: BodyShapeResult) => void;
  onManualEntry?: () => void;
}

export function ResultsDisplay({ result, onRetry, onUseResult, onManualEntry }: ResultsDisplayProps) {
  const getShapeColor = (shape: BodyShapeType) => {
    switch (shape) {
      case 'HOURGLASS': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'PEAR': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'INVERTED_TRIANGLE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RECTANGLE': return 'bg-green-100 text-green-800 border-green-200';
      case 'APPLE': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getShapeIcon = (shape: BodyShapeType) => {
    switch (shape) {
      case 'HOURGLASS': return '⏳';
      case 'PEAR': return '🍐';
      case 'INVERTED_TRIANGLE': return '🔻';
      case 'RECTANGLE': return '⬜';
      case 'APPLE': return '🍎';
      default: return '❓';
    }
  };

  const getShapeDescription = (shape: BodyShapeType) => {
    switch (shape) {
      case 'HOURGLASS':
        return 'Shoulders and hips are similar in width with a well-defined waist.';
      case 'PEAR':
        return 'Hips are wider than shoulders with a defined waist.';
      case 'INVERTED_TRIANGLE':
        return 'Shoulders are wider than hips.';
      case 'RECTANGLE':
        return 'Shoulders, waist, and hips are similar in width.';
      case 'APPLE':
        return 'Waist is the widest part of the body.';
      default:
        return 'Unable to determine body shape with confidence.';
    }
  };

  const getStyleRecommendations = (shape: BodyShapeType) => {
    switch (shape) {
      case 'HOURGLASS':
        return [
          'Emphasize your waist with belts and fitted clothing',
          'Choose V-neck tops to highlight your balanced proportions',
          'A-line skirts and dresses work well',
          'Avoid shapeless or boxy clothing'
        ];
      case 'PEAR':
        return [
          'Draw attention upward with statement necklaces',
          'Choose tops with detailing on the shoulders',
          'Dark bottoms with brighter tops create balance',
          'A-line skirts and wide-leg pants are flattering'
        ];
      case 'INVERTED_TRIANGLE':
        return [
          'Create balance with fuller skirts and pants',
          'Choose V-neck or scoop neck tops',
          'Avoid shoulder pads or wide necklines',
          'Dark tops with lighter bottoms work well'
        ];
      case 'RECTANGLE':
        return [
          'Create curves with peplum tops and belted dresses',
          'Choose clothing with ruching or gathering at the waist',
          'A-line skirts create the illusion of curves',
          'Avoid boxy or shapeless silhouettes'
        ];
      case 'APPLE':
        return [
          'Empire waist dresses create a flattering silhouette',
          'Choose V-neck tops to elongate the torso',
          'Dark colors and vertical stripes are slimming',
          'Avoid tight clothing around the waist'
        ];
      default:
        return [
          'Ensure good lighting and stand facing the camera',
          'Wear form-fitting clothing for better detection',
          'Stand about 6 feet from the camera',
          'Make sure your full body is visible in the frame'
        ];
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-amber-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const formatRatio = (ratio: number) => ratio.toFixed(2);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Main result card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Body Shape Analysis Result</CardTitle>
              <CardDescription>
                Based on your camera analysis
              </CardDescription>
            </div>
            <div className={`px-4 py-2 rounded-full border ${getShapeColor(result.shape)}`}>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getShapeIcon(result.shape)}</span>
                <span className="font-bold">{result.shape.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Confidence and quality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {result.confidence >= 0.8 ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                  <span className="font-medium">Confidence Level</span>
                </div>
                <span className={`font-bold ${getConfidenceColor(result.confidence)}`}>
                  {getConfidenceLabel(result.confidence)}
                </span>
              </div>
              <Progress value={result.confidence * 100} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {Math.round(result.confidence * 100)}% confidence in this classification
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Scan Quality</span>
                </div>
                <span className="font-bold">
                  {result.quality.overall >= 0.8 ? 'Excellent' : 
                   result.quality.overall >= 0.6 ? 'Good' : 'Fair'}
                </span>
              </div>
              <Progress value={result.quality.overall * 100} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Overall scan quality: {Math.round(result.quality.overall * 100)}%
              </p>
            </div>
          </div>

          {/* Body shape description */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">About {result.shape.replace('_', ' ')} Shape</h4>
                <p className="text-sm text-blue-700">{getShapeDescription(result.shape)}</p>
              </div>
            </div>
          </div>

          {/* Body ratios */}
          <div className="space-y-4">
            <h3 className="font-medium">Body Proportions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatRatio(result.ratios.shoulderToHip)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Shoulder-to-Hip Ratio</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {result.ratios.shoulderToHip > 1 ? 'Shoulders wider' : 'Hips wider'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatRatio(result.ratios.waistToHip)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Waist-to-Hip Ratio</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Ideal range: 0.67-0.80
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatRatio(result.ratios.shoulderToWaist)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Shoulder-to-Waist Ratio</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Indicates waist definition
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Style recommendations */}
          <div className="space-y-4">
            <h3 className="font-medium">Style Recommendations</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <ul className="space-y-2">
                {getStyleRecommendations(result.shape).map((recommendation, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="mr-2 text-green-600">✓</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quality metrics */}
          <div className="space-y-4">
            <h3 className="font-medium">Scan Quality Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold">{Math.round(result.quality.landmarks * 100)}%</div>
                <p className="text-xs text-muted-foreground">Landmark Detection</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold">{Math.round(result.quality.stability * 100)}%</div>
                <p className="text-xs text-muted-foreground">Pose Stability</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold">{Math.round(result.quality.lighting * 100)}%</div>
                <p className="text-xs text-muted-foreground">Lighting</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold">{Math.round(result.quality.framing * 100)}%</div>
                <p className="text-xs text-muted-foreground">Framing</p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onRetry}
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Analysis
          </Button>
          
          {onManualEntry && (
            <Button
              variant="outline"
              onClick={onManualEntry}
              className="flex-1"
            >
              Enter Measurements Manually
            </Button>
          )}
          
          <Button
            onClick={() => onUseResult(result)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Use This Result
          </Button>
        </CardFooter>
      </Card>

      {/* Privacy notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-800 mb-1">Privacy Protected</h4>
            <p className="text-sm text-green-700">
              Your analysis was processed entirely on your device. No images were stored or sent to any server. 
              Only the numerical measurements and classification results are available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}