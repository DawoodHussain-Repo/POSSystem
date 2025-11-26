# SG Technologies - Point of Sale System

A modern, secure, and beautiful web-based Point of Sale system built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

### 🔐 Security & Authentication
- **Route Protection**: All routes protected with role-based access control
- **Password Hashing**: bcrypt with 10 salt rounds
- **Session Management**: Secure session storage with automatic redirect
- **Role-Based Access**: Admin and Cashier roles with appropriate permissions

### 👥 Employee Management
- Add/Edit/Delete employees with validation
- Password strength requirements enforced
- Role assignment (Admin/Cashier)
- Real-time data from Supabase

### 💰 Sales Transactions
- Add items to cart with stock validation
- Apply discount coupons (10% off)
- Calculate tax (6%)
- Cash/Card payment with cashback option
- Receipt generation with print functionality
- Database persistence

### 📦 Rental Transactions
- Customer verification by 11-digit phone
- Auto-create customer if not exists
- Add rental items with stock validation
- Set return dates
- Payment processing with receipts

### 🔄 Return Processing
- **Two Return Types**:
  - Rental Return: Normal return with late fee calculation
  - Unsatisfied Item Return: Full refund for defective items
- Late fees calculated at 10% per day
- Database updates (status change, stock restoration)

### 📊 Dashboard Statistics
- Real-time data from Supabase
- Today's sales, transaction count, active rentals
- Employee statistics (Admin dashboard)

### 🎨 Modern UI/UX
- shadcn-inspired component library
- Glass morphism effects with backdrop blur
- Smooth animations with Framer Motion
- Responsive design for all devices
- Modern gradient color palette (Indigo/Violet/Emerald)

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Auth**: bcryptjs for password hashing

## 📦 Installation

```bash
# Navigate to project
cd pos-frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to `.env.local`
3. Run the schema in Supabase SQL Editor:
   - Copy contents of `supabase/schema.sql`
   - Paste and run in SQL Editor

## 🔑 Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | dawood90999 | 12E2d786@2 |

## 📁 Project Structure

```
pos-frontend/
├── app/
│   ├── admin/           # Admin dashboard & transactions
│   ├── cashier/         # Cashier dashboard & transactions
│   ├── globals.css      # Global styles with CSS variables
│   ├── layout.tsx       # Root layout with AuthProvider
│   └── page.tsx         # Login page
├── components/
│   ├── admin/           # Admin-specific components
│   ├── auth/            # Authentication components
│   ├── pos/             # POS transaction components
│   └── ui/              # Reusable UI components (shadcn-style)
├── lib/
│   ├── api/             # API functions for Supabase
│   ├── auth/            # Authentication context
│   └── utils/           # Utility functions
└── supabase/
    └── schema.sql       # Database schema with RLS policies
```

## 🔒 Security Features

- ✅ Route protection with ProtectedRoute component
- ✅ Role-based access control (Admin/Cashier)
- ✅ Auth context with session management
- ✅ Bcrypt password hashing (10 salt rounds)
- ✅ Input validation on all forms
- ✅ SQL injection prevention (Supabase client)
- ✅ RLS policies on all database tables
- ✅ Automatic redirect for unauthorized access

## 🎨 UI Components

The project includes a custom component library inspired by shadcn/ui:

- **Button**: Multiple variants (default, destructive, outline, success, warning)
- **Card**: Glass morphism effect with hover animations
- **Input**: Icon support with focus states
- **Badge**: Status indicators with color variants
- **Avatar**: User avatars with fallback initials

## 📋 Business Rules

| Rule | Value |
|------|-------|
| Tax Rate | 6% |
| Coupon Discount | 10% |
| Late Fee | 10% per day |
| Phone Format | 11 digits |
| Password Min Length | 8 characters |

## 🚧 Route Protection

| Route | Required Role |
|-------|---------------|
| `/` | Public |
| `/admin` | Admin |
| `/admin/transactions` | Admin |
| `/cashier` | Cashier (Admin also allowed) |
| `/cashier/sale` | Cashier |
| `/cashier/rental` | Cashier |
| `/cashier/return` | Cashier |

## 📝 Documentation

- `IMPLEMENTATION_SUMMARY.md` - Complete feature list and setup guide
- `SECURITY.md` - Security documentation and best practices
- `DATABASE_SETUP.md` - Database configuration guide
- `TROUBLESHOOTING.md` - Common issues and solutions

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow Tailwind CSS conventions
4. Ensure responsive design
5. Add proper error handling

---

**Built with ❤️ using Next.js, Tailwind CSS, and Supabase**
