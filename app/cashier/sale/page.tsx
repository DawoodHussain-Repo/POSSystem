'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Aurora from '@/components/Aurora';
import Notification from '@/components/ui/Notification';
import PaymentModal from '@/components/ui/PaymentModal';
import Receipt from '@/components/ui/Receipt';
import AddItemForm from '@/components/pos/AddItemForm';
import CartItem, { CartItemData } from '@/components/pos/CartItem';
import { findProduct } from '@/lib/mockData';
import { createSalesTransaction } from '@/lib/api/transactions';

const TAX_RATE = 0.06;

export default function SalePage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItemData[]>([]);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [showPayment, setShowPayment] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [notification, setNotification] = useState({ type: 'success' as 'success' | 'error' | 'warning', message: '', visible: false });

    const showNotify = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message, visible: true });
        setTimeout(() => setNotification(n => ({ ...n, visible: false })), 3000);
    };

    const handleAddItem = (itemId: string, quantity: number) => {
        const product = findProduct(itemId);
        if (!product) { showNotify('error', 'Product not found! Try: 1000-1009, 2000-2004, 3000-3002'); return; }
        if (product.stock < quantity) { showNotify('error', `Insufficient stock! Available: ${product.stock}`); return; }

        const existing = cart.findIndex(item => item.id === product.id);
        if (existing >= 0) {
            const updated = [...cart];
            updated[existing].quantity += quantity;
            setCart(updated);
        } else {
            setCart([...cart, { id: product.id, name: product.name, price: product.price, quantity }]);
        }
        showNotify('success', `Added ${product.name}`);
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
                employeeId,
                cart,
                subtotal,
                discountAmount,
                taxAmount,
                total,
                method,
                discount > 0 ? 'COUPON10' : undefined
            );

            // Prepare receipt data
            setReceiptData({
                transactionId: transaction.id,
                items: cart.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.price * item.quantity
                })),
                subtotal,
                discount: discountAmount,
                tax: taxAmount,
                total,
                paymentMethod: method,
                cashReceived,
                change: cashReceived ? cashReceived - total : undefined,
                cashback,
                employeeName: employee.name
            });

            setShowReceipt(true);
            showNotify('success', 'Sale completed successfully!');
        } catch (error) {
            console.error('Sale failed:', error);
            throw error;
        }
    };

    const handleReceiptClose = () => {
        setShowReceipt(false);
        router.push('/cashier');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50 relative">
            <Aurora colorStops={["#5D866C", "#C2A68C", "#E6D8C3"]} blend={0.3} amplitude={0.8} speed={0.3} />
            <Notification type={notification.type} message={notification.message} isVisible={notification.visible} />

            <header className="bg-white/90 backdrop-blur-sm border-b border-cream-200 shadow-sm relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-4">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => router.push('/cashier')}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-cream-100">
                        <ArrowLeft className="w-5 h-5 text-sage-600" />
                    </motion.button>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                        <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-sage-800">New Sale</h1>
                        <p className="text-sm text-sage-600">Process sales transaction</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Add Items */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6">
                            <h2 className="text-lg font-semibold text-sage-800 mb-4">Add Items</h2>
                            <AddItemForm onAdd={handleAddItem} placeholder="Enter Item ID (e.g., 1000)" buttonColor="green" />
                        </motion.div>

                        {/* Cart */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6">
                            <h2 className="text-lg font-semibold text-sage-800 mb-4">Cart ({cart.length})</h2>
                            {cart.length === 0 ? (
                                <div className="text-center py-12">
                                    <ShoppingBag className="w-16 h-16 text-cream-300 mx-auto mb-4" />
                                    <p className="text-sage-500">No items in cart</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {cart.map((item, i) => (
                                            <CartItem key={item.id} item={item} index={i} onRemove={(id) => setCart(cart.filter(c => c.id !== id))} />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>

                        {/* Coupon */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6">
                            <h2 className="text-lg font-semibold text-sage-800 mb-4">Apply Coupon</h2>
                            <div className="flex space-x-3">
                                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Enter coupon code (e.g., C10OFF)"
                                    className="flex-1 px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50" />
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleApplyCoupon}
                                    className="px-6 py-3 bg-cream-300 text-sage-700 rounded-lg hover:bg-cream-400 flex items-center space-x-2">
                                    <Tag className="w-5 h-5" /><span>Apply</span>
                                </motion.button>
                            </div>
                            {discount > 0 && <p className="mt-2 text-green-600 text-sm">✓ 10% discount applied</p>}
                        </motion.div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6 sticky top-6">
                            <h2 className="text-lg font-semibold text-sage-800 mb-6">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sage-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount (10%)</span><span>-${discountAmount.toFixed(2)}</span></div>}
                                <div className="flex justify-between text-sage-600"><span>Tax (6%)</span><span>${taxAmount.toFixed(2)}</span></div>
                                <div className="border-t border-cream-200 pt-3">
                                    <div className="flex justify-between text-xl font-bold text-sage-800"><span>Total</span><span>${total.toFixed(2)}</span></div>
                                </div>
                            </div>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowPayment(true)}
                                disabled={cart.length === 0}
                                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold disabled:opacity-50 shadow-lg">
                                Proceed to Payment
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </main>

            <PaymentModal isOpen={showPayment} total={total} onClose={() => setShowPayment(false)}
                onComplete={handlePayment} title="Payment" allowCashback={true} />

            {receiptData && (
                <Receipt
                    isOpen={showReceipt}
                    onClose={handleReceiptClose}
                    type="sale"
                    items={receiptData.items}
                    subtotal={receiptData.subtotal}
                    discount={receiptData.discount}
                    tax={receiptData.tax}
                    total={receiptData.total}
                    paymentMethod={receiptData.paymentMethod}
                    cashReceived={receiptData.cashReceived}
                    change={receiptData.change}
                    cashback={receiptData.cashback}
                    transactionId={receiptData.transactionId}
                    employeeName={receiptData.employeeName}
                />
            )}
        </div>
    );
}
