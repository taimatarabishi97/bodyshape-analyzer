import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, ArrowRight, Loader2, Sparkles, Heart, Target, 
  Palette, ShoppingBag, Sun, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import type { QuestionnaireAnswers } from '@/types';
import { classifyBodyShape, getAnalysisResult } from '@/lib/analysis/bodyShapeClassifier';
import stylingRecommendations from '@/config/stylingRecommendations.json';

// Premium consultation questions - warm, supportive tone
const questions = [
  {
    id: 'goal',
    step: 1,
    icon: Target,
    title: "What brings you here today?",
    subtitle: "We want to understand your styling journey",
    type: 'single',
    options: [
      { value: 'confidence', label: "Feel more confident in my clothes", description: "Love what I see in the mirror" },
      { value: 'flatter', label: "Find what flatters my body", description: "Understand my best silhouettes" },
      { value: 'wardrobe', label: "Build a better wardrobe", description: "Stop buying things I never wear" },
      { value: 'explore', label: "Explore my personal style", description: "Discover what makes me feel like me" },
    ],
  },
  {
    id: 'styleVibe',
    step: 2,
    icon: Sparkles,
    title: "How would you describe your dream style vibe?",
    subtitle: "Pick the one that resonates most with you",
    type: 'single',
    options: [
      { value: 'classic', label: "Classic & Polished", description: "Timeless, elegant, refined" },
      { value: 'relaxed', label: "Relaxed & Effortless", description: "Casual, comfortable, put-together" },
      { value: 'bold', label: "Bold & Expressive", description: "Statement pieces, creative, unique" },
      { value: 'minimal', label: "Minimal & Modern", description: "Clean lines, neutral palette, simple" },
      { value: 'romantic', label: "Soft & Feminine", description: "Flowing, delicate, romantic" },
    ],
  },
  {
    id: 'bodyFeeling',
    step: 3,
    icon: Heart,
    title: "When you look in the mirror, which area do you feel most confident about?",
    subtitle: "Let's celebrate what you love! (This helps us suggest styles that highlight your favorites)",
    type: 'single',
    options: [
      { value: 'shoulders', label: "My shoulders & upper body", description: "I love showing off this area" },
      { value: 'waist', label: "My waist", description: "I like definition here" },
      { value: 'hips', label: "My hips & curves", description: "I embrace my curves" },
      { value: 'legs', label: "My legs", description: "I like to show them off" },
      { value: 'overall', label: "All of me!", description: "I appreciate my whole body" },
    ],
  },
  {
    id: 'proportions',
    step: 4,
    icon: Palette,
    title: "How would you describe your proportions?",
    subtitle: "Think about your shoulders compared to your hips",
    type: 'single',
    options: [
      { value: 'balanced', label: "Balanced", description: "Shoulders and hips are similar width" },
      { value: 'shoulderWider', label: "Shoulders wider than hips", description: "Athletic or inverted triangle" },
      { value: 'hipsWider', label: "Hips wider than shoulders", description: "Pear or curvy shape" },
      { value: 'notSure', label: "Not sure", description: "I'd like help figuring this out" },
    ],
  },
  {
    id: 'waist',
    step: 5,
    icon: Sparkles,
    title: "What about your waist?",
    subtitle: "Is there a visible difference between your waist and your bust/hips?",
    type: 'single',
    options: [
      { value: 'veryDefined', label: "Very defined", description: "Clear hourglass curve" },
      { value: 'somewhatDefined', label: "Somewhat defined", description: "Gentle curve inward" },
      { value: 'straight', label: "More straight", description: "Little difference between waist and hips" },
      { value: 'midsection', label: "Fuller around the middle", description: "Waist is wider than bust/hips" },
    ],
  },
  {
    id: 'fitPreference',
    step: 6,
    icon: ShoppingBag,
    title: "How do you prefer your clothes to fit?",
    subtitle: "There's no wrong answer—this is about your comfort!",
    type: 'single',
    options: [
      { value: 'fitted', label: "Fitted & structured", description: "I like clothes that show my shape" },
      { value: 'relaxed', label: "Relaxed & flowy", description: "Comfort is my priority" },
      { value: 'balanced', label: "Mix of both", description: "Depends on the piece" },
      { value: 'unsure', label: "I'm experimenting", description: "Still figuring out what works" },
    ],
  },
  {
    id: 'struggle',
    step: 7,
    icon: Heart,
    title: "What's your biggest styling challenge?",
    subtitle: "We all have them—and we can help!",
    type: 'single',
    options: [
      { value: 'fit', label: "Finding clothes that fit well", description: "Things never fit right" },
      { value: 'balance', label: "Creating balanced outfits", description: "Looking proportional" },
      { value: 'versatile', label: "Building versatile outfits", description: "Need more outfit variety" },
      { value: 'trends', label: "Knowing what trends suit me", description: "What works for my body?" },
      { value: 'confidence', label: "Feeling confident in outfits", description: "Second-guessing my choices" },
    ],
  },
  {
    id: 'occasions',
    step: 8,
    icon: Sun,
    title: "Where do you need outfit help most?",
    subtitle: "Select the occasions you dress for most often",
    type: 'single',
    options: [
      { value: 'work', label: "Work & professional settings", description: "Office, meetings, business" },
      { value: 'casual', label: "Everyday & casual", description: "Errands, weekends, hanging out" },
      { value: 'events', label: "Events & special occasions", description: "Dates, parties, weddings" },
      { value: 'allRound', label: "All of the above!", description: "I need a complete wardrobe refresh" },
    ],
  },
];

