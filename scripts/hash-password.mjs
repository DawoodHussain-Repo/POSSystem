#!/usr/bin/env node

import bcrypt from 'bcryptjs';

const password = '12E2d786@2';
const hash = await bcrypt.hash(password, 10);

console.log('\n🔐 Password Hash Generated:\n');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('\n');
