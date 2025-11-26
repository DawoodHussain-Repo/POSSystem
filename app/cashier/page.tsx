'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Package, RotateCcw, LogOut, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Aurora from '@/components/Aurora';
import { getTodayStats } from '@/lib/api/transactions';

export default function CashierDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({ totalSales: 0, transactionCount: 0, activeRentals: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50 relative">
            <Aurora colorStops={["#C2A68C", "#5D866C", "#E6D8C3"]} blend={0.2} amplitude={0.7} speed={0.5} />
            <header className="bg-white/90 backdrop-blur-sm border-b border-cream-200 shadow-sm relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-sage-800">Cashier Dashboard</h1>
                                <p className="text-sm text-sage-600">Transaction Processing</p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/')}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </motion.button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-sage-600 animate-spin mr-3" />
                        <span className="text-sage-600">Loading stats...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6 hover:shadow-xl transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-sage-600 mb-1">Today's Sales</p>
                                    <p className="text-2xl font-bold text-sage-800">${stats.totalSales.toFixed(2)}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6 hover:shadow-xl transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-sage-600 mb-1">Transactions</p>
                                    <p className="text-2xl font-bold text-sage-800">{stats.transactionCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-sage-600" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6 hover:shadow-xl transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-sage-600 mb-1">Active Rentals</p>
                                    <p className="text-2xl font-bold text-sage-800">{stats.activeRentals}</p>
                                </div>
                                <div className="w-12 h-12 bg-cream-200 rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-cream-500" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-sage-800 mb-4">Start New Transaction</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.03, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/cashier/sale')}
                            className="bg-white rounded-lg shadow-md border border-cream-200 p-8 hover:shadow-xl transition-all text-left"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                                <ShoppingCart className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-sage-800 mb-2">New Sale</h3>
                            <p className="text-sage-600 text-sm">Process a new sales transaction with automatic inventory update</p>
                            <div className="mt-4 flex items-center text-green-600 font-medium">
                                <span>Start Sale</span>
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.03, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/cashier/rental')}
                            className="bg-white rounded-lg shadow-md border border-cream-200 p-8 hover:shadow-xl transition-all text-left"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-cream-400 to-cream-500 rounded-lg flex items-center justify-center mb-4">
                                <Package className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-sage-800 mb-2">New Rental</h3>
                            <p className="text-sage-600 text-sm">Start a rental transaction and track return dates</p>
                            <div className="mt-4 flex items-center text-cream-500 font-medium">
                                <span>Start Rental</span>
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.03, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/cashier/return')}
                            className="bg-white rounded-lg shadow-md border border-cream-200 p-8 hover:shadow-xl transition-all text-left"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center mb-4">
                                <RotateCcw className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-sage-800 mb-2">Process Return</h3>
                            <p className="text-sage-600 text-sm">Handle rental returns and calculate late fees</p>
                            <div className="mt-4 flex items-center text-sage-600 font-medium">
                                <span>Start Return</span>
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </motion.button>
                    </div>
                </div>
            </main>
        </div>
    );
}
