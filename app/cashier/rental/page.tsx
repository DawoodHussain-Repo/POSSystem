'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Package, Calendar, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Aurora from '@/components/Aurora';
import { findRentalProduct } from '@/lib/mockData';

interface RentalItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export default function RentalPage() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [customerVerified, setCustomerVerified] = useState(false);
    const [itemId, setItemId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState<RentalItem[]>([]);
    const [returnDate, setReturnDate] = useState('');

    const handleVerifyCustomer = () => {
        if (phoneNumber.length === 10) {
            setCustomerVerified(true);
        } else {
            alert('Please enter a valid 10-digit phone number');
        }
    };

    const handleAddItem = () => {
        const product = findRentalProduct(itemId);
        if (!product) {
            alert('Rental item not found! Try: 1000-1010 (movies, books, equipment)');
            return;
        }
        if (product.stock < quantity) {
            alert(`Insufficient stock! Available: ${product.stock}`);
            return;
        }
        const mockItem = {
            id: product.id,
            name: product.name,
            price: product.rentalPrice,
            quantity: quantity
        };
        setCart([...cart, mockItem]);
        setItemId('');
        setQuantity(1);
    };

    const handleRemoveItem = (id: string) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCompleteRental = () => {
        if (!returnDate) {
            alert('Please select a return date');
            return;
        }
        alert('Rental transaction completed!');
        router.push('/cashier');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50 relative">
            <Aurora colorStops={["#C2A68C", "#E6D8C3", "#5D866C"]} blend={0.3} amplitude={0.8} speed={0.3} />

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
                        <div className="w-12 h-12 bg-gradient-to-br from-cream-400 to-cream-500 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-sage-800">New Rental</h1>
                            <p className="text-sm text-sage-600">Process rental transaction</p>
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
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-cream-200 p-6"
                        >
                            <h2 className="text-lg font-semibold text-sage-800 mb-4">Customer Information</h2>
                            <div className="flex space-x-3">
                                <div className="flex-1 relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Enter 10-digit phone number"
                                        maxLength={10}
                                        disabled={customerVerified}
                                        className="w-full pl-10 pr-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-cream-500 disabled:bg-cream-100 bg-cream-50"
                                    />
                                </div>
                                {!customerVerified ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleVerifyCustomer}
                                        className="px-6 py-3 bg-gradient-to-r from-cream-400 to-cream-500 text-white rounded-lg hover:from-cream-500 hover:to-cream-600 transition-all"
                                    >
                                        Verify
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setCustomerVerified(false);
                                            setPhoneNumber('');
                                            setCart([]);
                                        }}
                                        className="px-6 py-3 bg-cream-200 text-sage-700 rounded-lg hover:bg-cream-300 transition-all"
                                    >
                                        Change
                                    </motion.button>
                                )}
                            </div>
                            {customerVerified && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                                >
                                    <p className="text-green-800 font-medium">✓ Customer verified</p>
                                    <p className="text-sm text-green-700 mt-1">Phone: {phoneNumber}</p>
                                </motion.div>
                            )}
                        </motion.div>

                        {customerVerified && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-cream-200 p-6"
                                >
                                    <h2 className="text-lg font-semibold text-sage-800 mb-4">Add Rental Items</h2>
                                    <div className="flex space-x-3">
                                        <input
                                            type="text"
                                            value={itemId}
                                            onChange={(e) => setItemId(e.target.value)}
                                            placeholder="Enter Item ID (1000-1010)"
                                            className="flex-1 px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-cream-500 bg-cream-50"
                                        />
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                            min="1"
                                            className="w-24 px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-cream-500 bg-cream-50"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleAddItem}
                                            className="px-6 py-3 bg-gradient-to-r from-cream-400 to-cream-500 text-white rounded-lg hover:from-cream-500 hover:to-cream-600 transition-all flex items-center space-x-2"
                                        >
                                            <Plus className="w-5 h-5" />
                                            <span>Add</span>
                                        </motion.button>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-cream-200 p-6"
                                >
                                    <h2 className="text-lg font-semibold text-sage-800 mb-4">Rental Items</h2>
                                    {cart.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Package className="w-16 h-16 text-cream-300 mx-auto mb-4" />
                                            <p className="text-sage-500">No items added</p>
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
                                    transition={{ delay: 0.3 }}
                                    className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-cream-200 p-6"
                                >
                                    <h2 className="text-lg font-semibold text-sage-800 mb-4">Return Date</h2>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
                                        <input
                                            type="date"
                                            value={returnDate}
                                            onChange={(e) => setReturnDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full pl-10 pr-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-cream-500 bg-cream-50"
                                        />
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-cream-200 p-6 sticky top-6"
                        >
                            <h2 className="text-lg font-semibold text-sage-800 mb-6">Rental Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="p-4 bg-cream-100 rounded-lg border border-cream-200">
                                    <p className="text-sm text-sage-700 mb-1">Customer Phone</p>
                                    <p className="font-semibold text-sage-800">{phoneNumber || 'Not verified'}</p>
                                </div>

                                <div className="p-4 bg-sage-50 rounded-lg border border-sage-100">
                                    <p className="text-sm text-sage-700 mb-1">Items Count</p>
                                    <p className="font-semibold text-sage-800">{cart.length} items</p>
                                </div>

                                <div className="p-4 bg-cream-100 rounded-lg border border-cream-200">
                                    <p className="text-sm text-sage-700 mb-1">Return Date</p>
                                    <p className="font-semibold text-sage-800">{returnDate || 'Not set'}</p>
                                </div>
                            </div>

                            <div className="border-t border-cream-200 pt-4 mb-6">
                                <div className="flex justify-between text-xl font-bold text-sage-800">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCompleteRental}
                                disabled={!customerVerified || cart.length === 0}
                                className="w-full py-4 bg-gradient-to-r from-cream-400 to-cream-500 text-white rounded-lg font-semibold hover:from-cream-500 hover:to-cream-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                Complete Rental
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
