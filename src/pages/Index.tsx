import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sparkles, Shield, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Index() {
  const navigate = useNavigate();
  const [consentGiven, setConsentGiven] = useState(false);
  const isBasicMode = import.meta.env.VITE_MODE?.toLowerCase() === 'basic';

  const handleStart = () => {
    if (!consentGiven) {
      toast.error('Please read and accept the consent statement to continue');
      return;
    }

    // In BASIC_MODE, go to method selection (camera or questionnaire)
    // In FULL_MODE, go to access gate first
    if (isBasicMode) {
      navigate('/method');
    } else {
      navigate('/access');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
            <a
              href="/admin/login"
              className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              Admin
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Discover Your Perfect Style
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get personalized styling recommendations based on your unique body shape.
              Our analysis helps you understand what works best for you.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Personalized Analysis</h3>
                <p className="text-sm text-gray-600">
                  Get tailored recommendations based on your unique proportions
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold mb-2">Privacy First</h3>
                <p className="text-sm text-gray-600">
                  Your data is secure and used only for your analysis
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Detailed Report</h3>
                <p className="text-sm text-gray-600">
                  Download a comprehensive PDF with all your recommendations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Consent Card */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-start gap-3 mb-6">
                <Shield className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Before You Begin</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    This body shape analysis is a styling tool based on fashion industry standards.
                    It is not medical advice and makes no health claims.
                  </p>
                  
                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p>Your responses help us provide personalized styling recommendations</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p>All body shapes are beautiful - this is about finding what flatters you</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p>Your data is stored securely and used only for your analysis</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p>You can download your results as a PDF for future reference</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                    <Checkbox
                      id="consent"
                      checked={consentGiven}
                      onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
                    />
                    <Label
                      htmlFor="consent"
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      I understand this is a styling tool, not medical advice. I consent to
                      providing my information for personalized styling recommendations.
                    </Label>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStart}
                disabled={!consentGiven}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Your Analysis
              </Button>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Questions? Visit our{' '}
              <a href="https://colorscodestyle.com/faq" className="text-purple-600 hover:text-purple-700">
                FAQ
              </a>{' '}
              or{' '}
              <a href="https://colorscodestyle.com/contact" className="text-purple-600 hover:text-purple-700">
                contact us
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Colors Code</p>
                <p className="text-xs text-gray-600">Personalized Style Analysis</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600">© 2024 Colors Code. All rights reserved.</p>
              <div className="flex gap-4 mt-2 justify-center md:justify-end text-xs">
                <a href="https://colorscodestyle.com/privacy" className="text-gray-600 hover:text-purple-600">
                  Privacy Policy
                </a>
                <a href="https://colorscodestyle.com/terms" className="text-gray-600 hover:text-purple-600">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}