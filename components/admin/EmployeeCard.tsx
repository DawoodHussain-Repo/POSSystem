'use client';

import { motion } from 'framer-motion';
import { Edit, Trash2, Shield, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
            whileHover={{ y: -5 }}
        >
            <Card className="overflow-hidden">
                <div className={`h-1 ${isAdmin ? 'bg-gradient-to-r from-indigo-500 to-violet-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`} />
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className={isAdmin ? 'bg-gradient-to-br from-indigo-500 to-violet-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}>
                                    {employee.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold text-slate-900">{employee.name}</h3>
                                <p className="text-sm text-slate-500">@{employee.username}</p>
                            </div>
                        </div>
                        <Badge variant={isAdmin ? 'default' : 'success'} className="flex items-center gap-1">
                            {isAdmin ? <Shield className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                            {employee.position}
                        </Badge>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(employee)}>
                            <Edit className="w-4 h-4 mr-2" />Edit
                        </Button>
                        <Button variant="destructive" size="sm" className="flex-1" onClick={() => onDelete(employee)}>
                            <Trash2 className="w-4 h-4 mr-2" />Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
