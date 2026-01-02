import { useEffect, useState } from 'react';

const EnvTest = () => {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    // Collect all VITE_ environment variables
    const vars: Record<string, string> = {};
    for (const key in import.meta.env) {
      if (key.startsWith('VITE_')) {
        vars[key] = import.meta.env[key] || '(empty/undefined)';
      }
    }
    setEnvVars(vars);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Environment Variables Test</h1>
        
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h2 className="font-semibold text-yellow-800 mb-2">Important:</h2>
          <p className="text-yellow-700">
            This page shows what environment variables are actually loaded in your browser.
            If VITE_SUPABASE_URL shows as empty, your Vercel environment variables are not set correctly.
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className={`p-4 rounded border ${key.includes('SUPABASE') && !value.includes('your-') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <span className="font-mono font-semibold text-gray-700">{key}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${value && !value.includes('your-') && !value.includes('empty') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {value && !value.includes('your-') && !value.includes('empty') ? '✓ Set' : '✗ Missing'}
                </span>
              </div>
              <div className="mt-2">
                <code className="text-sm bg-gray-100 p-2 rounded block overflow-x-auto">
                  {value}
                </code>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
          <ul className="list-disc pl-5 text-blue-700 space-y-1">
            <li>If VITE_SUPABASE_URL is empty, check Vercel Environment Variables</li>
            <li>Redeploy after fixing environment variables</li>
            <li>Clear browser cache and hard reload (Ctrl+F5)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EnvTest;
