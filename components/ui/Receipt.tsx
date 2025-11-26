'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Printer, Download, X } from 'lucide-react';

interface ReceiptItem {
    name: string;
    quantity: number;
    price: number;
    total: number;
}

interface ReceiptProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'sale' | 'rental' | 'return';
    items: ReceiptItem[];
    subtotal: number;
    discount?: number;
    tax?: number;
    lateFees?: number;
    total: number;
    paymentMethod: string;
    cashReceived?: number;
    change?: number;
    cashback?: number;
    transactionId?: string;
    returnDate?: string;
    employeeName?: string;
    customerPhone?: string;
}

export default function Receipt({
    isOpen,
    onClose,
    type,
    items,
    subtotal,
    discount = 0,
    tax = 0,
    lateFees = 0,
    total,
    paymentMethod,
    cashReceived,
    change,
    cashback,
    transactionId,
    returnDate,
    employeeName,
    customerPhone
}: ReceiptProps) {
    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
    };

    const getTitle = () => {
        switch (type) {
            case 'sale': return 'Sales Receipt';
            case 'rental': return 'Rental Receipt';
            case 'return': return 'Return Receipt';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-2xl max-w-md w-full relative"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-sage-500 to-sage-600 text-white p-6 rounded-t-lg">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-all">
                        <X className="w-5 h-5" />
                    </button>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <CheckCircle className="w-8 h-8" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-center">Transaction Complete!</h2>
                    <p className="text-center text-sage-100 mt-1">{getTitle()}</p>
                </div>

                {/* Receipt Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {/* Store Info */}
                    <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-cream-300">
                        <h3 className="text-xl font-bold text-sage-800">SG Technologies</h3>
                        <p className="text-sm text-sage-600">Point of Sale System</p>
                        {transactionId && <p className="text-xs text-sage-500 mt-2">Transaction ID: {transactionId}</p>}
                        <p className="text-xs text-sage-500">{new Date().toLocaleString()}</p>
                        {employeeName && <p className="text-xs text-sage-500">Cashier: {employeeName}</p>}
                        {customerPhone && <p className="text-xs text-sage-500">Customer: {customerPhone}</p>}
                    </div>

                    {/* Items */}
                    <div className="mb-6">
                        <h4 className="font-semibold text-sage-800 mb-3">Items</h4>
                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <div className="flex-1">
                                        <p className="text-sage-800">{item.name}</p>
                                        <p className="text-sage-500 text-xs">{item.quantity} × ${item.price.toFixed(2)}</p>
                                    </div>
                                    <p className="font-medium text-sage-800">${item.total.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 mb-6 pb-4 border-t border-cream-300 pt-4">
                        <div className="flex justify-between text-sm text-sage-600">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount</span>
                                <span>-${discount.toFixed(2)}</span>
                            </div>
                        )}
                        {tax > 0 && (
                            <div className="flex justify-between text-sm text-sage-600">
                                <span>Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                        )}
                        {lateFees > 0 && (
                            <div className="flex justify-between text-sm text-red-600">
                                <span>Late Fees</span>
                                <span>${lateFees.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold text-sage-800 pt-2 border-t border-cream-300">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-cream-50 rounded-lg p-4 mb-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-sage-600">Payment Method</span>
                            <span className="font-medium text-sage-800 capitalize">{paymentMethod}</span>
                        </div>
                        {cashReceived && (
                            <>
                                <div className="flex justify-between text-sm">
                                    <span className="text-sage-600">Cash Received</span>
                                    <span className="font-medium text-sage-800">${cashReceived.toFixed(2)}</span>
                                </div>
                                {change && change > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-blue-700 font-medium">Change</span>
                                        <span className="font-bold text-blue-700">${change.toFixed(2)}</span>
                                    </div>
                                )}
                            </>
                        )}
                        {cashback && cashback > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-purple-700 font-medium">Cashback Given</span>
                                <span className="font-bold text-purple-700">${cashback.toFixed(2)}</span>
                            </div>
                        )}
                        {returnDate && (
                            <div className="flex justify-between text-sm">
                                <span className="text-sage-600">Return By</span>
                                <span className="font-medium text-sage-800">{returnDate}</span>
                            </div>
                        )}
                    </div>

                    {/* Thank You Message */}
                    <div className="text-center text-sm text-sage-600 border-t-2 border-dashed border-cream-300 pt-4">
                        <p className="font-medium">Thank you for your business!</p>
                        <p className="text-xs mt-1">Please keep this receipt for your records</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-cream-50 rounded-b-lg flex space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePrint}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-cream-300 text-sage-700 rounded-lg hover:bg-cream-100 transition-all"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Print</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-lg hover:from-sage-600 hover:to-sage-700 transition-all"
                    >
                        Done
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}
