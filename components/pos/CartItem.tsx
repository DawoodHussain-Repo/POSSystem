'use client';

import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export interface CartItemData {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartItemProps {
    item: CartItemData;
    index: number;
    onRemove: (id: string) => void;
    priceLabel?: string;
}

export default function CartItem({ item, index, onRemove, priceLabel }: CartItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 bg-cream-50 rounded-lg border border-cream-200"
        >
            <div className="flex-1">
                <p className="font-medium text-sage-800">{item.name}</p>
                <p className="text-sm text-sage-600">
                    ID: {item.id} • ${item.price.toFixed(2)}{priceLabel || ''} × {item.quantity}
                </p>
            </div>
            <div className="flex items-center space-x-4">
                <p className="font-semibold text-sage-800">${(item.price * item.quantity).toFixed(2)}</p>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemove(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                    <Trash2 className="w-5 h-5" />
                </motion.button>
            </div>
        </motion.div>
    );
}
