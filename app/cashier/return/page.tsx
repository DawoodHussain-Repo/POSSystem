'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Phone, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Aurora from '@/components/Aurora';
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

export default function ReturnPage() {
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
        if (phone.length !== 11) {
            showNotify('error', 'Enter valid 11-digit phone');
            return;
        }

        setLoading(true);
        try {
            // Get or create customer
            const customer = await getOrCreateCustomer(phone);
            setCustomerId(customer.id);

            // Fetch active rentals
            const activeRentals = await getActiveRentals(customer.id);

            // Transform data to match our interface
            const rentalItems: RentalItem[] = [];
            for (const rental of activeRentals) {
                if (rental.rental_transaction_items) {
                    for (const item of rental.rental_transaction_items) {
                        const returnDate = new Date(rental.return_date);
                        const today = new Date();
                        const daysLate = Math.max(0, Math.floor((today.getTime() - returnDate.getTime()) / (1000 * 60 * 60 * 24)));

                        rentalItems.push({
                            id: item.id,
                            itemId: item.product_id,
                            itemName: item.rental_products?.name || 'Unknown Item',
                            rentalPrice: Number(item.rental_price),
                            rentalDate: new Date(rental.created_at).toLocaleDateString(),
                            returnDate: returnDate.toLocaleDateString(),
                            daysLate,
                            rentalId: rental.id
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
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setVerified(false);
        setCustomerId(null);
        setPhone('');
        setRentals([]);
        setSelected(new Set());
    };

    const toggleItem = (id: string) => {
        const newSet = new Set(selected);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        setSelected(newSet);
    };

    const calcLateFee = (price: number, days: number) => price * 0.1 * days;
    const totalFees = rentals.filter(r => selected.has(r.itemId)).reduce((s, r) => s + calcLateFee(r.rentalPrice, r.daysLate), 0);

    const handleProceed = () => {
        if (selected.size === 0) {
            showNotify('error', 'Select items to return');
            return;
        }
        // Always show payment modal for both types
        setShowPayment(true);
    };

    const handlePayment = async (method: string, cashReceived?: number, cashback?: number) => {
        if (!customerId) return;

        setProcessingPayment(true);
        try {
            const employee = JSON.parse(sessionStorage.getItem('employee') || '{}');
            const employeeId = employee.id || '1';
            const returnedItems = rentals.filter(r => selected.has(r.itemId));

            if (returnType === 'rental') {
                // Get unique rental IDs from selected items
                const rentalIds = [...new Set(returnedItems.map(item => item.rentalId))];

                // Process each rental transaction
                for (const rentalId of rentalIds) {
                    const itemsForRental = returnedItems.filter(item => item.rentalId === rentalId);

                    // Prepare items for return transaction
                    const returnItems = itemsForRental.map(item => ({
                        rentalItemId: item.id,
                        productId: item.itemId,
                        quantity: 1,
                        daysLate: item.daysLate,
                        lateFee: calcLateFee(item.rentalPrice, item.daysLate)
                    }));

                    const rentalLateFees = returnItems.reduce((sum, item) => sum + item.lateFee, 0);

                    // Create return transaction in database
                    await createReturnTransaction(
                        rentalId,
                        customerId,
                        employeeId,
                        returnItems,
                        rentalLateFees
                    );
                }

                setReceiptData({
                    items: returnedItems.map(item => ({
                        name: item.itemName,
                        quantity: 1,
                        price: item.rentalPrice,
                        total: calcLateFee(item.rentalPrice, item.daysLate)
                    })),
                    subtotal: 0,
                    lateFees: totalFees,
                    total: totalFees,
                    paymentMethod: method,
                    cashReceived,
                    change: cashReceived ? cashReceived - totalFees : undefined,
                    employeeName: employee.name,
                    customerPhone: phone,
                    returnType: 'Rental Return'
                });
            } else {
                // Unsatisfied item return - full refund
                // Get unique rental IDs
                const rentalIds = [...new Set(returnedItems.map(item => item.rentalId))];

                // Process each rental transaction (mark as returned and restore stock)
                for (const rentalId of rentalIds) {
                    const itemsForRental = returnedItems.filter(item => item.rentalId === rentalId);

                    const returnItems = itemsForRental.map(item => ({
                        rentalItemId: item.id,
                        productId: item.itemId,
                        quantity: 1,
                        daysLate: 0,
                        lateFee: 0
                    }));

                    // Create return transaction with 0 late fees (refund scenario)
                    await createReturnTransaction(
                        rentalId,
                        customerId,
                        employeeId,
                        returnItems,
                        0
                    );
                }

                const refundAmount = returnedItems.reduce((sum, item) => sum + item.rentalPrice, 0);

                setReceiptData({
                    items: returnedItems.map(item => ({
                        name: item.itemName,
                        quantity: 1,
                        price: item.rentalPrice,
                        total: item.rentalPrice
                    })),
                    subtotal: refundAmount,
                    total: -refundAmount, // Negative for refund
                    paymentMethod: method,
                    employeeName: employee.name,
                    customerPhone: phone,
                    returnType: 'Unsatisfied Item Return (Refund)'
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

    const handleReceiptClose = () => {
        setShowReceipt(false);
        router.push('/cashier');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50 relative">
            <Aurora colorStops={["#E6D8C3", "#5D866C", "#C2A68C"]} blend={0.3} amplitude={0.8} speed={0.3} />
            <Notification type={notification.type} message={notification.message} isVisible={notification.visible} />

            <header className="bg-white/90 backdrop-blur-sm border-b border-cream-200 shadow-sm relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-4">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => router.push('/cashier')}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-cream-100">
                        <ArrowLeft className="w-5 h-5 text-sage-600" />
                    </motion.button>
                    <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center shadow-lg">
                        <RotateCcw className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-sage-800">Process Return</h1>
                        <p className="text-sm text-sage-600">Handle rental returns</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Return Type Selector */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6">
                            <h2 className="text-lg font-semibold text-sage-800 mb-4">Return Type</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setReturnType('rental')}
                                    className={`p-4 rounded-lg border-2 transition-all ${returnType === 'rental'
                                        ? 'border-sage-500 bg-sage-50'
                                        : 'border-cream-300 bg-white hover:border-sage-300'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${returnType === 'rental' ? 'bg-sage-100' : 'bg-cream-100'
                                            }`}>
                                            <RotateCcw className={`w-5 h-5 ${returnType === 'rental' ? 'text-sage-600' : 'text-sage-400'}`} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-sage-800">Rental Return</p>
                                            <p className="text-xs text-sage-600">Return rented items</p>
                                        </div>
                                    </div>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setReturnType('unsatisfied')}
                                    className={`p-4 rounded-lg border-2 transition-all ${returnType === 'unsatisfied'
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-cream-300 bg-white hover:border-red-300'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${returnType === 'unsatisfied' ? 'bg-red-100' : 'bg-cream-100'
                                            }`}>
                                            <AlertCircle className={`w-5 h-5 ${returnType === 'unsatisfied' ? 'text-red-600' : 'text-sage-400'}`} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-sage-800">Unsatisfied Item</p>
                                            <p className="text-xs text-sage-600">Refund for defective item</p>
                                        </div>
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Customer */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6">
                            <h2 className="text-lg font-semibold text-sage-800 mb-4">Customer</h2>
                            <div className="flex space-x-3">
                                <div className="flex-1 relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        placeholder="Enter 11-digit phone" maxLength={11} disabled={verified}
                                        className="w-full pl-10 pr-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 disabled:bg-cream-100 bg-cream-50" />
                                </div>
                                {!verified ? (
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleVerify}
                                        disabled={loading || phone.length !== 11}
                                        className="px-6 py-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-lg shadow-lg disabled:opacity-50 flex items-center">
                                        {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Verifying...</> : 'Verify'}
                                    </motion.button>
                                ) : (
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleReset}
                                        className="px-6 py-3 bg-cream-200 text-sage-700 rounded-lg">Change</motion.button>
                                )}
                            </div>
                            {verified && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-800 font-medium">✓ Customer verified</p>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Rentals */}
                        {verified && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6">
                                <h2 className="text-lg font-semibold text-sage-800 mb-4">Active Rentals</h2>
                                {rentals.length === 0 ? (
                                    <div className="text-center py-12">
                                        <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                                        <p className="text-sage-500">No active rentals</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <AnimatePresence>
                                            {rentals.map((item, i) => (
                                                <motion.div key={item.itemId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }} onClick={() => toggleItem(item.itemId)}
                                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selected.has(item.itemId) ? 'border-sage-500 bg-sage-50' : 'border-cream-200 bg-cream-50 hover:border-cream-300'}`}>
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center space-x-2">
                                                            <input type="checkbox" checked={selected.has(item.itemId)} onChange={() => toggleItem(item.itemId)}
                                                                className="w-5 h-5 text-sage-600 rounded" />
                                                            <span className="font-medium text-sage-800">{item.itemName}</span>
                                                        </div>
                                                        {item.daysLate > 0 && (
                                                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-lg flex items-center">
                                                                <AlertCircle className="w-3 h-3 mr-1" />{item.daysLate} days late
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="ml-7 grid grid-cols-3 gap-4 text-sm">
                                                        <div><p className="text-sage-500">Rental Date</p><p className="font-medium">{item.rentalDate}</p></div>
                                                        <div><p className="text-sage-500">Price</p><p className="font-medium">${item.rentalPrice.toFixed(2)}</p></div>
                                                        <div><p className="text-sage-500">Late Fee</p>
                                                            <p className={`font-medium ${item.daysLate > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                                ${calcLateFee(item.rentalPrice, item.daysLate).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6 sticky top-6">
                            <h2 className="text-lg font-semibold text-sage-800 mb-6">Summary</h2>
                            <div className="space-y-4 mb-6">
                                <div className={`p-4 rounded-lg border ${returnType === 'rental' ? 'bg-sage-50 border-sage-100' : 'bg-red-50 border-red-100'
                                    }`}>
                                    <p className="text-sm text-sage-700">Return Type</p>
                                    <p className="font-semibold text-sage-800">
                                        {returnType === 'rental' ? 'Rental Return' : 'Unsatisfied Item'}
                                    </p>
                                </div>
                                <div className="p-4 bg-cream-100 rounded-lg border border-cream-200">
                                    <p className="text-sm text-sage-700">Customer</p>
                                    <p className="font-semibold text-sage-800">{phone || 'Not verified'}</p>
                                </div>
                                <div className="p-4 bg-sage-50 rounded-lg border border-sage-100">
                                    <p className="text-sm text-sage-700">Items to Return</p>
                                    <p className="font-semibold text-sage-800">{selected.size}</p>
                                </div>
                                {returnType === 'rental' && totalFees > 0 && (
                                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <AlertCircle className="w-4 h-4 text-red-600" />
                                            <p className="text-sm text-red-700 font-medium">Late Fees</p>
                                        </div>
                                        <p className="text-2xl font-bold text-red-900">${totalFees.toFixed(2)}</p>
                                    </div>
                                )}
                                {returnType === 'unsatisfied' && selected.size > 0 && (
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <p className="text-sm text-green-700 font-medium">Refund Amount</p>
                                        </div>
                                        <p className="text-2xl font-bold text-green-900">
                                            ${rentals.filter(r => selected.has(r.itemId)).reduce((s, r) => s + r.rentalPrice, 0).toFixed(2)}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-cream-200 pt-4 mb-6">
                                <div className="flex justify-between text-xl font-bold text-sage-800">
                                    <span>{returnType === 'rental' ? 'Total Due' : 'Refund Amount'}</span>
                                    <span className={returnType === 'unsatisfied' ? 'text-green-700' : ''}>
                                        {returnType === 'rental' ? `$${totalFees.toFixed(2)}` :
                                            `$${rentals.filter(r => selected.has(r.itemId)).reduce((s, r) => s + r.rentalPrice, 0).toFixed(2)}`}
                                    </span>
                                </div>
                            </div>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleProceed}
                                disabled={!verified || selected.size === 0}
                                className={`w-full py-4 rounded-lg font-semibold disabled:opacity-50 shadow-lg ${returnType === 'rental'
                                    ? 'bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                                    }`}>
                                {returnType === 'rental'
                                    ? (totalFees > 0 ? 'Proceed to Payment' : 'Process Return')
                                    : 'Process Refund'}
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </main>

            <PaymentModal
                isOpen={showPayment}
                total={returnType === 'rental' ? totalFees : 0}
                onClose={() => setShowPayment(false)}
                onComplete={handlePayment}
                title={returnType === 'rental' ? 'Pay Late Fees' : 'Process Refund'}
                allowCashback={false}
            />

            {/* Processing Loader */}
            <AnimatePresence>
                {processingPayment && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4"
                        >
                            <div className="text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 border-4 border-sage-200 border-t-sage-600 rounded-full mx-auto mb-4"
                                />
                                <h3 className="text-xl font-bold text-sage-800 mb-2">Processing Return...</h3>
                                <p className="text-sage-600">Please wait while we process your transaction</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {receiptData && (
                <Receipt
                    isOpen={showReceipt}
                    onClose={handleReceiptClose}
                    type="return"
                    items={receiptData.items}
                    subtotal={receiptData.subtotal}
                    lateFees={receiptData.lateFees}
                    total={receiptData.total}
                    paymentMethod={receiptData.paymentMethod}
                    cashReceived={receiptData.cashReceived}
                    change={receiptData.change}
                    employeeName={receiptData.employeeName}
                    customerPhone={receiptData.customerPhone}
                />
            )}
        </div>
    );
}
