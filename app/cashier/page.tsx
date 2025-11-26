'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Package, RotateCcw, LogOut, DollarSign, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CashierDashboard() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50">
            <header className="bg-white border-b border-cream-200 shadow-sm">
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg shadow-md border border-cream-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-sage-600 mb-1">Today's Sales</p>
                                <p className="text-2xl font-bold text-sage-800">$2,450.00</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-lg shadow-md border border-cream-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-sage-600 mb-1">Transactions</p>
                                <p className="text-2xl font-bold text-sage-800">47</p>
                            </div>
                            <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-sage-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg shadow-md border border-cream-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-sage-600 mb-1">Active Rentals</p>
                                <p className="text-2xl font-bold text-sage-800">12</p>
                            </div>
                            <div className="w-12 h-12 bg-cream-200 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-cream-500" />
                            </div>
                        </div>
                    </motion.div>
                </div>

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
