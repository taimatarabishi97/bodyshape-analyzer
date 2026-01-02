import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, LogOut, Search, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { isAdminAuthenticated, signOutAdmin } from '@/lib/auth';
import type { Submission } from '@/types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  });

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  useEffect(() => {
    // Filter submissions based on search query
    if (searchQuery.trim()) {
      const filtered = submissions.filter(
        (sub) =>
          sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.body_shape_result.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubmissions(filtered);
    } else {
      setFilteredSubmissions(submissions);
    }
  }, [searchQuery, submissions]);

  const checkAuthAndLoadData = async () => {
    try {
      // Check if user is authenticated as admin
      const isAuth = await isAdminAuthenticated();
      
      if (!isAuth) {
        toast.error('Please login to access admin dashboard');
        navigate('/admin/login');
        return;
      }

      await loadSubmissions();
    } catch (error) {
      console.error('Auth check error:', error);
      toast.error('Authentication error');
      navigate('/admin/login');
    }
  };

  const loadSubmissions = async () => {
    if (!supabase) {
      toast.error('Database not configured');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading submissions:', error);
        toast.error('Failed to load submissions');
        setIsLoading(false);
        return;
      }

      setSubmissions(data || []);
      setFilteredSubmissions(data || []);
      calculateStats(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast.error('An error occurred');
      setIsLoading(false);
    }
  };

  const calculateStats = (data: Submission[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    setStats({
      total: data.length,
      today: data.filter((s) => new Date(s.created_at) >= today).length,
      thisWeek: data.filter((s) => new Date(s.created_at) >= weekAgo).length,
      thisMonth: data.filter((s) => new Date(s.created_at) >= monthAgo).length,
    });
  };

  const handleLogout = async () => {
    await signOutAdmin();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Email', 'Body Shape', 'Date', 'Has Measurements'];
    const rows = filteredSubmissions.map((sub) => [
      sub.email,
      sub.body_shape_result,
      new Date(sub.created_at).toLocaleDateString(),
      sub.measurements ? 'Yes' : 'No',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('CSV exported successfully');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Colors Code
              </h1>
              <p className="text-sm text-gray-600">Admin Dashboard</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Submissions</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Today</CardDescription>
              <CardTitle className="text-3xl">{stats.today}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-3xl">{stats.thisWeek}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-3xl">{stats.thisMonth}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Submissions</CardTitle>
                <CardDescription>
                  View and manage body shape analysis submissions
                </CardDescription>
              </div>
              <Button onClick={handleExportCSV} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by email or body shape..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Body Shape</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Measurements</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                        No submissions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">
                          {submission.email}
                        </TableCell>
                        <TableCell>
                          <Badge className={getBodyShapeColor(submission.body_shape_result)}>
                            {submission.body_shape_result}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(submission.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {submission.measurements ? (
                            <Badge variant="outline">Yes</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/submission/${submission.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>© 2024 Colors Code. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}