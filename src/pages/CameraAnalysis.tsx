import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraProvider, useCamera } from '@/contexts/CameraContext';
import { CameraConsentModal } from '@/components/camera/CameraConsentModal';
import { CameraInterface } from '@/components/camera/CameraInterface';
import { ResultsDisplay } from '@/components/camera/ResultsDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, AlertCircle, ArrowLeft, CheckCircle, Ruler } from 'lucide-react';
import { BodyShapeResult } from '@/types/camera';

// Main component that uses camera context
function CameraAnalysisContent() {
  const navigate = useNavigate();
  const { state, requestPermission, startCamera, stopCamera, switchCamera, analyzePose, reset } = useCamera();
  
  const [showConsent, setShowConsent] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<ImageData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<BodyShapeResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we need to show consent modal
  useEffect(() => {
    if (state.permission === 'GRANTED') {
      setShowConsent(false);
      setShowCamera(true);
    }
  }, [state.permission]);

  const handleGrantPermission = async () => {
    try {
      setError(null);
      await requestPermission();
      setShowConsent(false);
      setShowCamera(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request camera permission';
      setError(errorMessage);
    }
  };

  const handleStartCamera = async () => {
    try {
      setError(null);
      await startCamera();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start camera';
      setError(errorMessage);
    }
  };

  const handleCapture = async (imageData: ImageData) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Analyze the captured image
      if (state.landmarks) {
        const result = await analyzePose(state.landmarks, imageData);
        setAnalysisResult(result);
        setCapturedImage(imageData);
        setShowCamera(false);
      } else {
        throw new Error('No pose landmarks detected');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze pose';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCancel = () => {
    stopCamera();
    setShowCamera(false);
    setShowConsent(true);
  };

  const handleRetry = () => {
    reset();
    setAnalysisResult(null);
    setCapturedImage(null);
    setShowConsent(true);
    setError(null);
  };

  const handleUseResult = (result: BodyShapeResult) => {
    // Navigate to results page with the analysis result
    const resultsData = {
      shape: result.shape,
      confidence: result.confidence,
      measurements: result.measurements,
      timestamp: new Date().toISOString(),
      method: 'camera' as const,
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('bodyShapeResults', JSON.stringify(resultsData));
    
    // Navigate to results page
    navigate('/results', { state: resultsData });
  };

  const handleManualEntry = () => {
    navigate('/manual');
  };

  // Render based on current state
  const renderContent = () => {
    if (analysisResult) {
      return (
        <ResultsDisplay
          result={analysisResult}
          onRetry={handleRetry}
          onUseResult={handleUseResult}
          onManualEntry={handleManualEntry}
        />
      );
    }

    if (showCamera && state.status === 'ACTIVE') {
      return (
        <CameraInterface
          onCapture={handleCapture}
          onCancel={handleCancel}
          onSwitchCamera={switchCamera}
        />
      );
    }

    if (showCamera) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Camera Setup</CardTitle>
              <CardDescription className="text-center">
                Getting your camera ready for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Camera className="w-10 h-10 text-blue-600" />
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Ready to Start</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the button below to start your camera and begin the body shape analysis.
                  </p>
                </div>

                <Button
                  onClick={handleStartCamera}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={state.status === 'ACTIVE'}
                >
                  {state.status === 'ACTIVE' ? 'Starting Camera...' : 'Start Camera'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowCamera(false)}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default view - instructions
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Body Shape Analysis</h1>
            <p className="text-muted-foreground">
              Get your body shape classification using camera analysis
            </p>
          </div>

          {/* Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 list-decimal list-inside">
                  <li className="text-sm">Grant camera permission when prompted</li>
                  <li className="text-sm">Stand about 6 feet from your camera</li>
                  <li className="text-sm">Face the camera directly with arms at your sides</li>
                  <li className="text-sm">Hold still while we analyze your pose</li>
                  <li className="text-sm">Get instant body shape classification</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  What You'll Get
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Body shape classification (Hourglass, Pear, etc.)
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Detailed body proportion ratios
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Personalized style recommendations
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    100% private - no images stored
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Requirements */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">📱</div>
                  <h4 className="font-medium mb-1">Device</h4>
                  <p className="text-sm text-muted-foreground">
                    Smartphone, tablet, or computer with camera
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">💡</div>
                  <h4 className="font-medium mb-1">Lighting</h4>
                  <p className="text-sm text-muted-foreground">
                    Well-lit area without harsh shadows
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">👕</div>
                  <h4 className="font-medium mb-1">Clothing</h4>
                  <p className="text-sm text-muted-foreground">
                    Form-fitting clothing for best results
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual Fallback Card */}
          <Card className="mb-8 border-dashed border-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ruler className="w-5 h-5 mr-2" />
                Alternative: Manual Measurements
              </CardTitle>
              <CardDescription>
                Don't have a camera or prefer to enter measurements manually?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">
                    Enter your bust, waist, and hip measurements manually. We'll use the same body shape classification logic.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                      Same accurate classification as camera analysis
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                      No camera required
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                      Perfect for low-light conditions
                    </li>
                  </ul>
                </div>
                <Button
                  onClick={handleManualEntry}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  <Ruler className="w-4 h-4 mr-2" />
                  Enter Measurements Manually
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Start button */}
          <div className="text-center">
            <Button
              onClick={() => setShowConsent(true)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Camera Analysis
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              By clicking above, you agree to use your camera for analysis
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Consent Modal - Updated to include manual option */}
      <CameraConsentModal
        isOpen={showConsent}
        onClose={() => setShowConsent(false)}
        onGrantPermission={handleGrantPermission}
        onManualEntry={handleManualEntry}
        isLoading={state.status === 'REQUESTING_PERMISSION'}
      />

      {/* Error Alert */}
      {error && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Loading overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <div className="text-center">
                  <h3 className="font-medium">Analyzing Your Pose</h3>
                  <p className="text-sm text-muted-foreground">
                    Calculating measurements and classifying body shape...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main content */}
      {renderContent()}
    </>
  );
}

// Wrapper component that provides camera context
export default function CameraAnalysis() {
  return (
    <CameraProvider>
      <CameraAnalysisContent />
    </CameraProvider>
  );
}