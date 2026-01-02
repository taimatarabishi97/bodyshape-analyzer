import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, ClipboardList, ArrowLeft, Sparkles, Shield, Zap } from 'lucide-react';

export default function MethodSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Colors Code
                </h1>
                <p className="text-xs text-gray-600">Body Shape Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Choose Your Analysis Method
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select how you'd like to determine your body shape. Both methods provide accurate results.
            </p>
          </div>

          {/* Method Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Camera Analysis Card */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  onClick={() => navigate('/camera')}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-10 h-10 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Camera Analysis</CardTitle>
                <CardDescription className="text-base">
                  Quick and easy - use your camera
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">Instant results in under 30 seconds</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">100% private - no images are stored or sent</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">AI-powered pose detection for accuracy</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mt-4"
                  size="lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Start Camera Analysis
                </Button>
                
                <p className="text-xs text-center text-gray-500">
                  Requires camera access permission
                </p>
              </CardContent>
            </Card>

            {/* Manual Questionnaire Card */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  onClick={() => navigate('/questionnaire')}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-10 h-10 text-pink-600" />
                </div>
                <CardTitle className="text-2xl">Questionnaire</CardTitle>
                <CardDescription className="text-base">
                  Answer questions about your body
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <ClipboardList className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">Simple questions about your proportions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">No camera required - works anywhere</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">Optional measurements for better accuracy</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full border-2 border-pink-600 text-pink-600 hover:bg-pink-50 mt-4"
                  size="lg"
                >
                  <ClipboardList className="w-5 h-5 mr-2" />
                  Start Questionnaire
                </Button>
                
                <p className="text-xs text-center text-gray-500">
                  Takes about 2-3 minutes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Info Banner */}
          <Card className="border-0 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Your Privacy Matters</h4>
                  <p className="text-sm text-gray-600">
                    Both methods are designed with your privacy in mind. Camera analysis processes everything 
                    locally on your device - no images are ever stored or sent to our servers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
