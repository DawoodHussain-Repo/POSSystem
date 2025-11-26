'use client';

import { motion } from 'framer-motion';
import { Users, Edit, Trash2 } from 'lucide-react';
import type { Employee } from '@/lib/types';

interface EmployeeCardProps {
    employee: Employee;
    index: number;
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
}

export default function EmployeeCard({ employee, index, onEdit, onDelete }: EmployeeCardProps) {
    const isAdmin = employee.position === 'Admin';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-cream-200 p-6 hover:shadow-xl transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isAdmin ? 'bg-sage-100' : 'bg-cream-200'}`}>
                        <Users className={`w-6 h-6 ${isAdmin ? 'text-sage-600' : 'text-cream-500'}`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sage-800">{employee.name}</h3>
                        <p className="text-sm text-sage-600">@{employee.username}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${isAdmin ? 'bg-sage-100 text-sage-700' : 'bg-cream-200 text-sage-700'}`}>
                    {employee.position}
                </span>
            </div>
            <div className="flex space-x-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(employee)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-sage-50 text-sage-700 rounded-lg hover:bg-sage-100 transition-all"
                >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(employee)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all"
                >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                </motion.button>
            </div>
        </motion.div>
    );
}
