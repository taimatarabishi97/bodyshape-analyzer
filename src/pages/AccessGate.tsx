import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function AccessGate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isValidating, setIsValidating] = useState(false);
  const [accessInput, setAccessInput] = useState('');
  const [mode, setMode] = useState<'token' | 'email'>('token');

  // Check if we're in BASIC_MODE
  const isBasicMode = import.meta.env.VITE_MODE?.toLowerCase() === 'basic';

  useEffect(() => {
    // If in BASIC_MODE, skip access gate - go directly to questionnaire
    if (isBasicMode) {
      navigate('/questionnaire');
      return;
    }

    // Check if token is provided in URL
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setAccessInput(tokenParam);
      validateAccess(tokenParam, 'token');
    }
  }, [isBasicMode, searchParams]);

  const validateAccess = async (input: string, type: 'token' | 'email') => {
    if (!input.trim()) {
      toast.error('Please enter an access token or email');
      return;
    }

    setIsValidating(true);

    try {
      if (!supabase) {
        toast.error('Database not configured');
        setIsValidating(false);
        return;
      }

      if (type === 'token') {
        // Validate access token
        const { data: accessToken, error } = await supabase
          .from('access_tokens')
          .select('*')
          .eq('token', input.trim())
          .single();

        if (error || !accessToken) {
          toast.error('Invalid access token. Please check your purchase email.');
          setIsValidating(false);
          return;
        }

        // Check if token is already used
        if (accessToken.is_used) {
          toast.error('This access token has already been used.');
          setIsValidating(false);
          return;
        }

        // Check if token is expired
        if (new Date(accessToken.expires_at) < new Date()) {
          toast.error('This access token has expired.');
          setIsValidating(false);
          return;
        }

        // Store token in session
        sessionStorage.setItem('access_token', accessToken.token);
        sessionStorage.setItem('user_email', accessToken.email);
        sessionStorage.setItem('service_tier', accessToken.tier);

        toast.success('Access granted! Let\'s get started...');
        navigate('/questionnaire');
      } else {
        // Validate email (check if they have a paid purchase)
        // First check if email has any valid access tokens
        const { data: tokens, error: tokenError } = await supabase
          .from('access_tokens')
          .select('*')
          .eq('email', input.trim().toLowerCase())
          .order('created_at', { ascending: false });

        if (tokenError || !tokens || tokens.length === 0) {
          toast.error('No purchase found for this email. Please use your access token from the purchase email.');
          setIsValidating(false);
          return;
        }

        // Check if they have any unused, non-expired tokens
        const validToken = tokens.find(
          (t) => !t.is_used && new Date(t.expires_at) > new Date()
        );

        if (!validToken) {
          toast.error('All access tokens for this email have been used or expired. Please contact support.');
          setIsValidating(false);
          return;
        }

        // Use the first valid token
        sessionStorage.setItem('access_token', validToken.token);
        sessionStorage.setItem('user_email', validToken.email);
        sessionStorage.setItem('service_tier', validToken.tier);

        toast.success('Access granted! Let\'s get started...');
        navigate('/questionnaire');
      }
    } catch (error) {
      console.error('Error validating access:', error);
      toast.error('An error occurred. Please try again.');
      setIsValidating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAccess(accessInput, mode);
  };

  // Skip rendering if in BASIC_MODE (will redirect in useEffect)
  if (isBasicMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Access Your Analysis</CardTitle>
            <CardDescription className="mt-2">
              Enter your access token or email from your purchase confirmation
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mode Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setMode('token')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === 'token'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Access Token
              </button>
              <button
                type="button"
                onClick={() => setMode('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === 'email'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Email
              </button>
            </div>

            {/* Input Field */}
            <div className="space-y-2">
              <Label htmlFor="access-input">
                {mode === 'token' ? 'Access Token' : 'Email Address'}
              </Label>
              <Input
                id="access-input"
                type={mode === 'email' ? 'email' : 'text'}
                placeholder={
                  mode === 'token'
                    ? 'Enter your access token'
                    : 'Enter your email address'
                }
                value={accessInput}
                onChange={(e) => setAccessInput(e.target.value)}
                disabled={isValidating}
                required
              />
              <p className="text-xs text-gray-500">
                {mode === 'token'
                  ? 'Find this in your purchase confirmation email'
                  : 'Use the email you used for purchase'}
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isValidating || !accessInput.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Continue to Analysis
                </>
              )}
            </Button>

            {/* Help Text */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 text-center">
                Don't have an access token?{' '}
                <a
                  href="https://shop.colorscodestyle.com"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Purchase here
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}