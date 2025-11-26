'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import PasswordInput, { validatePassword } from '@/components/ui/PasswordInput';
import type { Employee } from '@/lib/types';

interface EmployeeModalProps {
    isOpen: boolean;
    mode: 'add' | 'edit';
    employee?: Employee | null;
    onClose: () => void;
    onSubmit: (data: { name: string; username: string; password: string; position: 'Admin' | 'Cashier' }) => Promise<void>;
}

export default function EmployeeModal({ isOpen, mode, employee, onClose, onSubmit }: EmployeeModalProps) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [position, setPosition] = useState<'Admin' | 'Cashier'>('Cashier');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (mode === 'edit' && employee) {
            setName(employee.name);
            setUsername(employee.username);
            setPosition(employee.position);
            setPassword('');
        } else {
            setName('');
            setUsername('');
            setPassword('');
            setPosition('Cashier');
        }
        setError('');
    }, [isOpen, mode, employee]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Name is required');
            return;
        }

        if (mode === 'add') {
            if (!username.trim()) {
                setError('Username is required');
                return;
            }
            if (!password) {
                setError('Password is required');
                return;
            }
            const validation = validatePassword(password);
            if (!validation.isValid) {
                setError('Password does not meet requirements');
                return;
            }
        }

        if (mode === 'edit' && password) {
            const validation = validatePassword(password);
            if (!validation.isValid) {
                setError('Password does not meet requirements');
                return;
            }
        }

        setLoading(true);
        try {
            await onSubmit({ name, username, password, position });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
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
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-cream-100 rounded-lg">
                        <X className="w-5 h-5 text-sage-600" />
                    </button>

                    <h3 className="text-xl font-bold text-sage-800 mb-2">
                        {mode === 'add' ? 'Add New Employee' : 'Update Employee'}
                    </h3>
                    {mode === 'edit' && employee && (
                        <p className="text-sm text-sage-600 mb-4">Editing: @{employee.username}</p>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-sage-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50"
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        {mode === 'add' && (
                            <div>
                                <label className="block text-sm font-medium text-sage-700 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-sage-700 mb-2">
                                {mode === 'add' ? 'Password' : 'New Password (leave blank to keep current)'}
                            </label>
                            <PasswordInput
                                value={password}
                                onChange={setPassword}
                                showValidation={mode === 'add' || password.length > 0}
                                placeholder={mode === 'add' ? 'Enter password' : 'Enter new password'}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-sage-700 mb-2">Position</label>
                            <select
                                value={position}
                                onChange={(e) => setPosition(e.target.value as 'Admin' | 'Cashier')}
                                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50"
                            >
                                <option value="Cashier">Cashier</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-4 py-3 border border-cream-300 text-sage-700 rounded-lg hover:bg-cream-50 disabled:opacity-50"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-lg hover:from-sage-600 hover:to-sage-700 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : mode === 'add' ? 'Add Employee' : 'Update'}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
