# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd pos-frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## Demo Credentials

### 👨‍💼 Admin Login
```
Username: admin
Password: 1
```
**Access**: Employee management + Cashier features

### 👤 Cashier Login
```
Username: cashier
Password: lehigh2016
```
**Access**: Sales, Rentals, Returns processing

---

## Quick Tour

### Admin Dashboard
1. Login as admin
2. View employee list
3. Click "Add Employee" to create new users
4. Edit or delete existing employees
5. Switch to "Cashier View" to process transactions

### Cashier Dashboard
1. Login as cashier
2. See today's statistics
3. Choose transaction type:
   - **New Sale**: Process purchases
   - **New Rental**: Rent items to customers
   - **Process Return**: Handle returns and late fees

### Sales Transaction
1. Enter item ID (e.g., 1000)
2. Set quantity
3. Click "Add" to cart
4. Apply coupon code (e.g., C001) for 10% off
5. Click "Proceed to Payment"
6. Select payment method
7. Complete transaction

### Rental Transaction
1. Enter customer phone (10 digits)
2. Click "Verify"
3. Add rental items
4. Set return date
5. Complete rental

### Return Processing
1. Enter customer phone
2. Click "Verify"
3. Select items to return
4. View late fees (if any)
5. Process return

---

## Features to Try

✅ Add items to cart  
✅ Apply coupon codes (C001-C200)  
✅ Calculate tax (6%)  
✅ Process payments  
✅ Manage employees  
✅ Track rentals  
✅ Calculate late fees  

---

## Build for Production

```bash
npm run build
npm run start
```

---

## Need Help?

- Check `README.md` for detailed documentation
- Review `docs/Frontend-Implementation.md` for technical details
- Ensure Node.js 18+ is installed
- Clear browser cache if styles don't load

---

**Enjoy your modern POS system! 🚀**
