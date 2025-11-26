import { supabase } from '../supabase';
import type { Product, RentalProduct } from '../types';

export async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Product;
}

export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id');

  if (error) throw error;
  return data as Product[];
}

export async function updateProductStock(id: string, quantity: number) {
  const { data, error } = await supabase
    .from('products')
    .update({ stock: quantity })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function decreaseProductStock(id: string, amount: number) {
  const product = await getProduct(id);
  if (!product) throw new Error('Product not found');
  
  const newStock = product.stock - amount;
  if (newStock < 0) throw new Error('Insufficient stock');
  
  return updateProductStock(id, newStock);
}

export async function increaseProductStock(id: string, amount: number) {
  const product = await getProduct(id);
  if (!product) throw new Error('Product not found');
  
  const newStock = product.stock + amount;
  return updateProductStock(id, newStock);
}

// Rental Products
export async function getRentalProduct(id: string) {
  const { data, error } = await supabase
    .from('rental_products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as RentalProduct;
}

export async function getAllRentalProducts() {
  const { data, error } = await supabase
    .from('rental_products')
    .select('*')
    .order('id');

  if (error) throw error;
  return data as RentalProduct[];
}

export async function updateRentalProductStock(id: string, quantity: number) {
  const { data, error } = await supabase
    .from('rental_products')
    .update({ stock: quantity })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as RentalProduct;
}

export async function decreaseRentalProductStock(id: string, amount: number) {
  const product = await getRentalProduct(id);
  if (!product) throw new Error('Rental product not found');
  
  const newStock = product.stock - amount;
  if (newStock < 0) throw new Error('Insufficient stock');
  
  return updateRentalProductStock(id, newStock);
}

export async function increaseRentalProductStock(id: string, amount: number) {
  const product = await getRentalProduct(id);
  if (!product) throw new Error('Rental product not found');
  
  const newStock = product.stock + amount;
  return updateRentalProductStock(id, newStock);
}
