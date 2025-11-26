'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Package, RotateCcw, LogOut, DollarSign, TrendingUp, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getTodayStats } from '@/lib/api/transactions';

function CashierDashboardContent() {
    const router = useRouter();
    const { employee, logout } = useAuth();
    const [stats, setStats] = useState({ totalSales: 0, transactionCount: 0, activeRentals: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadStats(); }, []);

    const loadStats = async () => {
        try {
            const data = await getTodayStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => { logout(); };

    const transactionTypes = [
        {
            title: 'New Sale',
            description: 'Process a new sales transaction with automatic inventory update',
            icon: ShoppingCart,
            href: '/cashier/sale',
            gradient: 'from-emerald-500 to-teal-600',
            bgGradient: 'from-emerald-50 to-teal-50',
            borderColor: 'border-emerald-200',
            textColor: 'text-emerald-600'
        },
        {
            title: 'New Rental',
            description: 'Start a rental transaction and track return dates',
            icon: Package,
            href: '/cashier/rental',
            gradient: 'from-amber-500 to-orange-500',
            bgGradient: 'from-amber-50 to-orange-50',
            borderColor: 'border-amber-200',
            textColor: 'text-amber-600'
        },
        {
            title: 'Process Return',
            description: 'Handle rental returns and calculate late fees',
            icon: RotateCcw,
            href: '/cashier/return',
            gradient: 'from-indigo-500 to-violet-600',
            bgGradient: 'from-indigo-50 to-violet-50',
            borderColor: 'border-indigo-200',
            textColor: 'text-indigo-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Cashier Dashboard</h1>
                                <p className="text-sm text-slate-500">Transaction Processing</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {/* User Info */}
                            <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-xl">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs bg-gradient-to-br from-emerald-500 to-teal-600">
                                        {employee?.name?.charAt(0) || 'C'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                    <p className="font-medium text-slate-700">{employee?.name}</p>
                                    <Badge variant="success" className="text-xs py-0">{employee?.position}</Badge>
                                </div>
                            </div>
                            <Button variant="destructive" size="sm" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 mr-2" />Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        Welcome back, {employee?.name?.split(' ')[0] || 'Cashier'}! <Sparkles className="inline w-6 h-6 text-amber-500" />
                    </h2>
                    <p className="text-slate-500">Here's your dashboard overview for today</p>
                </motion.div>

                {/* Stats Cards */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mr-3" />
                        <span className="text-slate-600">Loading stats...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500 mb-1">Today's Sales</p>
                                                <p className="text-3xl font-bold text-slate-900">${stats.totalSales.toFixed(2)}</p>
                                            </div>
                                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                                <DollarSign className="w-7 h-7 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500 mb-1">Transactions</p>
                                                <p className="text-3xl font-bold text-slate-900">{stats.transactionCount}</p>
                                            </div>
                                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                                <TrendingUp className="w-7 h-7 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-600" />
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500 mb-1">Active Rentals</p>
                                                <p className="text-3xl font-bold text-slate-900">{stats.activeRentals}</p>
                                            </div>
                                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                                                <Package className="w-7 h-7 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                )}

                {/* Transaction Types */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-6">Start New Transaction</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {transactionTypes.map((type, i) => (
                            <motion.div
                                key={type.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card
                                    className={`cursor-pointer bg-gradient-to-br ${type.bgGradient} border-2 ${type.borderColor} hover:shadow-xl transition-all`}
                                    onClick={() => router.push(type.href)}
                                >
                                    <CardContent className="p-6">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${type.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                                            <type.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">{type.title}</h4>
                                        <p className="text-slate-600 text-sm mb-4">{type.description}</p>
                                        <div className={`flex items-center ${type.textColor} font-semibold`}>
                                            <span>Get Started</span>
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function CashierDashboard() {
    return (
        <ProtectedRoute requiredRole="Cashier">
            <CashierDashboardContent />
        </ProtectedRoute>
    );
}
