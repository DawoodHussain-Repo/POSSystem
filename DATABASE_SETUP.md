# Database Setup Guide

## Quick Setup

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (or create one)
3. Go to **SQL Editor** in the left sidebar
4. Copy and paste the contents of `supabase/schema.sql`
5. Click **Run** to execute the SQL

## Manual Steps

### 1. Get Your Supabase Credentials

From your Supabase project dashboard:
- Go to **Settings** → **API**
- Copy the **Project URL** and **anon public** key

### 2. Update Environment Variables

Create/update `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run the Schema

In Supabase SQL Editor, run the schema from `supabase/schema.sql`

This will create:
- `employees` table with default admin user
- `products` table with sample products
- `rental_products` table with sample rental items
- `customers` table
- `sales_transactions` and `sales_transaction_items` tables
- `rental_transactions` and `rental_transaction_items` tables
- `return_transactions` and `return_transaction_items` tables
- `coupons` table with sample coupons
- `employee_logs` table

### 4. Default Login Credentials

After running the schema:
- **Admin**: Username: `dawood90999`, Password: `12E2d786@2`

**Security Features:**
- ✅ Passwords are hashed using bcrypt
- ✅ Username validation (no numeric-only usernames like 110001)
- ✅ Password strength requirements (8+ chars, uppercase, lowercase, number, special char)
- ✅ Name validation (letters, spaces, hyphens only)

## Troubleshooting

### "Could not find table" error
- Make sure you ran the schema SQL in Supabase
- Check that your Supabase URL and key are correct in `.env.local`
- Restart the dev server after updating `.env.local`

### Connection issues
- Verify your Supabase project is active
- Check if Row Level Security (RLS) is blocking access
- For development, you can disable RLS on tables or add policies
