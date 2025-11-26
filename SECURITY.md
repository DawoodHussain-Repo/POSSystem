# Security Documentation

## Overview

This document outlines the security measures implemented in the SG Technologies POS System.

---

## Authentication

### Password Security

**Hashing Algorithm**: bcrypt
- **Salt Rounds**: 10
- **Library**: bcryptjs

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*(),.?":{}|<>)

**Implementation** (`lib/utils/password.ts`):
```typescript
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### Username Validation

- Length: 4-20 characters
- Allowed characters: alphanumeric and underscore
- Cannot be numeric-only (e.g., "110001" is invalid)
- Reserved usernames blocked: admin, root, system, etc.

---

## Authorization

### Role-Based Access Control (RBAC)

**Roles**:
| Role | Description | Access Level |
|------|-------------|--------------|
| Admin | System administrator | Full access |
| Cashier | Point of sale operator | Transaction access |

**Route Protection**:

| Route | Required Role | Description |
|-------|---------------|-------------|
| `/` | Public | Login page |
| `/admin` | Admin | Employee management |
| `/admin/transactions` | Admin | Transaction history |
| `/cashier` | Cashier | Cashier dashboard |
| `/cashier/sale` | Cashier | Sales processing |
| `/cashier/rental` | Cashier | Rental processing |
| `/cashier/return` | Cashier | Return processing |

**Note**: Admin users automatically have access to all Cashier routes.

### Implementation

**AuthContext** (`lib/auth/AuthContext.tsx`):
- Centralized authentication state
- Session persistence
- Role checking utilities

**ProtectedRoute** (`components/auth/ProtectedRoute.tsx`):
- Route guard component
- Role validation
- Automatic redirect for unauthorized access

---

## Session Management

### Storage
- **Method**: sessionStorage (browser)
- **Data Stored**: Employee object (id, username, name, position)
- **Lifetime**: Browser session (cleared on tab close)

### Security Measures
- No sensitive data (passwords) stored in session
- Session cleared on logout
- Automatic redirect on session expiry

---

## Database Security

### Supabase Configuration

**Row Level Security (RLS)**:
All tables have RLS enabled with policies defined in `supabase/schema.sql`.

**Tables with RLS**:
- employees
- products
- rental_products
- customers
- sales_transactions
- sales_transaction_items
- rental_transactions
- rental_transaction_items
- return_transactions
- return_transaction_items
- coupons
- employee_logs

### SQL Injection Prevention
- Supabase client uses parameterized queries
- No raw SQL execution from frontend
- Input validation before database operations

---

## Input Validation

### Client-Side Validation

**Employee Form**:
- Name: 2-100 characters, letters/spaces/hyphens/apostrophes only
- Username: 4-20 characters, alphanumeric + underscore, no numeric-only
- Password: 8+ characters with complexity requirements
- Position: Must be 'Admin' or 'Cashier'

**Customer Phone**:
- Exactly 11 digits
- Numeric only

**Transaction Items**:
- Valid product ID required
- Quantity must be positive integer
- Stock availability checked

### Server-Side Validation
- Supabase constraints enforce data integrity
- Foreign key relationships validated
- Check constraints on enum fields

---

## API Security

### Supabase Client
- **Authentication**: API key in environment variables
- **Authorization**: RLS policies enforce access control
- **Transport**: HTTPS only

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Note**: Never commit `.env.local` to version control.

---

## Security Best Practices

### Implemented
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Session management
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ Environment variable configuration
- ✅ RLS database policies

### Recommendations for Production

1. **HTTPS Only**: Ensure all traffic is encrypted
2. **Rate Limiting**: Implement login attempt limits
3. **Audit Logging**: Log all authentication events
4. **Session Timeout**: Implement automatic logout after inactivity
5. **CSRF Protection**: Add CSRF tokens for form submissions
6. **Content Security Policy**: Configure CSP headers
7. **Secure Cookies**: Use HttpOnly and Secure flags
8. **Two-Factor Authentication**: Consider adding 2FA for admin accounts

---

## Incident Response

### Suspicious Activity
1. Monitor failed login attempts
2. Check employee_logs table for unusual activity
3. Review transaction patterns

### Password Compromise
1. Immediately change affected password
2. Review recent transactions
3. Check for unauthorized employee additions

### Data Breach
1. Rotate Supabase API keys
2. Reset all employee passwords
3. Review RLS policies
4. Audit database access logs

---

## Compliance Considerations

### Data Protection
- Customer phone numbers stored securely
- No credit card data stored (use payment gateway)
- Employee passwords hashed, never stored in plain text

### Access Control
- Principle of least privilege
- Role-based access
- Audit trail via employee_logs

---

**Document Version**: 1.0  
**Last Updated**: November 27, 2025
