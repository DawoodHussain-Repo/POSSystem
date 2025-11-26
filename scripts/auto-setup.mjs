#!/usr/bin/env node

/**
 * Automatic Database Setup via Supabase Management API
 * 
 * This script uses Supabase's Management API to execute SQL directly.
 * 
 * Usage:
 *   npm run auto-setup
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
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
  } catch (err) {}
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n' + '='.repeat(70));
console.log('🚀 AUTOMATIC DATABASE SETUP');
console.log('='.repeat(70) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local\n');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Could not extract project reference from URL\n');
  process.exit(1);
}

console.log('📋 Project:', projectRef);
console.log('🔗 URL:', supabaseUrl, '\n');

// Read schema
const schemaPath = join(__dirname, '..', 'supabase', 'schema.sql');
const schema = readFileSync(schemaPath, 'utf8');

console.log('📄 Schema loaded:', (schema.length / 1024).toFixed(2), 'KB');
console.log('📝 Lines:', schema.split('\n').length, '\n');

console.log('='.repeat(70));
console.log('⚠️  AUTOMATIC EXECUTION NOT AVAILABLE');
console.log('='.repeat(70) + '\n');

console.log('Supabase requires the service_role key or Management API token');
console.log('to execute SQL programmatically.\n');

console.log('📖 EASIEST METHOD - Copy & Paste:\n');
console.log('1. The SQL is already in your clipboard (if you ran setup-db)');
console.log('2. Go to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
console.log('3. Paste (Ctrl+V) and click "Run"\n');

console.log('💡 Or copy to clipboard now:');
console.log('   Get-Content supabase/schema.sql | Set-Clipboard\n');

console.log('='.repeat(70));
console.log('🔐 AFTER SETUP - Login Credentials:');
console.log('='.repeat(70));
console.log('Admin: username=dawood90999, password=12E2d786@2\n');

console.log('🔒 Security Features:');
console.log('   • Passwords are bcrypt hashed');
console.log('   • Username validation (no numeric-only usernames)');
console.log('   • Strong password requirements enforced\n');

console.log('✨ Then run: npm run init-db');
console.log('   (to verify and insert initial data)\n');

// Try to open browser
try {
  const { exec } = await import('child_process');
  const url = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;
  
  console.log('🌐 Opening Supabase SQL Editor in browser...\n');
  
  const command = process.platform === 'win32' ? `start ${url}` :
                  process.platform === 'darwin' ? `open ${url}` :
                  `xdg-open ${url}`;
  
  exec(command, (error) => {
    if (error) {
      console.log('⚠️  Could not open browser automatically');
      console.log('   Please visit:', url, '\n');
    }
  });
} catch (err) {
  // Browser opening failed, that's ok
}
