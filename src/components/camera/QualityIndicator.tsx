import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle, XCircle, Zap, Sun, Target, Shield } from 'lucide-react';
import { QualityScore } from '@/types/camera';

interface QualityIndicatorProps {
  quality: QualityScore;
}

export function QualityIndicator({ quality }: QualityIndicatorProps) {
  const getOverallQualityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-amber-600';
    return 'text-red-600';
  };

  const getOverallQualityIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (score >= 0.6) return <AlertCircle className="w-5 h-5 text-amber-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getMetricColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getMetricLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Poor';
  };

  const getSuggestions = () => {
    const suggestions: string[] = [];

    if (quality.landmarks < 0.7) {
      suggestions.push('Move closer to the camera');
      suggestions.push('Ensure shoulders and hips are visible');
    }

    if (quality.stability < 0.6) {
      suggestions.push('Hold still for better detection');
      suggestions.push('Avoid moving during analysis');
    }

    if (quality.lighting < 0.5) {
      suggestions.push('Move to a well-lit area');
      suggestions.push('Avoid backlighting');
    }

    if (quality.framing < 0.8) {
      suggestions.push('Adjust distance from camera');
      suggestions.push('Ensure full body is in frame');
    }

    return suggestions.length > 0 ? suggestions : ['Perfect! Ready for analysis.'];
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Overall quality */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getOverallQualityIcon(quality.overall)}
              <div>
                <h3 className="font-medium">Overall Quality</h3>
                <p className={`text-sm font-semibold ${getOverallQualityColor(quality.overall)}`}>
                  {getMetricLabel(quality.overall)} ({Math.round(quality.overall * 100)}%)
                </p>
              </div>
            </div>
            <Progress value={quality.overall * 100} className="w-32" />
          </div>

          {/* Quality metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Landmarks</span>
              </div>
              <div className="flex items-center justify-between">
                <div className={`h-2 flex-1 rounded-full ${getMetricColor(quality.landmarks)}`} 
                  style={{ width: `${quality.landmarks * 100}%` }} />
                <span className="text-xs font-medium ml-2">
                  {Math.round(quality.landmarks * 100)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Stability</span>
              </div>
              <div className="flex items-center justify-between">
                <div className={`h-2 flex-1 rounded-full ${getMetricColor(quality.stability)}`} 
                  style={{ width: `${quality.stability * 100}%` }} />
                <span className="text-xs font-medium ml-2">
                  {Math.round(quality.stability * 100)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium">Lighting</span>
              </div>
              <div className="flex items-center justify-between">
                <div className={`h-2 flex-1 rounded-full ${getMetricColor(quality.lighting)}`} 
                  style={{ width: `${quality.lighting * 100}%` }} />
                <span className="text-xs font-medium ml-2">
                  {Math.round(quality.lighting * 100)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Framing</span>
              </div>
              <div className="flex items-center justify-between">
                <div className={`h-2 flex-1 rounded-full ${getMetricColor(quality.framing)}`} 
                  style={{ width: `${quality.framing * 100}%` }} />
                <span className="text-xs font-medium ml-2">
                  {Math.round(quality.framing * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {quality.overall < 0.8 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Suggestions for Improvement:</h4>
              <ul className="space-y-1">
                {getSuggestions().map((suggestion, index) => (
                  <li key={index} className="flex items-start text-sm text-muted-foreground">
                    <span className="mr-2">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}