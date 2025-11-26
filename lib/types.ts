// Database Types
export interface Employee {
  id: string;
  username: string;
  name: string;
  password: string;
  position: 'Admin' | 'Cashier';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface RentalProduct {
  id: string;
  name: string;
  rental_price: number;
  stock: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  phone: string;
  created_at: string;
}

export interface SalesTransaction {
  id: string;
  employee_id: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  payment_method: string;
  coupon_code?: string;
  created_at: string;
}

export interface SalesTransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface RentalTransaction {
  id: string;
  customer_id: string;
  employee_id: string;
  total: number;
  return_date: string;
  status: 'active' | 'returned' | 'overdue';
  created_at: string;
}

export interface RentalTransactionItem {
  id: string;
  rental_id: string;
  product_id: string;
  quantity: number;
  rental_price: number;
  subtotal: number;
}

export interface ReturnTransaction {
  id: string;
  rental_id: string;
  customer_id: string;
  employee_id: string;
  late_fees: number;
  total_due: number;
  created_at: string;
}

export interface ReturnTransactionItem {
  id: string;
  return_id: string;
  rental_item_id: string;
  days_late: number;
  late_fee: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  is_active: boolean;
  created_at: string;
}

export interface EmployeeLog {
  id: string;
  employee_id: string;
  action: string;
  details?: string;
  created_at: string;
}
