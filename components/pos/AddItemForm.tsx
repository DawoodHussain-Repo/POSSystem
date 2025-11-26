'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface AddItemFormProps {
    onAdd: (itemId: string, quantity: number) => void;
    placeholder?: string;
    buttonColor?: 'green' | 'cream';
}

export default function AddItemForm({ onAdd, placeholder = 'Enter Item ID', buttonColor = 'green' }: AddItemFormProps) {
    const [itemId, setItemId] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = () => {
        if (itemId.trim()) {
            onAdd(itemId.trim(), quantity);
            setItemId('');
            setQuantity(1);
        }
    };

    const buttonClass = buttonColor === 'green'
        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
        : 'bg-gradient-to-r from-cream-400 to-cream-500 hover:from-cream-500 hover:to-cream-600';

    return (
        <div className="flex space-x-3">
            <input
                type="text"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={placeholder}
                className="flex-1 px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50"
            />
            <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                className="w-24 px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50"
            />
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className={`px-6 py-3 text-white rounded-lg transition-all flex items-center space-x-2 shadow-lg ${buttonClass}`}
            >
                <Plus className="w-5 h-5" />
                <span>Add</span>
            </motion.button>
        </div>
    );
}
