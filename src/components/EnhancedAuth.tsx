
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/pages/Index';
import { Heart, Eye, EyeOff, Mail, Lock, User, Shield, Sparkles } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';

interface EnhancedAuthProps {
  onLogin: (email: string, password: string, role: UserRole) => boolean;
}

export const EnhancedAuth = ({ onLogin }: EnhancedAuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'admin' as UserRole
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      onLogin(formData.email, formData.password, formData.role);
      setIsLoading(false);
    }, 1500);
  };

  const inputVariants = {
    focused: { scale: 1.02, transition: { duration: 0.2 } },
    unfocused: { scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full max-w-md"
        >
          <Card className="glass-card border-0 overflow-hidden">
            <CardHeader className="text-center pb-4">
              <motion.div 
                className="flex justify-center mb-6"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl glow">
                  <Heart className="h-10 w-10 text-white" />
                </div>
              </motion.div>
              
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Noble Cause Tracker
              </CardTitle>
              <CardDescription className="text-gray-300 mt-2">
                {isLogin ? 'Welcome back to your dashboard' : 'Join our mission to make a difference'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex rounded-2xl glass p-1 mb-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    isLogin 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    !isLogin 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Sign Up
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <motion.div variants={inputVariants} whileFocus="focused">
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type="text"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            className="pl-10 glass border-white/20 text-white placeholder-gray-400 focus:border-blue-400"
                          />
                        </div>
                        {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                      </motion.div>

                      <motion.div variants={inputVariants} whileFocus="focused">
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type="text"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            className="pl-10 glass border-white/20 text-white placeholder-gray-400 focus:border-blue-400"
                          />
                        </div>
                        {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={inputVariants} whileFocus="focused">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 glass border-white/20 text-white placeholder-gray-400 focus:border-blue-400"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </motion.div>

                <motion.div variants={inputVariants} whileFocus="focused">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10 glass border-white/20 text-white placeholder-gray-400 focus:border-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                </motion.div>

                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      variants={inputVariants} 
                      whileFocus="focused"
                    >
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="pl-10 pr-10 glass border-white/20 text-white placeholder-gray-400 focus:border-blue-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                  <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}>
                    <SelectTrigger className="pl-10 glass border-white/20 text-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="finance">Finance Manager</SelectItem>
                      <SelectItem value="event_manager">Event Manager</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium rounded-2xl glow transition-all duration-300"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </Button>
                </motion.div>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Demo credentials: Use any email/password combination
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
