'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Tag, CreditCard, Banknote, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import Aurora from '@/components/Aurora';
import { findProduct } from '@/lib/mockData';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export default function SalePage() {
    const router = useRouter();
    const [itemId, setItemId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [showPayment, setShowPayment] = useState(false);

    const TAX_RATE = 0.06;

    const handleAddItem = () => {
        const product = findProduct(itemId);
        if (!product) {
            alert('Product not found! Try: 1000-1009 (grocery), 2000-2004 (electronics), 3000-3002 (clothing)');
            return;
        }
        if (product.stock < quantity) {
            alert(`Insufficient stock! Available: ${product.stock}`);
            return;
        }
        const mockItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        };
        setCart([...cart, mockItem]);
        setItemId('');
        setQuantity(1);
    };

    const handleRemoveItem = (id: string) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const handleApplyCoupon = () => {
        if (couponCode.startsWith('C')) {
            setDiscount(0.10);
            alert('Coupon applied! 10% discount');
        } else {
            alert('Invalid coupon code');
        }
        setCouponCode('');
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * discount;
    const taxAmount = (subtotal - discountAmount) * TAX_RATE;
    const total = subtotal - discountAmount + taxAmount;

    const handleCompletePayment = () => {
        alert('Payment successful! Invoice generated.');
        router.push('/cashier');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50 relative">
            <Aurora colorStops={["#5D866C", "#C2A68C", "#E6D8C3"]} blend={0.3} amplitude={0.8} speed={0.3} />
            <header className="bg-white/90 backdrop-blur-sm border-b border-cream-200 shadow-sm relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => router.push('/cashier')}
                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-cream-100 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5 text-sage-600" />
                        </motion.button>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-sage-800">New Sale</h1>
                            <p className="text-sm text-sage-600">Process sales transaction</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-md border border-cream-200 p-6"
                        >
                            <h2 className="text-lg font-semibold text-sage-800 mb-4">Add Items</h2>
                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    value={itemId}
                                    onChange={(e) => setItemId(e.target.value)}
                                    placeholder="Enter Item ID"
                                    className="flex-1 px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-cream-50"
                                />
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    min="1"
                                    className="w-24 px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-cream-50"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAddItem}
                                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center space-x-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Add</span>
                                </motion.button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-lg shadow-md border border-cream-200 p-6"
                        >
                            <h2 className="text-lg font-semibold text-sage-800 mb-4">Cart Items</h2>
                            {cart.length === 0 ? (
                                <div className="text-center py-12">
                                    <ShoppingBag className="w-16 h-16 text-cream-300 mx-auto mb-4" />
                                    <p className="text-sage-500">No items in cart</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center justify-between p-4 bg-cream-50 rounded-lg border border-cream-200"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-sage-800">{item.name}</p>
                                                <p className="text-sm text-sage-600">ID: {item.id} • Qty: {item.quantity}</p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <p className="font-semibold text-sage-800">${(item.price * item.quantity).toFixed(2)}</p>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-lg shadow-md border border-cream-200 p-6"
                        >
                            <h2 className="text-lg font-semibold text-sage-800 mb-4">Apply Coupon</h2>
                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Enter coupon code"
                                    className="flex-1 px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleApplyCoupon}
                                    className="px-6 py-3 bg-cream-300 text-sage-700 rounded-lg hover:bg-cream-400 transition-all flex items-center space-x-2"
                                >
                                    <Tag className="w-5 h-5" />
                                    <span>Apply</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-lg shadow-md border border-cream-200 p-6 sticky top-6"
                        >
                            <h2 className="text-lg font-semibold text-sage-800 mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sage-600">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount (10%)</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sage-600">
                                    <span>Tax (6%)</span>
                                    <span>${taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-cream-200 pt-3">
                                    <div className="flex justify-between text-xl font-bold text-sage-800">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowPayment(true)}
                                disabled={cart.length === 0}
                                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                Proceed to Payment
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </main>

            {showPayment && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
                    >
                        <h3 className="text-xl font-bold text-sage-800 mb-6">Payment Method</h3>

                        <div className="space-y-3 mb-6">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                className="w-full p-4 border-2 border-cream-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all flex items-center space-x-3"
                            >
                                <CreditCard className="w-6 h-6 text-sage-600" />
                                <div className="text-left">
                                    <p className="font-semibold text-sage-800">Credit Card</p>
                                    <p className="text-sm text-sage-600">Pay with credit/debit card</p>
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                className="w-full p-4 border-2 border-cream-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all flex items-center space-x-3"
                            >
                                <Banknote className="w-6 h-6 text-sage-600" />
                                <div className="text-left">
                                    <p className="font-semibold text-sage-800">Cash</p>
                                    <p className="text-sm text-sage-600">Pay with cash</p>
                                </div>
                            </motion.button>
                        </div>

                        <div className="bg-cream-100 rounded-lg p-4 mb-6 border border-cream-200">
                            <div className="flex justify-between mb-2">
                                <span className="text-sage-600">Amount to Pay:</span>
                                <span className="text-2xl font-bold text-sage-800">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowPayment(false)}
                                className="flex-1 px-4 py-3 border border-cream-300 text-sage-700 rounded-lg hover:bg-cream-50"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCompletePayment}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700"
                            >
                                Complete Payment
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
