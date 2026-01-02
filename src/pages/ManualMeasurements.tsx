import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Ruler, Calculator, AlertCircle, CheckCircle } from 'lucide-react';
import { BodyShapeClassifier } from '@/services/poseDetection/BodyShapeClassifier';
import { QualityAssessmentService } from '@/services/poseDetection/QualityAssessmentService';
import { BodyShapeResult, BodyMeasurements, DEFAULT_QUALITY_THRESHOLDS } from '@/types/camera';

export default function ManualMeasurements() {
  const navigate = useNavigate();
  
  const [measurements, setMeasurements] = useState<BodyMeasurements>({
    bust: '',
    waist: '',
    hips: '',
    shoulderWidth: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<BodyShapeResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (field: keyof BodyMeasurements, value: string) => {
    // Only allow numbers and one decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    const formattedValue = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('')
      : numericValue;
    
    setMeasurements(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateMeasurements = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!measurements.bust.trim()) {
      newErrors.bust = 'Bust measurement is required';
    } else if (parseFloat(measurements.bust) <= 0) {
      newErrors.bust = 'Bust must be greater than 0';
    } else if (parseFloat(measurements.bust) > 200) {
      newErrors.bust = 'Bust measurement seems too large';
    }
    
    if (!measurements.waist.trim()) {
      newErrors.waist = 'Waist measurement is required';
    } else if (parseFloat(measurements.waist) <= 0) {
      newErrors.waist = 'Waist must be greater than 0';
    } else if (parseFloat(measurements.waist) > 200) {
      newErrors.waist = 'Waist measurement seems too large';
    }
    
    if (!measurements.hips.trim()) {
      newErrors.hips = 'Hips measurement is required';
    } else if (parseFloat(measurements.hips) <= 0) {
      newErrors.hips = 'Hips must be greater than 0';
    } else if (parseFloat(measurements.hips) > 200) {
      newErrors.hips = 'Hips measurement seems too large';
    }
    
    // Optional field validation
    if (measurements.shoulderWidth.trim()) {
      const shoulderValue = parseFloat(measurements.shoulderWidth);
      if (shoulderValue <= 0) {
        newErrors.shoulderWidth = 'Shoulder width must be greater than 0';
      } else if (shoulderValue > 100) {
        newErrors.shoulderWidth = 'Shoulder width seems too large';
      }
    }
    
    // Logical validation: waist should be smaller than bust and hips
    const bustValue = parseFloat(measurements.bust);
    const waistValue = parseFloat(measurements.waist);
    const hipsValue = parseFloat(measurements.hips);
    
    if (waistValue >= bustValue) {
      newErrors.waist = 'Waist should be smaller than bust';
    }
    
    if (waistValue >= hipsValue) {
      newErrors.waist = 'Waist should be smaller than hips';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMeasurements()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Convert measurements to numbers
      const bust = parseFloat(measurements.bust);
      const waist = parseFloat(measurements.waist);
      const hips = parseFloat(measurements.hips);
      const shoulderWidth = measurements.shoulderWidth ? parseFloat(measurements.shoulderWidth) : undefined;
      
      // Calculate shoulder width if not provided (estimate based on bust)
      const estimatedShoulderWidth = shoulderWidth || bust * 0.25;
      
      // Create mock measurements for classification
      const mockMeasurements = {
        shoulderWidth: estimatedShoulderWidth,
        bust,
        waist,
        hips,
        // These would normally come from pose detection
        // For manual entry, we'll use reasonable estimates
        shoulderToHipRatio: estimatedShoulderWidth / hips,
        waistToHipRatio: waist / hips,
        shoulderToWaistRatio: estimatedShoulderWidth / waist
      };
      
      // Use the same classification logic as camera flow
      const classifier = new BodyShapeClassifier();
      const qualityService = new QualityAssessmentService(DEFAULT_QUALITY_THRESHOLDS);
      
      // Create mock quality score (high for manual entry)
      const qualityScore = {
        overall: 0.9,
        landmarks: 0.9,
        stability: 0.9,
        lighting: 0.9,
        framing: 0.9
      };
      
      const classificationResult = classifier.classify(mockMeasurements, qualityScore);
      
      setResult(classificationResult);
      setShowResult(true);
      
    } catch (error) {
      console.error('Error processing measurements:', error);
      setErrors({ 
        submit: 'Failed to process measurements. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseResult = () => {
    if (result) {
      // Navigate to results page with the analysis result
      const resultsData = {
        shape: result.shape,
        confidence: result.confidence,
        measurements: {
          shoulders: result.measurements?.shoulderWidth || 0,
          bust: result.measurements?.bust || 0,
          waist: result.measurements?.waist || 0,
          hips: result.measurements?.hips || 0,
        },
        timestamp: new Date().toISOString(),
        method: 'manual' as const,
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('bodyShapeResults', JSON.stringify(resultsData));
      
      // Navigate to results page
      navigate('/results', { state: resultsData });
    }
  };

  const handleRetry = () => {
    setShowResult(false);
    setResult(null);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (showResult && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={handleRetry}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Enter Different Measurements
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                Analysis Complete
              </CardTitle>
              <CardDescription>
                Based on your manual measurements
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <div className="inline-block px-6 py-3 bg-blue-100 text-blue-800 rounded-full text-xl font-bold mb-4">
                  {result.shape.replace('_', ' ')} Shape
                </div>
                <p className="text-muted-foreground">
                  Confidence: {Math.round(result.confidence * 100)}%
                </p>
                <Progress value={result.confidence * 100} className="mt-2 max-w-xs mx-auto" />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{measurements.bust}"</div>
                  <p className="text-sm text-muted-foreground">Bust</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{measurements.waist}"</div>
                  <p className="text-sm text-muted-foreground">Waist</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{measurements.hips}"</div>
                  <p className="text-sm text-muted-foreground">Hips</p>
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Note</AlertTitle>
                <AlertDescription>
                  Manual measurements provide good estimates, but camera analysis may be more accurate for body shape classification.
                </AlertDescription>
              </Alert>
            </CardContent>
            
            <CardFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRetry}
                className="flex-1"
              >
                Enter Different Measurements
              </Button>
              <Button
                onClick={handleUseResult}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                View Detailed Results
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Ruler className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Manual Measurements</CardTitle>
                <CardDescription>
                  Enter your measurements for body shape analysis
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bust" className="flex items-center">
                      <span>Bust</span>
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="bust"
                        placeholder="e.g., 36.5"
                        value={measurements.bust}
                        onChange={(e) => handleInputChange('bust', e.target.value)}
                        className={errors.bust ? 'border-red-500' : ''}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        inches
                      </div>
                    </div>
                    {errors.bust && (
                      <p className="text-sm text-red-500">{errors.bust}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Measure around the fullest part of your bust
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="waist" className="flex items-center">
                      <span>Waist</span>
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="waist"
                        placeholder="e.g., 28.0"
                        value={measurements.waist}
                        onChange={(e) => handleInputChange('waist', e.target.value)}
                        className={errors.waist ? 'border-red-500' : ''}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        inches
                      </div>
                    </div>
                    {errors.waist && (
                      <p className="text-sm text-red-500">{errors.waist}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Measure around the narrowest part of your waist
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hips" className="flex items-center">
                      <span>Hips</span>
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="hips"
                        placeholder="e.g., 38.5"
                        value={measurements.hips}
                        onChange={(e) => handleInputChange('hips', e.target.value)}
                        className={errors.hips ? 'border-red-500' : ''}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        inches
                      </div>
                    </div>
                    {errors.hips && (
                      <p className="text-sm text-red-500">{errors.hips}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Measure around the fullest part of your hips
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shoulderWidth">Shoulder Width (Optional)</Label>
                    <div className="relative">
                      <Input
                        id="shoulderWidth"
                        placeholder="e.g., 16.5"
                        value={measurements.shoulderWidth}
                        onChange={(e) => handleInputChange('shoulderWidth', e.target.value)}
                        className={errors.shoulderWidth ? 'border-red-500' : ''}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        inches
                      </div>
                    </div>
                    {errors.shoulderWidth && (
                      <p className="text-sm text-red-500">{errors.shoulderWidth}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Measure across the back from shoulder to shoulder
                    </p>
                  </div>
                </div>
              </div>
              
              <Alert>
                <Calculator className="h-4 w-4" />
                <AlertTitle>Measurement Tips</AlertTitle>
                <AlertDescription className="space-y-1">
                  <p>• Use a soft measuring tape</p>
                  <p>• Stand naturally, don't suck in your stomach</p>
                  <p>• Keep the tape parallel to the floor</p>
                  <p>• Don't pull the tape too tight</p>
                </AlertDescription>
              </Alert>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Privacy Note</h4>
                    <p className="text-sm text-blue-700">
                      Your measurements are processed locally and not stored on any server. 
                      For more accurate results, consider using the camera analysis.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Measurements'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => navigate('/camera')}
            className="text-blue-600"
          >
            Prefer camera analysis? Try our camera-based body shape scanner
          </Button>
        </div>
      </div>
    </div>
  );
}