// Map questionnaire answers to body shape classification
function mapToPropAnswers(answers: Record<string, string>): Partial<QuestionnaireAnswers> {
  // Map proportions question to shoulder/hip width
  let shoulderWidth: 'average' | 'broad' | 'narrow' = 'average';
  let hipWidth: 'average' | 'narrow' | 'wide' = 'average';
  
  if (answers.proportions === 'shoulderWider') {
    shoulderWidth = 'broad';
    hipWidth = 'narrow';
  } else if (answers.proportions === 'hipsWider') {
    shoulderWidth = 'narrow';
    hipWidth = 'wide';
  } else if (answers.proportions === 'balanced') {
    shoulderWidth = 'average';
    hipWidth = 'average';
  }

  // Map waist question
  let waistDefinition: 'undefined' | 'straight' | 'somewhat-defined' | 'very-defined' = 'somewhat-defined';
  if (answers.waist === 'veryDefined') {
    waistDefinition = 'very-defined';
  } else if (answers.waist === 'somewhatDefined') {
    waistDefinition = 'somewhat-defined';
  } else if (answers.waist === 'straight') {
    waistDefinition = 'straight';
  } else if (answers.waist === 'midsection') {
    waistDefinition = 'undefined';
  }

  // Map body feeling to largest/smallest parts
  let largestBodyPart: 'shoulders' | 'waist' | 'hips' | 'thighs' | 'bust' = 'hips';
  let smallestBodyPart: 'shoulders' | 'waist' | 'hips' | 'thighs' | 'bust' = 'waist';
  
  if (answers.bodyFeeling === 'shoulders') {
    largestBodyPart = 'shoulders';
    smallestBodyPart = 'hips';
  } else if (answers.bodyFeeling === 'waist') {
    smallestBodyPart = 'waist';
    largestBodyPart = answers.proportions === 'hipsWider' ? 'hips' : 'shoulders';
  } else if (answers.bodyFeeling === 'hips') {
    largestBodyPart = 'hips';
    smallestBodyPart = 'waist';
  } else if (answers.bodyFeeling === 'legs') {
    largestBodyPart = 'thighs';
    smallestBodyPart = 'waist';
  }

  // Weight distribution based on proportions
  let weightDistribution: 'midsection' | 'evenly' | 'upper-body' | 'lower-body' = 'evenly';
  if (answers.proportions === 'shoulderWider') {
    weightDistribution = 'upper-body';
  } else if (answers.proportions === 'hipsWider') {
    weightDistribution = 'lower-body';
  } else if (answers.waist === 'midsection') {
    weightDistribution = 'midsection';
  }

  return {
    shoulderWidth,
    hipWidth,
    waistDefinition,
    weightDistribution,
    bustSize: 'medium',
    largestBodyPart,
    smallestBodyPart,
    bodyFrameSize: 'average',
  };
}

