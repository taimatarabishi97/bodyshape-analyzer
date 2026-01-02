import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import type { Submission } from '@/types';
import { supabase } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';
import { generatePDF } from '@/lib/pdf-generator';
import { sendResultsEmail } from '@/lib/resend';

export default function AdminSubmissionDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    checkAuthAndLoadSubmission();
  }, [id]);

  const checkAuthAndLoadSubmission = async () => {
    try {
      // Check if user is authenticated as admin
      const isAuth = await isAdminAuthenticated();
      
      if (!isAuth) {
        toast.error('Please login to access admin dashboard');
        navigate('/admin/login');
        return;
      }

      await loadSubmission();
    } catch (error) {
      console.error('Auth check error:', error);
      toast.error('Authentication error');
      navigate('/admin/login');
    }
  };

  const loadSubmission = async () => {
    if (!id || !supabase) {
      toast.error('Invalid submission ID or database not configured');
      navigate('/admin/dashboard');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Error loading submission:', error);
        toast.error('Submission not found');
        navigate('/admin/dashboard');
        return;
      }

      setSubmission(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading submission:', error);
      toast.error('An error occurred');
      navigate('/admin/dashboard');
    }
  };

  const handleDownloadPDF = () => {
    if (!submission) return;

    try {
      const pdfBuffer = generatePDF(
        submission.email,
        submission.styling_recommendations
      );

      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `body-shape-analysis-${submission.email}-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleSendEmail = async () => {
    if (!submission) return;

    const isFullMode = import.meta.env.VITE_MODE === 'FULL';
    if (!isFullMode) {
      toast.error('Email sending is only available in FULL_MODE');
      return;
    }

    setIsSendingEmail(true);

    try {
      const pdfBuffer = generatePDF(
        submission.email,
        submission.styling_recommendations
      );

      await sendResultsEmail(
        submission.email,
        submission.body_shape_result,
        pdfBuffer
      );

      toast.success('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getBodyShapeColor = (shape: string) => {
    const colors: Record<string, string> = {
      pear: 'bg-green-100 text-green-800',
      hourglass: 'bg-purple-100 text-purple-800',
      apple: 'bg-red-100 text-red-800',
      rectangle: 'bg-blue-100 text-blue-800',
      'inverted-triangle': 'bg-orange-100 text-orange-800',
    };
    return colors[shape] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!submission) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Colors Code Admin
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Submission Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Submission Details</CardTitle>
                  <CardDescription className="mt-1">
                    Submitted on {new Date(submission.created_at).toLocaleString()}
                  </CardDescription>
                </div>
                <Badge className={getBodyShapeColor(submission.body_shape_result)}>
                  {submission.body_shape_result}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-lg">{submission.email}</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleDownloadPDF} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail || import.meta.env.VITE_MODE !== 'FULL'}
                  variant="outline"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Questionnaire Answers */}
          <Card>
            <CardHeader>
              <CardTitle>Questionnaire Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(submission.questionnaire_answers).map(([key, value]) => (
                  <div key={key} className="border-b pb-2">
                    <p className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-base capitalize">{String(value).replace(/-/g, ' ')}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Measurements */}
          {submission.measurements && (
            <Card>
              <CardHeader>
                <CardTitle>Body Measurements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(submission.measurements).map(([key, value]) => (
                    <div key={key} className="border-b pb-2">
                      <p className="text-sm font-medium text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-base">
                        {value} {key === 'height' ? 'cm' : key === 'weight' ? 'kg' : 'cm'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Styling Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Body Shape</h3>
                <Badge className={getBodyShapeColor(submission.body_shape_result)} size="lg">
                  {submission.body_shape_result}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">
                  {submission.styling_recommendations.description}
                </p>
              </div>

              {submission.styling_recommendations.stylingRecommendations.map((rec, idx) => (
                <div key={idx}>
                  <h3 className="font-semibold mb-2">{rec.category}</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">
                        ✓ Recommendations:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {rec.recommendations.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    {rec.avoid.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-red-700 mb-1">
                          ✗ Avoid:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {rec.avoid.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div>
                <h3 className="font-semibold mb-2">Color Tips</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {submission.styling_recommendations.colorTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Fit Tips</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {submission.styling_recommendations.fitTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}