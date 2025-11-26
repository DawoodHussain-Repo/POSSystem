'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
    type: 'success' | 'error' | 'warning';
    message: string;
    isVisible: boolean;
}

export default function Notification({ type, message, isVisible }: NotificationProps) {
    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500'
    }[type];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${bgColor}`}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
