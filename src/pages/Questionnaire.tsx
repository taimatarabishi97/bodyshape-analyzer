import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { QuestionnaireAnswers, OptionalMeasurements } from '@/types';
import { classifyBodyShape, getAnalysisResult } from '@/lib/analysis/bodyShapeClassifier';
import stylingRecommendations from '@/config/stylingRecommendations.json';
import { supabase } from '@/lib/supabase';

export default function Questionnaire() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({
    shoulderWidth: '',
    hipWidth: '',
    waistDefinition: '',
    weightDistribution: '',
    bustSize: '',
    largestBodyPart: '',
    smallestBodyPart: '',
    bodyFrameSize: '',
  });
  const [measurements, setMeasurements] = useState<OptionalMeasurements>({});

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const updateAnswer = (key: keyof QuestionnaireAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const updateMeasurement = (key: keyof OptionalMeasurements, value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setMeasurements(prev => ({ ...prev, [key]: numValue }));
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return answers.shoulderWidth && answers.hipWidth && answers.waistDefinition && answers.weightDistribution && answers.bustSize;
      case 2:
        return answers.largestBodyPart && answers.smallestBodyPart && answers.bodyFrameSize;
      case 3:
        return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepComplete()) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error('Please answer all questions before continuing');
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!isStepComplete()) {
      toast.error('Please provide your email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Classify body shape
      const bodyShape = classifyBodyShape(answers as QuestionnaireAnswers, measurements);
      const analysisResult = getAnalysisResult(bodyShape, stylingRecommendations);

      // Save to database
      if (supabase) {
        const { data, error } = await supabase
          .from('submissions')
          .insert({
            email,
            questionnaire_answers: answers,
            measurements: Object.keys(measurements).length > 0 ? measurements : null,
            body_shape_result: bodyShape,
            styling_recommendations: analysisResult,
          })
          .select()
          .single();

        if (error) {
          console.error('Database error:', error);
          toast.error('Failed to save your analysis. Please try again.');
          setIsSubmitting(false);
          return;
        }

        // Navigate to results page with submission ID
        navigate(`/results/${data.id}`);
      } else {
        // If no database configured, still show results (for testing)
        toast.warning('Database not configured. Showing results without saving.');
        navigate('/results/demo', { 
          state: { 
            analysisResult, 
            email,
            bodyShape 
          } 
        });
      }
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </h2>
            <span className="text-sm font-medium text-purple-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl">
              {currentStep === 1 && 'Body Proportions'}
              {currentStep === 2 && 'Shape Perception'}
              {currentStep === 3 && 'Optional Measurements & Contact'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Tell us about your body proportions'}
              {currentStep === 2 && 'Help us understand your body shape'}
              {currentStep === 3 && 'Add measurements for more accuracy (optional) and provide your email'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Body Proportions */}
            {currentStep === 1 && (
              <>
                <div className="space-y-3">
                  <Label>Shoulder Width</Label>
                  <RadioGroup value={answers.shoulderWidth} onValueChange={(v) => updateAnswer('shoulderWidth', v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="narrow" id="shoulder-narrow" />
                      <Label htmlFor="shoulder-narrow" className="cursor-pointer">Narrow (smaller than hips)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="average" id="shoulder-average" />
                      <Label htmlFor="shoulder-average" className="cursor-pointer">Average (about the same as hips)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="broad" id="shoulder-broad" />
                      <Label htmlFor="shoulder-broad" className="cursor-pointer">Broad (wider than hips)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Hip Width</Label>
                  <RadioGroup value={answers.hipWidth} onValueChange={(v) => updateAnswer('hipWidth', v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="narrow" id="hip-narrow" />
                      <Label htmlFor="hip-narrow" className="cursor-pointer">Narrow (smaller than shoulders)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="average" id="hip-average" />
                      <Label htmlFor="hip-average" className="cursor-pointer">Average (about the same as shoulders)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wide" id="hip-wide" />
                      <Label htmlFor="hip-wide" className="cursor-pointer">Wide (wider than shoulders)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Waist Definition</Label>
                  <RadioGroup value={answers.waistDefinition} onValueChange={(v) => updateAnswer('waistDefinition', v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-defined" id="waist-very" />
                      <Label htmlFor="waist-very" className="cursor-pointer">Very defined (clear hourglass curve)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat-defined" id="waist-some" />
                      <Label htmlFor="waist-some" className="cursor-pointer">Somewhat defined (gentle curve)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="straight" id="waist-straight" />
                      <Label htmlFor="waist-straight" className="cursor-pointer">Straight (minimal curve)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="undefined" id="waist-undefined" />
                      <Label htmlFor="waist-undefined" className="cursor-pointer">Undefined (no visible curve)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Where do you carry most of your weight?</Label>
                  <RadioGroup value={answers.weightDistribution} onValueChange={(v) => updateAnswer('weightDistribution', v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upper-body" id="weight-upper" />
                      <Label htmlFor="weight-upper" className="cursor-pointer">Upper body (shoulders, bust, arms)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="midsection" id="weight-mid" />
                      <Label htmlFor="weight-mid" className="cursor-pointer">Midsection (stomach, waist)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lower-body" id="weight-lower" />
                      <Label htmlFor="weight-lower" className="cursor-pointer">Lower body (hips, thighs, legs)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="evenly" id="weight-even" />
                      <Label htmlFor="weight-even" className="cursor-pointer">Evenly distributed</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Bust Size (relative to your frame)</Label>
                  <RadioGroup value={answers.bustSize} onValueChange={(v) => updateAnswer('bustSize', v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small" id="bust-small" />
                      <Label htmlFor="bust-small" className="cursor-pointer">Small</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="bust-medium" />
                      <Label htmlFor="bust-medium" className="cursor-pointer">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="large" id="bust-large" />
                      <Label htmlFor="bust-large" className="cursor-pointer">Large</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {/* Step 2: Shape Perception */}
            {currentStep === 2 && (
              <>
                <div className="space-y-3">
                  <Label>What is your largest body part?</Label>
                  <RadioGroup value={answers.largestBodyPart} onValueChange={(v) => updateAnswer('largestBodyPart', v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="shoulders" id="largest-shoulders" />
                      <Label htmlFor="largest-shoulders" className="cursor-pointer">Shoulders</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bust" id="largest-bust" />
                      <Label htmlFor="largest-bust" className="cursor-pointer">Bust</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="waist" id="largest-waist" />
                      <Label htmlFor="largest-waist" className="cursor-pointer">Waist</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hips" id="largest-hips" />
                      <Label htmlFor="largest-hips" className="cursor-pointer">Hips</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="thighs" id="largest-thighs" />
                      <Label htmlFor="largest-thighs" className="cursor-pointer">Thighs</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>What is your smallest body part?</Label>
                  <RadioGroup value={answers.smallestBodyPart} onValueChange={(v) => updateAnswer('smallestBodyPart', v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="shoulders" id="smallest-shoulders" />
                      <Label htmlFor="smallest-shoulders" className="cursor-pointer">Shoulders</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bust" id="smallest-bust" />
                      <Label htmlFor="smallest-bust" className="cursor-pointer">Bust</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="waist" id="smallest-waist" />
                      <Label htmlFor="smallest-waist" className="cursor-pointer">Waist</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hips" id="smallest-hips" />
                      <Label htmlFor="smallest-hips" className="cursor-pointer">Hips</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="thighs" id="smallest-thighs" />
                      <Label htmlFor="smallest-thighs" className="cursor-pointer">Thighs</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Body Frame Size</Label>
                  <RadioGroup value={answers.bodyFrameSize} onValueChange={(v) => updateAnswer('bodyFrameSize', v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="petite" id="frame-petite" />
                      <Label htmlFor="frame-petite" className="cursor-pointer">Petite (under 5'4" / 163cm)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="average" id="frame-average" />
                      <Label htmlFor="frame-average" className="cursor-pointer">Average (5'4" - 5'8" / 163-173cm)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="plus-size" id="frame-plus" />
                      <Label htmlFor="frame-plus" className="cursor-pointer">Tall or Plus-Size (over 5'8" / 173cm or size 14+)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {/* Step 3: Measurements & Email */}
            {currentStep === 3 && (
              <>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-base font-semibold">Email Address *</Label>
                    <p className="text-sm text-gray-600 mb-2">We'll send your results to this email</p>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Optional Measurements</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Adding measurements improves accuracy. All fields are optional.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="165"
                          value={measurements.height || ''}
                          onChange={(e) => updateMeasurement('height', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="65"
                          value={measurements.weight || ''}
                          onChange={(e) => updateMeasurement('weight', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bust">Bust (cm)</Label>
                        <Input
                          id="bust"
                          type="number"
                          placeholder="90"
                          value={measurements.bust || ''}
                          onChange={(e) => updateMeasurement('bust', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="waist">Waist (cm)</Label>
                        <Input
                          id="waist"
                          type="number"
                          placeholder="70"
                          value={measurements.waist || ''}
                          onChange={(e) => updateMeasurement('waist', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="hips">Hips (cm)</Label>
                        <Input
                          id="hips"
                          type="number"
                          placeholder="95"
                          value={measurements.hips || ''}
                          onChange={(e) => updateMeasurement('hips', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shoulderWidth">Shoulder Width (cm)</Label>
                        <Input
                          id="shoulderWidth"
                          type="number"
                          placeholder="40"
                          value={measurements.shoulderWidth || ''}
                          onChange={(e) => updateMeasurement('shoulderWidth', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepComplete()}
                  className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepComplete() || isSubmitting}
                  className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Get My Results'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}