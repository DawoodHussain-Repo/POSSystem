'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

interface CustomerVerificationProps {
    onVerify: (phone: string) => Promise<boolean>;
    onReset: () => void;
    verified: boolean;
    phone: string;
}

export default function CustomerVerification({ onVerify, onReset, verified, phone }: CustomerVerificationProps) {
    const [phoneInput, setPhoneInput] = useState(phone);
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (phoneInput.length !== 11) return;
        setLoading(true);
        const success = await onVerify(phoneInput);
        setLoading(false);
        if (!success) setPhoneInput('');
    };

    const handleReset = () => {
        setPhoneInput('');
        onReset();
    };

    return (
        <div>
            <div className="flex space-x-3">
                <div className="flex-1 relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
                    <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 11-digit phone number"
                        maxLength={11}
                        disabled={verified}
                        className="w-full pl-10 pr-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-cream-500 disabled:bg-cream-100 bg-cream-50"
                    />
                </div>
                {!verified ? (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleVerify}
                        disabled={phoneInput.length !== 11 || loading}
                        className="px-6 py-3 bg-gradient-to-r from-cream-400 to-cream-500 text-white rounded-lg hover:from-cream-500 hover:to-cream-600 transition-all shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </motion.button>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleReset}
                        className="px-6 py-3 bg-cream-200 text-sage-700 rounded-lg hover:bg-cream-300 transition-all"
                    >
                        Change
                    </motion.button>
                )}
            </div>
            {verified && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                    <p className="text-green-800 font-medium">✓ Customer verified</p>
                    <p className="text-sm text-green-700 mt-1">Phone: {phone}</p>
                </motion.div>
            )}
        </div>
    );
}
