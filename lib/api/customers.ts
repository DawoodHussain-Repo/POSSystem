import { supabase } from '../supabase';
import type { Customer } from '../types';

export async function getCustomerByPhone(phone: string) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .maybeSingle(); // Use maybeSingle instead of single to avoid error when not found

    if (error) {
      console.error('Get customer error:', error.message);
      return null;
    }
    return data as Customer | null;
  } catch (err) {
    console.error('Get customer exception:', err);
    return null;
  }
}

export async function createCustomer(phone: string) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([{ phone }])
      .select()
      .single();

    if (error) {
      console.error('Create customer error:', error.message);
      throw new Error(error.message);
    }
    return data as Customer;
  } catch (err: any) {
    console.error('Create customer exception:', err);
    throw err;
  }
}

export async function getOrCreateCustomer(phone: string): Promise<Customer> {
  try {
    // First try to get existing customer
    let customer = await getCustomerByPhone(phone);
    
    // If not found, create new customer
    if (!customer) {
      console.log('Customer not found, creating new customer with phone:', phone);
      customer = await createCustomer(phone);
    }
    
    return customer;
  } catch (err: any) {
    console.error('Get or create customer failed:', err);
    throw new Error('Failed to verify customer. Please try again.');
  }
}
