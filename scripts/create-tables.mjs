#!/usr/bin/env node

/**
 * Automatic Table Creation Script
 * 
 * This script creates all tables directly in Supabase using the service role key.
 * 
 * IMPORTANT: You need the SERVICE_ROLE key (not anon key) for this to work.
 * Get it from: Supabase Dashboard → Settings → API → service_role key
 * 
 * Add to .env.local:
 *   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 * 
 * Usage:
 *   npm run create-tables
 */

import { createClient } from '@supabase/supabase-js';
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
  } catch (err) {
    // .env.local doesn't exist
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n' + '='.repeat(70));
console.log('🔧 CREATING SUPABASE TABLES');
console.log('='.repeat(70) + '\n');

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local\n');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.local\n');
  console.error('To create tables automatically, you need the service_role key:\n');
  console.error('1. Go to: https://supabase.com/dashboard');
  console.error('2. Select your project');
  console.error('3. Go to Settings → API');
  console.error('4. Copy the "service_role" key (NOT the anon key)');
  console.error('5. Add to .env.local:');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key\n');
  console.error('⚠️  WARNING: Keep service_role key secret! Never commit to git!\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQLStatements() {
  try {
    // Read schema file
    const schemaPath = join(__dirname, '..', 'supabase', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    console.log('📄 Reading schema from:', schemaPath);
    console.log('📊 Schema size:', (schema.length / 1024).toFixed(2), 'KB\n');

    // Split into statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements\n`);
    console.log('⏳ Executing SQL statements...\n');

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // Execute each statement using REST API
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      
      if (!statement || statement.startsWith('--')) {
        skipCount++;
        continue;
      }

      try {
        // Use the REST API to execute SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`
          },
          body: JSON.stringify({ query: statement + ';' })
        });

        if (response.ok) {
          process.stdout.write('✅');
          successCount++;
        } else {
          const error = await response.text();
          if (error.includes('already exists') || error.includes('duplicate')) {
            process.stdout.write('⚠️');
            skipCount++;
          } else {
            process.stdout.write('❌');
            errorCount++;
            if (i < 5) { // Show first few errors
              console.log(`\n   Error in statement ${i + 1}: ${error.substring(0, 100)}`);
            }
          }
        }

        // Progress indicator
        if ((i + 1) % 20 === 0) {
          console.log(` ${i + 1}/${statements.length}`);
        }

      } catch (err) {
        process.stdout.write('❌');
        errorCount++;
      }
    }

    console.log('\n\n' + '='.repeat(70));
    console.log('📊 EXECUTION SUMMARY');
    console.log('='.repeat(70));
    console.log(`✅ Successful: ${successCount}`);
    console.log(`⚠️  Skipped/Exists: ${skipCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('='.repeat(70) + '\n');

    if (errorCount > 0) {
      console.log('⚠️  Some statements failed. This might be normal if:');
      console.log('   - Tables already exist');
      console.log('   - Extensions are already enabled');
      console.log('   - Triggers already exist\n');
    }

    // Verify tables were created
    console.log('🔍 Verifying tables...\n');
    
    const tables = ['employees', 'products', 'rental_products', 'customers', 
                    'sales_transactions', 'rental_transactions', 'return_transactions', 'coupons'];
    
    let verifiedCount = 0;
    for (const table of tables) {
      const { error } = await supabase.from(table).select('count').limit(1);
      if (!error) {
        console.log(`✅ ${table}`);
        verifiedCount++;
      } else {
        console.log(`❌ ${table}: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(70));
    if (verifiedCount === tables.length) {
      console.log('✅ ALL TABLES CREATED SUCCESSFULLY!');
      console.log('='.repeat(70) + '\n');
      console.log('📋 Next step: Initialize data');
      console.log('   npm run init-db\n');
    } else {
      console.log('⚠️  SOME TABLES MISSING');
      console.log('='.repeat(70) + '\n');
      console.log('Please run the SQL manually in Supabase Dashboard:\n');
      console.log('1. Go to SQL Editor');
      console.log('2. Paste contents of supabase/schema.sql');
      console.log('3. Click Run\n');
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error('\n💡 Try manual setup instead:');
    console.error('   npm run setup-db\n');
    process.exit(1);
  }
}

executeSQLStatements();
