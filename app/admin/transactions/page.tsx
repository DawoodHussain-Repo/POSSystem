'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Receipt, ShoppingBag, Package, RotateCcw, Loader2, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface Transaction {
    id: string;
    type: 'sale' | 'rental' | 'return';
    total: number;
    payment_method?: string;
    status?: string;
    created_at: string;
}

function TransactionsPageContent() {
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
        } finally { setLoading(false); }
    };

    const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);
    const totals = {
        sales: transactions.filter(t => t.type === 'sale').reduce((s, t) => s + Number(t.total), 0),
        rentals: transactions.filter(t => t.type === 'rental').reduce((s, t) => s + Number(t.total), 0),
        returns: transactions.filter(t => t.type === 'return').reduce((s, t) => s + Number(t.total), 0)
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'sale': return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
            case 'rental': return <Package className="w-5 h-5 text-amber-600" />;
            case 'return': return <RotateCcw className="w-5 h-5 text-indigo-600" />;
        }
    };

    const getBadgeVariant = (type: string) => {
        switch (type) {
            case 'sale': return 'success';
            case 'rental': return 'warning';
            case 'return': return 'default';
            default: return 'secondary';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/admin')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Receipt className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
                        <p className="text-sm text-slate-500">View all transactions from database</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-500">Total Sales</p>
                                            <p className="text-3xl font-bold text-slate-900">${totals.sales.toFixed(2)}</p>
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
                                            <p className="text-sm text-slate-500">Total Rentals</p>
                                            <p className="text-3xl font-bold text-slate-900">${totals.rentals.toFixed(2)}</p>
                                        </div>
                                        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                                            <TrendingUp className="w-7 h-7 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-500">Late Fees Collected</p>
                                            <p className="text-3xl font-bold text-slate-900">${totals.returns.toFixed(2)}</p>
                                        </div>
                                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                            <Clock className="w-7 h-7 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-600" />
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Filter */}
                <div className="flex space-x-2 mb-6">
                    {(['all', 'sale', 'rental', 'return'] as const).map(f => (
                        <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)} className="capitalize">
                            {f}
                        </Button>
                    ))}
                </div>

                {/* Transactions List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Transaction History
                            <Badge variant="secondary">{filtered.length} transactions</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20">
                                <Receipt className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400">No transactions found</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filtered.map((t, i) => (
                                    <motion.div key={`${t.type}-${t.id}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.02 }}
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                {getIcon(t.type)}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <p className="font-medium text-slate-900 capitalize">{t.type}</p>
                                                    <Badge variant={getBadgeVariant(t.type) as any} className="text-xs">{t.type}</Badge>
                                                </div>
                                                <p className="text-sm text-slate-500">
                                                    {new Date(t.created_at).toLocaleString()}
                                                    {t.payment_method && ` • ${t.payment_method}`}
                                                    {t.status && ` • ${t.status}`}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-bold text-slate-900">${Number(t.total).toFixed(2)}</p>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

export default function TransactionsPage() {
    return <ProtectedRoute requiredRole="Admin"><TransactionsPageContent /></ProtectedRoute>;
}
