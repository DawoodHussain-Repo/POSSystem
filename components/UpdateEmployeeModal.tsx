'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface UpdateEmployeeModalProps {
    onClose: () => void;
    onUpdate: (data: { username: string; name: string; password: string; position: string }) => void;
}

export default function UpdateEmployeeModal({ onClose, onUpdate }: UpdateEmployeeModalProps) {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [position, setPosition] = useState('Cashier');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !name || !password) {
            alert('Please fill all fields');
            return;
        }
        onUpdate({ username, name, password, position });
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-cream-100 rounded-lg transition-all"
                >
                    <X className="w-5 h-5 text-sage-600" />
                </button>

                <h3 className="text-xl font-bold text-sage-800 mb-6">Update Employee</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-sage-700 mb-2">Username (ID)</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter employee username/ID"
                            className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-sage-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter new name"
                            className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-sage-700 mb-2">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-sage-700 mb-2">Position</label>
                        <select
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50"
                        >
                            <option>Cashier</option>
                            <option>Admin</option>
                        </select>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-cream-300 text-sage-700 rounded-lg hover:bg-cream-50"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-lg hover:from-sage-600 hover:to-sage-700"
                        >
                            Update Employee
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
