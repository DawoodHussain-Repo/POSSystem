'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Receipt, ShoppingBag, Package, RotateCcw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Aurora from '@/components/Aurora';
import { supabase } from '@/lib/supabase';

interface Transaction {
    id: string;
    type: 'sale' | 'rental' | 'return';
    total: number;
    payment_method?: string;
    status?: string;
    created_at: string;
}

export default function TransactionsPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'sale' | 'rental' | 'return'>('all');

    useEffect(() => { loadTransactions(); }, []);

    const loadTransactions = async () => {
        setLoading(true);
        try {
            const [sales, rentals, returns] = await Promise.all([
                supabase.from('sales_transactions').select('id, total, payment_method, created_at').order('created_at', { ascending: false }).limit(50),
                supabase.from('rental_transactions').select('id, total, status, created_at').order('created_at', { ascending: false }).limit(50),
                supabase.from('return_transactions').select('id, total_due, created_at').order('created_at', { ascending: false }).limit(50)
            ]);

            const all: Transaction[] = [
                ...(sales.data || []).map(t => ({ ...t, type: 'sale' as const })),
                ...(rentals.data || []).map(t => ({ ...t, type: 'rental' as const })),
                ...(returns.data || []).map(t => ({ ...t, type: 'return' as const, total: t.total_due }))
            ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            setTransactions(all);
        } catch (error) {
            console.error('Failed to load transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);
    const totals = {
        sales: transactions.filter(t => t.type === 'sale').reduce((s, t) => s + Number(t.total), 0),
        rentals: transactions.filter(t => t.type === 'rental').reduce((s, t) => s + Number(t.total), 0),
        returns: transactions.filter(t => t.type === 'return').reduce((s, t) => s + Number(t.total), 0)
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'sale': return <ShoppingBag className="w-5 h-5 text-green-600" />;
            case 'rental': return <Package className="w-5 h-5 text-cream-500" />;
            case 'return': return <RotateCcw className="w-5 h-5 text-sage-600" />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'sale': return 'bg-green-50 border-green-200';
            case 'rental': return 'bg-cream-50 border-cream-200';
            case 'return': return 'bg-sage-50 border-sage-200';
            default: return 'bg-cream-50 border-cream-200';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50 relative">
            <Aurora colorStops={["#5D866C", "#C2A68C", "#E6D8C3"]} blend={0.2} amplitude={0.6} speed={0.4} />

            <header className="bg-white/90 backdrop-blur-sm border-b border-cream-200 shadow-sm relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-4">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => router.push('/admin')}
                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-cream-100">
                            <ArrowLeft className="w-5 h-5 text-sage-600" />
                        </motion.button>
                        <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Receipt className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-sage-800">Transactions</h1>
                            <p className="text-sm text-sage-600">View all transactions from Supabase</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="text-sm text-green-700">Total Sales</p>
                        <p className="text-2xl font-bold text-green-800">${totals.sales.toFixed(2)}</p>
                    </div>
                    <div className="bg-cream-100 rounded-lg p-4 border border-cream-200">
                        <p className="text-sm text-sage-700">Total Rentals</p>
                        <p className="text-2xl font-bold text-sage-800">${totals.rentals.toFixed(2)}</p>
                    </div>
                    <div className="bg-sage-50 rounded-lg p-4 border border-sage-200">
                        <p className="text-sm text-sage-700">Late Fees Collected</p>
                        <p className="text-2xl font-bold text-sage-800">${totals.returns.toFixed(2)}</p>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex space-x-2 mb-6">
                    {(['all', 'sale', 'rental', 'return'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg capitalize transition-all ${filter === f ? 'bg-sage-600 text-white' : 'bg-white text-sage-700 hover:bg-cream-100'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                {/* Transactions List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-sage-600 animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <Receipt className="w-16 h-16 text-cream-300 mx-auto mb-4" />
                        <p className="text-sage-500">No transactions found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((t, i) => (
                            <motion.div key={`${t.type}-${t.id}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.02 }}
                                className={`p-4 rounded-lg border ${getColor(t.type)} flex items-center justify-between`}>
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                        {getIcon(t.type)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sage-800 capitalize">{t.type}</p>
                                        <p className="text-sm text-sage-600">
                                            {new Date(t.created_at).toLocaleString()}
                                            {t.payment_method && ` • ${t.payment_method}`}
                                            {t.status && ` • ${t.status}`}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-lg font-bold text-sage-800">${Number(t.total).toFixed(2)}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
