import { supabase } from '../supabase';
import type { SalesTransaction, RentalTransaction, ReturnTransaction } from '../types';
import { decreaseProductStock, decreaseRentalProductStock, increaseRentalProductStock } from './products';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Sales Transactions
export async function createSalesTransaction(
  employeeId: string,
  items: CartItem[],
  subtotal: number,
  discount: number,
  tax: number,
  total: number,
  paymentMethod: string,
  couponCode?: string
) {
  // Create transaction
  const { data: transaction, error: transError } = await supabase
    .from('sales_transactions')
    .insert([{
      employee_id: employeeId,
      subtotal,
      discount,
      tax,
      total,
      payment_method: paymentMethod,
      coupon_code: couponCode
    }])
    .select()
    .single();

  if (transError) throw transError;

  // Create transaction items and update stock
  for (const item of items) {
    const { error: itemError } = await supabase
      .from('sales_transaction_items')
      .insert([{
        transaction_id: transaction.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      }]);

    if (itemError) throw itemError;

    // Decrease product stock
    await decreaseProductStock(item.id, item.quantity);
  }

  return transaction as SalesTransaction;
}

// Rental Transactions
export async function createRentalTransaction(
  customerId: string,
  employeeId: string,
  items: CartItem[],
  total: number,
  returnDate: string
) {
  // Create rental transaction
  const { data: rental, error: rentalError } = await supabase
    .from('rental_transactions')
    .insert([{
      customer_id: customerId,
      employee_id: employeeId,
      total,
      return_date: returnDate,
      status: 'active'
    }])
    .select()
    .single();

  if (rentalError) throw rentalError;

  // Create rental items and update stock
  for (const item of items) {
    const { error: itemError } = await supabase
      .from('rental_transaction_items')
      .insert([{
        rental_id: rental.id,
        product_id: item.id,
        quantity: item.quantity,
        rental_price: item.price,
        subtotal: item.price * item.quantity
      }]);

    if (itemError) throw itemError;

    // Decrease rental product stock
    await decreaseRentalProductStock(item.id, item.quantity);
  }

  return rental as RentalTransaction;
}

// Get active rentals for customer
export async function getActiveRentals(customerId: string) {
  const { data, error } = await supabase
    .from('rental_transactions')
    .select(`
      *,
      rental_transaction_items (
        *,
        rental_products (*)
      )
    `)
    .eq('customer_id', customerId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Return Transactions
export async function createReturnTransaction(
  rentalId: string,
  customerId: string,
  employeeId: string,
  items: Array<{ rentalItemId: string; productId: string; quantity: number; daysLate: number; lateFee: number }>,
  totalLateFees: number
) {
  // Create return transaction
  const { data: returnTrans, error: returnError } = await supabase
    .from('return_transactions')
    .insert([{
      rental_id: rentalId,
      customer_id: customerId,
      employee_id: employeeId,
      late_fees: totalLateFees,
      total_due: totalLateFees
    }])
    .select()
    .single();

  if (returnError) throw returnError;

  // Create return items and update stock
  for (const item of items) {
    const { error: itemError } = await supabase
      .from('return_transaction_items')
      .insert([{
        return_id: returnTrans.id,
        rental_item_id: item.rentalItemId,
        days_late: item.daysLate,
        late_fee: item.lateFee
      }]);

    if (itemError) throw itemError;

    // Increase rental product stock
    await increaseRentalProductStock(item.productId, item.quantity);
  }

  // Update rental status to returned
  await supabase
    .from('rental_transactions')
    .update({ status: 'returned' })
    .eq('id', rentalId);

  return returnTrans as ReturnTransaction;
}

// Get transaction statistics
export async function getTodayStats() {
  const today = new Date().toISOString().split('T')[0];

  // Get today's sales
  const { data: sales, error: salesError } = await supabase
    .from('sales_transactions')
    .select('total')
    .gte('created_at', today);

  if (salesError) throw salesError;

  const totalSales = sales?.reduce((sum, t) => sum + Number(t.total), 0) || 0;
  const transactionCount = sales?.length || 0;

  // Get active rentals count
  const { count: activeRentals } = await supabase
    .from('rental_transactions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  return {
    totalSales,
    transactionCount,
    activeRentals: activeRentals || 0
  };
}
