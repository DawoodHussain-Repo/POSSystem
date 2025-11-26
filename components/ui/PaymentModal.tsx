'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Banknote, CreditCard, Loader2, DollarSign, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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

export default function PaymentModal({ isOpen, total, onClose, onComplete, title = 'Payment', allowCashback = false }: PaymentModalProps) {
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
        for (let i = 0; i < v.length && i < 16; i += 4) parts.push(v.substring(i, i + 4));
        return parts.join(' ');
    };

    const handleSelectMethod = (m: PaymentMethod) => { setMethod(m); setStep(m); };
    const handleCashContinue = () => { if (parseFloat(cashReceived) >= total) setStep('confirm'); };
    const handleCardContinue = () => { if (cardNumber.replace(/\s/g, '').length >= 16) setStep('confirm'); };

    const handleConfirm = async () => {
        setStep('processing');
        try {
            const cashRec = method === 'cash' ? parseFloat(cashReceived) : undefined;
            await onComplete(method, cashRec, cashbackAmount > 0 ? cashbackAmount : undefined);
            onClose();
        } catch (error) {
            console.error('Payment failed:', error);
            setStep('confirm');
        }
    };

    const reset = () => { setStep('select'); setCashReceived(''); setCardNumber(''); setCashback(''); onClose(); };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                    <Card className="max-w-md w-full shadow-2xl border-0">
                        <CardHeader className="relative pb-2">
                            <button onClick={reset} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                            <CardTitle>{title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Select Method */}
                            {step === 'select' && (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleSelectMethod('cash')}
                                            className="w-full p-4 border-2 border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                                <Banknote className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-900">Cash</p>
                                                <p className="text-sm text-slate-500">Pay with cash</p>
                                            </div>
                                        </motion.button>
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleSelectMethod('card')}
                                            className="w-full p-4 border-2 border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                                <CreditCard className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-900">Card</p>
                                                <p className="text-sm text-slate-500">{allowCashback ? 'Debit/Credit with cashback' : 'Credit/Debit card'}</p>
                                            </div>
                                        </motion.button>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">Total Amount</span>
                                            <span className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cash */}
                            {step === 'cash' && (
                                <div className="space-y-4">
                                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-emerald-700">Total Due</span>
                                            <span className="text-2xl font-bold text-emerald-900">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Cash Received</label>
                                        <Input icon={<DollarSign className="w-4 h-4" />} type="number" value={cashReceived}
                                            onChange={(e) => setCashReceived(e.target.value)} placeholder="0.00" step="0.01" autoFocus
                                            className="text-xl font-semibold" />
                                    </div>
                                    {parseFloat(cashReceived) >= total && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                            className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                                            <div className="flex justify-between items-center">
                                                <span className="text-indigo-700">Change</span>
                                                <span className="text-2xl font-bold text-indigo-900">${change.toFixed(2)}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    <div className="flex space-x-3 pt-2">
                                        <Button variant="outline" className="flex-1" onClick={() => setStep('select')}>
                                            <ArrowLeft className="w-4 h-4 mr-2" />Back
                                        </Button>
                                        <Button variant="success" className="flex-1" onClick={handleCashContinue} disabled={parseFloat(cashReceived) < total}>
                                            Continue
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Card */}
                            {step === 'card' && (
                                <div className="space-y-4">
                                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-indigo-700">Total Due</span>
                                            <span className="text-2xl font-bold text-indigo-900">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                                        <Input icon={<CreditCard className="w-4 h-4" />} value={cardNumber}
                                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                            placeholder="1234 5678 9012 3456" maxLength={19} autoFocus className="tracking-wider" />
                                    </div>
                                    {allowCashback && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Cashback (Optional, max $100)</label>
                                            <Input icon={<DollarSign className="w-4 h-4" />} type="number" value={cashback}
                                                onChange={(e) => setCashback(e.target.value)} placeholder="0.00" step="5" min="0" max="100" />
                                        </div>
                                    )}
                                    {cashbackAmount > 0 && (
                                        <div className="bg-violet-50 rounded-xl p-3 border border-violet-100">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-violet-700">Total Charge (Bill + Cashback)</span>
                                                <span className="font-bold text-violet-900">${totalWithCashback.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex space-x-3 pt-2">
                                        <Button variant="outline" className="flex-1" onClick={() => setStep('select')}>
                                            <ArrowLeft className="w-4 h-4 mr-2" />Back
                                        </Button>
                                        <Button className="flex-1" onClick={handleCardContinue} disabled={cardNumber.replace(/\s/g, '').length < 16}>
                                            Continue
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Confirm */}
                            {step === 'confirm' && (
                                <div className="space-y-4">
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                                        <div className="flex justify-between"><span className="text-slate-500">Method</span>
                                            <Badge variant={method === 'cash' ? 'success' : 'default'}>{method === 'cash' ? 'Cash' : 'Card'}</Badge>
                                        </div>
                                        <div className="flex justify-between"><span className="text-slate-500">Total</span><span className="font-bold text-slate-900">${total.toFixed(2)}</span></div>
                                        {method === 'cash' && <div className="flex justify-between text-indigo-700"><span>Change</span><span className="font-bold">${change.toFixed(2)}</span></div>}
                                        {method === 'card' && cardNumber && <div className="flex justify-between"><span className="text-slate-500">Card</span><span>**** {cardNumber.slice(-4)}</span></div>}
                                        {cashbackAmount > 0 && (
                                            <>
                                                <div className="flex justify-between text-violet-700"><span>Cashback</span><span className="font-bold">${cashbackAmount.toFixed(2)}</span></div>
                                                <div className="flex justify-between border-t border-slate-200 pt-2"><span className="text-slate-500">Card Charge</span><span className="font-bold">${totalWithCashback.toFixed(2)}</span></div>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex space-x-3">
                                        <Button variant="outline" className="flex-1" onClick={() => setStep(method)} disabled={step === 'processing'}>
                                            <ArrowLeft className="w-4 h-4 mr-2" />Back
                                        </Button>
                                        <Button variant="success" className="flex-1" onClick={handleConfirm} disabled={step === 'processing'}>
                                            <CheckCircle2 className="w-4 h-4 mr-2" />Confirm Payment
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Processing */}
                            {step === 'processing' && (
                                <div className="text-center py-8">
                                    <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Payment...</h3>
                                    <p className="text-slate-500">Please wait</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
