import { supabase } from '../supabase';
import type { Coupon } from '../types';

export async function validateCoupon(code: string) {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single();

  if (error) return null;
  return data as Coupon;
}

export async function getAllCoupons() {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('is_active', true)
    .order('code');

  if (error) throw error;
  return data as Coupon[];
}
