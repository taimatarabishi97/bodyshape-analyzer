import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Download, Mail, Loader2, CheckCircle, XCircle, Home } from 'lucide-react';
import { toast } from 'sonner';
import type { AnalysisResult, Submission } from '@/types';
import { supabase } from '@/lib/supabase';
import { generatePDF } from '@/lib/pdf-generator';

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      // Check if we have state from navigation (demo mode)
      if (location.state && location.state.analysisResult) {
        setAnalysisResult(location.state.analysisResult);
        setLoading(false);
        return;
      }

      // Fetch from database
      if (!id || id === 'demo') {
        toast.error('Invalid submission ID');
        navigate('/');
        return;
      }

      if (!supabase) {
        toast.error('Database not configured');
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setSubmission(data);
        setAnalysisResult(data.styling_recommendations);
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error('Failed to load results');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id, location.state, navigate]);

  const handleDownloadPDF = () => {
    if (!analysisResult) return;

    const email = submission?.email || location.state?.email || 'user@example.com';
    const doc = generatePDF(email, analysisResult);
    doc.save('body-shape-analysis.pdf');
    toast.success('PDF downloaded successfully!');
  };

  const handleSendEmail = async () => {
    if (!analysisResult || !submission) {
      toast.error('Cannot send email without submission data');
      return;
    }

    setSendingEmail(true);

    try {
      // In a real implementation, this would call a backend API endpoint
      // For now, we'll just simulate the email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Results sent to your email!');
      setEmailSent(true);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email. Please try downloading the PDF instead.');
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Results Not Found</h2>
            <p className="text-gray-600 mb-4">We couldn't find your analysis results.</p>
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bodyShapeName = analysisResult.bodyShape
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Your Analysis is Complete!
          </h1>
          <p className="text-gray-600">Here are your personalized styling recommendations</p>
        </div>

        {/* Body Shape Result Card */}
        <Card className="shadow-xl border-0 mb-6">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardTitle className="text-2xl">Your Body Shape</CardTitle>
            <CardDescription className="text-purple-100">
              {submission?.email || location.state?.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <Badge className="text-lg px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200">
                {bodyShapeName}
              </Badge>
            </div>
            <p className="text-gray-700 leading-relaxed">{analysisResult.description}</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={handleDownloadPDF}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={sendingEmail || emailSent || !submission}
            variant="outline"
            size="lg"
          >
            {sendingEmail ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : emailSent ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Email Sent
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Email Results
              </>
            )}
          </Button>
        </div>

        {/* Styling Recommendations */}
        <Card className="shadow-xl border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Styling Recommendations</CardTitle>
            <CardDescription>
              Personalized fashion advice for your {bodyShapeName} shape
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {analysisResult.stylingRecommendations.map((rec, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold">
                    {rec.category}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {rec.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            What Works
                          </h4>
                          <ul className="space-y-2">
                            {rec.recommendations.map((item, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {rec.avoid.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-700 mb-2 flex items-center">
                            <XCircle className="w-4 h-4 mr-2" />
                            What to Avoid
                          </h4>
                          <ul className="space-y-2">
                            {rec.avoid.map((item, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-red-600 mr-2">•</span>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Color Tips */}
        {analysisResult.colorTips.length > 0 && (
          <Card className="shadow-xl border-0 mb-6">
            <CardHeader>
              <CardTitle>Color Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysisResult.colorTips.map((tip, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Fit Tips */}
        {analysisResult.fitTips.length > 0 && (
          <Card className="shadow-xl border-0 mb-6">
            <CardHeader>
              <CardTitle>Fit Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysisResult.fitTips.map((tip, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-pink-600 mr-2">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Footer Actions */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <Home className="w-4 h-4 mr-2" />
            Start New Analysis
          </Button>
          <p className="text-sm text-gray-500">
            Questions? Contact us at support@example.com
          </p>
        </div>
      </div>
    </div>
  );
}