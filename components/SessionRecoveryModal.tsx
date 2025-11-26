'use client';

import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';

interface SessionRecoveryModalProps {
    onRecover: () => void;
    onDiscard: () => void;
}

export default function SessionRecoveryModal({ onRecover, onDiscard }: SessionRecoveryModalProps) {
    return (
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
                <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-sage-800 mb-2">Incomplete Transaction Found</h3>
                        <p className="text-sage-600">
                            System was able to restore an unfinished transaction. Would you like to retrieve it?
                        </p>
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2 text-yellow-800">
                        <AlertCircle className="w-4 h-4" />
                        <p className="text-sm">This transaction was interrupted during the previous session.</p>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onDiscard}
                        className="flex-1 px-4 py-3 border border-cream-300 text-sage-700 rounded-lg hover:bg-cream-50 transition-all"
                    >
                        Discard
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onRecover}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-lg hover:from-sage-600 hover:to-sage-700 transition-all"
                    >
                        Continue Transaction
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}
