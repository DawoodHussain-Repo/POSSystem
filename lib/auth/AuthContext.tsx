'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Employee } from '@/lib/types';

interface AuthContextType {
    employee: Employee | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (employee: Employee) => void;
    logout: () => void;
    hasRole: (role: 'Admin' | 'Cashier') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/'];

// Routes that require Admin role
const ADMIN_ROUTES = ['/admin', '/admin/transactions'];

// Routes that require Cashier or Admin role
const CASHIER_ROUTES = ['/cashier', '/cashier/sale', '/cashier/rental', '/cashier/return'];

export function AuthProvider({ children }: { children: ReactNode }) {
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Check session on mount
    useEffect(() => {
        const checkAuth = () => {
            try {
                const stored = sessionStorage.getItem('employee');
                if (stored) {
                    const emp = JSON.parse(stored) as Employee;
                    setEmployee(emp);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                sessionStorage.removeItem('employee');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Route protection
    useEffect(() => {
        if (isLoading) return;

        const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
        const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
        const isCashierRoute = CASHIER_ROUTES.some(route => pathname.startsWith(route));

        // If not authenticated and trying to access protected route
        if (!employee && !isPublicRoute) {
            router.replace('/');
            return;
        }

        // If authenticated and on login page, redirect to appropriate dashboard
        if (employee && isPublicRoute) {
            if (employee.position === 'Admin') {
                router.replace('/admin');
            } else {
                router.replace('/cashier');
            }
            return;
        }

        // Check role-based access
        if (employee) {
            // Admin trying to access admin routes - OK
            // Cashier trying to access admin routes - NOT OK
            if (isAdminRoute && employee.position !== 'Admin') {
                router.replace('/cashier');
                return;
            }

            // Both Admin and Cashier can access cashier routes
            // (Admin might want to process transactions too)
        }
    }, [employee, isLoading, pathname, router]);

    const login = (emp: Employee) => {
        sessionStorage.setItem('employee', JSON.stringify(emp));
        setEmployee(emp);
    };

    const logout = () => {
        sessionStorage.removeItem('employee');
        setEmployee(null);
        router.replace('/');
    };

    const hasRole = (role: 'Admin' | 'Cashier'): boolean => {
        if (!employee) return false;
        if (role === 'Cashier') return true; // Both Admin and Cashier have cashier access
        return employee.position === role;
    };

    return (
        <AuthContext.Provider value={{
            employee,
            isAuthenticated: !!employee,
            isLoading,
            login,
            logout,
            hasRole
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
