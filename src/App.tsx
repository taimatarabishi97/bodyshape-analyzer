import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Index from './pages/Index';
import AccessGate from './pages/AccessGate';
import MethodSelection from './pages/MethodSelection';
import PremiumQuestionnaire from './pages/PremiumQuestionnaire';
import Results from './pages/Results';
import ResultsPage from './pages/ResultsPage';
import CameraAnalysis from './pages/CameraAnalysis';
import ManualMeasurements from './pages/ManualMeasurements';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminSubmissionDetail from './pages/AdminSubmissionDetail';
import NotFound from './pages/NotFound';
import EnvTest from './pages/EnvTest';
import { isAdminAuthenticated } from './lib/auth';

const queryClient = new QueryClient();

// Protected Route Component for Admin
function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = await isAdminAuthenticated();
    setIsAuthenticated(isAuth);
  };

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/access" element={<AccessGate />} />
          <Route path="/method" element={<MethodSelection />} />
          <Route path="/questionnaire" element={<PremiumQuestionnaire />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/camera" element={<CameraAnalysis />} />
          <Route path="/manual" element={<ManualMeasurements />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/submission/:id"
            element={
              <ProtectedAdminRoute>
                <AdminSubmissionDetail />
              </ProtectedAdminRoute>
            }
          />
          
          {/* Diagnostic Route */}
          <Route path="/env-test" element={<EnvTest />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;