import { supabase } from '../supabase';
import type { Employee } from '../types';
import { hashPassword, verifyPassword, validatePasswordStrength, validateUsername, validateName } from '../utils/password';

export async function loginEmployee(username: string, password: string) {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) {
      console.error('Login error: User not found');
      return null;
    }

    // Verify password hash
    const isValid = await verifyPassword(password, data.password);
    if (!isValid) {
      console.error('Login error: Invalid password');
      return null;
    }

    return data as Employee;
  } catch (err) {
    console.error('Login exception:', err);
    return null;
  }
}

export async function getAllEmployees(): Promise<Employee[]> {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Check if table doesn't exist
      if (error.message.includes('does not exist') || error.message.includes('schema cache')) {
        console.error('Database not initialized. Please run the schema SQL in Supabase. See DATABASE_SETUP.md');
        throw new Error('Database not initialized. Please run schema.sql in Supabase SQL Editor.');
      }
      console.error('Get employees error:', error.message);
      throw new Error(error.message);
    }
    return (data || []) as Employee[];
  } catch (err: any) {
    console.error('Get employees exception:', err);
    throw err;
  }
}

export async function addEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) {
  // Validate username
  const usernameValidation = validateUsername(employee.username);
  if (!usernameValidation.isValid) {
    throw new Error(usernameValidation.errors[0]);
  }

  // Validate name
  const nameValidation = validateName(employee.name);
  if (!nameValidation.isValid) {
    throw new Error(nameValidation.errors[0]);
  }

  // Validate password
  const passwordValidation = validatePasswordStrength(employee.password);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.errors[0]);
  }

  // Hash password
  const hashedPassword = await hashPassword(employee.password);

  const { data, error } = await supabase
    .from('employees')
    .insert([{ ...employee, password: hashedPassword }])
    .select()
    .single();

  if (error) {
    console.error('Add employee error:', error.message, error.code);
    if (error.code === '23505') {
      throw new Error('Username already exists');
    }
    throw new Error(error.message);
  }
  return data as Employee;
}

export async function updateEmployee(username: string, updates: Partial<Employee>) {
  // Validate name if provided
  if (updates.name) {
    const nameValidation = validateName(updates.name);
    if (!nameValidation.isValid) {
      throw new Error(nameValidation.errors[0]);
    }
  }

  // Hash password if provided
  if (updates.password) {
    const passwordValidation = validatePasswordStrength(updates.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0]);
    }
    updates.password = await hashPassword(updates.password);
  }

  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('username', username)
    .select()
    .single();

  if (error) {
    console.error('Update employee error:', error.message);
    throw new Error(error.message);
  }
  return data as Employee;
}

export async function deleteEmployee(username: string) {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('username', username);

  if (error) {
    console.error('Delete employee error:', error.message);
    throw new Error(error.message);
  }
  return true;
}

export async function logEmployeeAction(employeeId: string, action: string, details?: string) {
  const { error } = await supabase
    .from('employee_logs')
    .insert([{
      employee_id: employeeId,
      action,
      details
    }]);

  if (error) console.error('Failed to log action:', error);
}
