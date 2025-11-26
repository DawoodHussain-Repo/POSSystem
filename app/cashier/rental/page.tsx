'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Calendar, Plus, Trash2, Phone, CheckCircle, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Notification from '@/components/ui/Notification';
import PaymentModal from '@/components/ui/PaymentModal';
import Receipt from '@/components/ui/Receipt';
import { findRentalProduct } from '@/lib/mockData';
import { createRentalTransaction } from '@/lib/api/transactions';
import { getOrCreateCustomer } from '@/lib/api/customers';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

function RentalPageContent() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [verified, setVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [itemId, setItemId] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [returnDate, setReturnDate] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);
    const [notification, setNotification] = useState({ type: 'success' as 'success' | 'error' | 'warning', message: '', visible: false });

    const showNotify = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message, visible: true });
        setTimeout(() => setNotification(n => ({ ...n, visible: false })), 3000);
    };

    const handleVerify = async () => {
        if (phone.length !== 11) { showNotify('error', 'Enter valid 11-digit phone'); return; }
        setVerifying(true);
        try {
            const customer = await getOrCreateCustomer(phone);
            setCustomerId(customer.id);
            setVerified(true);
            showNotify('success', 'Customer verified');
        } catch { showNotify('error', 'Failed to verify customer'); }
        finally { setVerifying(false); }
    };

    const handleReset = () => { setVerified(false); setCustomerId(null); setPhone(''); setCart([]); };

    const handleAddItem = () => {
        if (!itemId) return;
        const qty = parseInt(quantity) || 1;
        const product = findRentalProduct(itemId);
        if (!product) { showNotify('error', 'Item not found! Try: 1000-1010'); return; }
        if (product.stock < qty) { showNotify('error', `Insufficient stock! Available: ${product.stock}`); return; }

        const existing = cart.findIndex(item => item.id === product.id);
        if (existing >= 0) {
            const updated = [...cart];
            updated[existing].quantity += qty;
            setCart(updated);
        } else {
            setCart([...cart, { id: product.id, name: product.name, price: product.rentalPrice, quantity: qty }]);
        }
        showNotify('success', `Added ${product.name}`);
        setItemId('');
        setQuantity('1');
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleProceed = () => {
        if (!returnDate) { showNotify('error', 'Please select return date'); return; }
        setShowPayment(true);
    };

    const handlePayment = async (method: string, cashReceived?: number, cashback?: number) => {
        if (!customerId) return;
        try {
            const employee = JSON.parse(sessionStorage.getItem('employee') || '{}');
            const transaction = await createRentalTransaction(customerId, employee.id || '1', cart, total, returnDate);

            setReceiptData({
                transactionId: transaction.id,
                items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price, total: item.price * item.quantity })),
                subtotal: total, total, paymentMethod: method, cashReceived,
                change: cashReceived ? cashReceived - total : undefined, cashback, returnDate,
                employeeName: employee.name, customerPhone: phone
            });

            setShowReceipt(true);
            showNotify('success', 'Rental completed successfully!');
        } catch (error) {
            console.error('Rental failed:', error);
            throw error;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
            <Notification type={notification.type} message={notification.message} isVisible={notification.visible} />

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/cashier')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">New Rental</h1>
                        <p className="text-sm text-slate-500">Process rental transaction</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Verification */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card>
                                <CardHeader><CardTitle>Customer Verification</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="flex space-x-3">
                                        <Input icon={<Phone className="w-4 h-4" />} placeholder="Enter 11-digit phone" value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} maxLength={11} disabled={verified} className="flex-1" />
                                        {!verified ? (
                                            <Button onClick={handleVerify} disabled={verifying || phone.length !== 11} variant="warning">
                                                {verifying ? 'Verifying...' : 'Verify'}
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

                        {verified && (
                            <>
                                {/* Add Items */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                    <Card>
                                        <CardHeader><CardTitle>Add Rental Items</CardTitle></CardHeader>
                                        <CardContent>
                                            <div className="flex space-x-3">
                                                <Input placeholder="Item ID (1000-1010)" value={itemId} onChange={(e) => setItemId(e.target.value)} className="flex-1" />
                                                <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-24" />
                                                <Button onClick={handleAddItem} variant="warning">
                                                    <Plus className="w-4 h-4 mr-2" />Add
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Cart */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                Rental Items <Badge variant="warning">{cart.length} items</Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {cart.length === 0 ? (
                                                <div className="text-center py-12">
                                                    <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                                    <p className="text-slate-400">No items added</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <AnimatePresence>
                                                        {cart.map((item, i) => (
                                                            <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.05 }}
                                                                className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                                                                <div>
                                                                    <p className="font-medium text-slate-900">{item.name}</p>
                                                                    <p className="text-sm text-slate-500">${item.price.toFixed(2)}/day × {item.quantity}</p>
                                                                </div>
                                                                <div className="flex items-center space-x-3">
                                                                    <p className="font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                                                                    <Button variant="ghost" size="icon" onClick={() => setCart(cart.filter(c => c.id !== item.id))}>
                                                                        <Trash2 className="w-4 h-4 text-rose-500" />
                                                                    </Button>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Return Date */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                    <Card>
                                        <CardHeader><CardTitle>Return Date</CardTitle></CardHeader>
                                        <CardContent>
                                            <Input icon={<Calendar className="w-4 h-4" />} type="date" value={returnDate}
                                                onChange={(e) => setReturnDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                            <Card className="sticky top-24">
                                <CardHeader><CardTitle>Rental Summary</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                            <p className="text-sm text-slate-500">Customer</p>
                                            <p className="font-semibold text-slate-900">{phone || 'Not verified'}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-sm text-slate-500">Items</p>
                                            <p className="font-semibold text-slate-900">{cart.length}</p>
                                        </div>
                                        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                            <p className="text-sm text-slate-500">Return Date</p>
                                            <p className="font-semibold text-slate-900">{returnDate || 'Not set'}</p>
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-200 pt-4">
                                        <div className="flex justify-between text-xl font-bold text-slate-900"><span>Total</span><span>${total.toFixed(2)}</span></div>
                                    </div>
                                    <Button className="w-full" size="lg" variant="warning" onClick={handleProceed} disabled={!verified || cart.length === 0}>
                                        <CreditCard className="w-5 h-5 mr-2" />Proceed to Payment
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </main>

            <PaymentModal isOpen={showPayment} total={total} onClose={() => setShowPayment(false)} onComplete={handlePayment} title="Rental Payment" allowCashback={true} />

            {receiptData && (
                <Receipt isOpen={showReceipt} onClose={() => { setShowReceipt(false); router.push('/cashier'); }} type="rental"
                    items={receiptData.items} subtotal={receiptData.subtotal} total={receiptData.total} paymentMethod={receiptData.paymentMethod}
                    cashReceived={receiptData.cashReceived} change={receiptData.change} cashback={receiptData.cashback}
                    returnDate={receiptData.returnDate} transactionId={receiptData.transactionId} employeeName={receiptData.employeeName} customerPhone={receiptData.customerPhone} />
            )}
        </div>
    );
}

export default function RentalPage() {
    return <ProtectedRoute requiredRole="Cashier"><RentalPageContent /></ProtectedRoute>;
}
