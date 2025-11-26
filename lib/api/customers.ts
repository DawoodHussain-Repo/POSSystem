import { supabase } from '../supabase';
import type { Customer } from '../types';

export async function getCustomerByPhone(phone: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('phone', phone)
    .single();

  if (error) return null;
  return data as Customer;
}

export async function createCustomer(phone: string) {
  const { data, error } = await supabase
    .from('customers')
    .insert([{ phone }])
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
}

export async function getOrCreateCustomer(phone: string) {
  let customer = await getCustomerByPhone(phone);
  
  if (!customer) {
    customer = await createCustomer(phone);
  }
  
  return customer;
}
