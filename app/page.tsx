'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Lock, User, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginEmployee } from '@/lib/api/employees';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();

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

      // Use auth context to login
      login(employee);

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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-violet-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-300/10 to-violet-300/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl mb-4 shadow-xl shadow-indigo-500/30"
          >
            <ShoppingCart className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold gradient-text mb-2">SG Technologies</h1>
          <p className="text-slate-500 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Point of Sale System
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-2xl shadow-slate-200/50">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-slate-700">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    icon={<User className="w-4 h-4" />}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    icon={<Lock className="w-4 h-4" />}
                    required
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>


            </CardContent>
          </Card>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex justify-center gap-4"
        >
          {['Secure', 'Fast', 'Reliable'].map((feature, i) => (
            <motion.div
              key={feature}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-slate-100 text-sm text-slate-600 font-medium"
            >
              {feature}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
