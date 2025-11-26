'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Phone, AlertCircle, CheckCircle, Loader2, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Notification from '@/components/ui/Notification';
import PaymentModal from '@/components/ui/PaymentModal';
import Receipt from '@/components/ui/Receipt';
import { getActiveRentals, createReturnTransaction } from '@/lib/api/transactions';
import { getOrCreateCustomer } from '@/lib/api/customers';

interface RentalItem {
    id: string;
    itemId: string;
    itemName: string;
    rentalPrice: number;
    rentalDate: string;
    returnDate: string;
    daysLate: number;
    rentalId: string;
}

type ReturnType = 'rental' | 'unsatisfied';

function ReturnPageContent() {
    const router = useRouter();
    const [returnType, setReturnType] = useState<ReturnType>('rental');
    const [phone, setPhone] = useState('');
    const [verified, setVerified] = useState(false);
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [rentals, setRentals] = useState<RentalItem[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [showPayment, setShowPayment] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [notification, setNotification] = useState({ type: 'success' as 'success' | 'error' | 'warning', message: '', visible: false });

    const showNotify = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message, visible: true });
        setTimeout(() => setNotification(n => ({ ...n, visible: false })), 3000);
    };

    const handleVerify = async () => {
        if (phone.length !== 11) { showNotify('error', 'Enter valid 11-digit phone'); return; }
        setLoading(true);
        try {
            const customer = await getOrCreateCustomer(phone);
            setCustomerId(customer.id);
            const activeRentals = await getActiveRentals(customer.id);

            const rentalItems: RentalItem[] = [];
            for (const rental of activeRentals) {
                if (rental.rental_transaction_items) {
                    for (const item of rental.rental_transaction_items) {
                        const returnDate = new Date(rental.return_date);
                        const today = new Date();
                        const daysLate = Math.max(0, Math.floor((today.getTime() - returnDate.getTime()) / (1000 * 60 * 60 * 24)));
                        rentalItems.push({
                            id: item.id, itemId: item.product_id, itemName: item.rental_products?.name || 'Unknown Item',
                            rentalPrice: Number(item.rental_price), rentalDate: new Date(rental.created_at).toLocaleDateString(),
                            returnDate: returnDate.toLocaleDateString(), daysLate, rentalId: rental.id
                        });
                    }
                }
            }
            setRentals(rentalItems);
            setVerified(true);
            showNotify('success', rentalItems.length > 0 ? `Found ${rentalItems.length} rental(s)` : 'No active rentals');
        } catch (error) {
            console.error('Failed to fetch rentals:', error);
            showNotify('error', 'Failed to fetch rentals');
        } finally { setLoading(false); }
    };

    const handleReset = () => { setVerified(false); setCustomerId(null); setPhone(''); setRentals([]); setSelected(new Set()); };
    const toggleItem = (id: string) => { const newSet = new Set(selected); newSet.has(id) ? newSet.delete(id) : newSet.add(id); setSelected(newSet); };
    const calcLateFee = (price: number, days: number) => price * 0.1 * days;
    const totalFees = rentals.filter(r => selected.has(r.itemId)).reduce((s, r) => s + calcLateFee(r.rentalPrice, r.daysLate), 0);
    const refundAmount = rentals.filter(r => selected.has(r.itemId)).reduce((s, r) => s + r.rentalPrice, 0);

    const handleProceed = () => {
        if (selected.size === 0) { showNotify('error', 'Select items to return'); return; }
        setShowPayment(true);
    };

    const handlePayment = async (method: string, cashReceived?: number, cashback?: number) => {
        if (!customerId) return;
        setProcessingPayment(true);
        try {
            const employee = JSON.parse(sessionStorage.getItem('employee') || '{}');
            const employeeId = employee.id || '1';
            const returnedItems = rentals.filter(r => selected.has(r.itemId));
            const rentalIds = [...new Set(returnedItems.map(item => item.rentalId))];

            for (const rentalId of rentalIds) {
                const itemsForRental = returnedItems.filter(item => item.rentalId === rentalId);
                const returnItems = itemsForRental.map(item => ({
                    rentalItemId: item.id, productId: item.itemId, quantity: 1,
                    daysLate: returnType === 'rental' ? item.daysLate : 0,
                    lateFee: returnType === 'rental' ? calcLateFee(item.rentalPrice, item.daysLate) : 0
                }));
                const rentalLateFees = returnItems.reduce((sum, item) => sum + item.lateFee, 0);
                await createReturnTransaction(rentalId, customerId, employeeId, returnItems, rentalLateFees);
            }

            if (returnType === 'rental') {
                setReceiptData({
                    items: returnedItems.map(item => ({ name: item.itemName, quantity: 1, price: item.rentalPrice, total: calcLateFee(item.rentalPrice, item.daysLate) })),
                    subtotal: 0, lateFees: totalFees, total: totalFees, paymentMethod: method, cashReceived,
                    change: cashReceived ? cashReceived - totalFees : undefined, employeeName: employee.name, customerPhone: phone, returnType: 'Rental Return'
                });
            } else {
                setReceiptData({
                    items: returnedItems.map(item => ({ name: item.itemName, quantity: 1, price: item.rentalPrice, total: item.rentalPrice })),
                    subtotal: refundAmount, total: -refundAmount, paymentMethod: method, employeeName: employee.name, customerPhone: phone, returnType: 'Unsatisfied Item Return (Refund)'
                });
            }
            setProcessingPayment(false);
            setShowReceipt(true);
            showNotify('success', 'Return processed successfully!');
        } catch (error) {
            console.error('Return failed:', error);
            setProcessingPayment(false);
            showNotify('error', 'Failed to process return');
            throw error;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <Notification type={notification.type} message={notification.message} isVisible={notification.visible} />

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/cashier')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <RotateCcw className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Process Return</h1>
                        <p className="text-sm text-slate-500">Handle rental returns</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Return Type */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card>
                                <CardHeader><CardTitle>Return Type</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-3">
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setReturnType('rental')}
                                            className={`p-4 rounded-xl border-2 transition-all ${returnType === 'rental' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${returnType === 'rental' ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                                                    <RotateCcw className={`w-5 h-5 ${returnType === 'rental' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-semibold text-slate-900">Rental Return</p>
                                                    <p className="text-xs text-slate-500">Return rented items</p>
                                                </div>
                                            </div>
                                        </motion.button>
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setReturnType('unsatisfied')}
                                            className={`p-4 rounded-xl border-2 transition-all ${returnType === 'unsatisfied' ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-white hover:border-rose-300'}`}>
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${returnType === 'unsatisfied' ? 'bg-rose-100' : 'bg-slate-100'}`}>
                                                    <AlertCircle className={`w-5 h-5 ${returnType === 'unsatisfied' ? 'text-rose-600' : 'text-slate-400'}`} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-semibold text-slate-900">Unsatisfied Item</p>
                                                    <p className="text-xs text-slate-500">Refund for defective item</p>
                                                </div>
                                            </div>
                                        </motion.button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Customer */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Card>
                                <CardHeader><CardTitle>Customer Verification</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="flex space-x-3">
                                        <Input icon={<Phone className="w-4 h-4" />} placeholder="Enter 11-digit phone" value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} maxLength={11} disabled={verified} className="flex-1" />
                                        {!verified ? (
                                            <Button onClick={handleVerify} disabled={loading || phone.length !== 11}>
                                                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : 'Verify'}
                                            </Button>
                                        ) : (
                                            <Button variant="outline" onClick={handleReset}>Change</Button>
                                        )}
                                    </div>
                                    {verified && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2">
                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                            <span className="text-emerald-700 font-medium">Customer verified</span>
                                        </motion.div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Rentals */}
                        {verified && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            Active Rentals <Badge variant="secondary">{rentals.length} items</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {rentals.length === 0 ? (
                                            <div className="text-center py-12">
                                                <CheckCircle className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
                                                <p className="text-slate-400">No active rentals</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <AnimatePresence>
                                                    {rentals.map((item, i) => (
                                                        <motion.div key={item.itemId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.05 }} onClick={() => toggleItem(item.itemId)}
                                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selected.has(item.itemId) ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex items-center space-x-2">
                                                                    <input type="checkbox" checked={selected.has(item.itemId)} onChange={() => toggleItem(item.itemId)} className="w-5 h-5 text-indigo-600 rounded" />
                                                                    <span className="font-medium text-slate-900">{item.itemName}</span>
                                                                </div>
                                                                {item.daysLate > 0 && (
                                                                    <Badge variant="destructive" className="flex items-center">
                                                                        <AlertCircle className="w-3 h-3 mr-1" />{item.daysLate} days late
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="ml-7 grid grid-cols-3 gap-4 text-sm">
                                                                <div><p className="text-slate-500">Rental Date</p><p className="font-medium">{item.rentalDate}</p></div>
                                                                <div><p className="text-slate-500">Price</p><p className="font-medium">${item.rentalPrice.toFixed(2)}</p></div>
                                                                <div><p className="text-slate-500">Late Fee</p>
                                                                    <p className={`font-medium ${item.daysLate > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                                        ${calcLateFee(item.rentalPrice, item.daysLate).toFixed(2)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <Card className="sticky top-24">
                                <CardHeader><CardTitle>Return Summary</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className={`p-4 rounded-xl border ${returnType === 'rental' ? 'bg-indigo-50 border-indigo-100' : 'bg-rose-50 border-rose-100'}`}>
                                            <p className="text-sm text-slate-500">Return Type</p>
                                            <p className="font-semibold text-slate-900">{returnType === 'rental' ? 'Rental Return' : 'Unsatisfied Item'}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-sm text-slate-500">Customer</p>
                                            <p className="font-semibold text-slate-900">{phone || 'Not verified'}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-sm text-slate-500">Items to Return</p>
                                            <p className="font-semibold text-slate-900">{selected.size}</p>
                                        </div>
                                        {returnType === 'rental' && totalFees > 0 && (
                                            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <AlertCircle className="w-4 h-4 text-rose-600" />
                                                    <p className="text-sm text-rose-700 font-medium">Late Fees</p>
                                                </div>
                                                <p className="text-2xl font-bold text-rose-900">${totalFees.toFixed(2)}</p>
                                            </div>
                                        )}
                                        {returnType === 'unsatisfied' && selected.size > 0 && (
                                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                    <p className="text-sm text-emerald-700 font-medium">Refund Amount</p>
                                                </div>
                                                <p className="text-2xl font-bold text-emerald-900">${refundAmount.toFixed(2)}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-t border-slate-200 pt-4">
                                        <div className="flex justify-between text-xl font-bold text-slate-900">
                                            <span>{returnType === 'rental' ? 'Total Due' : 'Refund Amount'}</span>
                                            <span className={returnType === 'unsatisfied' ? 'text-emerald-700' : ''}>
                                                ${returnType === 'rental' ? totalFees.toFixed(2) : refundAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <Button className="w-full" size="lg" variant={returnType === 'rental' ? 'default' : 'success'}
                                        onClick={handleProceed} disabled={!verified || selected.size === 0}>
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        {returnType === 'rental' ? (totalFees > 0 ? 'Proceed to Payment' : 'Process Return') : 'Process Refund'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </main>

            <PaymentModal isOpen={showPayment} total={returnType === 'rental' ? totalFees : 0} onClose={() => setShowPayment(false)}
                onComplete={handlePayment} title={returnType === 'rental' ? 'Pay Late Fees' : 'Process Refund'} allowCashback={false} />

            {/* Processing Loader */}
            <AnimatePresence>
                {processingPayment && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
                            <div className="text-center">
                                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Return...</h3>
                                <p className="text-slate-500">Please wait while we process your transaction</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {receiptData && (
                <Receipt isOpen={showReceipt} onClose={() => { setShowReceipt(false); router.push('/cashier'); }} type="return"
                    items={receiptData.items} subtotal={receiptData.subtotal} lateFees={receiptData.lateFees} total={receiptData.total}
                    paymentMethod={receiptData.paymentMethod} cashReceived={receiptData.cashReceived} change={receiptData.change}
                    employeeName={receiptData.employeeName} customerPhone={receiptData.customerPhone} />
            )}
        </div>
    );
}

export default function ReturnPage() {
    return <ProtectedRoute requiredRole="Cashier"><ReturnPageContent /></ProtectedRoute>;
}
