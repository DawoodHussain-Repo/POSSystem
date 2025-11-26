'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Aurora from '@/components/Aurora';
import { getCustomerRentals, type CustomerRental } from '@/lib/mockData';

export default function ReturnPage() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [customerVerified, setCustomerVerified] = useState(false);
    const [rentalItems, setRentalItems] = useState<CustomerRental[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const handleVerifyCustomer = () => {
        if (phoneNumber.length === 10) {
            setCustomerVerified(true);
            const rentals = getCustomerRentals(phoneNumber);
            setRentalItems(rentals);
        } else {
            alert('Please enter a valid 10-digit phone number');
        }
    };

    const handleToggleItem = (id: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const calculateLateFee = (rentalPrice: number, daysLate: number) => {
        return rentalPrice * 0.1 * daysLate;
    };

    const totalLateFees = rentalItems
        .filter(item => selectedItems.has(item.itemId))
        .reduce((sum, item) => sum + calculateLateFee(item.rentalPrice, item.daysLate), 0);

    const handleCompleteReturn = () => {
        if (selectedItems.size === 0) {
            alert('Please select at least one item to return');
            return;
        }
        alert(`Return processed! Late fees: $${totalLateFees.toFixed(2)}`);
        router.push('/cashier');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50 relative">
            <Aurora colorStops={["#E6D8C3", "#5D866C", "#C2A68C"]} blend={0.3} amplitude={0.8} speed={0.3} />

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
                        <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center">
                            <RotateCcw className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-sage-800">Process Return</h1>
                            <p className="text-sm text-sage-600">Handle rental returns</p>
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
                                        className="w-full pl-10 pr-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 disabled:bg-cream-100 bg-cream-50"
                                    />
                                </div>
                                {!customerVerified ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleVerifyCustomer}
                                        className="px-6 py-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-lg hover:from-sage-600 hover:to-sage-700 transition-all"
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
                                            setRentalItems([]);
                                            setSelectedItems(new Set());
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
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-cream-200 p-6"
                            >
                                <h2 className="text-lg font-semibold text-sage-800 mb-4">Active Rentals</h2>
                                {rentalItems.length === 0 ? (
                                    <div className="text-center py-12">
                                        <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                                        <p className="text-sage-500">No active rentals found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {rentalItems.map((item, index) => (
                                            <motion.div
                                                key={item.itemId}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => handleToggleItem(item.itemId)}
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedItems.has(item.itemId)
                                                        ? 'border-sage-500 bg-sage-50'
                                                        : 'border-cream-200 hover:border-cream-300 bg-cream-50'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedItems.has(item.itemId)}
                                                                onChange={() => handleToggleItem(item.itemId)}
                                                                className="w-5 h-5 text-sage-600 rounded focus:ring-2 focus:ring-sage-500"
                                                            />
                                                            <p className="font-medium text-sage-800">{item.itemName}</p>
                                                        </div>
                                                        <p className="text-sm text-sage-600 ml-7">ID: {item.itemId}</p>
                                                    </div>
                                                    {item.daysLate > 0 && (
                                                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg flex items-center space-x-1">
                                                            <AlertCircle className="w-3 h-3" />
                                                            <span>{item.daysLate} days late</span>
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="ml-7 grid grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-sage-500">Rental Date</p>
                                                        <p className="font-medium text-sage-800">{item.rentalDate}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sage-500">Rental Price</p>
                                                        <p className="font-medium text-sage-800">${item.rentalPrice.toFixed(2)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sage-500">Late Fee</p>
                                                        <p className={`font-medium ${item.daysLate > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                            ${calculateLateFee(item.rentalPrice, item.daysLate).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-cream-200 p-6 sticky top-6"
                        >
                            <h2 className="text-lg font-semibold text-sage-800 mb-6">Return Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="p-4 bg-sage-50 rounded-lg border border-sage-100">
                                    <p className="text-sm text-sage-700 mb-1">Customer Phone</p>
                                    <p className="font-semibold text-sage-800">{phoneNumber || 'Not verified'}</p>
                                </div>

                                <div className="p-4 bg-cream-100 rounded-lg border border-cream-200">
                                    <p className="text-sm text-sage-700 mb-1">Items to Return</p>
                                    <p className="font-semibold text-sage-800">{selectedItems.size} items</p>
                                </div>

                                {totalLateFees > 0 && (
                                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <AlertCircle className="w-4 h-4 text-red-600" />
                                            <p className="text-sm text-red-700 font-medium">Late Fees</p>
                                        </div>
                                        <p className="text-2xl font-bold text-red-900">${totalLateFees.toFixed(2)}</p>
                                        <p className="text-xs text-red-700 mt-1">10% per day late</p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-cream-200 pt-4 mb-6">
                                <div className="flex justify-between text-xl font-bold text-sage-800">
                                    <span>Total Due</span>
                                    <span>${totalLateFees.toFixed(2)}</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCompleteReturn}
                                disabled={!customerVerified || selectedItems.size === 0}
                                className="w-full py-4 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-lg font-semibold hover:from-sage-600 hover:to-sage-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                Process Return
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
