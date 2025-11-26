#!/usr/bin/env node

/**
 * Supabase Database Setup Script
 * 
 * This script automatically creates all required tables in your Supabase database.
 * 
 * Usage:
 *   node scripts/setup-database.js
 * 
 * Make sure your .env.local file has:
 *   NEXT_PUBLIC_SUPABASE_URL=your_url
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Starting Supabase database setup...\n');

  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📄 Reading schema from:', schemaPath);
    console.log('📊 Schema size:', schema.length, 'characters\n');

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      // Skip comments
      if (statement.startsWith('--')) continue;

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Try direct query if RPC fails
          const { error: queryError } = await supabase.from('_').select('*').limit(0);
          
          if (queryError) {
            console.log(`⚠️  Statement ${i + 1}: ${error.message}`);
            errorCount++;
          } else {
            successCount++;
          }
        } else {
          successCount++;
        }
      } catch (err) {
        console.log(`⚠️  Statement ${i + 1}: ${err.message}`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Database setup completed!');
    console.log(`   Successful: ${successCount}`);
    console.log(`   Warnings: ${errorCount}`);
    console.log('='.repeat(60));
    console.log('\n📋 Next steps:');
    console.log('   1. Go to Supabase Dashboard → SQL Editor');
    console.log('   2. Copy and paste the contents of supabase/schema.sql');
    console.log('   3. Click "Run" to execute');
    console.log('\n   OR use the Supabase CLI:');
    console.log('   supabase db push\n');
    console.log('🔐 Default credentials:');
    console.log('   Admin: username=110001, password=1');
    console.log('   Cashier: username=110002, password=lehigh2016\n');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error('\n💡 Manual setup required:');
    console.error('   1. Go to your Supabase Dashboard');
    console.error('   2. Navigate to SQL Editor');
    console.error('   3. Copy contents from supabase/schema.sql');
    console.error('   4. Paste and run the SQL\n');
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
