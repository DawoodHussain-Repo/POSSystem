'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, Edit, Trash2, LogOut, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import UpdateEmployeeModal from '@/components/UpdateEmployeeModal';

interface Employee {
    id: string;
    username: string;
    name: string;
    position: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [employees, setEmployees] = useState<Employee[]>([
        { id: '110001', username: '110001', name: 'Harry Larry', position: 'Admin' },
        { id: '110002', username: '110002', name: 'Debra Cooper', position: 'Cashier' },
    ]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const handleLogout = () => router.push('/');
    const handleSwitchToCashier = () => router.push('/cashier');
    const handleDeleteEmployee = (id: string) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            setEmployees(employees.filter(emp => emp.id !== id));
        }
    };

    const handleUpdateEmployee = (data: { username: string; name: string; password: string; position: string }) => {
        const empIndex = employees.findIndex(e => e.username === data.username);
        if (empIndex === -1) {
            alert('Employee with such username doesn\'t exist');
            return;
        }
        const updated = [...employees];
        updated[empIndex] = {
            ...updated[empIndex],
            name: data.name,
            position: data.position
        };
        setEmployees(updated);
        alert('Employee updated successfully!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50">
            <header className="bg-white border-b border-cream-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-sage-800">Admin Dashboard</h1>
                                <p className="text-sm text-sage-600">Employee Management</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSwitchToCashier}
                                className="flex items-center space-x-2 px-4 py-2 bg-cream-200 text-sage-700 rounded-lg hover:bg-cream-300 transition-all"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                <span>Cashier View</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-sage-800">Employee List</h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-lg hover:from-sage-600 hover:to-sage-700 transition-all shadow-lg"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Add Employee</span>
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {employees.map((employee, index) => (
                        <motion.div
                            key={employee.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-lg shadow-md border border-cream-200 p-6 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${employee.position === 'Admin' ? 'bg-sage-100' : 'bg-cream-200'
                                        }`}>
                                        <Users className={`w-6 h-6 ${employee.position === 'Admin' ? 'text-sage-600' : 'text-cream-500'
                                            }`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sage-800">{employee.name}</h3>
                                        <p className="text-sm text-sage-600">ID: {employee.username}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${employee.position === 'Admin'
                                    ? 'bg-sage-100 text-sage-700'
                                    : 'bg-cream-200 text-sage-700'
                                    }`}>
                                    {employee.position}
                                </span>
                            </div>

                            <div className="flex space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowUpdateModal(true)}
                                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-sage-50 text-sage-700 rounded-lg hover:bg-sage-100 transition-all"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDeleteEmployee(employee.id)}
                                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {showUpdateModal && (
                <UpdateEmployeeModal
                    onClose={() => setShowUpdateModal(false)}
                    onUpdate={handleUpdateEmployee}
                />
            )}

            {showAddModal && (
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
                        <h3 className="text-xl font-bold text-sage-800 mb-4">Add New Employee</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-sage-700 mb-2">Full Name</label>
                                <input type="text" className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-sage-700 mb-2">Username</label>
                                <input type="text" className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-sage-700 mb-2">Password</label>
                                <input type="password" className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-sage-700 mb-2">Position</label>
                                <select className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50">
                                    <option>Cashier</option>
                                    <option>Admin</option>
                                </select>
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
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
                                    Add Employee
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