export default function PremiumQuestionnaire() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');

  const totalSteps = questions.length;
  const progress = (currentStep / totalSteps) * 100;
  
  const currentQuestion = useMemo(() => 
    questions.find(q => q.step === currentStep), 
    [currentStep]
  );

  const updateAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isStepComplete = () => {
    if (!currentQuestion) return false;
    return !!answers[currentQuestion.id];
  };

  const handleNext = () => {
    if (isStepComplete()) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      toast.error('Please select an option to continue');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Store questionnaire answers in sessionStorage for later use
      sessionStorage.setItem('questionnaireAnswers', JSON.stringify(answers));
      sessionStorage.setItem('questionnaireNotes', notes);

      toast.success('Great! Now choose how you would like to analyze your body shape.');
      
      // Navigate to method selection
      navigate('/method');
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const IconComponent = currentQuestion?.icon || Sparkles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Style Consultation</p>
              <p className="text-sm font-medium text-purple-700">
                Question {currentStep} of {totalSteps}
              </p>
            </div>
            <div className="w-20" /> {/* Spacer for alignment */}
          </div>
          <Progress value={progress} className="h-1 mt-3" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentQuestion && (
              <Card className="shadow-xl border-0 overflow-hidden">
                {/* Question Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-8 text-white text-center">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">
                    {currentQuestion.title}
                  </h1>
                  <p className="text-purple-100">
                    {currentQuestion.subtitle}
                  </p>
                </div>

                <CardContent className="p-6">
                  <RadioGroup 
                    value={answers[currentQuestion.id] || ''} 
                    onValueChange={(v) => updateAnswer(currentQuestion.id, v)}
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option) => (
                      <Label
                        key={option.value}
                        htmlFor={`${currentQuestion.id}-${option.value}`}
                        className={`
                          flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                          ${answers[currentQuestion.id] === option.value 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                          }
                        `}
                      >
                        <RadioGroupItem 
                          value={option.value} 
                          id={`${currentQuestion.id}-${option.value}`}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{option.label}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
                        </div>
                        {answers[currentQuestion.id] === option.value && (
                          <CheckCircle2 className="w-5 h-5 text-purple-500 mt-1" />
                        )}
                      </Label>
                    ))}
                  </RadioGroup>

                  {/* Notes field on last question */}
                  {currentStep === totalSteps && (
                    <div className="mt-6 pt-6 border-t">
                      <Label htmlFor="notes" className="text-base font-medium text-gray-700">
                        Anything else you'd like us to know? (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="E.g., I have a long torso, I prefer to avoid tight clothes, I love florals..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-2 resize-none"
                        rows={3}
                      />
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      disabled={isSubmitting}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>

                    {currentStep < totalSteps ? (
                      <Button
                        onClick={handleNext}
                        disabled={!isStepComplete()}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={!isStepComplete() || isSubmitting}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 min-w-[160px]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Get My Results
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-1.5 mt-8">
          {questions.map((q) => (
            <div
              key={q.step}
              className={`
                w-2 h-2 rounded-full transition-all
                ${q.step === currentStep 
                  ? 'w-6 bg-purple-600' 
                  : q.step < currentStep 
                    ? 'bg-purple-400' 
                    : 'bg-gray-300'
                }
              `}
            />
          ))}
        </div>

        {/* Supportive Message */}
        <p className="text-center text-gray-500 text-sm mt-6">
          ✨ Remember: Every body is beautiful. We're here to help you feel your best!
        </p>
      </main>
    </div>
  );
}
