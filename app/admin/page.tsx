'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, LogOut, ShoppingCart, Loader2, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import Aurora from '@/components/Aurora';
import Notification from '@/components/ui/Notification';
import EmployeeCard from '@/components/admin/EmployeeCard';
import EmployeeModal from '@/components/admin/EmployeeModal';
import { getAllEmployees, addEmployee, updateEmployee, deleteEmployee } from '@/lib/api/employees';
import type { Employee } from '@/lib/types';

export default function AdminDashboard() {
    const router = useRouter();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [notification, setNotification] = useState({ type: 'success' as 'success' | 'error' | 'warning', message: '', visible: false });

    useEffect(() => { loadEmployees(); }, []);

    const [dbError, setDbError] = useState<string | null>(null);

    const loadEmployees = async () => {
        setLoading(true);
        setDbError(null);
        try {
            const data = await getAllEmployees();
            setEmployees(data);
        } catch (error: any) {
            if (error.message?.includes('Database not initialized')) {
                setDbError(error.message);
            } else {
                showNotification('error', 'Failed to load employees');
            }
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message, visible: true });
        setTimeout(() => setNotification(n => ({ ...n, visible: false })), 3000);
    };

    const handleAdd = () => {
        setModalMode('add');
        setSelectedEmployee(null);
        setModalOpen(true);
    };

    const handleEdit = (employee: Employee) => {
        setModalMode('edit');
        setSelectedEmployee(employee);
        setModalOpen(true);
    };

    const handleDelete = async (employee: Employee) => {
        if (!confirm(`Delete ${employee.name}?`)) return;
        try {
            await deleteEmployee(employee.username);
            setEmployees(employees.filter(e => e.username !== employee.username));
            showNotification('success', `${employee.name} deleted`);
        } catch {
            showNotification('error', 'Failed to delete employee');
        }
    };

    const handleSubmit = async (data: { name: string; username: string; password: string; position: 'Admin' | 'Cashier' }) => {
        if (modalMode === 'add') {
            const emp = await addEmployee({ name: data.name, username: data.username, password: data.password, position: data.position });
            setEmployees([emp, ...employees]);
            showNotification('success', `${data.name} added successfully`);
        } else if (selectedEmployee) {
            const updates: Partial<Employee> = { name: data.name, position: data.position };
            if (data.password) updates.password = data.password;
            const emp = await updateEmployee(selectedEmployee.username, updates);
            setEmployees(employees.map(e => e.username === selectedEmployee.username ? emp : e));
            showNotification('success', `${data.name} updated successfully`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50 relative">
            <Aurora colorStops={["#5D866C", "#C2A68C", "#E6D8C3"]} blend={0.2} amplitude={0.6} speed={0.4} />
            <Notification type={notification.type} message={notification.message} isVisible={notification.visible} />

            <header className="bg-white/90 backdrop-blur-sm border-b border-cream-200 shadow-sm relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-sage-800">Admin Dashboard</h1>
                                <p className="text-sm text-sage-600">Employee Management</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/admin/transactions')}
                                className="flex items-center space-x-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-all">
                                <Receipt className="w-4 h-4" /><span>Transactions</span>
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/cashier')}
                                className="flex items-center space-x-2 px-4 py-2 bg-cream-200 text-sage-700 rounded-lg hover:bg-cream-300 transition-all">
                                <ShoppingCart className="w-4 h-4" /><span>Cashier</span>
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/')}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all">
                                <LogOut className="w-4 h-4" /><span>Logout</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-sage-800">Employees ({employees.length})</h2>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAdd}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-lg shadow-lg">
                        <UserPlus className="w-4 h-4" /><span>Add Employee</span>
                    </motion.button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-sage-600 animate-spin" />
                        <span className="ml-3 text-sage-600">Loading...</span>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-16 h-16 text-cream-300 mx-auto mb-4" />
                        <p className="text-sage-500">No employees found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {employees.map((emp, i) => (
                            <EmployeeCard key={emp.id} employee={emp} index={i} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </main>

            <EmployeeModal isOpen={modalOpen} mode={modalMode} employee={selectedEmployee}
                onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
        </div>
    );
}
