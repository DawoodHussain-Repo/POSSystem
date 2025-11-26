#!/usr/bin/env node

/**
 * Generate Default Users with Hashed Passwords
 * 
 * This script generates bcrypt hashes for default users
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

async function generateUsers() {
  console.log('\n' + '='.repeat(70));
  console.log('🔐 GENERATING DEFAULT USER CREDENTIALS');
  console.log('='.repeat(70) + '\n');

  const users = [
    {
      username: 'admin_user',
      name: 'System Administrator',
      password: 'Admin@123',
      position: 'Admin'
    },
    {
      username: 'cashier_user',
      name: 'Default Cashier',
      password: 'Cashier@123',
      position: 'Cashier'
    }
  ];

  console.log('Generating password hashes...\n');

  for (const user of users) {
    const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    
    console.log(`${user.position}:`);
    console.log(`  Username: ${user.username}`);
    console.log(`  Password: ${user.password}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Hash: ${hash}`);
    console.log();
  }

  console.log('='.repeat(70));
  console.log('📋 SQL INSERT STATEMENT');
  console.log('='.repeat(70) + '\n');

  const adminHash = await bcrypt.hash('Admin@123', SALT_ROUNDS);
  const cashierHash = await bcrypt.hash('Cashier@123', SALT_ROUNDS);

  console.log(`INSERT INTO employees (username, name, password, position) VALUES`);
  console.log(`('admin_user', 'System Administrator', '${adminHash}', 'Admin'),`);
  console.log(`('cashier_user', 'Default Cashier', '${cashierHash}', 'Cashier')`);
  console.log(`ON CONFLICT (username) DO NOTHING;\n`);

  console.log('='.repeat(70));
  console.log('⚠️  IMPORTANT SECURITY NOTES');
  console.log('='.repeat(70));
  console.log('• Change these passwords immediately after first login');
  console.log('• Never use simple passwords in production');
  console.log('• These are for initial setup only\n');
}

generateUsers();
