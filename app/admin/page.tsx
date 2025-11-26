'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, LogOut, ShoppingCart, Loader2, Receipt, Shield, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth/AuthContext';
import Notification from '@/components/ui/Notification';
import EmployeeCard from '@/components/admin/EmployeeCard';
import EmployeeModal from '@/components/admin/EmployeeModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getAllEmployees, addEmployee, updateEmployee, deleteEmployee } from '@/lib/api/employees';
import type { Employee } from '@/lib/types';

function AdminDashboardContent() {
    const router = useRouter();
    const { employee, logout } = useAuth();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [notification, setNotification] = useState({ type: 'success' as 'success' | 'error' | 'warning', message: '', visible: false });

    useEffect(() => { loadEmployees(); }, []);

    const loadEmployees = async () => {
        setLoading(true);
        try {
            const data = await getAllEmployees();
            setEmployees(data);
        } catch (error: any) {
            showNotification('error', 'Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message, visible: true });
        setTimeout(() => setNotification(n => ({ ...n, visible: false })), 3000);
    };

    const handleAdd = () => { setModalMode('add'); setSelectedEmployee(null); setModalOpen(true); };
    const handleEdit = (emp: Employee) => { setModalMode('edit'); setSelectedEmployee(emp); setModalOpen(true); };

    const handleDelete = async (emp: Employee) => {
        if (!confirm(`Delete ${emp.name}?`)) return;
        try {
            await deleteEmployee(emp.username);
            setEmployees(employees.filter(e => e.username !== emp.username));
            showNotification('success', `${emp.name} deleted`);
        } catch { showNotification('error', 'Failed to delete employee'); }
    };

    const handleSubmit = async (data: { name: string; username: string; password: string; position: 'Admin' | 'Cashier' }) => {
        if (modalMode === 'add') {
            const emp = await addEmployee(data);
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

    const handleLogout = () => { logout(); };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <Notification type={notification.type} message={notification.message} isVisible={notification.visible} />

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <LayoutDashboard className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                                <p className="text-sm text-slate-500">Employee Management</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {/* User Info */}
                            <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-xl">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs">{employee?.name?.charAt(0) || 'A'}</AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                    <p className="font-medium text-slate-700">{employee?.name}</p>
                                    <Badge variant="default" className="text-xs py-0">
                                        <Shield className="w-3 h-3 mr-1" />Admin
                                    </Badge>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => router.push('/admin/transactions')}>
                                <Receipt className="w-4 h-4 mr-2" />Transactions
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => router.push('/cashier')}>
                                <ShoppingCart className="w-4 h-4 mr-2" />Cashier
                            </Button>
                            <Button variant="destructive" size="sm" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 mr-2" />Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Total Employees</p>
                                        <p className="text-3xl font-bold text-slate-900">{employees.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <Users className="w-6 h-6 text-indigo-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Admins</p>
                                        <p className="text-3xl font-bold text-slate-900">{employees.filter(e => e.position === 'Admin').length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-violet-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Cashiers</p>
                                        <p className="text-3xl font-bold text-slate-900">{employees.filter(e => e.position === 'Cashier').length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                        <ShoppingCart className="w-6 h-6 text-emerald-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Employee List Header */}
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-900">Employees</h2>
                    <Button onClick={handleAdd}>
                        <UserPlus className="w-4 h-4 mr-2" />Add Employee
                    </Button>
                </div>

                {/* Employee Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        <span className="ml-3 text-slate-600">Loading employees...</span>
                    </div>
                ) : employees.length === 0 ? (
                    <Card className="py-20">
                        <div className="text-center">
                            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No employees found</p>
                            <Button className="mt-4" onClick={handleAdd}>
                                <UserPlus className="w-4 h-4 mr-2" />Add First Employee
                            </Button>
                        </div>
                    </Card>
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

export default function AdminDashboard() {
    return (
        <ProtectedRoute requiredRole="Admin">
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}
