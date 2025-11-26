# SG Technologies - Point of Sale System (Next.js Frontend)

A modern, beautiful web-based Point of Sale system built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

### Authentication & Authorization
- **Login System**: Secure authentication with role-based access
- **Admin Dashboard**: Employee management (add, edit, delete employees)
- **Cashier Dashboard**: Transaction processing interface

### Transaction Management
- **Sales Processing**: 
  - Add items to cart by ID
  - Apply coupons (10% discount)
  - Automatic tax calculation (6%)
  - Multiple payment methods (Cash, Credit Card)
  - Invoice generation

- **Rental Management**:
  - Customer verification via phone number
  - Add rental items
  - Set return dates
  - Track rental history

- **Return Processing**:
  - Customer lookup
  - View active rentals
  - Calculate late fees (10% per day)
  - Process multiple returns

### UI/UX Features
- **Modern Design**: Beautiful gradient backgrounds and smooth animations
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Dynamic cart and summary calculations
- **Session Recovery**: Resume incomplete transactions
- **Statistics Dashboard**: View daily sales, transactions, and active rentals

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📦 Installation

1. Navigate to the project directory:
```bash
cd pos-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 Demo Credentials

### Admin Access
- **Username**: `admin`
- **Password**: `1`
- **Features**: Employee management, cashier view access

### Cashier Access
- **Username**: `cashier`
- **Password**: `lehigh2016`
- **Features**: Sales, rentals, returns processing

## 📁 Project Structure

```
pos-frontend/
├── app/
│   ├── page.tsx                 # Login page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── admin/
│   │   └── page.tsx             # Admin dashboard
│   └── cashier/
│       ├── page.tsx             # Cashier dashboard
│       ├── sale/
│       │   └── page.tsx         # Sales transaction
│       ├── rental/
│       │   └── page.tsx         # Rental transaction
│       └── return/
│           └── page.tsx         # Return processing
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Blue gradient (from-blue-600 to-purple-600)
- **Sales**: Green gradient (from-green-500 to-emerald-600)
- **Rentals**: Purple gradient (from-purple-500 to-pink-600)
- **Returns**: Blue gradient (from-blue-500 to-cyan-600)

### Components
- Gradient backgrounds with blur effects
- Rounded cards with shadows
- Smooth hover transitions
- Icon-based navigation
- Color-coded transaction types

## 🔄 Business Logic

### Tax Calculation
- Tax Rate: 6%
- Applied after discounts

### Coupon System
- Coupon codes starting with 'C' (e.g., C001-C200)
- 10% discount on subtotal

### Late Fee Calculation
- Formula: `itemPrice * 0.1 * daysLate`
- Applied per day overdue

### Inventory Updates
- Sales: Decrease stock
- Rentals: Decrease stock
- Returns: Increase stock

## 🚧 Future Enhancements

This is a frontend implementation. To make it fully functional:

1. **Backend API**: Connect to REST API or GraphQL backend
2. **Database**: Integrate with PostgreSQL/MySQL/MongoDB
3. **Authentication**: Implement JWT or session-based auth
4. **Real-time Updates**: Add WebSocket for live inventory
5. **Reporting**: Add analytics and sales reports
6. **Barcode Scanner**: Integrate barcode scanning
7. **Receipt Printing**: Add thermal printer support
8. **Multi-store**: Support multiple store locations

## 📝 Notes

- This is a reengineered version of the legacy Java desktop POS system
- All data is currently mocked for demonstration purposes
- Replace mock data with actual API calls for production use
- Follows modern web development best practices
- Implements responsive design principles

## 🤝 Contributing

This project is part of a Software Reengineering course project. For contributions:

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow Tailwind CSS conventions
4. Ensure responsive design
5. Test on multiple browsers

## 📄 License

Educational project for Software Reengineering course - Fall 2025

---

**Built with ❤️ using Next.js and Tailwind CSS**
