import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate username
 */
export function validateUsername(username: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (username.length < 4) {
    errors.push('Username must be at least 4 characters');
  }
  if (username.length > 20) {
    errors.push('Username must be at most 20 characters');
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }
  if (/^\d+$/.test(username)) {
    errors.push('Username cannot be only numbers (e.g., 110001)');
  }
  if (/^(admin|root|superuser|test|demo)$/i.test(username)) {
    errors.push('Username cannot be a reserved word');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate employee name
 */
export function validateName(name: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (name.length > 100) {
    errors.push('Name must be at most 100 characters');
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
