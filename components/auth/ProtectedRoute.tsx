'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'Admin' | 'Cashier';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, hasRole, employee } = useAuth();

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Verifying authentication...</p>
                </motion.div>
            </div>
        );
    }

    // Not authenticated - will be redirected by AuthContext
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Redirecting to login...</p>
                </motion.div>
            </div>
        );
    }

    // Check role if required
    if (requiredRole && !hasRole(requiredRole)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md mx-auto p-8"
                >
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert className="w-8 h-8 text-rose-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
                    <p className="text-slate-600 mb-4">
                        You don't have permission to access this page.
                        {requiredRole === 'Admin' && ' This area is restricted to administrators only.'}
                    </p>
                    <p className="text-sm text-slate-500">
                        Logged in as: <span className="font-semibold">{employee?.name}</span> ({employee?.position})
                    </p>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}
