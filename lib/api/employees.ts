import { supabase } from '../supabase';
import type { Employee } from '../types';

export async function loginEmployee(username: string, password: string) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error) return null;
  return data as Employee;
}

export async function getAllEmployees() {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Employee[];
}

export async function addEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('employees')
    .insert([employee])
    .select()
    .single();

  if (error) throw error;
  return data as Employee;
}

export async function updateEmployee(username: string, updates: Partial<Employee>) {
  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('username', username)
    .select()
    .single();

  if (error) throw error;
  return data as Employee;
}

export async function deleteEmployee(username: string) {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('username', username);

  if (error) throw error;
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
