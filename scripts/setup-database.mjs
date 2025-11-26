#!/usr/bin/env node

/**
 * Supabase Database Setup Script (ES Module version)
 * 
 * This script reads the schema.sql file and provides instructions for setup.
 * 
 * Usage:
 *   npm run setup-db
 *   or
 *   node scripts/setup-database.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables manually
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const envContent = readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
  } catch (err) {
    // .env.local doesn't exist, will use process.env
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n' + '='.repeat(70));
console.log('🗄️  SUPABASE DATABASE SETUP');
console.log('='.repeat(70) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local\n');
  console.error('Required variables:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your_project_url');
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key\n');
  console.error('Get these from: https://supabase.com/dashboard → Your Project → Settings → API\n');
  process.exit(1);
}

try {
  // Read the schema file
  const schemaPath = join(__dirname, '..', 'supabase', 'schema.sql');
  const schema = readFileSync(schemaPath, 'utf8');

  console.log('✅ Found schema file:', schemaPath);
  console.log('📊 Schema size:', (schema.length / 1024).toFixed(2), 'KB');
  console.log('📝 Lines:', schema.split('\n').length, '\n');

  // Count tables
  const tableMatches = schema.match(/CREATE TABLE IF NOT EXISTS/g);
  const tableCount = tableMatches ? tableMatches.length : 0;

  console.log('📋 Tables to create:', tableCount);
  console.log('   - employees');
  console.log('   - products');
  console.log('   - rental_products');
  console.log('   - customers');
  console.log('   - sales_transactions');
  console.log('   - sales_transaction_items');
  console.log('   - rental_transactions');
  console.log('   - rental_transaction_items');
  console.log('   - return_transactions');
  console.log('   - return_transaction_items');
  console.log('   - coupons');
  console.log('   - employee_logs\n');

  console.log('='.repeat(70));
  console.log('📖 SETUP INSTRUCTIONS');
  console.log('='.repeat(70) + '\n');

  console.log('Option 1: Supabase Dashboard (Recommended)');
  console.log('─'.repeat(70));
  console.log('1. Go to: https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Click "SQL Editor" in the left sidebar');
  console.log('4. Click "New Query"');
  console.log('5. Copy the entire contents of: supabase/schema.sql');
  console.log('6. Paste into the SQL Editor');
  console.log('7. Click "Run" (or press Ctrl+Enter)\n');

  console.log('Option 2: Supabase CLI');
  console.log('─'.repeat(70));
  console.log('1. Install Supabase CLI: npm install -g supabase');
  console.log('2. Login: supabase login');
  console.log('3. Link project: supabase link --project-ref your-project-ref');
  console.log('4. Push schema: supabase db push\n');

  console.log('Option 3: Copy SQL to Clipboard');
  console.log('─'.repeat(70));
  console.log('Run: cat supabase/schema.sql | clip  (Windows)');
  console.log('     cat supabase/schema.sql | pbcopy  (Mac)');
  console.log('     cat supabase/schema.sql | xclip  (Linux)\n');

  console.log('='.repeat(70));
  console.log('🔐 DEFAULT LOGIN CREDENTIALS');
  console.log('='.repeat(70));
  console.log('After running the schema, you can login with:\n');
  console.log('Admin Account:');
  console.log('  Username: 110001');
  console.log('  Password: 1\n');
  console.log('Cashier Account:');
  console.log('  Username: 110002');
  console.log('  Password: lehigh2016\n');

  console.log('='.repeat(70));
  console.log('⚠️  IMPORTANT NOTES');
  console.log('='.repeat(70));
  console.log('• The schema includes sample data (products, employees, coupons)');
  console.log('• Row Level Security (RLS) is NOT enabled by default');
  console.log('• For production, enable RLS and add proper security policies');
  console.log('• Change default passwords after first login\n');

  console.log('='.repeat(70));
  console.log('✨ After setup, restart your dev server:');
  console.log('   npm run dev\n');

  // Test connection
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.from('employees').select('count').limit(1);
  
  if (!error) {
    console.log('✅ Database connection successful!');
    console.log('✅ Tables already exist - you\'re all set!\n');
  } else if (error.message.includes('does not exist') || error.message.includes('schema cache')) {
    console.log('⚠️  Tables not found - please run the schema SQL as described above.\n');
  } else {
    console.log('⚠️  Connection test:', error.message, '\n');
  }

} catch (error) {
  console.error('❌ Error:', error.message, '\n');
  process.exit(1);
}
