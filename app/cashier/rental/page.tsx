'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Aurora from '@/components/Aurora';
import Notification from '@/components/ui/Notification';
import PaymentModal from '@/components/ui/PaymentModal';
import Receipt from '@/components/ui/Receipt';
import AddItemForm from '@/components/pos/AddItemForm';
import CartItem, { CartItemData } from '@/components/pos/CartItem';
import CustomerVerification from '@/components/pos/CustomerVerification';
import { findRentalProduct } from '@/lib/mockData';
import { createRentalTransaction } from '@/lib/api/transactions';
import { getOrCreateCustomer } from '@/lib/api/customers';

export default function RentalPage() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [verified, setVerified] = useState(false);
    const [cart, setCart] = useState<CartItemData[]>([]);
    const [returnDate, setReturnDate] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);
    const [notification, setNotification] = useState({ type: 'success' as 'success' | 'error' | 'warning', message: '', visible: false });

    const showNotify = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message, visible: true });
        setTimeout(() => setNotification(n => ({ ...n, visible: false })), 3000);
    };

    const handleVerify = async (phoneNum: string): Promise<boolean> => {
        try {
            const customer = await getOrCreateCustomer(phoneNum);
            setCustomerId(customer.id);
            setPhone(phoneNum);
            setVerified(true);
            showNotify('success', 'Customer verified');
            return true;
        } catch {
            showNotify('error', 'Failed to verify customer');
            return false;
        }
    };

    const handleReset = () => {
        setVerified(false);
        setCustomerId(null);
        setPhone('');
        setCart([]);
    };

    const handleAddItem = (itemId: string, quantity: number) => {
        const product = findRentalProduct(itemId);
        if (!product) { showNotify('error', 'Item not found! Try: 1000-1010'); return; }
        if (product.stock < quantity) { showNotify('error', `Insufficient stock! Available: ${product.stock}`); return; }

        const existing = cart.findIndex(item => item.id === product.id);
        if (existing >= 0) {
            const updated = [...cart];
            updated[existing].quantity += quantity;
            setCart(updated);
        } else {
            setCart([...cart, { id: product.id, name: product.name, price: product.rentalPrice, quantity }]);
        }
        showNotify('success', `Added ${product.name}`);
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
            const employeeId = employee.id || '1';

            const transaction = await createRentalTransaction(customerId, employeeId, cart, total, returnDate);

            setReceiptData({
                transactionId: transaction.id,
                items: cart.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.price * item.quantity
                })),
                subtotal: total,
                total,
                paymentMethod: method,
                cashReceived,
                change: cashReceived ? cashReceived - total : undefined,
                cashback,
                returnDate,
                employeeName: employee.name,
                customerPhone: phone
            });

            setShowReceipt(true);
            showNotify('success', 'Rental completed successfully!');
        } catch (error) {
            console.error('Rental failed:', error);
            throw error;
        }
    };

    const handleReceiptClose = () => {
        setShowReceipt(false);
        router.push('/cashier');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50 relative">
            <Aurora colorStops={["#C2A68C", "#E6D8C3", "#5D866C"]} blend={0.3} amplitude={0.8} speed={0.3} />
            <Notification type={notification.type} message={notification.message} isVisible={notification.visible} />

            <header className="bg-white/90 backdrop-blur-sm border-b border-cream-200 shadow-sm relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-4">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => router.push('/cashier')}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-cream-100">
                        <ArrowLeft className="w-5 h-5 text-sage-600" />
                    </motion.button>
                    <div className="w-12 h-12 bg-gradient-to-br from-cream-400 to-cream-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-sage-800">New Rental</h1>
                        <p className="text-sm text-sage-600">Process rental transaction</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6">
                            <h2 className="text-lg font-semibold text-sage-800 mb-4">Customer</h2>
                            <CustomerVerification onVerify={handleVerify} onReset={handleReset} verified={verified} phone={phone} />
                        </motion.div>

                        {verified && (
                            <>
                                {/* Add Items */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                    className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6">
                                    <h2 className="text-lg font-semibold text-sage-800 mb-4">Add Items</h2>
                                    <AddItemForm onAdd={handleAddItem} placeholder="Enter Item ID (1000-1010)" buttonColor="cream" />
                                </motion.div>

                                {/* Cart */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                    className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6">
                                    <h2 className="text-lg font-semibold text-sage-800 mb-4">Items ({cart.length})</h2>
                                    {cart.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Package className="w-16 h-16 text-cream-300 mx-auto mb-4" />
                                            <p className="text-sage-500">No items added</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <AnimatePresence>
                                                {cart.map((item, i) => (
                                                    <CartItem key={item.id} item={item} index={i} priceLabel="/day"
                                                        onRemove={(id) => setCart(cart.filter(c => c.id !== id))} />
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Return Date */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                    className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6">
                                    <h2 className="text-lg font-semibold text-sage-800 mb-4">Return Date</h2>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                                        <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full pl-10 pr-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-cream-500 bg-cream-50" />
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6 sticky top-6">
                            <h2 className="text-lg font-semibold text-sage-800 mb-6">Summary</h2>
                            <div className="space-y-4 mb-6">
                                <div className="p-4 bg-cream-100 rounded-lg border border-cream-200">
                                    <p className="text-sm text-sage-700">Customer</p>
                                    <p className="font-semibold text-sage-800">{phone || 'Not verified'}</p>
                                </div>
                                <div className="p-4 bg-sage-50 rounded-lg border border-sage-100">
                                    <p className="text-sm text-sage-700">Items</p>
                                    <p className="font-semibold text-sage-800">{cart.length}</p>
                                </div>
                                <div className="p-4 bg-cream-100 rounded-lg border border-cream-200">
                                    <p className="text-sm text-sage-700">Return Date</p>
                                    <p className="font-semibold text-sage-800">{returnDate || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="border-t border-cream-200 pt-4 mb-6">
                                <div className="flex justify-between text-xl font-bold text-sage-800"><span>Total</span><span>${total.toFixed(2)}</span></div>
                            </div>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleProceed}
                                disabled={!verified || cart.length === 0}
                                className="w-full py-4 bg-gradient-to-r from-cream-400 to-cream-500 text-white rounded-lg font-semibold disabled:opacity-50 shadow-lg">
                                Proceed to Payment
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </main>

            <PaymentModal isOpen={showPayment} total={total} onClose={() => setShowPayment(false)}
                onComplete={handlePayment} title="Rental Payment" allowCashback={true} />

            {receiptData && (
                <Receipt
                    isOpen={showReceipt}
                    onClose={handleReceiptClose}
                    type="rental"
                    items={receiptData.items}
                    subtotal={receiptData.subtotal}
                    total={receiptData.total}
                    paymentMethod={receiptData.paymentMethod}
                    cashReceived={receiptData.cashReceived}
                    change={receiptData.change}
                    cashback={receiptData.cashback}
                    returnDate={receiptData.returnDate}
                    transactionId={receiptData.transactionId}
                    employeeName={receiptData.employeeName}
                    customerPhone={receiptData.customerPhone}
                />
            )}
        </div>
    );
}
