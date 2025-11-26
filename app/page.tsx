'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Package, Users, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginEmployee } from '@/lib/api/employees';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const employee = await loginEmployee(username, password);

      if (!employee) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      // Store employee info in session storage
      sessionStorage.setItem('employee', JSON.stringify(employee));

      // Redirect based on position
      if (employee.position === 'Admin') {
        router.push('/admin');
      } else {
        router.push('/cashier');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg mb-4 shadow-lg"
          >
            <ShoppingCart className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-sage-800 mb-2">SG Technologies</h1>
          <p className="text-sage-600">Point of Sale System</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-xl p-8 border border-cream-200"
        >
          <h2 className="text-2xl font-semibold text-sage-800 mb-6">Welcome Back</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-sage-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all bg-cream-50"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-sage-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all bg-cream-50"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sage-500 to-sage-600 text-white py-3 rounded-lg font-semibold hover:from-sage-600 hover:to-sage-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-cream-200">
            <p className="text-xs text-sage-500 text-center mb-2">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-sage-50 p-2 rounded-lg border border-sage-100">
                <p className="font-semibold text-sage-800">Admin</p>
                <p className="text-sage-600">admin / 1</p>
              </div>
              <div className="bg-cream-200 p-2 rounded-lg border border-cream-300">
                <p className="font-semibold text-sage-800">Cashier</p>
                <p className="text-sage-600">cashier / lehigh2016</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-cream-200"
          >
            <ShoppingCart className="w-6 h-6 text-sage-600 mx-auto mb-2" />
            <p className="text-xs text-sage-700 font-medium">Sales</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-cream-200"
          >
            <Package className="w-6 h-6 text-cream-400 mx-auto mb-2" />
            <p className="text-xs text-sage-700 font-medium">Rentals</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-cream-200"
          >
            <Users className="w-6 h-6 text-sage-500 mx-auto mb-2" />
            <p className="text-xs text-sage-700 font-medium">Management</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
