-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    position VARCHAR(20) NOT NULL CHECK (position IN ('Admin', 'Cashier')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table (for sales)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rental Products Table
CREATE TABLE IF NOT EXISTS rental_products (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rental_price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Transactions Table
CREATE TABLE IF NOT EXISTS sales_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id),
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    coupon_code VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Transaction Items Table
CREATE TABLE IF NOT EXISTS sales_transaction_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES sales_transactions(id) ON DELETE CASCADE,
    product_id VARCHAR(10) REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);

-- Rental Transactions Table
CREATE TABLE IF NOT EXISTS rental_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    employee_id UUID REFERENCES employees(id),
    total DECIMAL(10, 2) NOT NULL,
    return_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rental Transaction Items Table
CREATE TABLE IF NOT EXISTS rental_transaction_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_id UUID REFERENCES rental_transactions(id) ON DELETE CASCADE,
    product_id VARCHAR(10) REFERENCES rental_products(id),
    quantity INTEGER NOT NULL,
    rental_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);

-- Return Transactions Table
CREATE TABLE IF NOT EXISTS return_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_id UUID REFERENCES rental_transactions(id),
    customer_id UUID REFERENCES customers(id),
    employee_id UUID REFERENCES employees(id),
    late_fees DECIMAL(10, 2) DEFAULT 0,
    total_due DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Return Transaction Items Table
CREATE TABLE IF NOT EXISTS return_transaction_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    return_id UUID REFERENCES return_transactions(id) ON DELETE CASCADE,
    rental_item_id UUID REFERENCES rental_transaction_items(id),
    days_late INTEGER DEFAULT 0,
    late_fee DECIMAL(10, 2) DEFAULT 0
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee Activity Log Table
CREATE TABLE IF NOT EXISTS employee_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id),
    action VARCHAR(50) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin (password is bcrypt hashed)
-- Admin: username=dawood90999, password=12E2d786@2
INSERT INTO employees (username, name, password, position) VALUES
('dawood90999', 'Dawood Hussain', '$2b$10$srv8WXtA1TdKWmCvYGIWAeLLgtbkHNMoGBq5g97OyEP89agPUv5IW', 'Admin')
ON CONFLICT (username) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, name, price, stock, category) VALUES
('1000', 'Potato', 1.00, 249, 'grocery'),
('1001', 'Plastic Cup', 0.50, 376, 'grocery'),
('1002', 'Tomato', 1.50, 180, 'grocery'),
('1003', 'Onion', 0.80, 220, 'grocery'),
('1004', 'Carrot', 1.20, 150, 'grocery'),
('1005', 'Bread', 2.50, 95, 'grocery'),
('1006', 'Milk (1L)', 3.99, 120, 'grocery'),
('1007', 'Eggs (12)', 4.50, 85, 'grocery'),
('1008', 'Cheese', 5.99, 60, 'grocery'),
('1009', 'Butter', 4.25, 75, 'grocery'),
('2000', 'USB Cable', 9.99, 150, 'electronics'),
('2001', 'Phone Charger', 15.99, 100, 'electronics'),
('2002', 'Headphones', 29.99, 45, 'electronics'),
('2003', 'Mouse', 19.99, 80, 'electronics'),
('2004', 'Keyboard', 39.99, 55, 'electronics'),
('3000', 'T-Shirt', 12.99, 200, 'clothing'),
('3001', 'Jeans', 39.99, 120, 'clothing'),
('3002', 'Socks (3-pack)', 8.99, 180, 'clothing')
ON CONFLICT (id) DO NOTHING;

-- Insert sample rental products
INSERT INTO rental_products (id, name, rental_price, stock, category) VALUES
('1000', 'Theory Of Everything', 30.00, 249, 'movie'),
('1001', 'Adventures Of Tom Sawyer', 40.50, 391, 'book'),
('1002', 'Interstellar', 35.00, 180, 'movie'),
('1003', 'The Martian', 32.00, 150, 'movie'),
('1004', 'Harry Potter Complete Set', 55.00, 85, 'book'),
('1005', 'Lord of the Rings Trilogy', 50.00, 95, 'book'),
('1006', 'Inception', 33.00, 120, 'movie'),
('1007', 'The Great Gatsby', 25.00, 200, 'book'),
('1008', 'Camera Equipment', 75.00, 25, 'equipment'),
('1009', 'Projector', 85.00, 15, 'equipment'),
('1010', 'Gaming Console', 65.00, 40, 'equipment')
ON CONFLICT (id) DO NOTHING;

-- Insert sample coupons
INSERT INTO coupons (code, discount_percentage, is_active) VALUES
('C001', 10.00, true),
('C002', 10.00, true),
('C003', 10.00, true),
('C004', 10.00, true),
('C005', 10.00, true)
ON CONFLICT (code) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_username ON employees(username);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_created_at ON sales_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_rental_transactions_status ON rental_transactions(status);
CREATE INDEX IF NOT EXISTS idx_rental_transactions_customer ON rental_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rental_products_updated_at BEFORE UPDATE ON rental_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_logs ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for development)
-- In production, you should restrict these based on authenticated users

-- Employees policies
CREATE POLICY "Allow all operations on employees" ON employees FOR ALL USING (true) WITH CHECK (true);

-- Products policies
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Rental products policies
CREATE POLICY "Allow all operations on rental_products" ON rental_products FOR ALL USING (true) WITH CHECK (true);

-- Customers policies
CREATE POLICY "Allow all operations on customers" ON customers FOR ALL USING (true) WITH CHECK (true);

-- Sales transactions policies
CREATE POLICY "Allow all operations on sales_transactions" ON sales_transactions FOR ALL USING (true) WITH CHECK (true);

-- Sales transaction items policies
CREATE POLICY "Allow all operations on sales_transaction_items" ON sales_transaction_items FOR ALL USING (true) WITH CHECK (true);

-- Rental transactions policies
CREATE POLICY "Allow all operations on rental_transactions" ON rental_transactions FOR ALL USING (true) WITH CHECK (true);

-- Rental transaction items policies
CREATE POLICY "Allow all operations on rental_transaction_items" ON rental_transaction_items FOR ALL USING (true) WITH CHECK (true);

-- Return transactions policies
CREATE POLICY "Allow all operations on return_transactions" ON return_transactions FOR ALL USING (true) WITH CHECK (true);

-- Return transaction items policies
CREATE POLICY "Allow all operations on return_transaction_items" ON return_transaction_items FOR ALL USING (true) WITH CHECK (true);

-- Coupons policies
CREATE POLICY "Allow all operations on coupons" ON coupons FOR ALL USING (true) WITH CHECK (true);

-- Employee logs policies
CREATE POLICY "Allow all operations on employee_logs" ON employee_logs FOR ALL USING (true) WITH CHECK (true);
