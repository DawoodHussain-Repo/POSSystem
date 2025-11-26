'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

interface PasswordInputProps {
    value: string;
    onChange: (value: string) => void;
    showValidation?: boolean;
    placeholder?: string;
    className?: string;
}

interface ValidationRule {
    label: string;
    test: (password: string) => boolean;
}

const validationRules: ValidationRule[] = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
    { label: 'Contains number', test: (p) => /[0-9]/.test(p) },
    { label: 'Contains special character (!@#$%^&*)', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors = validationRules
        .filter(rule => !rule.test(password))
        .map(rule => rule.label);
    return { isValid: errors.length === 0, errors };
}

export default function PasswordInput({
    value,
    onChange,
    showValidation = false,
    placeholder = 'Enter password',
    className = ''
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState(false);

    return (
        <div className="space-y-2">
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 pr-12 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 bg-cream-50 ${className}`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-sage-500 hover:text-sage-700"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>

            {showValidation && touched && value && (
                <div className="space-y-1 p-3 bg-cream-50 rounded-lg border border-cream-200">
                    {validationRules.map((rule, index) => {
                        const passed = rule.test(value);
                        return (
                            <div key={index} className={`flex items-center space-x-2 text-sm ${passed ? 'text-green-600' : 'text-red-500'}`}>
                                {passed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                <span>{rule.label}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
