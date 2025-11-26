'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Printer, X, ShoppingBag, Package, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    isOpen, onClose, type, items, subtotal, discount = 0, tax = 0, lateFees = 0, total,
    paymentMethod, cashReceived, change, cashback, transactionId, returnDate, employeeName, customerPhone
}: ReceiptProps) {
    if (!isOpen) return null;

    const handlePrint = () => window.print();

    const getConfig = () => {
        switch (type) {
            case 'sale': return { title: 'Sales Receipt', icon: ShoppingBag, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30' };
            case 'rental': return { title: 'Rental Receipt', icon: Package, gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/30' };
            case 'return': return { title: 'Return Receipt', icon: RotateCcw, gradient: 'from-indigo-500 to-violet-600', shadow: 'shadow-indigo-500/30' };
        }
    };

    const config = getConfig();
    const Icon = config.icon;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                <Card className="max-w-md w-full shadow-2xl border-0 overflow-hidden">
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${config.gradient} text-white p-6 relative`}>
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-all">
                            <X className="w-5 h-5" />
                        </button>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-center">Transaction Complete!</h2>
                        <p className="text-center text-white/80 mt-1">{config.title}</p>
                    </div>

                    {/* Receipt Content */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        {/* Store Info */}
                        <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900">SG Technologies</h3>
                            <p className="text-sm text-slate-500">Point of Sale System</p>
                            {transactionId && <p className="text-xs text-slate-400 mt-2 font-mono">ID: {transactionId.slice(0, 8)}...</p>}
                            <p className="text-xs text-slate-400">{new Date().toLocaleString()}</p>
                            {employeeName && <p className="text-xs text-slate-400">Cashier: {employeeName}</p>}
                            {customerPhone && <p className="text-xs text-slate-400">Customer: {customerPhone}</p>}
                        </div>

                        {/* Items */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                                <Icon className="w-4 h-4 mr-2" />Items
                            </h4>
                            <div className="space-y-2">
                                {items.map((item, index) => (
                                    <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }} className="flex justify-between text-sm bg-slate-50 p-3 rounded-lg">
                                        <div className="flex-1">
                                            <p className="text-slate-900 font-medium">{item.name}</p>
                                            <p className="text-slate-500 text-xs">{item.quantity} × ${item.price.toFixed(2)}</p>
                                        </div>
                                        <p className="font-semibold text-slate-900">${item.total.toFixed(2)}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="space-y-2 mb-6 pb-4 border-t border-slate-200 pt-4">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-sm text-emerald-600">
                                    <span>Discount</span><span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            {tax > 0 && (
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Tax (6%)</span><span>${tax.toFixed(2)}</span>
                                </div>
                            )}
                            {lateFees > 0 && (
                                <div className="flex justify-between text-sm text-rose-600">
                                    <span>Late Fees</span><span>${lateFees.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                                <span>Total</span>
                                <span className={total < 0 ? 'text-emerald-600' : ''}>${Math.abs(total).toFixed(2)}{total < 0 && ' (Refund)'}</span>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-2">
                            <div className="flex justify-between text-sm items-center">
                                <span className="text-slate-500">Payment Method</span>
                                <Badge variant={paymentMethod === 'cash' ? 'success' : 'default'} className="capitalize">{paymentMethod}</Badge>
                            </div>
                            {cashReceived && (
                                <>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Cash Received</span>
                                        <span className="font-medium text-slate-900">${cashReceived.toFixed(2)}</span>
                                    </div>
                                    {change && change > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-indigo-600 font-medium">Change</span>
                                            <span className="font-bold text-indigo-600">${change.toFixed(2)}</span>
                                        </div>
                                    )}
                                </>
                            )}
                            {cashback && cashback > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-violet-600 font-medium">Cashback Given</span>
                                    <span className="font-bold text-violet-600">${cashback.toFixed(2)}</span>
                                </div>
                            )}
                            {returnDate && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Return By</span>
                                    <span className="font-medium text-slate-900">{returnDate}</span>
                                </div>
                            )}
                        </div>

                        {/* Thank You */}
                        <div className="text-center text-sm text-slate-500 border-t-2 border-dashed border-slate-200 pt-4">
                            <p className="font-medium text-slate-700">Thank you for your business!</p>
                            <p className="text-xs mt-1">Please keep this receipt for your records</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 bg-slate-50 flex space-x-3">
                        <Button variant="outline" className="flex-1" onClick={handlePrint}>
                            <Printer className="w-4 h-4 mr-2" />Print
                        </Button>
                        <Button className={`flex-1 bg-gradient-to-r ${config.gradient}`} onClick={onClose}>
                            Done
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}
