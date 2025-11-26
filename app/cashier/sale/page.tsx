'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Tag, Plus, Trash2, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Notification from '@/components/ui/Notification';
import PaymentModal from '@/components/ui/PaymentModal';
import Receipt from '@/components/ui/Receipt';
import { findProduct } from '@/lib/mockData';
import { createSalesTransaction } from '@/lib/api/transactions';

const TAX_RATE = 0.06;

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

function SalePageContent() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [itemId, setItemId] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [showPayment, setShowPayment] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);
    const [notification, setNotification] = useState({ type: 'success' as 'success' | 'error' | 'warning', message: '', visible: false });

    const showNotify = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message, visible: true });
        setTimeout(() => setNotification(n => ({ ...n, visible: false })), 3000);
    };

    const handleAddItem = () => {
        if (!itemId) return;
        const qty = parseInt(quantity) || 1;
        const product = findProduct(itemId);
        if (!product) { showNotify('error', 'Product not found! Try: 1000-1009, 2000-2004, 3000-3002'); return; }
        if (product.stock < qty) { showNotify('error', `Insufficient stock! Available: ${product.stock}`); return; }

        const existing = cart.findIndex(item => item.id === product.id);
        if (existing >= 0) {
            const updated = [...cart];
            updated[existing].quantity += qty;
            setCart(updated);
        } else {
            setCart([...cart, { id: product.id, name: product.name, price: product.price, quantity: qty }]);
        }
        showNotify('success', `Added ${product.name}`);
        setItemId('');
        setQuantity('1');
    };

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase().startsWith('C')) {
            setDiscount(0.10);
            showNotify('success', '10% discount applied!');
        } else {
            showNotify('error', 'Invalid coupon');
        }
        setCouponCode('');
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = subtotal * discount;
    const taxAmount = (subtotal - discountAmount) * TAX_RATE;
    const total = subtotal - discountAmount + taxAmount;

    const handlePayment = async (method: string, cashReceived?: number, cashback?: number) => {
        try {
            const employee = JSON.parse(sessionStorage.getItem('employee') || '{}');
            const employeeId = employee.id || '1';

            const transaction = await createSalesTransaction(
                employeeId, cart, subtotal, discountAmount, taxAmount, total, method,
                discount > 0 ? 'COUPON10' : undefined
            );

            setReceiptData({
                transactionId: transaction.id,
                items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price, total: item.price * item.quantity })),
                subtotal, discount: discountAmount, tax: taxAmount, total,
                paymentMethod: method, cashReceived, change: cashReceived ? cashReceived - total : undefined,
                cashback, employeeName: employee.name
            });

            setShowReceipt(true);
            showNotify('success', 'Sale completed successfully!');
        } catch (error) {
            console.error('Sale failed:', error);
            throw error;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
            <Notification type={notification.type} message={notification.message} isVisible={notification.visible} />

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/cashier')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">New Sale</h1>
                        <p className="text-sm text-slate-500">Process sales transaction</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Add Items */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card>
                                <CardHeader><CardTitle>Add Items</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="flex space-x-3">
                                        <Input placeholder="Item ID (e.g., 1000)" value={itemId} onChange={(e) => setItemId(e.target.value)} className="flex-1" />
                                        <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-24" />
                                        <Button onClick={handleAddItem} variant="success">
                                            <Plus className="w-4 h-4 mr-2" />Add
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Cart */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        Cart <Badge variant="secondary">{cart.length} items</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {cart.length === 0 ? (
                                        <div className="text-center py-12">
                                            <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400">No items in cart</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <AnimatePresence>
                                                {cart.map((item, i) => (
                                                    <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.05 }}
                                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                        <div>
                                                            <p className="font-medium text-slate-900">{item.name}</p>
                                                            <p className="text-sm text-slate-500">${item.price.toFixed(2)} × {item.quantity}</p>
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

                        {/* Coupon */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Card>
                                <CardHeader><CardTitle>Apply Coupon</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="flex space-x-3">
                                        <Input placeholder="Enter coupon code (e.g., C001)" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="flex-1" />
                                        <Button variant="outline" onClick={handleApplyCoupon}>
                                            <Tag className="w-4 h-4 mr-2" />Apply
                                        </Button>
                                    </div>
                                    {discount > 0 && <Badge variant="success" className="mt-3">✓ 10% discount applied</Badge>}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <Card className="sticky top-24">
                                <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                        {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount (10%)</span><span>-${discountAmount.toFixed(2)}</span></div>}
                                        <div className="flex justify-between text-slate-600"><span>Tax (6%)</span><span>${taxAmount.toFixed(2)}</span></div>
                                        <div className="border-t border-slate-200 pt-3">
                                            <div className="flex justify-between text-xl font-bold text-slate-900"><span>Total</span><span>${total.toFixed(2)}</span></div>
                                        </div>
                                    </div>
                                    <Button className="w-full" size="lg" onClick={() => setShowPayment(true)} disabled={cart.length === 0}>
                                        <CreditCard className="w-5 h-5 mr-2" />Proceed to Payment
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </main>

            <PaymentModal isOpen={showPayment} total={total} onClose={() => setShowPayment(false)} onComplete={handlePayment} title="Payment" allowCashback={true} />

            {receiptData && (
                <Receipt isOpen={showReceipt} onClose={() => { setShowReceipt(false); router.push('/cashier'); }} type="sale"
                    items={receiptData.items} subtotal={receiptData.subtotal} discount={receiptData.discount} tax={receiptData.tax}
                    total={receiptData.total} paymentMethod={receiptData.paymentMethod} cashReceived={receiptData.cashReceived}
                    change={receiptData.change} cashback={receiptData.cashback} transactionId={receiptData.transactionId} employeeName={receiptData.employeeName} />
            )}
        </div>
    );
}

export default function SalePage() {
    return <ProtectedRoute requiredRole="Cashier"><SalePageContent /></ProtectedRoute>;
}
