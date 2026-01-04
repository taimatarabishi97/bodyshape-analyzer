/**
 * HybridResultsDisplay.tsx
 * 
 * Enhanced results display for the hybrid body shape analysis.
 * Shows silhouette-based measurements, ratios, and explanations.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, RefreshCw, Info, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import { BodyShapeType } from '@/types/camera';
import { HybridAnalysisResult } from '@/lib/analysis/HybridBodyAnalyzer';

interface HybridResultsDisplayProps {
  result: HybridAnalysisResult;
  onRetry: () => void;
  onUseResult: (result: HybridAnalysisResult) => void;
  onOverride?: (newShape: BodyShapeType) => void;
}

export function HybridResultsDisplay({ 
  result, 
  onRetry, 
  onUseResult,
  onOverride 
}: HybridResultsDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showOverrideOptions, setShowOverrideOptions] = useState(false);
  
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
          'Wrap dresses are particularly flattering'
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
          'Layer different textures for visual interest'
        ];
      case 'APPLE':
        return [
          'Empire waist dresses create a flattering silhouette',
          'Choose V-neck tops to elongate the torso',
          'Flowing fabrics skim over the midsection',
          'High-waisted bottoms provide definition'
        ];
      default:
        return [
          'Try capturing again with better lighting',
          'Stand facing the camera directly',
          'Ensure your full body is visible'
        ];
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'text-green-600';
    if (confidence >= 0.5) return 'text-amber-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.7) return 'High Confidence';
    if (confidence >= 0.5) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const formatRatio = (ratio: number) => ratio.toFixed(2);
  const formatWidth = (px: number | null) => px !== null ? `${Math.round(px)}px` : 'N/A';

  const allShapes: BodyShapeType[] = ['HOURGLASS', 'PEAR', 'INVERTED_TRIANGLE', 'RECTANGLE', 'APPLE'];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Main result card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Body Shape Analysis</CardTitle>
              <CardDescription>
                Analyzed using silhouette-based measurements
              </CardDescription>
            </div>
            <div className={`px-4 py-2 rounded-full border ${getShapeColor(result.userOverride || result.bodyShape)}`}>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getShapeIcon(result.userOverride || result.bodyShape)}</span>
                <span className="font-bold">{(result.userOverride || result.bodyShape).replace('_', ' ')}</span>
              </div>
            </div>
          </div>
          {result.userOverride && (
            <div className="mt-2 text-sm text-amber-600 flex items-center gap-1">
              <Edit3 className="w-4 h-4" />
              Manually overridden from {result.bodyShape.replace('_', ' ')}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Confidence and explanation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {result.confidence >= 0.7 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                )}
                <span className="font-medium">Confidence Level</span>
              </div>
              <span className={`font-bold ${getConfidenceColor(result.confidence)}`}>
                {getConfidenceLabel(result.confidence)} ({Math.round(result.confidence * 100)}%)
              </span>
            </div>
            <Progress value={result.confidence * 100} className="h-2" />
            
            {/* Explanation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Why this classification?</h4>
                  <p className="text-sm text-blue-700">{result.explanation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Ratios */}
          <div className="space-y-4">
            <h3 className="font-medium">Body Proportions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatRatio(result.ratios.SHR)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Shoulder-to-Hip (SHR)</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {result.ratios.SHR > 1.05 ? 'Shoulders wider' : 
                       result.ratios.SHR < 0.95 ? 'Hips wider' : 'Balanced'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatRatio(result.ratios.WHR)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Waist-to-Hip (WHR)</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Lower = more defined waist
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(result.waistCurvatureIndex * 100)}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Waist Definition</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {result.waistCurvatureIndex >= 0.2 ? 'Well-defined' : 
                       result.waistCurvatureIndex >= 0.1 ? 'Moderate' : 'Minimal'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Pixel Width Measurements */}
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              className="w-full justify-between"
              onClick={() => setShowDetails(!showDetails)}
            >
              <span className="font-medium">Detailed Measurements</span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            {showDetails && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold">{formatWidth(result.measurements.shoulderWidthPx)}</div>
                  <p className="text-xs text-muted-foreground">Shoulder Width</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold">{formatWidth(result.measurements.bustWidthPx)}</div>
                  <p className="text-xs text-muted-foreground">Bust Width</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold">{formatWidth(result.measurements.waistWidthPx)}</div>
                  <p className="text-xs text-muted-foreground">Waist Width</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold">{formatWidth(result.measurements.hipWidthPx)}</div>
                  <p className="text-xs text-muted-foreground">Hip Width</p>
                </div>
              </div>
            )}
            
            {showDetails && (
              <p className="text-xs text-muted-foreground text-center">
                ℹ️ Measurements are in pixels. For estimated cm values, use calibration mode with a reference object.
              </p>
            )}
          </div>

          {/* Quality Scores */}
          {showDetails && (
            <div className="space-y-4">
              <h3 className="font-medium">Analysis Quality</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold">{Math.round(result.quality.poseConfidence * 100)}%</div>
                  <p className="text-xs text-muted-foreground">Pose Detection</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold">{Math.round(result.quality.segmentationConfidence * 100)}%</div>
                  <p className="text-xs text-muted-foreground">Segmentation</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold">{Math.round(result.quality.measurementConfidence * 100)}%</div>
                  <p className="text-xs text-muted-foreground">Measurements</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold">{Math.round(result.quality.orientationScore * 100)}%</div>
                  <p className="text-xs text-muted-foreground">Orientation</p>
                </div>
              </div>
            </div>
          )}

          {/* Body shape description */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">About {(result.userOverride || result.bodyShape).replace('_', ' ')} Shape</h4>
            <p className="text-sm text-muted-foreground">
              {getShapeDescription(result.userOverride || result.bodyShape)}
            </p>
          </div>

          {/* Style recommendations */}
          <div className="space-y-4">
            <h3 className="font-medium">Style Recommendations</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <ul className="space-y-2">
                {getStyleRecommendations(result.userOverride || result.bodyShape).map((rec, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <span className="mr-2 text-green-600">✓</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Manual Override */}
          {onOverride && (
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => setShowOverrideOptions(!showOverrideOptions)}
              >
                <span className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  <span>Not accurate? Override classification</span>
                </span>
                {showOverrideOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              
              {showOverrideOptions && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {allShapes.map(shape => (
                    <Button
                      key={shape}
                      variant={shape === (result.userOverride || result.bodyShape) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onOverride(shape)}
                      className="flex items-center gap-1"
                    >
                      <span>{getShapeIcon(shape)}</span>
                      <span className="text-xs">{shape.replace('_', ' ')}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
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
          
          <Button
            onClick={() => onUseResult(result)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            View Styling Guide
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
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
