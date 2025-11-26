'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Shield, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

        if (!name.trim()) { setError('Name is required'); return; }
        if (mode === 'add') {
            if (!username.trim()) { setError('Username is required'); return; }
            if (!password) { setError('Password is required'); return; }
            const validation = validatePassword(password);
            if (!validation.isValid) { setError('Password does not meet requirements'); return; }
        }
        if (mode === 'edit' && password) {
            const validation = validatePassword(password);
            if (!validation.isValid) { setError('Password does not meet requirements'); return; }
        }

        setLoading(true);
        try {
            await onSubmit({ name, username, password, position });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Operation failed');
        } finally { setLoading(false); }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                    <Card className="max-w-md w-full shadow-2xl border-0">
                        <CardHeader className="relative pb-2">
                            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                            <CardTitle className="text-xl">
                                {mode === 'add' ? 'Add New Employee' : 'Update Employee'}
                            </CardTitle>
                            {mode === 'edit' && employee && (
                                <p className="text-sm text-slate-500">Editing: @{employee.username}</p>
                            )}
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                    <Input icon={<User className="w-4 h-4" />} value={name} onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter full name" required />
                                </div>

                                {mode === 'add' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                                        <Input value={username} onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Enter username" required />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {mode === 'add' ? 'Password' : 'New Password (leave blank to keep current)'}
                                    </label>
                                    <PasswordInput value={password} onChange={setPassword}
                                        showValidation={mode === 'add' || password.length > 0}
                                        placeholder={mode === 'add' ? 'Enter password' : 'Enter new password'} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Position</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            onClick={() => setPosition('Cashier')}
                                            className={`p-3 rounded-xl border-2 transition-all flex items-center space-x-2 ${position === 'Cashier' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}>
                                            <ShoppingCart className={`w-5 h-5 ${position === 'Cashier' ? 'text-emerald-600' : 'text-slate-400'}`} />
                                            <span className={position === 'Cashier' ? 'text-emerald-700 font-medium' : 'text-slate-600'}>Cashier</span>
                                        </motion.button>
                                        <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            onClick={() => setPosition('Admin')}
                                            className={`p-3 rounded-xl border-2 transition-all flex items-center space-x-2 ${position === 'Admin' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}>
                                            <Shield className={`w-5 h-5 ${position === 'Admin' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                            <span className={position === 'Admin' ? 'text-indigo-700 font-medium' : 'text-slate-600'}>Admin</span>
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1" disabled={loading}>
                                        {loading ? 'Saving...' : mode === 'add' ? 'Add Employee' : 'Update'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
