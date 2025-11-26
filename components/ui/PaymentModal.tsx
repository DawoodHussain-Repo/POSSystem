'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Banknote, CreditCard, CheckCircle, Loader2 } from 'lucide-react';

export type PaymentStep = 'select' | 'cash' | 'card' | 'confirm' | 'processing';
export type PaymentMethod = 'cash' | 'card';

interface PaymentModalProps {
    isOpen: boolean;
    total: number;
    onClose: () => void;
    onComplete: (method: PaymentMethod, cashReceived?: number, cashback?: number) => Promise<void>;
    title?: string;
    allowCashback?: boolean;
}

export default function PaymentModal({
    isOpen,
    total,
    onClose,
    onComplete,
    title = 'Payment',
    allowCashback = false
}: PaymentModalProps) {
    const [step, setStep] = useState<PaymentStep>('select');
    const [method, setMethod] = useState<PaymentMethod>('cash');
    const [cashReceived, setCashReceived] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cashback, setCashback] = useState('');

    const cashbackAmount = allowCashback && method === 'card' ? parseFloat(cashback || '0') : 0;
    const totalWithCashback = total + cashbackAmount;
    const change = method === 'cash' ? parseFloat(cashReceived || '0') - total : 0;

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const parts = [];
        for (let i = 0; i < v.length && i < 16; i += 4) {
            parts.push(v.substring(i, i + 4));
        }
        return parts.join(' ');
    };

    const handleSelectMethod = (m: PaymentMethod) => {
        setMethod(m);
        setStep(m);
    };

    const handleCashContinue = () => {
        if (parseFloat(cashReceived) >= total) setStep('confirm');
    };

    const handleCardContinue = () => {
        if (cardNumber.replace(/\s/g, '').length >= 16) setStep('confirm');
    };

    const handleConfirm = async () => {
        setStep('processing');
        try {
            const cashRec = method === 'cash' ? parseFloat(cashReceived) : undefined;
            await onComplete(method, cashRec, cashbackAmount > 0 ? cashbackAmount : undefined);
            // Don't set success here - parent will show receipt
            onClose();
        } catch (error) {
            console.error('Payment failed:', error);
            setStep('confirm');
            alert('Payment failed. Please try again.');
        }
    };

    const reset = () => {
        setStep('select');
        setCashReceived('');
        setCardNumber('');
        setCashback('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
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
                    className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative"
                >
                    {step !== 'success' && (
                        <button onClick={reset} className="absolute top-4 right-4 p-2 hover:bg-cream-100 rounded-lg">
                            <X className="w-5 h-5 text-sage-600" />
                        </button>
                    )}

                    {/* Select Method */}
                    {step === 'select' && (
                        <>
                            <h3 className="text-xl font-bold text-sage-800 mb-6">{title}</h3>
                            <div className="space-y-3 mb-6">
                                <button onClick={() => handleSelectMethod('cash')}
                                    className="w-full p-4 border-2 border-cream-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Banknote className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-sage-800">Cash</p>
                                        <p className="text-sm text-sage-600">Pay with cash</p>
                                    </div>
                                </button>
                                <button onClick={() => handleSelectMethod('card')}
                                    className="w-full p-4 border-2 border-cream-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-sage-800">Card</p>
                                        <p className="text-sm text-sage-600">{allowCashback ? 'Debit/Credit with cashback option' : 'Credit/Debit card'}</p>
                                    </div>
                                </button>
                            </div>
                            <div className="bg-cream-100 rounded-lg p-4 border border-cream-200">
                                <div className="flex justify-between">
                                    <span className="text-sage-600">Total:</span>
                                    <span className="text-2xl font-bold text-sage-800">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Cash */}
                    {step === 'cash' && (
                        <>
                            <h3 className="text-xl font-bold text-sage-800 mb-2">Cash Payment</h3>
                            <p className="text-sage-600 mb-4">Enter amount received</p>
                            <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                                <div className="flex justify-between">
                                    <span>Total:</span>
                                    <span className="text-xl font-bold">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-sage-700 mb-2">Cash Received</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-500">$</span>
                                    <input type="number" value={cashReceived} onChange={(e) => setCashReceived(e.target.value)}
                                        placeholder="0.00" step="0.01" autoFocus
                                        className="w-full pl-8 pr-4 py-4 text-2xl border border-cream-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-cream-50" />
                                </div>
                            </div>
                            {parseFloat(cashReceived) >= total && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Change:</span>
                                        <span className="text-xl font-bold text-blue-700">${change.toFixed(2)}</span>
                                    </div>
                                </motion.div>
                            )}
                            <div className="flex space-x-3">
                                <button onClick={() => setStep('select')} className="flex-1 px-4 py-3 border border-cream-300 text-sage-700 rounded-lg hover:bg-cream-50">Back</button>
                                <button onClick={handleCashContinue} disabled={parseFloat(cashReceived) < total}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg disabled:opacity-50">Continue</button>
                            </div>
                        </>
                    )}

                    {/* Card */}
                    {step === 'card' && (
                        <>
                            <h3 className="text-xl font-bold text-sage-800 mb-2">Card Payment</h3>
                            <p className="text-sage-600 mb-4">Enter card details</p>
                            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                                <div className="flex justify-between">
                                    <span>Total:</span>
                                    <span className="text-xl font-bold">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-sage-700 mb-2">Card Number</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400 w-5 h-5" />
                                    <input type="text" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        placeholder="1234 5678 9012 3456" maxLength={19} autoFocus
                                        className="w-full pl-12 pr-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-cream-50 tracking-wider" />
                                </div>
                            </div>
                            {allowCashback && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-sage-700 mb-2">Cashback Amount (Optional)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-500">$</span>
                                        <input type="number" value={cashback} onChange={(e) => setCashback(e.target.value)}
                                            placeholder="0.00" step="5" min="0" max="100"
                                            className="w-full pl-8 pr-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-cream-50" />
                                    </div>
                                    <p className="text-xs text-sage-500 mt-1">Max $100 cashback</p>
                                </div>
                            )}
                            {cashbackAmount > 0 && (
                                <div className="bg-purple-50 rounded-lg p-3 mb-4 border border-purple-200">
                                    <div className="flex justify-between text-sm">
                                        <span>Bill + Cashback:</span>
                                        <span className="font-bold">${totalWithCashback.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                            <div className="flex space-x-3">
                                <button onClick={() => setStep('select')} className="flex-1 px-4 py-3 border border-cream-300 text-sage-700 rounded-lg hover:bg-cream-50">Back</button>
                                <button onClick={handleCardContinue} disabled={cardNumber.replace(/\s/g, '').length < 16}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg disabled:opacity-50">Continue</button>
                            </div>
                        </>
                    )}

                    {/* Confirm */}
                    {step === 'confirm' && (
                        <>
                            <h3 className="text-xl font-bold text-sage-800 mb-4">Confirm Payment</h3>
                            <div className="bg-cream-50 rounded-lg p-4 mb-4 border border-cream-200 space-y-2">
                                <div className="flex justify-between"><span>Method:</span><span className="font-medium">{method === 'cash' ? 'Cash' : 'Card'}</span></div>
                                <div className="flex justify-between"><span>Total:</span><span className="font-bold">${total.toFixed(2)}</span></div>
                                {method === 'cash' && <div className="flex justify-between text-blue-700"><span>Change:</span><span className="font-bold">${change.toFixed(2)}</span></div>}
                                {method === 'card' && cardNumber && <div className="flex justify-between"><span>Card:</span><span>**** {cardNumber.slice(-4)}</span></div>}
                                {cashbackAmount > 0 && (
                                    <>
                                        <div className="flex justify-between text-purple-700"><span>Cashback:</span><span className="font-bold">${cashbackAmount.toFixed(2)}</span></div>
                                        <div className="flex justify-between border-t pt-2"><span>Card Charge:</span><span className="font-bold">${totalWithCashback.toFixed(2)}</span></div>
                                    </>
                                )}
                            </div>
                            <div className="flex space-x-3">
                                <button onClick={() => setStep(method)} disabled={step === 'processing'} className="flex-1 px-4 py-3 border border-cream-300 text-sage-700 rounded-lg disabled:opacity-50">Back</button>
                                <button onClick={handleConfirm} disabled={step === 'processing'}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center">
                                    {step === 'processing' ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Processing...</> : 'Confirm'}
                                </button>
                            </div>
                        </>
                    )}


                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
