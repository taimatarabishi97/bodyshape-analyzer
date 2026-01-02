// Database Connection Test Script
// Run this to check if your Supabase connection is working

console.log("=== Supabase Database Connection Test ===\n");

// Check if environment variables are set
console.log("1. Checking environment variables:");
console.log("   VITE_SUPABASE_URL:", process.env.VITE_SUPABASE_URL ? "✓ Set" : "✗ Missing");
console.log("   VITE_SUPABASE_ANON_KEY:", process.env.VITE_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing");
console.log("   VITE_MODE:", process.env.VITE_MODE || "Not set (default: BASIC)");

// If variables are missing, show instructions
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.log("\n⚠️  CRITICAL: Missing Supabase credentials!");
  console.log("   To fix this:");
  console.log("   1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables");
  console.log("   2. Add these variables:");
  console.log("      - VITE_SUPABASE_URL: https://your-project.supabase.co");
  console.log("      - VITE_SUPABASE_ANON_KEY: your_anon_key_here");
  console.log("   3. Redeploy your application");
  console.log("\n   Get these values from: Supabase Dashboard → Settings → API");
} else {
  console.log("\n✓ Environment variables are set.");
  console.log("  Next steps:");
  console.log("  1. Go to Supabase Dashboard → SQL Editor");
  console.log("  2. Run these migration files in order:");
  console.log("     - 001_initial_schema.sql");
  console.log("     - 002_setup_auth.sql");
  console.log("     - 003_seed_data.sql");
  console.log("  3. After running migrations, test the connection again.");
}

console.log("\n=== Troubleshooting Steps ===");
console.log("1. Check browser console (F12) for specific error messages");
console.log("2. Verify Supabase tables exist in the Table Editor");
console.log("3. Test Supabase connection with a simple query");
console.log("4. Ensure CORS is configured in Supabase (Settings → API)");
console.log("5. Redeploy Vercel after adding environment variables");

