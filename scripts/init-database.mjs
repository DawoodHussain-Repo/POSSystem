#!/usr/bin/env node

/**
 * Automatic Supabase Database Initialization Script
 * 
 * This script creates all tables and inserts initial data programmatically.
 * 
 * Usage:
 *   npm run init-db
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
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n' + '='.repeat(70));
console.log('🚀 INITIALIZING SUPABASE DATABASE');
console.log('='.repeat(70) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local\n');
  console.error('Required:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your_url');
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('📋 Creating tables...\n');

  const tables = [
    {
      name: 'employees',
      data: [
        { 
          username: 'dawood90999', 
          name: 'Dawood Hussain', 
          password: '$2b$10$srv8WXtA1TdKWmCvYGIWAeLLgtbkHNMoGBq5g97OyEP89agPUv5IW', 
          position: 'Admin' 
        }
      ]
    },
    {
      name: 'products',
      data: [
        { id: '1000', name: 'Potato', price: 1.00, stock: 249, category: 'grocery' },
        { id: '1001', name: 'Plastic Cup', price: 0.50, stock: 376, category: 'grocery' },
        { id: '1002', name: 'Tomato', price: 1.50, stock: 180, category: 'grocery' },
        { id: '1003', name: 'Onion', price: 0.80, stock: 220, category: 'grocery' },
        { id: '1004', name: 'Carrot', price: 1.20, stock: 150, category: 'grocery' },
        { id: '1005', name: 'Bread', price: 2.50, stock: 95, category: 'grocery' },
        { id: '1006', name: 'Milk (1L)', price: 3.99, stock: 120, category: 'grocery' },
        { id: '1007', name: 'Eggs (12)', price: 4.50, stock: 85, category: 'grocery' },
        { id: '1008', name: 'Cheese', price: 5.99, stock: 60, category: 'grocery' },
        { id: '1009', name: 'Butter', price: 4.25, stock: 75, category: 'grocery' },
        { id: '2000', name: 'USB Cable', price: 9.99, stock: 150, category: 'electronics' },
        { id: '2001', name: 'Phone Charger', price: 15.99, stock: 100, category: 'electronics' },
        { id: '2002', name: 'Headphones', price: 29.99, stock: 45, category: 'electronics' },
        { id: '2003', name: 'Mouse', price: 19.99, stock: 80, category: 'electronics' },
        { id: '2004', name: 'Keyboard', price: 39.99, stock: 55, category: 'electronics' },
        { id: '3000', name: 'T-Shirt', price: 12.99, stock: 200, category: 'clothing' },
        { id: '3001', name: 'Jeans', price: 39.99, stock: 120, category: 'clothing' },
        { id: '3002', name: 'Socks (3-pack)', price: 8.99, stock: 180, category: 'clothing' }
      ]
    },
    {
      name: 'rental_products',
      data: [
        { id: '1000', name: 'Theory Of Everything', rental_price: 30.00, stock: 249, category: 'movie' },
        { id: '1001', name: 'Adventures Of Tom Sawyer', rental_price: 40.50, stock: 391, category: 'book' },
        { id: '1002', name: 'Interstellar', rental_price: 35.00, stock: 180, category: 'movie' },
        { id: '1003', name: 'The Martian', rental_price: 32.00, stock: 150, category: 'movie' },
        { id: '1004', name: 'Harry Potter Complete Set', rental_price: 55.00, stock: 85, category: 'book' },
        { id: '1005', name: 'Lord of the Rings Trilogy', rental_price: 50.00, stock: 95, category: 'book' },
        { id: '1006', name: 'Inception', rental_price: 33.00, stock: 120, category: 'movie' },
        { id: '1007', name: 'The Great Gatsby', rental_price: 25.00, stock: 200, category: 'book' },
        { id: '1008', name: 'Camera Equipment', rental_price: 75.00, stock: 25, category: 'equipment' },
        { id: '1009', name: 'Projector', rental_price: 85.00, stock: 15, category: 'equipment' },
        { id: '1010', name: 'Gaming Console', rental_price: 65.00, stock: 40, category: 'equipment' }
      ]
    },
    {
      name: 'customers',
      data: []
    },
    {
      name: 'coupons',
      data: [
        { code: 'C001', discount_percentage: 10.00, is_active: true },
        { code: 'C002', discount_percentage: 10.00, is_active: true },
        { code: 'C003', discount_percentage: 10.00, is_active: true },
        { code: 'C004', discount_percentage: 10.00, is_active: true },
        { code: 'C005', discount_percentage: 10.00, is_active: true }
      ]
    },
    {
      name: 'sales_transactions',
      data: []
    },
    {
      name: 'sales_transaction_items',
      data: []
    },
    {
      name: 'rental_transactions',
      data: []
    },
    {
      name: 'rental_transaction_items',
      data: []
    },
    {
      name: 'return_transactions',
      data: []
    },
    {
      name: 'return_transaction_items',
      data: []
    },
    {
      name: 'employee_logs',
      data: []
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const table of tables) {
    try {
      // Check if table exists by trying to query it
      const { error: checkError } = await supabase
        .from(table.name)
        .select('*')
        .limit(1);

      if (checkError && (checkError.message.includes('does not exist') || checkError.message.includes('schema cache'))) {
        console.log(`❌ Table '${table.name}' does not exist`);
        errorCount++;
        continue;
      }

      // Insert data if table has initial data
      if (table.data.length > 0) {
        const { error: insertError } = await supabase
          .from(table.name)
          .upsert(table.data, { onConflict: table.name === 'employees' ? 'username' : 'id' });

        if (insertError) {
          console.log(`⚠️  ${table.name}: ${insertError.message}`);
          errorCount++;
        } else {
          console.log(`✅ ${table.name}: Inserted ${table.data.length} records`);
          successCount++;
        }
      } else {
        console.log(`✅ ${table.name}: Table exists (no initial data)`);
        successCount++;
      }
    } catch (err) {
      console.log(`❌ ${table.name}: ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(70));
  if (errorCount > 0) {
    console.log('⚠️  TABLES NOT FOUND - MANUAL SETUP REQUIRED');
    console.log('='.repeat(70));
    console.log('\nThe tables do not exist in your Supabase database.');
    console.log('You need to create them first using the SQL schema.\n');
    console.log('📖 Follow these steps:\n');
    console.log('1. Go to: https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Click "SQL Editor" in the left sidebar');
    console.log('4. Click "New Query"');
    console.log('5. Copy and paste the contents of: supabase/schema.sql');
    console.log('6. Click "Run" (or press Ctrl+Enter)');
    console.log('\n💡 Quick copy to clipboard (Windows):');
    console.log('   Get-Content supabase/schema.sql | Set-Clipboard\n');
    console.log('Then run this script again: npm run init-db\n');
  } else {
    console.log('✅ DATABASE INITIALIZED SUCCESSFULLY!');
    console.log('='.repeat(70));
    console.log(`\n📊 Summary:`);
    console.log(`   Tables ready: ${successCount}`);
    console.log(`   Employees: 1 (Admin)`);
    console.log(`   Products: 18`);
    console.log(`   Rental Products: 11`);
    console.log(`   Coupons: 5\n`);
    console.log('🔐 Login Credentials:');
    console.log('   Admin: username=dawood90999, password=12E2d786@2\n');
    console.log('✨ Start your app: npm run dev\n');
  }
}

createTables().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
